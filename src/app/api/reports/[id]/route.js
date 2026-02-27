import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// GET /api/reports/[id] - Get single report details
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    const report = await prisma.emergencyReport.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, phone: true, email: true, address: true }
        },
        disaster: true,
        rescueOps: {
          include: {
            report: {
              select: { id: true, description: true, urgency: true }
            }
          }
        }
      }
    })

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" }, 
        { status: 404 }
      )
    }

    // Check if user has permission to view this report
    if (session.user.role === 'USER' && report.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only view your own reports" }, 
        { status: 403 }
      )
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error fetching report:", error)
    return NextResponse.json(
      { error: "Failed to fetch report" }, 
      { status: 500 }
    )
  }
}

// PUT /api/reports/[id] - Update report status (Admin/Volunteer only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VOLUNTEER")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin or Volunteer access required" }, 
        { status: 403 }
      )
    }

    const { id } = params
    const data = await request.json()

    const report = await prisma.emergencyReport.update({
      where: { id },
      data: {
        status: data.status,
        ...(data.disasterId && { disasterId: data.disasterId })
      },
      include: {
        user: {
          select: { name: true, phone: true, email: true }
        },
        disaster: true,
        rescueOps: true
      }
    })

    return NextResponse.json(report)
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json(
      { error: "Failed to update report" }, 
      { status: 500 }
    )
  }
}

// DELETE /api/reports/[id] - Delete report (Admin only or report owner)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Check ownership or admin role
    const report = await prisma.emergencyReport.findUnique({
      where: { id }
    })

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" }, 
        { status: 404 }
      )
    }

    if (session.user.role !== "ADMIN" && report.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own reports" }, 
        { status: 403 }
      )
    }

    await prisma.emergencyReport.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Report deleted successfully" })
  } catch (error) {
    console.error("Error deleting report:", error)
    return NextResponse.json(
      { error: "Failed to delete report" }, 
      { status: 500 }
    )
  }
}

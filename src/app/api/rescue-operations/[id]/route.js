import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// GET /api/rescue-operations/[id] - Get single rescue operation details
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    const rescueOp = await prisma.rescueOperation.findUnique({
      where: { id },
      include: {
        report: {
          include: {
            user: {
              select: { id: true, name: true, phone: true, email: true, address: true }
            },
            disaster: true
          }
        }
      }
    })

    if (!rescueOp) {
      return NextResponse.json(
        { error: "Rescue operation not found" }, 
        { status: 404 }
      )
    }

    return NextResponse.json(rescueOp)
  } catch (error) {
    console.error("Error fetching rescue operation:", error)
    return NextResponse.json(
      { error: "Failed to fetch rescue operation" }, 
      { status: 500 }
    )
  }
}

// PUT /api/rescue-operations/[id] - Update rescue operation (Admin/Volunteer only)
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

    const updateData = { ...data }
    
    // Set completedAt when status changes to completed
    if (data.status === "completed" && !data.completedAt) {
      updateData.completedAt = new Date()
    }

    const rescueOp = await prisma.rescueOperation.update({
      where: { id },
      data: updateData,
      include: {
        report: {
          include: {
            user: {
              select: { name: true, phone: true, email: true }
            },
            disaster: true
          }
        }
      }
    })

    // Update associated report status based on rescue operation status
    if (data.status === "completed") {
      await prisma.emergencyReport.update({
        where: { id: rescueOp.reportId },
        data: { status: "resolved" }
      })
    }

    return NextResponse.json(rescueOp)
  } catch (error) {
    console.error("Error updating rescue operation:", error)
    return NextResponse.json(
      { error: "Failed to update rescue operation" }, 
      { status: 500 }
    )
  }
}

// DELETE /api/rescue-operations/[id] - Delete rescue operation (Admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" }, 
        { status: 403 }
      )
    }

    const { id } = params

    // Get the rescue operation to update associated report
    const rescueOp = await prisma.rescueOperation.findUnique({
      where: { id }
    })

    if (rescueOp) {
      // Reset report status to pending
      await prisma.emergencyReport.update({
        where: { id: rescueOp.reportId },
        data: { status: "pending" }
      })
    }

    await prisma.rescueOperation.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Rescue operation deleted successfully" })
  } catch (error) {
    console.error("Error deleting rescue operation:", error)
    return NextResponse.json(
      { error: "Failed to delete rescue operation" }, 
      { status: 500 }
    )
  }
}

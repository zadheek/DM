import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// POST /api/rescue-operations - Create new rescue operation (Admin/Volunteer only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VOLUNTEER")) {
      return NextResponse.json(
        { error: "Unauthorized - Admin or Volunteer access required" }, 
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.reportId || !data.assignedTeam || !data.priority) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    // Verify the report exists
    const report = await prisma.emergencyReport.findUnique({
      where: { id: data.reportId }
    })

    if (!report) {
      return NextResponse.json(
        { error: "Emergency report not found" }, 
        { status: 404 }
      )
    }

    const rescueOp = await prisma.rescueOperation.create({
      data: {
        reportId: data.reportId,
        assignedTeam: data.assignedTeam,
        priority: data.priority,
        status: data.status || "assigned",
        notes: data.notes || ""
      },
      include: {
        report: {
          include: {
            user: {
              select: { name: true, phone: true, email: true }
            },
            disaster: {
              select: { type: true, location: true, severity: true }
            }
          }
        }
      }
    })

    // Update the associated report status
    await prisma.emergencyReport.update({
      where: { id: data.reportId },
      data: { status: "in-progress" }
    })

    return NextResponse.json(rescueOp, { status: 201 })
  } catch (error) {
    console.error("Error creating rescue operation:", error)
    return NextResponse.json(
      { error: "Failed to create rescue operation" }, 
      { status: 500 }
    )
  }
}

// GET /api/rescue-operations - Get all rescue operations
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const reportId = searchParams.get('reportId')

    // Build query filters
    const where = {}
    if (status) where.status = status
    if (priority) where.priority = priority
    if (reportId) where.reportId = reportId

    const rescueOps = await prisma.rescueOperation.findMany({
      where,
      include: {
        report: {
          include: {
            user: {
              select: { id: true, name: true, phone: true, email: true }
            },
            disaster: {
              select: { id: true, type: true, location: true, severity: true }
            }
          }
        }
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" }
      ]
    })

    return NextResponse.json(rescueOps)
  } catch (error) {
    console.error("Error fetching rescue operations:", error)
    return NextResponse.json(
      { error: "Failed to fetch rescue operations" }, 
      { status: 500 }
    )
  }
}

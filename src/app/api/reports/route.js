import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// POST /api/reports - Create new emergency report
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.latitude || !data.longitude || !data.description || !data.urgency) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    // Create the emergency report
    const report = await prisma.emergencyReport.create({
      data: {
        userId: session.user.id,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        description: data.description,
        urgency: data.urgency,
        disasterId: data.disasterId || null,
        status: "pending"
      },
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        },
        disaster: true
      }
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error("Error creating emergency report:", error)
    return NextResponse.json(
      { error: "Failed to create report" }, 
      { status: 500 }
    )
  }
}

// GET /api/reports - Get all emergency reports (filtered by role)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const disasterId = searchParams.get('disasterId')

    // Build query filters
    const where = {}
    if (status) where.status = status
    if (disasterId) where.disasterId = disasterId
    
    // Regular users can only see their own reports
    // Admins and volunteers can see all reports
    if (session.user.role === 'USER') {
      where.userId = session.user.id
    }

    const reports = await prisma.emergencyReport.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, phone: true, email: true }
        },
        disaster: {
          select: { id: true, type: true, location: true, severity: true }
        },
        rescueOps: {
          select: { id: true, status: true, assignedTeam: true, priority: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json(
      { error: "Failed to fetch reports" }, 
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// POST /api/disasters - Create new disaster (Admin only)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" }, 
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.type || !data.severity || !data.location || !data.startDate) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    // Parse affected areas (stored as JSON string for SQLite)
    const affectedAreas = Array.isArray(data.affectedAreas) 
      ? JSON.stringify(data.affectedAreas)
      : data.affectedAreas || "[]"

    const disaster = await prisma.disaster.create({
      data: {
        type: data.type,
        severity: data.severity,
        location: data.location,
        description: data.description || "",
        affectedAreas: affectedAreas,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: data.status || "active"
      }
    })

    return NextResponse.json(disaster, { status: 201 })
  } catch (error) {
    console.error("Error creating disaster:", error)
    return NextResponse.json(
      { error: "Failed to create disaster" }, 
      { status: 500 }
    )
  }
}

// GET /api/disasters - Get all disasters (public access)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Build query filters
    const where = {}
    if (status) {
      where.status = status
    } else {
      // Default to active disasters only
      where.status = "active"
    }
    if (type) where.type = type

    const disasters = await prisma.disaster.findMany({
      where,
      include: {
        reports: {
          select: { id: true, status: true, urgency: true }
        },
        donations: {
          select: { id: true, type: true, quantity: true, status: true }
        },
        _count: {
          select: {
            reports: true,
            donations: true,
            notifications: true
          }
        }
      },
      orderBy: { startDate: "desc" }
    })

    // Parse affectedAreas JSON string back to array
    const disastersWithParsedAreas = disasters.map(disaster => ({
      ...disaster,
      affectedAreas: disaster.affectedAreas 
        ? JSON.parse(disaster.affectedAreas) 
        : []
    }))

    return NextResponse.json(disastersWithParsedAreas)
  } catch (error) {
    console.error("Error fetching disasters:", error)
    return NextResponse.json(
      { error: "Failed to fetch disasters" }, 
      { status: 500 }
    )
  }
}

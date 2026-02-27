import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// GET /api/disasters/[id] - Get single disaster details
export async function GET(request, { params }) {
  try {
    const { id } = params

    const disaster = await prisma.disaster.findUnique({
      where: { id },
      include: {
        reports: {
          include: {
            user: {
              select: { name: true, phone: true, email: true }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        donations: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        notifications: {
          orderBy: { createdAt: "desc" }
        }
      }
    })

    if (!disaster) {
      return NextResponse.json(
        { error: "Disaster not found" }, 
        { status: 404 }
      )
    }

    // Parse affectedAreas JSON string
    const disasterWithParsedAreas = {
      ...disaster,
      affectedAreas: disaster.affectedAreas 
        ? JSON.parse(disaster.affectedAreas) 
        : []
    }

    return NextResponse.json(disasterWithParsedAreas)
  } catch (error) {
    console.error("Error fetching disaster:", error)
    return NextResponse.json(
      { error: "Failed to fetch disaster" }, 
      { status: 500 }
    )
  }
}

// PUT /api/disasters/[id] - Update disaster (Admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" }, 
        { status: 403 }
      )
    }

    const { id } = params
    const data = await request.json()

    // Parse affected areas if provided
    const updateData = { ...data }
    if (data.affectedAreas && Array.isArray(data.affectedAreas)) {
      updateData.affectedAreas = JSON.stringify(data.affectedAreas)
    }

    // Convert date strings to Date objects if provided
    if (data.startDate) updateData.startDate = new Date(data.startDate)
    if (data.endDate) updateData.endDate = new Date(data.endDate)

    const disaster = await prisma.disaster.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(disaster)
  } catch (error) {
    console.error("Error updating disaster:", error)
    return NextResponse.json(
      { error: "Failed to update disaster" }, 
      { status: 500 }
    )
  }
}

// DELETE /api/disasters/[id] - Delete disaster (Admin only)
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

    await prisma.disaster.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Disaster deleted successfully" })
  } catch (error) {
    console.error("Error deleting disaster:", error)
    return NextResponse.json(
      { error: "Failed to delete disaster" }, 
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// GET /api/donations/[id] - Get single donation details
export async function GET(request, { params }) {
  try {
    const { id } = params

    const donation = await prisma.donation.findUnique({
      where: { id },
      include: {
        disaster: true,
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    })

    if (!donation) {
      return NextResponse.json(
        { error: "Donation not found" }, 
        { status: 404 }
      )
    }

    return NextResponse.json(donation)
  } catch (error) {
    console.error("Error fetching donation:", error)
    return NextResponse.json(
      { error: "Failed to fetch donation" }, 
      { status: 500 }
    )
  }
}

// PUT /api/donations/[id] - Update donation status (Admin/Volunteer only)
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
    
    // Set distributedAt when status changes to distributed
    if (data.status === "distributed" && !data.distributedAt) {
      updateData.distributedAt = new Date()
    }

    const donation = await prisma.donation.update({
      where: { id },
      data: updateData,
      include: {
        disaster: true,
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(donation)
  } catch (error) {
    console.error("Error updating donation:", error)
    return NextResponse.json(
      { error: "Failed to update donation" }, 
      { status: 500 }
    )
  }
}

// DELETE /api/donations/[id] - Delete donation (Admin only)
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

    await prisma.donation.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Donation deleted successfully" })
  } catch (error) {
    console.error("Error deleting donation:", error)
    return NextResponse.json(
      { error: "Failed to delete donation" }, 
      { status: 500 }
    )
  }
}

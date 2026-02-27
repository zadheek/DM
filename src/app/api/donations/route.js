import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// POST /api/donations - Create new donation
export async function POST(request) {
  try {
    const data = await request.json()
    
    // Validate required fields
    if (!data.donorName || !data.donorContact || !data.type || !data.quantity) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    // Get user ID from session if logged in
    const session = await getServerSession(authOptions)

    const donation = await prisma.donation.create({
      data: {
        donorName: data.donorName,
        donorContact: data.donorContact,
        userId: session?.user?.id || null,
        disasterId: data.disasterId || null,
        type: data.type,
        quantity: parseInt(data.quantity),
        description: data.description || "",
        status: "pending"
      },
      include: {
        disaster: {
          select: { id: true, type: true, location: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    console.error("Error creating donation:", error)
    return NextResponse.json(
      { error: "Failed to create donation" }, 
      { status: 500 }
    )
  }
}

// GET /api/donations - Get all donations
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const disasterId = searchParams.get('disasterId')
    const type = searchParams.get('type')

    // Build query filters
    const where = {}
    if (status) where.status = status
    if (disasterId) where.disasterId = disasterId
    if (type) where.type = type

    // Regular users can only see their own donations
    // Admins and volunteers can see all
    if (session?.user?.role === 'USER') {
      where.userId = session.user.id
    }

    const donations = await prisma.donation.findMany({
      where,
      include: {
        disaster: {
          select: { id: true, type: true, location: true, severity: true }
        },
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(donations)
  } catch (error) {
    console.error("Error fetching donations:", error)
    return NextResponse.json(
      { error: "Failed to fetch donations" }, 
      { status: 500 }
    )
  }
}

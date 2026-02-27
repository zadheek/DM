import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// POST /api/notifications - Create and send notification (Admin only)
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
    if (!data.title || !data.message || !data.type) {
      return NextResponse.json(
        { error: "Missing required fields" }, 
        { status: 400 }
      )
    }

    const notification = await prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        disasterId: data.disasterId || null,
        targetAudience: data.targetAudience || "all",
        sentAt: new Date()
      },
      include: {
        disaster: {
          select: { id: true, type: true, location: true }
        }
      }
    })

    // TODO: Implement actual notification sending
    // - SMS integration (Twilio, etc.)
    // - Email integration (SendGrid, Nodemailer)
    // - Push notifications (Firebase Cloud Messaging)
    
    console.log(`Notification sent: ${notification.title} to ${notification.targetAudience}`)

    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json(
      { error: "Failed to create notification" }, 
      { status: 500 }
    )
  }
}

// GET /api/notifications - Get all notifications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const disasterId = searchParams.get('disasterId')
    const type = searchParams.get('type')
    const targetAudience = searchParams.get('targetAudience')

    // Build query filters
    const where = {}
    if (disasterId) where.disasterId = disasterId
    if (type) where.type = type
    if (targetAudience) where.targetAudience = targetAudience

    const notifications = await prisma.notification.findMany({
      where,
      include: {
        disaster: {
          select: { id: true, type: true, location: true, severity: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 50 // Limit to recent 50 notifications
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "Failed to fetch notifications" }, 
      { status: 500 }
    )
  }
}

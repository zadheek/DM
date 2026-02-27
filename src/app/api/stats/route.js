import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import prisma from "@/lib/db"

// GET /api/stats - Get dashboard statistics
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get counts for different entities
    const [
      totalDisasters,
      activeDisasters,
      totalReports,
      pendingReports,
      totalDonations,
      pendingDonations,
      totalRescueOps,
      activeRescueOps,
      totalUsers
    ] = await Promise.all([
      prisma.disaster.count(),
      prisma.disaster.count({ where: { status: "active" } }),
      prisma.emergencyReport.count(),
      prisma.emergencyReport.count({ where: { status: "pending" } }),
      prisma.donation.count(),
      prisma.donation.count({ where: { status: "pending" } }),
      prisma.rescueOperation.count(),
      prisma.rescueOperation.count({ 
        where: { 
          status: { in: ["assigned", "in-progress"] } 
        } 
      }),
      session.user.role === "ADMIN" ? prisma.user.count() : Promise.resolve(null)
    ])

    // Get recent activity
    const recentReports = await prisma.emergencyReport.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        disaster: { select: { type: true, location: true } }
      }
    })

    const recentDonations = await prisma.donation.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        disaster: { select: { type: true, location: true } }
      }
    })

    // Get reports by urgency
    const reportsByUrgency = await prisma.emergencyReport.groupBy({
      by: ['urgency'],
      _count: { urgency: true }
    })

    // Get donations by type
    const donationsByType = await prisma.donation.groupBy({
      by: ['type'],
      _count: { type: true },
      _sum: { quantity: true }
    })

    const stats = {
      overview: {
        totalDisasters,
        activeDisasters,
        totalReports,
        pendingReports,
        totalDonations,
        pendingDonations,
        totalRescueOps,
        activeRescueOps,
        ...(totalUsers !== null && { totalUsers })
      },
      recentActivity: {
        reports: recentReports,
        donations: recentDonations
      },
      analytics: {
        reportsByUrgency: reportsByUrgency.reduce((acc, item) => {
          acc[item.urgency] = item._count.urgency
          return acc
        }, {}),
        donationsByType: donationsByType.map(item => ({
          type: item.type,
          count: item._count.type,
          totalQuantity: item._sum.quantity
        }))
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" }, 
      { status: 500 }
    )
  }
}

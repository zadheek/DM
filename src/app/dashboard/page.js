"use client"
import { useEffect, useState } from "react"
import StatCards from "@/components/dashboard/StatCards"
import ActiveDisasters from "@/components/dashboard/ActiveDisasters"
import RecentNotifications from "@/components/dashboard/RecentNotifications"
import EmergencyReportForm from "@/components/forms/EmergencyReportForm"

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [disasters, setDisasters] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, disastersRes, notificationsRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/disasters"),
          fetch("/api/notifications")
        ])

        const [statsData, disastersData, notificationsData] = await Promise.all([
          statsRes.json(),
          disastersRes.json(),
          notificationsRes.json()
        ])

        setStats(statsData)
        setDisasters(disastersData)
        setNotifications(notificationsData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor and manage disaster response</p>
      </div>

      <StatCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmergencyReportForm disasters={disasters} />
        <RecentNotifications notifications={notifications} />
      </div>

      <ActiveDisasters disasters={disasters} />
    </div>
  )
}

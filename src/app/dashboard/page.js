"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Disaster Management System
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, <strong>{session.user?.name}</strong>
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {session.user?.role}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h2>
          <p className="text-gray-600">
            Manage disasters, reports, and coordinate relief efforts
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Active Disasters</p>
                <p className="text-3xl font-bold text-blue-600">1</p>
              </div>
              <div className="text-4xl">🌊</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Emergency Reports</p>
                <p className="text-3xl font-bold text-red-600">1</p>
              </div>
              <div className="text-4xl">🚨</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Donations</p>
                <p className="text-3xl font-bold text-green-600">1</p>
              </div>
              <div className="text-4xl">💝</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Notifications</p>
                <p className="text-3xl font-bold text-yellow-600">1</p>
              </div>
              <div className="text-4xl">📢</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/report"
              className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">🚨</div>
              <h4 className="font-semibold">Report Emergency</h4>
              <p className="text-sm text-gray-600">Submit emergency report</p>
            </Link>

            <Link
              href="/donate"
              className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors text-center"
            >
              <div className="text-3xl mb-2">💝</div>
              <h4 className="font-semibold">Make Donation</h4>
              <p className="text-sm text-gray-600">Contribute relief items</p>
            </Link>

            {session.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-center"
              >
                <div className="text-3xl mb-2">⚙️</div>
                <h4 className="font-semibold">Admin Panel</h4>
                <p className="text-sm text-gray-600">Manage system</p>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded">
              <span className="text-2xl mr-3">🌊</span>
              <div className="flex-1">
                <p className="font-medium">Flood Warning - Colombo District</p>
                <p className="text-sm text-gray-600">Active disaster event</p>
              </div>
              <span className="text-sm text-gray-500">Today</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

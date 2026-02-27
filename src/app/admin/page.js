"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ReportsTable from "@/components/admin/ReportsTable"
import DisasterManagement from "@/components/admin/DisasterManagement"
import DonationsManagement from "@/components/admin/DonationsManagement"
import RescueOpsManagement from "@/components/admin/RescueOpsManagement"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("reports")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (session && session.user.role !== "ADMIN") {
      router.push("/dashboard")
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  const tabs = [
    { id: "reports", label: "Emergency Reports" },
    { id: "disasters", label: "Disasters" },
    { id: "donations", label: "Donations" },
    { id: "rescue", label: "Rescue Operations" }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <p className="text-gray-600 mt-1">Manage disasters, reports, and relief operations</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "reports" && <ReportsTable />}
          {activeTab === "disasters" && <DisasterManagement />}
          {activeTab === "donations" && <DonationsManagement />}
          {activeTab === "rescue" && <RescueOpsManagement />}
        </div>
      </div>
    </div>
  )
}

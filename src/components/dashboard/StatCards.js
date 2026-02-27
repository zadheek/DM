"use client"
import { AlertTriangle, Heart, Ambulance, TrendingUp } from "lucide-react"

export default function StatCards({ stats }) {
  const cards = [
    {
      title: "Active Disasters",
      value: stats?.overview?.activeDisasters || 0,
      icon: AlertTriangle,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    {
      title: "Pending Reports",
      value: stats?.overview?.pendingReports || 0,
      icon: AlertTriangle,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      title: "Pending Donations",
      value: stats?.overview?.pendingDonations || 0,
      icon: Heart,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      title: "Active Rescue Ops",
      value: stats?.overview?.activeRescueOps || 0,
      icon: Ambulance,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor} mt-2`}>{card.value}</p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <Icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

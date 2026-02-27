"use client"
import { Bell, AlertTriangle, Info, CheckCircle } from "lucide-react"

export default function RecentNotifications({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
        <p className="text-gray-500 text-center py-8">No notifications</p>
      </div>
    )
  }

  const getTypeIcon = (type) => {
    const icons = {
      alert: AlertTriangle,
      info: Info,
      success: CheckCircle,
      warning: Bell
    }
    return icons[type?.toLowerCase()] || Bell
  }

  const getTypeColor = (type) => {
    const colors = {
      alert: "text-red-500 bg-red-50",
      info: "text-blue-500 bg-blue-50",
      success: "text-green-500 bg-green-50",
      warning: "text-orange-500 bg-orange-50"
    }
    return colors[type?.toLowerCase()] || "text-gray-500 bg-gray-50"
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell size={24} className="text-blue-600" />
        <h2 className="text-xl font-bold">Recent Notifications</h2>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.slice(0, 10).map((notification) => {
          const Icon = getTypeIcon(notification.type)
          const colorClass = getTypeColor(notification.type)
          
          return (
            <div key={notification.id} className="border-l-4 border-blue-500 bg-gray-50 p-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon size={20} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span>{new Date(notification.createdAt).toLocaleString()}</span>
                    {notification.disaster && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                        {notification.disaster.type} - {notification.disaster.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

"use client"
import { AlertCircle, MapPin, Calendar } from "lucide-react"

export default function ActiveDisasters({ disasters }) {
  if (!disasters || disasters.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Active Disasters</h2>
        <p className="text-gray-500 text-center py-8">No active disasters at the moment</p>
      </div>
    )
  }

  const getSeverityColor = (severity) => {
    const colors = {
      low: "bg-yellow-100 text-yellow-800",
      medium: "bg-orange-100 text-orange-800",
      high: "bg-red-100 text-red-800",
      critical: "bg-purple-100 text-purple-800"
    }
    return colors[severity?.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Active Disasters</h2>
      
      <div className="space-y-4">
        {disasters.map((disaster) => (
          <div key={disaster.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-red-500" size={20} />
                  <h3 className="font-bold text-lg">{disaster.type}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(disaster.severity)}`}>
                    {disaster.severity}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    <span>{disaster.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Started: {new Date(disaster.startDate).toLocaleDateString()}</span>
                  </div>
                  
                  {disaster.description && (
                    <p className="mt-2">{disaster.description}</p>
                  )}
                  
                  {disaster.affectedAreas && disaster.affectedAreas.length > 0 && (
                    <div className="mt-2">
                      <span className="font-semibold">Affected Areas: </span>
                      <span>{disaster.affectedAreas.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  <div>{disaster._count?.reports || 0} Reports</div>
                  <div>{disaster._count?.donations || 0} Donations</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

"use client"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function RescueOpsManagement() {
  const [rescueOps, setRescueOps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRescueOps()
  }, [])

  const fetchRescueOps = async () => {
    try {
      const response = await fetch("/api/rescue-operations")
      const data = await response.json()
      setRescueOps(data)
    } catch (error) {
      console.error("Error fetching rescue operations:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/rescue-operations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchRescueOps()
      }
    } catch (error) {
      console.error("Error updating rescue operation:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Rescue Operations ({rescueOps.length})</h2>
        <button
          onClick={fetchRescueOps}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {rescueOps.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No rescue operations found</p>
      ) : (
        <div className="grid gap-4">
          {rescueOps.map((op) => (
            <div key={op.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">Team: {op.assignedTeam}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      op.priority === "critical" ? "bg-red-100 text-red-800" :
                      op.priority === "high" ? "bg-orange-100 text-orange-800" :
                      op.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {op.priority} priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      op.status === "completed" ? "bg-green-100 text-green-800" :
                      op.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {op.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Report:</span> {op.report?.description}
                    </div>
                    <div>
                      <span className="font-semibold">Reporter:</span> {op.report?.user?.name} ({op.report?.user?.phone})
                    </div>
                    {op.report?.disaster && (
                      <div>
                        <span className="font-semibold">Disaster:</span> {op.report.disaster.type} - {op.report.disaster.location}
                      </div>
                    )}
                    {op.notes && (
                      <div>
                        <span className="font-semibold">Notes:</span> {op.notes}
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Created: {new Date(op.createdAt).toLocaleString()}
                      {op.completedAt && ` | Completed: ${new Date(op.completedAt).toLocaleString()}`}
                    </div>
                  </div>
                </div>

                <select
                  value={op.status}
                  onChange={(e) => updateStatus(op.id, e.target.value)}
                  className="ml-4 border border-gray-300 rounded px-3 py-1"
                >
                  <option value="assigned">Assigned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

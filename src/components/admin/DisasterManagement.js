"use client"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Plus, X, Loader2 } from "lucide-react"

export default function DisasterManagement() {
  const [disasters, setDisasters] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    fetchDisasters()
  }, [])

  const fetchDisasters = async () => {
    try {
      const response = await fetch("/api/disasters?status=")
      const data = await response.json()
      setDisasters(data)
    } catch (error) {
      console.error("Error fetching disasters:", error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      const response = await fetch("/api/disasters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          affectedAreas: data.affectedAreas.split(",").map(area => area.trim())
        })
      })

      if (response.ok) {
        reset()
        setShowForm(false)
        fetchDisasters()
      }
    } catch (error) {
      console.error("Error creating disaster:", error)
      alert("Failed to create disaster")
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/disasters/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchDisasters()
      }
    } catch (error) {
      console.error("Error updating disaster:", error)
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
        <h2 className="text-xl font-semibold">Disasters ({disasters.length})</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? "Cancel" : "New Disaster"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Create New Disaster</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type *</label>
                <input
                  {...register("type", { required: true })}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Flood, Earthquake"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Severity *</label>
                <select {...register("severity", { required: true })} className="w-full p-2 border rounded">
                  <option value="">Select severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                {...register("location", { required: true })}
                className="w-full p-2 border rounded"
                placeholder="e.g., Colombo District"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Affected Areas (comma-separated)</label>
              <input
                {...register("affectedAreas")}
                className="w-full p-2 border rounded"
                placeholder="e.g., Kelaniya, Kaduwela, Kolonnawa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register("description")}
                className="w-full p-2 border rounded"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input
                {...register("startDate", { required: true })}
                type="datetime-local"
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Create Disaster
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {disasters.map((disaster) => (
          <div key={disaster.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{disaster.type}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    disaster.severity === "critical" ? "bg-red-100 text-red-800" :
                    disaster.severity === "high" ? "bg-orange-100 text-orange-800" :
                    disaster.severity === "medium" ? "bg-yellow-100 text-yellow-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {disaster.severity}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    disaster.status === "active" ? "bg-red-100 text-red-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {disaster.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{disaster.location}</p>
                {disaster.description && <p className="text-sm text-gray-500 mb-2">{disaster.description}</p>}
                {disaster.affectedAreas?.length > 0 && (
                  <p className="text-sm text-gray-500">
                    <strong>Affected:</strong> {disaster.affectedAreas.join(", ")}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Started: {new Date(disaster.startDate).toLocaleString()}
                </p>
              </div>
              <select
                value={disaster.status}
                onChange={(e) => updateStatus(disaster.id, e.target.value)}
                className="ml-4 border border-gray-300 rounded px-3 py-1"
              >
                <option value="active">Active</option>
                <option value="monitoring">Monitoring</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

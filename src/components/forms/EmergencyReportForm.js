"use client"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { MapPin, Loader2, CheckCircle } from "lucide-react"

export default function EmergencyReportForm({ disasters }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const getLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          setLocationLoading(false)
        },
        (error) => {
          alert("Unable to get location. Please enable location services.")
          setLocationLoading(false)
        }
      )
    } else {
      alert("Geolocation is not supported by your browser")
      setLocationLoading(false)
    }
  }

  const onSubmit = async (data) => {
    if (!location) {
      alert("Please capture your location first")
      return
    }

    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          latitude: location.latitude,
          longitude: location.longitude
        })
      })

      if (response.ok) {
        setSuccess(true)
        reset()
        setLocation(null)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        const error = await response.json()
        alert(error.error || "Failed to submit report")
      }
    } catch (error) {
      alert("Failed to submit report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Report Emergency</h2>
        <p className="text-sm text-gray-600 mt-1">Submit an emergency report with your location</p>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle size={20} />
          <span className="font-medium">Report submitted successfully!</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Related Disaster (Optional)
          </label>
          <select 
            {...register("disasterId")} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">General Emergency</option>
            {disasters && disasters.map(d => (
              <option key={d.id} value={d.id}>
                {d.type} - {d.location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgency Level <span className="text-red-500">*</span>
          </label>
          <select 
            {...register("urgency", { required: "Urgency level is required" })} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select urgency</option>
            <option value="low">Low - Non-urgent situation</option>
            <option value="medium">Medium - Requires attention</option>
            <option value="high">High - Urgent response needed</option>
            <option value="critical">Critical - Immediate action required</option>
          </select>
          {errors.urgency && (
            <p className="text-red-500 text-sm mt-1">{errors.urgency.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea 
            {...register("description", { 
              required: "Description is required",
              minLength: { value: 10, message: "Please provide more details (at least 10 characters)" }
            })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Describe the emergency situation in detail..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <button
            type="button"
            onClick={getLocation}
            disabled={locationLoading}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
              location 
                ? "bg-green-600 text-white hover:bg-green-700" 
                : "bg-gray-600 text-white hover:bg-gray-700"
            } disabled:bg-gray-400`}
          >
            {locationLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Getting Location...</span>
              </>
            ) : location ? (
              <>
                <CheckCircle size={20} />
                <span>Location Captured ({location.latitude.toFixed(4)}, {location.longitude.toFixed(4)})</span>
              </>
            ) : (
              <>
                <MapPin size={20} />
                <span>Capture My Location</span>
              </>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !location}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            "Submit Emergency Report"
          )}
        </button>
      </form>
    </div>
  )
}

"use client"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { Heart, Loader2, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DonatePage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [disasters, setDisasters] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function fetchDisasters() {
      try {
        const response = await fetch("/api/disasters")
        const data = await response.json()
        setDisasters(data)
      } catch (error) {
        console.error("Error fetching disasters:", error)
      }
    }
    fetchDisasters()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    setSuccess(false)

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        setSuccess(true)
        reset()
        setTimeout(() => setSuccess(false), 5000)
      } else {
        alert("Failed to submit donation")
      }
    } catch (error) {
      alert("Failed to submit donation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="text-green-600" size={32} />
              <h1 className="text-2xl font-bold text-gray-800">DMS Donation Portal</h1>
            </div>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Make a Donation</h2>
          <p className="text-lg text-gray-600">
            Your contribution helps provide essential supplies to disaster-affected communities
          </p>
        </div>

        {success && (
          <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3 text-green-700">
            <CheckCircle size={32} />
            <div>
              <p className="font-semibold text-lg">Thank you for your donation!</p>
              <p className="text-sm">Your contribution will help those in need. We'll contact you soon.</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("donorName", { required: "Name is required" })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your full name"
              />
              {errors.donorName && (
                <p className="text-red-500 text-sm mt-1">{errors.donorName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                {...register("donorContact", { 
                  required: "Contact number is required",
                  pattern: {
                    value: /^[0-9+\-\s()]+$/,
                    message: "Please enter a valid phone number"
                  }
                })}
                type="tel"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="+94 77 123 4567"
              />
              {errors.donorContact && (
                <p className="text-red-500 text-sm mt-1">{errors.donorContact.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related Disaster (Optional)
              </label>
              <select
                {...register("disasterId")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">General Donation (Not disaster-specific)</option>
                {disasters.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.type} - {d.location} ({d.severity} severity)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register("type", { required: "Please select donation type" })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select type</option>
                <option value="food">🍚 Food Items (Rice, Canned food, Water)</option>
                <option value="clothing">👕 Clothing (New or gently used)</option>
                <option value="medical">💊 Medical Supplies (First aid, Medicines)</option>
                <option value="other">📦 Other Essentials</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity / Amount <span className="text-red-500">*</span>
              </label>
              <input
                {...register("quantity", { 
                  required: "Quantity is required",
                  min: { value: 1, message: "Quantity must be at least 1" }
                })}
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., 10 (kg, units, boxes)"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                {...register("description")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows="4"
                placeholder="Provide additional details about your donation..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Heart size={24} />
                  <span>Submit Donation</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> After submitting, our team will contact you to coordinate the donation pickup or delivery. 
              Thank you for your generosity!
            </p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl mb-3">🍚</div>
            <h3 className="font-semibold text-gray-800 mb-2">Food Items</h3>
            <p className="text-sm text-gray-600">Rice, canned food, water, dry rations</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl mb-3">👕</div>
            <h3 className="font-semibold text-gray-800 mb-2">Clothing</h3>
            <p className="text-sm text-gray-600">New or gently used clothes, blankets</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl mb-3">💊</div>
            <h3 className="font-semibold text-gray-800 mb-2">Medical Supplies</h3>
            <p className="text-sm text-gray-600">First aid kits, medicines, hygiene items</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 Disaster Management System. All rights reserved.</p>
          <p className="text-sm mt-2">For urgent matters, please contact local authorities immediately.</p>
        </div>
      </footer>
    </div>
  )
}

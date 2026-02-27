"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Heart, 
  Bell, 
  Users, 
  BarChart3,
  Ambulance,
  Shield
} from "lucide-react"

export default function Sidebar({ role }) {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path ? "bg-blue-700" : ""
  }

  const userLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/reports", label: "My Reports", icon: AlertTriangle },
    { href: "/donate", label: "Donate", icon: Heart },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ]

  const adminLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin", label: "Admin Panel", icon: Shield },
    { href: "/admin/reports", label: "All Reports", icon: AlertTriangle },
    { href: "/admin/disasters", label: "Disasters", icon: Ambulance },
    { href: "/admin/donations", label: "Donations", icon: Heart },
    { href: "/admin/rescue-ops", label: "Rescue Ops", icon: Ambulance },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  ]

  const volunteerLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/volunteer/reports", label: "Reports", icon: AlertTriangle },
    { href: "/volunteer/rescue-ops", label: "Rescue Ops", icon: Ambulance },
    { href: "/volunteer/donations", label: "Donations", icon: Heart },
  ]

  const links = role === "ADMIN" ? adminLinks : role === "VOLUNTEER" ? volunteerLinks : userLinks

  return (
    <aside className="w-64 bg-blue-600 text-white flex flex-col">
      <div className="p-6 border-b border-blue-500">
        <h1 className="text-2xl font-bold">DMS</h1>
        <p className="text-sm text-blue-200 mt-1">Disaster Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors ${isActive(link.href)}`}
            >
              <Icon size={20} />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-blue-500">
        <div className="px-4 py-2">
          <p className="text-xs text-blue-200 uppercase font-semibold">Role</p>
          <p className="text-sm font-medium">{role}</p>
        </div>
      </div>
    </aside>
  )
}

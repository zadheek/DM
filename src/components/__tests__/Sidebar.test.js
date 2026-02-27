import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import Sidebar from '../layout/Sidebar'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/dashboard'),
}))

describe('Sidebar', () => {
  it('should render USER role navigation', () => {
    render(<Sidebar role="USER" />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('My Reports')).toBeInTheDocument()
    expect(screen.getByText('Donate')).toBeInTheDocument()
    expect(screen.getByText('Notifications')).toBeInTheDocument()

    // Admin link should not be visible for USER
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
  })

  it('should render VOLUNTEER role navigation', () => {
    render(<Sidebar role="VOLUNTEER" />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Reports')).toBeInTheDocument()
    expect(screen.getByText('Rescue Ops')).toBeInTheDocument()
    expect(screen.getByText('Donations')).toBeInTheDocument()

    // Admin link should not be visible for VOLUNTEER
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
  })

  it('should render ADMIN role navigation with all links', () => {
    render(<Sidebar role="ADMIN" />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('All Reports')).toBeInTheDocument()
    expect(screen.getByText('Rescue Ops')).toBeInTheDocument()
    expect(screen.getByText('Disasters')).toBeInTheDocument()
    expect(screen.getByText('Admin Panel')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('should highlight active link', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/dashboard')

    const { container } = render(<Sidebar role="USER" />)

    // Check for active state styling (based on implementation)
    const activeLinks = container.querySelectorAll('.bg-blue-700')
    expect(activeLinks.length).toBeGreaterThan(0)
  })
})

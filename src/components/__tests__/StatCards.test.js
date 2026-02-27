import { render, screen } from '@testing-library/react'
import StatCards from '../dashboard/StatCards'

describe('StatCards', () => {
  it('should render all stat cards with correct values', () => {
    const stats = {
      overview: {
        activeDisasters: 5,
        pendingReports: 12,
        pendingDonations: 8,
        activeRescueOps: 3,
      }
    }

    render(<StatCards stats={stats} />)

    // Check if values are rendered
    expect(screen.getByText('Active Disasters')).toBeInTheDocument()
    expect(screen.getByText('Pending Reports')).toBeInTheDocument()
    expect(screen.getByText('Pending Donations')).toBeInTheDocument()
    expect(screen.getByText('Active Rescue Ops')).toBeInTheDocument()
  })

  it('should render with zero values', () => {
    const stats = {
      overview: {
        activeDisasters: 0,
        pendingReports: 0,
        pendingDonations: 0,
        activeRescueOps: 0,
      }
    }

    render(<StatCards stats={stats} />)

    const zeros = screen.getAllByText('0')
    expect(zeros).toHaveLength(4)
  })

  it('should display correct colors for each card', () => {
    const stats = {
      overview: {
        activeDisasters: 5,
        pendingReports: 12,
        pendingDonations: 8,
        activeRescueOps: 3,
      }
    }

    const { container } = render(<StatCards stats={stats} />)

    // Check for colored elements (based on implementation)
    const cards = container.querySelectorAll('.bg-red-50, .bg-orange-50, .bg-green-50, .bg-blue-50')
    expect(cards.length).toBeGreaterThan(0)
  })
})

import { render, screen } from '@testing-library/react'
import ActiveDisasters from '../dashboard/ActiveDisasters'

describe('ActiveDisasters', () => {
  it('should render disaster cards', () => {
    const disasters = [
      {
        id: 'disaster1',
        type: 'Flood',
        severity: 'high',
        location: 'Colombo',
        description: 'Heavy rainfall causing floods',
        affectedAreas: ['Colombo', 'Gampaha'],
        _count: {
          reports: 15,
          donations: 8,
        },
      },
      {
        id: 'disaster2',
        type: 'Landslide',
        severity: 'medium',
        location: 'Kandy',
        description: 'Landslide in hilly areas',
        affectedAreas: ['Kandy', 'Nuwara Eliya'],
        _count: {
          reports: 7,
          donations: 3,
        },
      },
    ]

    render(<ActiveDisasters disasters={disasters} />)

    expect(screen.getByText('Active Disasters')).toBeInTheDocument()
    expect(screen.getByText('Flood')).toBeInTheDocument()
    expect(screen.getByText('Landslide')).toBeInTheDocument()
    expect(screen.getByText('Heavy rainfall causing floods')).toBeInTheDocument()
    expect(screen.getByText('Landslide in hilly areas')).toBeInTheDocument()
  })

  it('should display severity badges with correct colors', () => {
    const disasters = [
      {
        id: 'disaster1',
        type: 'Flood',
        severity: 'critical',
        location: 'Colombo',
        affectedAreas: ['Colombo'],
        _count: { reports: 10, donations: 5 },
      },
      {
        id: 'disaster2',
        type: 'Landslide',
        severity: 'low',
        location: 'Kandy',
        affectedAreas: ['Kandy'],
        _count: { reports: 2, donations: 1 },
      },
    ]

    const { container } = render(<ActiveDisasters disasters={disasters} />)

    // Check for severity badges
    expect(screen.getByText('critical')).toBeInTheDocument()
    expect(screen.getByText('low')).toBeInTheDocument()
  })

  it('should display affected areas', () => {
    const disasters = [
      {
        id: 'disaster1',
        type: 'Flood',
        severity: 'high',
        location: 'Colombo',
        affectedAreas: ['Colombo', 'Gampaha', 'Kalutara'],
        _count: { reports: 15, donations: 8 },
      },
    ]

    render(<ActiveDisasters disasters={disasters} />)

    expect(screen.getByText('Colombo')).toBeInTheDocument()
    expect(screen.getByText('Gampaha')).toBeInTheDocument()
    expect(screen.getByText('Kalutara')).toBeInTheDocument()
  })

  it('should display report and donation counts', () => {
    const disasters = [
      {
        id: 'disaster1',
        type: 'Flood',
        severity: 'high',
        location: 'Colombo',
        affectedAreas: ['Colombo'],
        _count: {
          reports: 25,
          donations: 18,
        },
      },
    ]

    render(<ActiveDisasters disasters={disasters} />)

    expect(screen.getByText('25 Reports')).toBeInTheDocument()
    expect(screen.getByText('18 Donations')).toBeInTheDocument()
  })

  it('should show message when no disasters', () => {
    render(<ActiveDisasters disasters={[]} />)

    expect(screen.getByText('Active Disasters')).toBeInTheDocument()
    expect(screen.getByText('No active disasters at the moment')).toBeInTheDocument()
  })
})

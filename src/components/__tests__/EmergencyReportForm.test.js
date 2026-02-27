import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EmergencyReportForm from '../forms/EmergencyReportForm'

// Mock fetch
global.fetch = jest.fn()

describe('EmergencyReportForm', () => {
  const mockDisasters = [
    { id: 'disaster1', type: 'Flood', location: 'Colombo' },
    { id: 'disaster2', type: 'Landslide', location: 'Kandy' },
  ]

  beforeEach(() => {
    fetch.mockClear()
  })

  it('should render the form with all fields', () => {
    render(<EmergencyReportForm disasters={mockDisasters} />)

    expect(screen.getByText('Report Emergency')).toBeInTheDocument()
    expect(screen.getByLabelText('Disaster')).toBeInTheDocument()
    expect(screen.getByLabelText('Urgency Level')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(screen.getByText('Get My Location')).toBeInTheDocument()
  })

  it('should display disaster options', () => {
    render(<EmergencyReportForm disasters={mockDisasters} />)

    const select = screen.getByLabelText('Disaster')
    expect(select).toHaveTextContent('General Emergency')
    expect(select).toHaveTextContent('Flood - Colombo')
    expect(select).toHaveTextContent('Landslide - Kandy')
  })

  it('should capture location when button is clicked', async () => {
    render(<EmergencyReportForm disasters={mockDisasters} />)

    const locationButton = screen.getByText('Get My Location')
    fireEvent.click(locationButton)

    await waitFor(() => {
      expect(screen.getByText('✓ Location Captured')).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'report123', status: 'pending' }),
    })

    render(<EmergencyReportForm disasters={mockDisasters} />)

    // Capture location
    const locationButton = screen.getByText('Get My Location')
    fireEvent.click(locationButton)

    await waitFor(() => {
      expect(screen.getByText('✓ Location Captured')).toBeInTheDocument()
    })

    // Fill form
    const urgencySelect = screen.getByLabelText('Urgency Level')
    fireEvent.change(urgencySelect, { target: { value: 'high' } })

    const description = screen.getByLabelText('Description')
    fireEvent.change(description, {
      target: { value: 'Emergency situation requiring immediate help' },
    })

    // Submit
    const submitButton = screen.getByText('Submit Report')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('high'),
      })
    })
  })

  it('should not submit without location', async () => {
    // Mock alert
    global.alert = jest.fn()

    render(<EmergencyReportForm disasters={mockDisasters} />)

    const urgencySelect = screen.getByLabelText('Urgency Level')
    fireEvent.change(urgencySelect, { target: { value: 'high' } })

    const description = screen.getByLabelText('Description')
    fireEvent.change(description, { target: { value: 'Emergency' } })

    const submitButton = screen.getByText('Submit Report')
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Please get your location first'
      )
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  it('should show loading state during submission', async () => {
    fetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100)
        )
    )

    render(<EmergencyReportForm disasters={mockDisasters} />)

    // Capture location
    const locationButton = screen.getByText('Get My Location')
    fireEvent.click(locationButton)

    await waitFor(() => {
      expect(screen.getByText('✓ Location Captured')).toBeInTheDocument()
    })

    // Fill and submit
    const urgencySelect = screen.getByLabelText('Urgency Level')
    fireEvent.change(urgencySelect, { target: { value: 'critical' } })

    const description = screen.getByLabelText('Description')
    fireEvent.change(description, { target: { value: 'Critical emergency' } })

    const submitButton = screen.getByText('Submit Report')
    fireEvent.click(submitButton)

    // Check loading state
    expect(screen.getByText('Submitting...')).toBeInTheDocument()
  })
})

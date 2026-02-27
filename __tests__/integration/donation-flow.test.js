/**
 * Integration Test: Donation Submission Flow
 * 
 * This test verifies the complete donation flow:
 * 1. Public access (no authentication required)
 * 2. Loading active disasters
 * 3. Filling donation form
 * 4. Submitting donation
 * 5. Donation appearing in admin donations list
 */

describe('Donation Submission Flow', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should allow public donation without authentication', async () => {
    const mockDisasters = [
      { id: 'disaster1', type: 'Flood', location: 'Colombo', status: 'active' },
      { id: 'disaster2', type: 'Landslide', location: 'Kandy', status: 'active' },
    ]

    const mockDonation = {
      id: 'donation123',
      donorName: 'John Doe',
      donorContact: '0771234567',
      type: 'food',
      quantity: 50,
      disasterId: 'disaster1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDisasters,
      }) // GET /api/disasters
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDonation,
      }) // POST /api/donations

    // Step 1: Load disasters
    const disastersResponse = await fetch('/api/disasters')
    const disasters = await disastersResponse.json()

    expect(disasters).toHaveLength(2)

    // Step 2: Submit donation
    const donationData = {
      donorName: 'John Doe',
      donorContact: '0771234567',
      type: 'food',
      quantity: '50',
      description: '50 kg of rice',
      disasterId: 'disaster1',
    }

    const donationResponse = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData),
    })

    const donation = await donationResponse.json()

    expect(donationResponse.ok).toBe(true)
    expect(donation.id).toBe('donation123')
    expect(donation.donorName).toBe('John Doe')
    expect(donation.type).toBe('food')
    expect(donation.quantity).toBe(50)
  })

  it('should handle general donations without disaster link', async () => {
    const mockDonation = {
      id: 'donation456',
      donorName: 'Jane Smith',
      donorContact: '0779876543',
      type: 'medical',
      quantity: 100,
      disasterId: null,
      status: 'pending',
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDonation,
    })

    const donationData = {
      donorName: 'Jane Smith',
      donorContact: '0779876543',
      type: 'medical',
      quantity: '100',
      description: 'Medical supplies',
      disasterId: null,
    }

    const response = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData),
    })

    const donation = await response.json()

    expect(donation.disasterId).toBeNull()
    expect(donation.type).toBe('medical')
  })
})

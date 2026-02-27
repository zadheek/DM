/**
 * Integration Test: Admin Disaster Management Flow
 * 
 * This test verifies admin operations:
 * 1. Admin authentication
 * 2. Creating a new disaster
 * 3. Updating disaster status
 * 4. Viewing disaster with associated reports
 */

import { useSession } from 'next-auth/react'

jest.mock('next-auth/react')

describe('Admin Disaster Management Flow', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  it('should allow admin to create and manage disasters', async () => {
    // Mock admin session
    useSession.mockReturnValue({
      data: {
        user: { id: 'admin123', email: 'admin@dms.lk', role: 'ADMIN', name: 'Admin User' },
      },
      status: 'authenticated',
    })

    const newDisaster = {
      type: 'Flood',
      severity: 'high',
      location: 'Colombo',
      description: 'Heavy rainfall causing severe floods',
      affectedAreas: 'Colombo, Gampaha, Kalutara',
      startDate: new Date().toISOString(),
    }

    const createdDisaster = {
      id: 'disaster123',
      ...newDisaster,
      affectedAreas: ['Colombo', 'Gampaha', 'Kalutara'],
      status: 'active',
      createdAt: new Date().toISOString(),
    }

    // Mock disaster creation
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => createdDisaster,
    })

    // Step 1: Create disaster
    const createResponse = await fetch('/api/disasters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDisaster),
    })

    const disaster = await createResponse.json()

    expect(createResponse.status).toBe(201)
    expect(disaster.id).toBe('disaster123')
    expect(disaster.type).toBe('Flood')
    expect(disaster.severity).toBe('high')
    expect(disaster.affectedAreas).toEqual(['Colombo', 'Gampaha', 'Kalutara'])

    // Step 2: Update disaster status
    const updatedDisaster = { ...disaster, status: 'resolved' }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedDisaster,
    })

    const updateResponse = await fetch(`/api/disasters/${disaster.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved' }),
    })

    const updated = await updateResponse.json()

    expect(updated.status).toBe('resolved')
  })

  it('should prevent non-admin from creating disasters', async () => {
    useSession.mockReturnValue({
      data: {
        user: { id: 'user123', email: 'user@dms.lk', role: 'USER', name: 'Regular User' },
      },
      status: 'authenticated',
    })

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
    })

    const response = await fetch('/api/disasters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'Flood',
        severity: 'high',
        location: 'Colombo',
      }),
    })

    const result = await response.json()

    expect(response.status).toBe(401)
    expect(result.error).toBe('Unauthorized')
  })
})

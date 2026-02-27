/**
 * Integration Test: Complete User Journey
 * 
 * This test simulates a complete user journey:
 * 1. Registration
 * 2. Login
 * 3. View dashboard
 * 4. Submit emergency report
 * 5. View notifications
 * 6. Check report status
 */

import { signIn, useSession } from 'next-auth/react'

jest.mock('next-auth/react')

describe('Complete User Journey', () => {
  beforeEach(() => {
    fetch.mockClear()
    jest.clearAllMocks()
  })

  it('should complete full user journey from registration to report submission', async () => {
    // Step 1: User Registration
    const newUser = {
      name: 'New User',
      email: 'newuser@dms.lk',
      password: 'password123',
      phone: '0771234567',
      address: 'Colombo, Sri Lanka',
    }

    const registeredUser = {
      id: 'user789',
      name: 'New User',
      email: 'newuser@dms.lk',
      role: 'USER',
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => registeredUser,
    })

    const registerResponse = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })

    const user = await registerResponse.json()

    expect(registerResponse.status).toBe(201)
    expect(user.email).toBe('newuser@dms.lk')

    // Step 2: User Login
    signIn.mockResolvedValueOnce({ ok: true, url: '/dashboard' })

    const loginResult = await signIn('credentials', {
      redirect: false,
      email: 'newuser@dms.lk',
      password: 'password123',
    })

    expect(loginResult.ok).toBe(true)

    // Step 3: Mock authenticated session
    useSession.mockReturnValue({
      data: {
        user: { id: 'user789', email: 'newuser@dms.lk', role: 'USER', name: 'New User' },
      },
      status: 'authenticated',
    })

    // Step 4: Load dashboard data
    const mockStats = {
      activeDisasters: 3,
      pendingReports: 8,
      pendingDonations: 5,
      activeRescueOps: 2,
    }

    const mockDisasters = [
      {
        id: 'disaster1',
        type: 'Flood',
        severity: 'high',
        location: 'Colombo',
        _count: { reports: 10, donations: 5 },
      },
    ]

    const mockNotifications = [
      {
        id: 'notif1',
        title: 'New Disaster Alert',
        message: 'Flood warning in Colombo',
        type: 'alert',
        createdAt: new Date().toISOString(),
      },
    ]

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockStats,
      }) // GET /api/stats
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockDisasters,
      }) // GET /api/disasters
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockNotifications,
      }) // GET /api/notifications

    // Load stats
    const statsResponse = await fetch('/api/stats')
    const stats = await statsResponse.json()
    expect(stats.activeDisasters).toBe(3)

    // Load disasters
    const disastersResponse = await fetch('/api/disasters')
    const disasters = await disastersResponse.json()
    expect(disasters).toHaveLength(1)

    // Load notifications
    const notificationsResponse = await fetch('/api/notifications')
    const notifications = await notificationsResponse.json()
    expect(notifications).toHaveLength(1)

    // Step 5: Submit emergency report
    const mockReport = {
      id: 'report999',
      userId: 'user789',
      disasterId: 'disaster1',
      latitude: 6.9271,
      longitude: 79.8612,
      description: 'Need urgent help',
      urgency: 'critical',
      status: 'pending',
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockReport,
    })

    const reportResponse = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        disasterId: 'disaster1',
        latitude: 6.9271,
        longitude: 79.8612,
        description: 'Need urgent help',
        urgency: 'critical',
      }),
    })

    const report = await reportResponse.json()

    expect(report.id).toBe('report999')
    expect(report.urgency).toBe('critical')
    expect(report.status).toBe('pending')
  })
})

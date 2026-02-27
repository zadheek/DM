import { POST, GET } from '../reports/route'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

// Mock dependencies
jest.mock('@prisma/client')
jest.mock('next-auth')

describe('Emergency Reports API', () => {
  let mockPrisma

  beforeEach(() => {
    mockPrisma = {
      emergencyReport: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    }
    PrismaClient.mockImplementation(() => mockPrisma)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/reports', () => {
    it('should create an emergency report when authenticated', async () => {
      // Mock authenticated session
      getServerSession.mockResolvedValue({
        user: { id: 'user123', email: 'user@dms.lk', role: 'USER' },
      })

      const mockReport = {
        id: 'report123',
        userId: 'user123',
        latitude: 6.9271,
        longitude: 79.8612,
        description: 'Emergency situation',
        urgency: 'high',
        status: 'pending',
      }

      mockPrisma.emergencyReport.create.mockResolvedValue(mockReport)

      const request = {
        json: async () => ({
          latitude: 6.9271,
          longitude: 79.8612,
          description: 'Emergency situation',
          urgency: 'high',
        }),
      }

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockReport)
      expect(mockPrisma.emergencyReport.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user123',
          latitude: 6.9271,
          longitude: 79.8612,
          description: 'Emergency situation',
          urgency: 'high',
        }),
      })
    })

    it('should return 401 when not authenticated', async () => {
      getServerSession.mockResolvedValue(null)

      const request = {
        json: async () => ({}),
      }

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
      expect(mockPrisma.emergencyReport.create).not.toHaveBeenCalled()
    })
  })

  describe('GET /api/reports', () => {
    it('should return all reports with user and disaster data', async () => {
      getServerSession.mockResolvedValue({
        user: { id: 'admin123', email: 'admin@dms.lk', role: 'ADMIN' },
      })

      const mockReports = [
        {
          id: 'report1',
          userId: 'user1',
          description: 'Emergency 1',
          urgency: 'high',
          status: 'pending',
          user: { name: 'John Doe', phone: '0771234567' },
          disaster: { type: 'Flood', location: 'Colombo' },
        },
        {
          id: 'report2',
          userId: 'user2',
          description: 'Emergency 2',
          urgency: 'critical',
          status: 'in-progress',
          user: { name: 'Jane Smith', phone: '0779876543' },
          disaster: null,
        },
      ]

      mockPrisma.emergencyReport.findMany.mockResolvedValue(mockReports)

      const request = {}
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockReports)
      expect(mockPrisma.emergencyReport.findMany).toHaveBeenCalledWith({
        include: {
          user: { select: { name: true, phone: true } },
          disaster: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should return 401 when not authenticated', async () => {
      getServerSession.mockResolvedValue(null)

      const request = {}
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })
  })
})

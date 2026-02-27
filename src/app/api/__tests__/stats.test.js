import { GET } from '../stats/route'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

jest.mock('@prisma/client')
jest.mock('next-auth')

describe('Statistics API', () => {
  let mockPrisma

  beforeEach(() => {
    mockPrisma = {
      disaster: {
        count: jest.fn(),
      },
      emergencyReport: {
        count: jest.fn(),
      },
      donation: {
        count: jest.fn(),
      },
      rescueOperation: {
        count: jest.fn(),
      },
    }
    PrismaClient.mockImplementation(() => mockPrisma)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/stats', () => {
    it('should return statistics when authenticated', async () => {
      getServerSession.mockResolvedValue({
        user: { id: 'user123', email: 'user@dms.lk', role: 'USER' },
      })

      mockPrisma.disaster.count.mockResolvedValue(5)
      mockPrisma.emergencyReport.count.mockResolvedValue(12)
      mockPrisma.donation.count.mockResolvedValue(8)
      mockPrisma.rescueOperation.count.mockResolvedValue(3)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        activeDisasters: 5,
        pendingReports: 12,
        pendingDonations: 8,
        activeRescueOps: 3,
      })

      expect(mockPrisma.disaster.count).toHaveBeenCalledWith({
        where: { status: 'active' },
      })
      expect(mockPrisma.emergencyReport.count).toHaveBeenCalledWith({
        where: { status: 'pending' },
      })
      expect(mockPrisma.donation.count).toHaveBeenCalledWith({
        where: { status: 'pending' },
      })
      expect(mockPrisma.rescueOperation.count).toHaveBeenCalledWith({
        where: { status: { in: ['assigned', 'in-progress'] } },
      })
    })

    it('should return 401 when not authenticated', async () => {
      getServerSession.mockResolvedValue(null)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })
  })
})

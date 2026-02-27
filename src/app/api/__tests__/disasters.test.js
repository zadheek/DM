import { POST, GET } from '../disasters/route'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'

jest.mock('@prisma/client')
jest.mock('next-auth')

describe('Disasters API', () => {
  let mockPrisma

  beforeEach(() => {
    mockPrisma = {
      disaster: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    }
    PrismaClient.mockImplementation(() => mockPrisma)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/disasters', () => {
    it('should allow admin to create disaster', async () => {
      getServerSession.mockResolvedValue({
        user: { id: 'admin123', email: 'admin@dms.lk', role: 'ADMIN' },
      })

      const mockDisaster = {
        id: 'disaster123',
        type: 'Flood',
        severity: 'high',
        location: 'Colombo',
        description: 'Heavy rainfall causing floods',
        status: 'active',
        affectedAreas: ['Colombo', 'Gampaha'],
      }

      mockPrisma.disaster.create.mockResolvedValue(mockDisaster)

      const request = {
        json: async () => ({
          type: 'Flood',
          severity: 'high',
          location: 'Colombo',
          description: 'Heavy rainfall causing floods',
          affectedAreas: 'Colombo, Gampaha',
        }),
      }

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockDisaster)
    })

    it('should deny non-admin users', async () => {
      getServerSession.mockResolvedValue({
        user: { id: 'user123', email: 'user@dms.lk', role: 'USER' },
      })

      const request = {
        json: async () => ({}),
      }

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
      expect(mockPrisma.disaster.create).not.toHaveBeenCalled()
    })
  })

  describe('GET /api/disasters', () => {
    it('should return all active disasters', async () => {
      const mockDisasters = [
        {
          id: 'disaster1',
          type: 'Flood',
          severity: 'high',
          location: 'Colombo',
          status: 'active',
        },
        {
          id: 'disaster2',
          type: 'Landslide',
          severity: 'medium',
          location: 'Kandy',
          status: 'active',
        },
      ]

      mockPrisma.disaster.findMany.mockResolvedValue(mockDisasters)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockDisasters)
      expect(mockPrisma.disaster.findMany).toHaveBeenCalledWith({
        where: { status: 'active' },
        orderBy: { startDate: 'desc' },
      })
    })
  })
})

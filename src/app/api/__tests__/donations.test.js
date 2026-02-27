import { POST, GET } from '../donations/route'
import { PrismaClient } from '@prisma/client'

jest.mock('@prisma/client')

describe('Donations API', () => {
  let mockPrisma

  beforeEach(() => {
    mockPrisma = {
      donation: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    }
    PrismaClient.mockImplementation(() => mockPrisma)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/donations', () => {
    it('should create a donation (no auth required)', async () => {
      const mockDonation = {
        id: 'donation123',
        donorName: 'John Doe',
        donorContact: '0771234567',
        type: 'food',
        quantity: 50,
        description: '50 kg of rice',
        status: 'pending',
      }

      mockPrisma.donation.create.mockResolvedValue(mockDonation)

      const request = {
        json: async () => ({
          donorName: 'John Doe',
          donorContact: '0771234567',
          type: 'food',
          quantity: '50',
          description: '50 kg of rice',
        }),
      }

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockDonation)
      expect(mockPrisma.donation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          donorName: 'John Doe',
          quantity: 50,
          type: 'food',
        }),
      })
    })

    it('should handle donations linked to disasters', async () => {
      const mockDonation = {
        id: 'donation456',
        donorName: 'Jane Smith',
        donorContact: '0779876543',
        type: 'medical',
        quantity: 100,
        disasterId: 'disaster123',
      }

      mockPrisma.donation.create.mockResolvedValue(mockDonation)

      const request = {
        json: async () => ({
          donorName: 'Jane Smith',
          donorContact: '0779876543',
          type: 'medical',
          quantity: '100',
          disasterId: 'disaster123',
        }),
      }

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(mockPrisma.donation.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          disasterId: 'disaster123',
        }),
      })
    })
  })

  describe('GET /api/donations', () => {
    it('should return all donations with disaster info', async () => {
      const mockDonations = [
        {
          id: 'donation1',
          donorName: 'Donor 1',
          type: 'food',
          quantity: 50,
          disaster: { type: 'Flood', location: 'Colombo' },
        },
        {
          id: 'donation2',
          donorName: 'Donor 2',
          type: 'clothing',
          quantity: 100,
          disaster: null,
        },
      ]

      mockPrisma.donation.findMany.mockResolvedValue(mockDonations)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockDonations)
      expect(mockPrisma.donation.findMany).toHaveBeenCalledWith({
        include: { disaster: true },
        orderBy: { createdAt: 'desc' },
      })
    })
  })
})

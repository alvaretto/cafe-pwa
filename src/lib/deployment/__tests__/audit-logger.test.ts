/**
 * Tests de integración para audit logger
 * CRM Tinto del Mirador
 */

import { logDeploymentActivity, getDeploymentLogs, getDeploymentStats } from '../audit-logger'
import { DeploymentLogLevel, DeploymentLogType } from '@/types/deployment'

// Mock de Prisma Client
const mockPrismaClient = {
  deploymentLog: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  $disconnect: jest.fn(),
}

// Mock del módulo prisma
jest.mock('@/lib/prisma', () => ({
  prisma: mockPrismaClient
}))

describe('Audit Logger Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('logDeploymentActivity', () => {
    it('should log deployment activity successfully', async () => {
      const mockLogEntry = {
        id: 'log-1',
        type: 'deployment' as DeploymentLogType,
        level: 'info' as DeploymentLogLevel,
        message: 'Deployment started',
        details: { platform: 'vercel' },
        userId: 'user-1',
        timestamp: new Date(),
        deploymentId: 'deploy-1',
        duration: null,
        metadata: {}
      }

      mockPrismaClient.deploymentLog.create.mockResolvedValue(mockLogEntry)

      const result = await logDeploymentActivity({
        type: 'deployment',
        level: 'info',
        message: 'Deployment started',
        details: { platform: 'vercel' },
        userId: 'user-1',
        deploymentId: 'deploy-1'
      })

      expect(mockPrismaClient.deploymentLog.create).toHaveBeenCalledWith({
        data: {
          type: 'deployment',
          level: 'info',
          message: 'Deployment started',
          details: { platform: 'vercel' },
          userId: 'user-1',
          deploymentId: 'deploy-1',
          timestamp: expect.any(Date),
          duration: null,
          metadata: {}
        }
      })

      expect(result).toEqual(mockLogEntry)
    })

    it('should handle database errors gracefully', async () => {
      mockPrismaClient.deploymentLog.create.mockRejectedValue(new Error('Database error'))

      await expect(logDeploymentActivity({
        type: 'deployment',
        level: 'error',
        message: 'Test error',
        userId: 'user-1'
      })).rejects.toThrow('Database error')
    })

    it('should log with default values when optional fields are missing', async () => {
      const mockLogEntry = {
        id: 'log-2',
        type: 'validation' as DeploymentLogType,
        level: 'warning' as DeploymentLogLevel,
        message: 'Validation warning',
        details: {},
        userId: 'user-1',
        timestamp: new Date(),
        deploymentId: null,
        duration: null,
        metadata: {}
      }

      mockPrismaClient.deploymentLog.create.mockResolvedValue(mockLogEntry)

      const result = await logDeploymentActivity({
        type: 'validation',
        level: 'warning',
        message: 'Validation warning',
        userId: 'user-1'
      })

      expect(mockPrismaClient.deploymentLog.create).toHaveBeenCalledWith({
        data: {
          type: 'validation',
          level: 'warning',
          message: 'Validation warning',
          details: {},
          userId: 'user-1',
          timestamp: expect.any(Date),
          deploymentId: null,
          duration: null,
          metadata: {}
        }
      })

      expect(result).toEqual(mockLogEntry)
    })

    it('should log with duration for completed activities', async () => {
      const mockLogEntry = {
        id: 'log-3',
        type: 'build' as DeploymentLogType,
        level: 'success' as DeploymentLogLevel,
        message: 'Build completed',
        details: { buildTime: '2.5s' },
        userId: 'user-1',
        timestamp: new Date(),
        deploymentId: 'deploy-1',
        duration: 2500,
        metadata: { exitCode: 0 }
      }

      mockPrismaClient.deploymentLog.create.mockResolvedValue(mockLogEntry)

      const result = await logDeploymentActivity({
        type: 'build',
        level: 'success',
        message: 'Build completed',
        details: { buildTime: '2.5s' },
        userId: 'user-1',
        deploymentId: 'deploy-1',
        duration: 2500,
        metadata: { exitCode: 0 }
      })

      expect(result.duration).toBe(2500)
      expect(result.metadata).toEqual({ exitCode: 0 })
    })
  })

  describe('getDeploymentLogs', () => {
    it('should retrieve deployment logs with default pagination', async () => {
      const mockLogs = [
        {
          id: 'log-1',
          type: 'deployment',
          level: 'info',
          message: 'Deployment started',
          timestamp: new Date(),
          userId: 'user-1'
        },
        {
          id: 'log-2',
          type: 'deployment',
          level: 'success',
          message: 'Deployment completed',
          timestamp: new Date(),
          userId: 'user-1'
        }
      ]

      mockPrismaClient.deploymentLog.findMany.mockResolvedValue(mockLogs)

      const result = await getDeploymentLogs()

      expect(mockPrismaClient.deploymentLog.findMany).toHaveBeenCalledWith({
        orderBy: { timestamp: 'desc' },
        take: 50,
        skip: 0,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      expect(result).toEqual(mockLogs)
    })

    it('should retrieve logs with custom pagination', async () => {
      const mockLogs = []
      mockPrismaClient.deploymentLog.findMany.mockResolvedValue(mockLogs)

      await getDeploymentLogs({ page: 2, limit: 25 })

      expect(mockPrismaClient.deploymentLog.findMany).toHaveBeenCalledWith({
        orderBy: { timestamp: 'desc' },
        take: 25,
        skip: 25,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    })

    it('should filter logs by deployment ID', async () => {
      const mockLogs = []
      mockPrismaClient.deploymentLog.findMany.mockResolvedValue(mockLogs)

      await getDeploymentLogs({ deploymentId: 'deploy-1' })

      expect(mockPrismaClient.deploymentLog.findMany).toHaveBeenCalledWith({
        where: {
          deploymentId: 'deploy-1'
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
        skip: 0,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    })

    it('should filter logs by user ID', async () => {
      const mockLogs = []
      mockPrismaClient.deploymentLog.findMany.mockResolvedValue(mockLogs)

      await getDeploymentLogs({ userId: 'user-1' })

      expect(mockPrismaClient.deploymentLog.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-1'
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
        skip: 0,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    })

    it('should filter logs by level', async () => {
      const mockLogs = []
      mockPrismaClient.deploymentLog.findMany.mockResolvedValue(mockLogs)

      await getDeploymentLogs({ level: 'error' })

      expect(mockPrismaClient.deploymentLog.findMany).toHaveBeenCalledWith({
        where: {
          level: 'error'
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
        skip: 0,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    })

    it('should filter logs by date range', async () => {
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')
      const mockLogs = []
      mockPrismaClient.deploymentLog.findMany.mockResolvedValue(mockLogs)

      await getDeploymentLogs({ startDate, endDate })

      expect(mockPrismaClient.deploymentLog.findMany).toHaveBeenCalledWith({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
        skip: 0,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    })

    it('should combine multiple filters', async () => {
      const mockLogs = []
      mockPrismaClient.deploymentLog.findMany.mockResolvedValue(mockLogs)

      await getDeploymentLogs({
        deploymentId: 'deploy-1',
        userId: 'user-1',
        level: 'error',
        startDate: new Date('2024-01-01')
      })

      expect(mockPrismaClient.deploymentLog.findMany).toHaveBeenCalledWith({
        where: {
          deploymentId: 'deploy-1',
          userId: 'user-1',
          level: 'error',
          timestamp: {
            gte: new Date('2024-01-01')
          }
        },
        orderBy: { timestamp: 'desc' },
        take: 50,
        skip: 0,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    })
  })

  describe('getDeploymentStats', () => {
    it('should return deployment statistics', async () => {
      // Mock count queries
      mockPrismaClient.deploymentLog.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(85)  // success
        .mockResolvedValueOnce(10)  // errors
        .mockResolvedValueOnce(5)   // warnings

      // Mock groupBy for recent activity
      mockPrismaClient.deploymentLog.groupBy.mockResolvedValue([
        { type: 'deployment', _count: { type: 15 } },
        { type: 'build', _count: { type: 12 } },
        { type: 'validation', _count: { type: 8 } }
      ])

      const result = await getDeploymentStats()

      expect(result).toEqual({
        total: 100,
        success: 85,
        errors: 10,
        warnings: 5,
        recentActivity: [
          { type: 'deployment', count: 15 },
          { type: 'build', count: 12 },
          { type: 'validation', count: 8 }
        ]
      })
    })

    it('should handle database errors in stats', async () => {
      mockPrismaClient.deploymentLog.count.mockRejectedValue(new Error('Database error'))

      await expect(getDeploymentStats()).rejects.toThrow('Database error')
    })

    it('should return stats for specific time period', async () => {
      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')

      mockPrismaClient.deploymentLog.count
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(45)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(2)

      mockPrismaClient.deploymentLog.groupBy.mockResolvedValue([])

      await getDeploymentStats(startDate, endDate)

      // Verify that all count calls include the date filter
      expect(mockPrismaClient.deploymentLog.count).toHaveBeenCalledWith({
        where: {
          timestamp: {
            gte: startDate,
            lte: endDate
          }
        }
      })
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle null/undefined values gracefully', async () => {
      mockPrismaClient.deploymentLog.create.mockResolvedValue({
        id: 'log-1',
        type: 'deployment',
        level: 'info',
        message: 'Test',
        details: null,
        userId: 'user-1',
        timestamp: new Date(),
        deploymentId: null,
        duration: null,
        metadata: null
      })

      const result = await logDeploymentActivity({
        type: 'deployment',
        level: 'info',
        message: 'Test',
        userId: 'user-1',
        details: null,
        metadata: null
      })

      expect(result).toBeDefined()
      expect(result.details).toBeNull()
      expect(result.metadata).toBeNull()
    })

    it('should handle empty results gracefully', async () => {
      mockPrismaClient.deploymentLog.findMany.mockResolvedValue([])

      const result = await getDeploymentLogs()

      expect(result).toEqual([])
    })

    it('should handle large datasets efficiently', async () => {
      const largeMockLogs = Array.from({ length: 1000 }, (_, i) => ({
        id: `log-${i}`,
        type: 'deployment',
        level: 'info',
        message: `Log ${i}`,
        timestamp: new Date()
      }))

      mockPrismaClient.deploymentLog.findMany.mockResolvedValue(largeMockLogs)

      const result = await getDeploymentLogs({ limit: 1000 })

      expect(result).toHaveLength(1000)
      expect(mockPrismaClient.deploymentLog.findMany).toHaveBeenCalledWith({
        orderBy: { timestamp: 'desc' },
        take: 1000,
        skip: 0,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
    })
  })
})

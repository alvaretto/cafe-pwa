/**
 * Sistema de auditoría para deployment logs
 * CRM Tinto del Mirador
 */

import { PrismaClient } from '@prisma/client'
import { 
  DeploymentLog, 
  DeploymentStatus, 
  HostingPlatform, 
  ValidationResult, 
  DeploymentStep 
} from '@/types/deployment'

// Crear instancia de Prisma
const prisma = new PrismaClient()

/**
 * Interfaz para crear un log de deployment
 */
interface CreateDeploymentLogData {
  userId: string
  status: DeploymentStatus
  platform: HostingPlatform
  configId?: string
  commitHash?: string
  branch?: string
  deploymentUrl?: string
  buildId?: string
  logs?: string[]
  validations?: ValidationResult[]
  steps?: DeploymentStep[]
  error?: {
    code: string
    message: string
    stack?: string
    step?: string
  }
  metadata?: {
    nodeVersion: string
    npmVersion: string
    nextVersion: string
    buildSize?: number
    bundleAnalysis?: any
  }
}

/**
 * Clase para manejar la auditoría de deployments
 */
export class DeploymentAuditLogger {
  /**
   * Crea un nuevo log de deployment
   */
  static async createLog(data: CreateDeploymentLogData): Promise<string> {
    try {
      const deploymentLog = await prisma.deploymentLog.create({
        data: {
          userId: data.userId,
          status: data.status.toUpperCase() as any,
          platform: data.platform.toUpperCase() as any,
          configId: data.configId || null,
          commitHash: data.commitHash || null,
          branch: data.branch || 'main',
          deploymentUrl: data.deploymentUrl || null,
          buildId: data.buildId || null,
          logs: JSON.stringify(data.logs || []),
          validations: JSON.stringify(data.validations || []),
          steps: JSON.stringify(data.steps || []),
          error: data.error ? JSON.stringify(data.error) : null,
          metadata: JSON.stringify(data.metadata || {})
        } as any
      })

      return deploymentLog.id
    } catch (error) {
      console.error('Error creating deployment log:', error)
      throw new Error('Failed to create deployment log')
    }
  }

  /**
   * Actualiza un log de deployment existente
   */
  static async updateLog(
    id: string, 
    updates: Partial<CreateDeploymentLogData> & {
      completedAt?: Date
      duration?: number
    }
  ): Promise<void> {
    try {
      const updateData: any = {}

      if (updates.status) {
        updateData.status = updates.status.toUpperCase()
      }

      if (updates.deploymentUrl) {
        updateData.deploymentUrl = updates.deploymentUrl
      }

      if (updates.buildId) {
        updateData.buildId = updates.buildId
      }

      if (updates.logs) {
        updateData.logs = JSON.stringify(updates.logs)
      }

      if (updates.validations) {
        updateData.validations = JSON.stringify(updates.validations)
      }

      if (updates.steps) {
        updateData.steps = JSON.stringify(updates.steps)
      }

      if (updates.error) {
        updateData.error = JSON.stringify(updates.error)
      }

      if (updates.metadata) {
        updateData.metadata = JSON.stringify(updates.metadata)
      }

      if (updates.completedAt) {
        updateData.completedAt = updates.completedAt
      }

      if (updates.duration) {
        updateData.duration = updates.duration
      }

      await prisma.deploymentLog.update({
        where: { id },
        data: updateData
      })
    } catch (error) {
      console.error('Error updating deployment log:', error)
      throw new Error('Failed to update deployment log')
    }
  }

  /**
   * Obtiene los logs de deployment de un usuario
   */
  static async getUserDeploymentLogs(
    userId: string, 
    limit: number = 10,
    offset: number = 0
  ): Promise<DeploymentLog[]> {
    try {
      const logs = await prisma.deploymentLog.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
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

      return logs.map(log => ({
        id: log.id,
        userId: log.userId,
        status: log.status.toLowerCase() as DeploymentStatus,
        platform: log.platform.toLowerCase() as HostingPlatform,
        configId: log.configId || '',
        startedAt: log.startedAt,
        completedAt: log.completedAt || undefined,
        duration: log.duration || undefined,
        commitHash: log.commitHash || undefined,
        branch: log.branch,
        deploymentUrl: log.deploymentUrl || undefined,
        buildId: log.buildId || undefined,
        steps: JSON.parse(log.steps),
        validations: JSON.parse(log.validations),
        logs: JSON.parse(log.logs),
        error: log.error ? JSON.parse(log.error) : undefined,
        metadata: JSON.parse(log.metadata)
      }) as any)
    } catch (error) {
      console.error('Error fetching user deployment logs:', error)
      return []
    }
  }

  /**
   * Obtiene todos los logs de deployment (solo para admins)
   */
  static async getAllDeploymentLogs(
    limit: number = 20,
    offset: number = 0,
    status?: DeploymentStatus,
    platform?: HostingPlatform
  ): Promise<DeploymentLog[]> {
    try {
      const where: any = {}

      if (status) {
        where.status = status.toUpperCase()
      }

      if (platform) {
        where.platform = platform.toUpperCase()
      }

      const logs = await prisma.deploymentLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
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

      return logs.map(log => ({
        id: log.id,
        userId: log.userId,
        status: log.status.toLowerCase() as DeploymentStatus,
        platform: log.platform.toLowerCase() as HostingPlatform,
        configId: log.configId || '',
        startedAt: log.startedAt,
        completedAt: log.completedAt || undefined,
        duration: log.duration || undefined,
        commitHash: log.commitHash || undefined,
        branch: log.branch,
        deploymentUrl: log.deploymentUrl || undefined,
        buildId: log.buildId || undefined,
        steps: JSON.parse(log.steps),
        validations: JSON.parse(log.validations),
        logs: JSON.parse(log.logs),
        error: log.error ? JSON.parse(log.error) : undefined,
        metadata: JSON.parse(log.metadata)
      }) as any)
    } catch (error) {
      console.error('Error fetching all deployment logs:', error)
      return []
    }
  }

  /**
   * Obtiene estadísticas de deployment
   */
  static async getDeploymentStats(userId?: string): Promise<{
    total: number
    successful: number
    failed: number
    averageDuration: number
    lastDeployment?: Date
    deploymentsByPlatform: Record<string, number>
    deploymentsByStatus: Record<string, number>
  }> {
    try {
      const where = userId ? { userId } : {}

      const [
        total,
        successful,
        failed,
        allLogs
      ] = await Promise.all([
        prisma.deploymentLog.count({ where }),
        prisma.deploymentLog.count({ 
          where: { ...where, status: 'SUCCESS' } 
        }),
        prisma.deploymentLog.count({ 
          where: { ...where, status: 'ERROR' } 
        }),
        prisma.deploymentLog.findMany({
          where,
          select: {
            duration: true,
            platform: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        })
      ])

      // Calcular duración promedio
      const completedLogs = allLogs.filter(log => log.duration)
      const averageDuration = completedLogs.length > 0
        ? completedLogs.reduce((sum, log) => sum + (log.duration || 0), 0) / completedLogs.length
        : 0

      // Estadísticas por plataforma
      const deploymentsByPlatform = allLogs.reduce((acc, log) => {
        const platform = log.platform.toLowerCase()
        acc[platform] = (acc[platform] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Estadísticas por estado
      const deploymentsByStatus = allLogs.reduce((acc, log) => {
        const status = log.status.toLowerCase()
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        total,
        successful,
        failed,
        averageDuration: Math.round(averageDuration),
        lastDeployment: allLogs[0]?.createdAt || undefined,
        deploymentsByPlatform,
        deploymentsByStatus
      } as any
    } catch (error) {
      console.error('Error fetching deployment stats:', error)
      return {
        total: 0,
        successful: 0,
        failed: 0,
        averageDuration: 0,
        deploymentsByPlatform: {},
        deploymentsByStatus: {}
      }
    }
  }

  /**
   * Elimina logs antiguos (cleanup)
   */
  static async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const result = await prisma.deploymentLog.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      })

      return result.count
    } catch (error) {
      console.error('Error cleaning up old deployment logs:', error)
      return 0
    }
  }

  /**
   * Obtiene un log específico por ID
   */
  static async getLogById(id: string): Promise<DeploymentLog | null> {
    try {
      const log = await prisma.deploymentLog.findUnique({
        where: { id },
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

      if (!log) return null

      return {
        id: log.id,
        userId: log.userId,
        status: log.status.toLowerCase() as DeploymentStatus,
        platform: log.platform.toLowerCase() as HostingPlatform,
        configId: log.configId || '',
        startedAt: log.startedAt,
        completedAt: log.completedAt || undefined,
        duration: log.duration || undefined,
        commitHash: log.commitHash || undefined,
        branch: log.branch,
        deploymentUrl: log.deploymentUrl || undefined,
        buildId: log.buildId || undefined,
        steps: JSON.parse(log.steps),
        validations: JSON.parse(log.validations),
        logs: JSON.parse(log.logs),
        error: log.error ? JSON.parse(log.error) : undefined,
        metadata: JSON.parse(log.metadata)
      } as any
    } catch (error) {
      console.error('Error fetching deployment log by ID:', error)
      return null
    }
  }
}

/**
 * Hook para integrar con el sistema de deployment
 */
export function useDeploymentAudit(userId: string) {
  /**
   * Inicia un nuevo log de deployment
   */
  const startDeploymentLog = async (data: Omit<CreateDeploymentLogData, 'userId'>) => {
    return await DeploymentAuditLogger.createLog({ ...data, userId })
  }

  /**
   * Actualiza un log de deployment
   */
  const updateDeploymentLog = async (
    id: string, 
    updates: Parameters<typeof DeploymentAuditLogger.updateLog>[1]
  ) => {
    return await DeploymentAuditLogger.updateLog(id, updates)
  }

  /**
   * Finaliza un log de deployment
   */
  const completeDeploymentLog = async (
    id: string,
    status: DeploymentStatus,
    deploymentUrl?: string,
    error?: any
  ) => {
    const completedAt = new Date()
    const startLog = await DeploymentAuditLogger.getLogById(id)
    const duration = startLog ? completedAt.getTime() - startLog.startedAt.getTime() : undefined

    return await DeploymentAuditLogger.updateLog(id, {
      status,
      deploymentUrl: deploymentUrl || undefined,
      error,
      completedAt,
      duration
    } as any)
  }

  return {
    startDeploymentLog,
    updateDeploymentLog,
    completeDeploymentLog
  }
}

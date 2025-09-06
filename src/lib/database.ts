import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { PaginationParams, ApiResponse } from '@/types'

/**
 * Función genérica para paginación
 */
export async function paginate<T>(
  model: any,
  params: PaginationParams,
  where?: any,
  include?: any,
  orderBy?: any
): Promise<ApiResponse<T[]>> {
  const { page = 1, limit = 10, search, filters, sortBy, sortOrder = 'desc' } = params

  // Construir condiciones WHERE
  let whereConditions: any = { ...where }

  // Agregar búsqueda si se proporciona
  if (search && model.fields) {
    const searchFields = Object.keys(model.fields).filter(field => 
      model.fields[field].type === 'String'
    )
    
    if (searchFields.length > 0) {
      whereConditions.OR = searchFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive'
        }
      }))
    }
  }

  // Agregar filtros adicionales
  if (filters) {
    whereConditions = { ...whereConditions, ...filters }
  }

  // Construir ordenamiento
  const orderByConditions: any = {}
  if (sortBy) {
    orderByConditions[sortBy] = sortOrder
  } else {
    orderByConditions.createdAt = sortOrder
  }

  try {
    // Contar total de registros
    const total = await model.count({
      where: whereConditions,
    })

    // Obtener registros paginados
    const data = await model.findMany({
      where: whereConditions,
      include,
      orderBy: orderByConditions,
      skip: (page - 1) * limit,
      take: limit,
    })

    const totalPages = Math.ceil(total / limit)

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  } catch (error) {
    console.error('Pagination error:', error)
    return {
      success: false,
      error: 'Error al obtener datos paginados',
    }
  }
}

/**
 * Función para crear registros con validación
 */
export async function createRecord<T>(
  model: any,
  data: any,
  userId?: string
): Promise<ApiResponse<T>> {
  try {
    // Agregar metadatos de auditoría si es necesario
    const recordData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const record = await model.create({
      data: recordData,
    })

    // Registrar en auditoría si se proporciona userId
    if (userId) {
      await logAuditEvent(
        userId,
        'CREATE',
        model.name || 'Unknown',
        record.id,
        null,
        recordData
      )
    }

    return {
      success: true,
      data: record,
      message: 'Registro creado exitosamente',
    }
  } catch (error) {
    console.error('Create record error:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'Ya existe un registro con estos datos únicos',
        }
      }
    }

    return {
      success: false,
      error: 'Error al crear el registro',
    }
  }
}

/**
 * Función para actualizar registros con validación
 */
export async function updateRecord<T>(
  model: any,
  id: string,
  data: any,
  userId?: string
): Promise<ApiResponse<T>> {
  try {
    // Obtener registro actual para auditoría
    const currentRecord = userId ? await model.findUnique({ where: { id } }) : null

    // Agregar metadatos de auditoría
    const recordData = {
      ...data,
      updatedAt: new Date(),
    }

    const record = await model.update({
      where: { id },
      data: recordData,
    })

    // Registrar en auditoría si se proporciona userId
    if (userId && currentRecord) {
      await logAuditEvent(
        userId,
        'UPDATE',
        model.name || 'Unknown',
        id,
        currentRecord,
        recordData
      )
    }

    return {
      success: true,
      data: record,
      message: 'Registro actualizado exitosamente',
    }
  } catch (error) {
    console.error('Update record error:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Registro no encontrado',
        }
      }
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'Ya existe un registro con estos datos únicos',
        }
      }
    }

    return {
      success: false,
      error: 'Error al actualizar el registro',
    }
  }
}

/**
 * Función para eliminar registros (soft delete)
 */
export async function deleteRecord<T>(
  model: any,
  id: string,
  userId?: string,
  hardDelete: boolean = false
): Promise<ApiResponse<T>> {
  try {
    // Obtener registro actual para auditoría
    const currentRecord = userId ? await model.findUnique({ where: { id } }) : null

    let record: any

    if (hardDelete) {
      record = await model.delete({
        where: { id },
      })
    } else {
      // Soft delete - marcar como inactivo si el campo existe
      const modelFields = Object.keys(model.fields || {})
      if (modelFields.includes('isActive')) {
        record = await model.update({
          where: { id },
          data: {
            isActive: false,
            updatedAt: new Date(),
          },
        })
      } else {
        // Si no hay campo isActive, hacer hard delete
        record = await model.delete({
          where: { id },
        })
      }
    }

    // Registrar en auditoría si se proporciona userId
    if (userId && currentRecord) {
      await logAuditEvent(
        userId,
        hardDelete ? 'DELETE' : 'DEACTIVATE',
        model.name || 'Unknown',
        id,
        currentRecord,
        null
      )
    }

    return {
      success: true,
      data: record,
      message: hardDelete ? 'Registro eliminado exitosamente' : 'Registro desactivado exitosamente',
    }
  } catch (error) {
    console.error('Delete record error:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Registro no encontrado',
        }
      }
    }

    return {
      success: false,
      error: 'Error al eliminar el registro',
    }
  }
}

/**
 * Función para registrar eventos de auditoría
 */
export async function logAuditEvent(
  userId: string,
  action: string,
  entity: string,
  entityId: string,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress,
        userAgent,
      } as any,
    })
  } catch (error) {
    console.error('Audit log error:', error)
    // No lanzar error para no interrumpir la operación principal
  }
}

/**
 * Función para obtener estadísticas generales
 */
export async function getDashboardStats(userId?: string) {
  try {
    const [
      totalCustomers,
      totalProducts,
      totalSales,
      totalRevenue,
      lowStockItems,
      recentSales,
    ] = await Promise.all([
      prisma.customer.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.sale.count({ where: { status: 'COMPLETADA' } }),
      prisma.sale.aggregate({
        where: { status: 'COMPLETADA' },
        _sum: { total: true },
      }),
      prisma.inventoryItem.count({
        where: {
          currentStock: {
            lte: prisma.inventoryItem.fields.minimumStock,
          },
        },
      }),
      prisma.sale.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          seller: {
            select: {
              name: true,
            },
          },
        },
      }),
    ])

    return {
      success: true,
      data: {
        totalCustomers,
        totalProducts,
        totalSales,
        totalRevenue: totalRevenue._sum.total || 0,
        lowStockItems,
        recentSales,
      },
    }
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return {
      success: false,
      error: 'Error al obtener estadísticas del dashboard',
    }
  }
}

/**
 * Función para backup de datos
 */
export async function createBackup(): Promise<ApiResponse<any>> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupData = {
      timestamp,
      users: await prisma.user.findMany(),
      customers: await prisma.customer.findMany(),
      products: await prisma.product.findMany(),
      sales: await prisma.sale.findMany({ include: { items: true } }),
      expenses: await prisma.expense.findMany(),
      inventory: await prisma.inventoryItem.findMany(),
      config: await prisma.systemConfig.findMany(),
    }

    // En un entorno real, esto se guardaría en un servicio de almacenamiento
    // Por ahora, solo retornamos los datos
    return {
      success: true,
      data: backupData,
      message: `Backup creado exitosamente: ${timestamp}`,
    }
  } catch (error) {
    console.error('Backup error:', error)
    return {
      success: false,
      error: 'Error al crear el backup',
    }
  }
}

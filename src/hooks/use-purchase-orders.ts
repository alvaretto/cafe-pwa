'use client'

import { useState, useCallback } from 'react'

export interface PurchaseOrderItem {
  productId: string
  productName: string
  currentStock: number
  minimumStock: number
  suggestedQuantity: number
  selectedQuantity: number
  supplierId: string
  unitCost: number
  totalCost: number
  priority: 'high' | 'medium' | 'low'
}

export interface PurchaseOrder {
  id: string
  orderNumber: string
  items: PurchaseOrderItem[]
  totalAmount: number
  notes: string
  expectedDelivery: string
  status: 'draft' | 'sent' | 'confirmed' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface CreatePurchaseOrderData {
  items: PurchaseOrderItem[]
  totalAmount: number
  notes: string
  expectedDelivery: string
}

export function usePurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateOrderNumber = useCallback(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `OC-${year}${month}${day}-${random}`
  }, [])

  const createPurchaseOrder = useCallback(async (data: CreatePurchaseOrderData): Promise<PurchaseOrder> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newOrder: PurchaseOrder = {
        id: `order_${Date.now()}`,
        orderNumber: generateOrderNumber(),
        items: data.items,
        totalAmount: data.totalAmount,
        notes: data.notes,
        expectedDelivery: data.expectedDelivery,
        status: 'draft',
        createdAt: new Date(),
        updatedAt: new Date()
      }

      setOrders(prev => [newOrder, ...prev])
      
      // Simular envío a proveedores
      setTimeout(() => {
        setOrders(prev => prev.map(order => 
          order.id === newOrder.id 
            ? { ...order, status: 'sent' as const, updatedAt: new Date() }
            : order
        ))
      }, 2000)

      return newOrder

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear orden de compra'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [generateOrderNumber])

  const updateOrderStatus = useCallback(async (orderId: string, status: PurchaseOrder['status']) => {
    setIsLoading(true)
    setError(null)

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500))

      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status, updatedAt: new Date() }
          : order
      ))

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar orden'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cancelOrder = useCallback(async (orderId: string) => {
    return updateOrderStatus(orderId, 'cancelled')
  }, [updateOrderStatus])

  const getOrdersByStatus = useCallback((status: PurchaseOrder['status']) => {
    return orders.filter(order => order.status === status)
  }, [orders])

  const getOrderStats = useCallback(() => {
    const totalOrders = orders.length
    const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const pendingOrders = orders.filter(order => ['draft', 'sent', 'confirmed'].includes(order.status)).length
    const completedOrders = orders.filter(order => order.status === 'delivered').length

    return {
      totalOrders,
      totalAmount,
      pendingOrders,
      completedOrders,
      averageOrderValue: totalOrders > 0 ? totalAmount / totalOrders : 0
    }
  }, [orders])

  const searchOrders = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return orders.filter(order => 
      order.orderNumber.toLowerCase().includes(lowercaseQuery) ||
      order.notes.toLowerCase().includes(lowercaseQuery) ||
      order.items.some(item => item.productName.toLowerCase().includes(lowercaseQuery))
    )
  }, [orders])

  return {
    orders,
    isLoading,
    error,
    createPurchaseOrder,
    updateOrderStatus,
    cancelOrder,
    getOrdersByStatus,
    getOrderStats,
    searchOrders
  }
}

// Hook para validación de órdenes de compra
export function usePurchaseOrderValidation() {
  const validateOrderData = useCallback((data: CreatePurchaseOrderData): string[] => {
    const errors: string[] = []

    if (!data.items || data.items.length === 0) {
      errors.push('Debe incluir al menos un producto en la orden')
    }

    if (!data.expectedDelivery) {
      errors.push('Debe especificar la fecha esperada de entrega')
    } else {
      const deliveryDate = new Date(data.expectedDelivery)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (deliveryDate < today) {
        errors.push('La fecha de entrega no puede ser anterior a hoy')
      }
    }

    data.items.forEach((item, index) => {
      if (item.selectedQuantity <= 0) {
        errors.push(`El producto "${item.productName}" debe tener una cantidad mayor a 0`)
      }

      if (item.unitCost <= 0) {
        errors.push(`El producto "${item.productName}" debe tener un costo unitario mayor a 0`)
      }

      if (!item.supplierId) {
        errors.push(`Debe seleccionar un proveedor para "${item.productName}"`)
      }
    })

    if (data.totalAmount <= 0) {
      errors.push('El monto total de la orden debe ser mayor a 0')
    }

    return errors
  }, [])

  const validateOrderItem = useCallback((item: Partial<PurchaseOrderItem>): string[] => {
    const errors: string[] = []

    if (!item.productName) {
      errors.push('El nombre del producto es requerido')
    }

    if (!item.selectedQuantity || item.selectedQuantity <= 0) {
      errors.push('La cantidad debe ser mayor a 0')
    }

    if (!item.unitCost || item.unitCost <= 0) {
      errors.push('El costo unitario debe ser mayor a 0')
    }

    if (!item.supplierId) {
      errors.push('Debe seleccionar un proveedor')
    }

    return errors
  }, [])

  return {
    validateOrderData,
    validateOrderItem
  }
}

// Utilidades para órdenes de compra
export const purchaseOrderUtils = {
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  },

  formatWeight: (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)} kg`
    }
    return `${grams} g`
  },

  getStatusLabel: (status: PurchaseOrder['status']) => {
    const labels = {
      draft: 'Borrador',
      sent: 'Enviada',
      confirmed: 'Confirmada',
      delivered: 'Entregada',
      cancelled: 'Cancelada'
    }
    return labels[status] || status
  },

  getStatusColor: (status: PurchaseOrder['status']) => {
    const colors = {
      draft: 'gray',
      sent: 'blue',
      confirmed: 'yellow',
      delivered: 'green',
      cancelled: 'red'
    }
    return colors[status] || 'gray'
  },

  getPriorityLabel: (priority: PurchaseOrderItem['priority']) => {
    const labels = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    }
    return labels[priority] || priority
  },

  calculateOrderSummary: (items: PurchaseOrderItem[]) => {
    const totalItems = items.length
    const totalQuantity = items.reduce((sum, item) => sum + item.selectedQuantity, 0)
    const totalAmount = items.reduce((sum, item) => sum + item.totalCost, 0)
    const highPriorityItems = items.filter(item => item.priority === 'high').length

    return {
      totalItems,
      totalQuantity,
      totalAmount,
      highPriorityItems,
      averageItemCost: totalItems > 0 ? totalAmount / totalItems : 0
    }
  }
}

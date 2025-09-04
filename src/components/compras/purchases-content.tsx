'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { 
  Product, 
  Supplier,
  InventoryMovement,
  MOCK_PRODUCTS, 
  MOCK_SUPPLIERS,
  getInventoryMovements
} from '@/lib/mock-data'
import { DashboardHeaderSimple } from '@/components/dashboard/dashboard-header-simple'
import {
  PurchasesHeader,
  PurchasesStats,
  PurchasesTabs,
  PurchasesOverview,
  NewPurchaseForm,
  PurchasesHistory,
  SuppliersManagement,
  EditPurchaseModal,
  DeletePurchaseModal
} from './purchases-components'

interface PurchasesContentProps {
  user: User
}

export function PurchasesContent({ user }: PurchasesContentProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [purchases, setPurchases] = useState<InventoryMovement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'new' | 'history' | 'suppliers'>('overview')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<InventoryMovement | null>(null)

  useEffect(() => {
    loadPurchasesData()
  }, [])

  const loadPurchasesData = async () => {
    try {
      setIsLoading(true)
      
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProducts(MOCK_PRODUCTS)
      setSuppliers(MOCK_SUPPLIERS)
      
      // Filtrar solo movimientos de entrada (compras)
      const purchaseMovements = getInventoryMovements().filter(
        movement => movement.type === 'entrada'
      )
      setPurchases(purchaseMovements)
      
    } catch (error) {
      console.error('Error loading purchases data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewPurchase = (purchaseData: {
    productId: string
    supplierId: string
    quantity: number
    unitType: 'gramos' | 'media_libra' | 'libra' | 'kilogramo'
    unitCost: number
    notes?: string
  }) => {
    const product = products.find(p => p.id === purchaseData.productId)
    const supplier = suppliers.find(s => s.id === purchaseData.supplierId)
    
    if (!product || !supplier) return

    // Convertir cantidad a gramos para el stock
    const quantityInGrams = convertToGrams(purchaseData.quantity, purchaseData.unitType)
    const totalCost = purchaseData.unitCost * purchaseData.quantity

    // Crear movimiento de inventario
    const newMovement: InventoryMovement = {
      id: Math.random().toString(36).substr(2, 9),
      productId: purchaseData.productId,
      productName: product.name,
      type: 'entrada',
      quantity: quantityInGrams,
      reason: `Compra a proveedor - ${purchaseData.quantity} ${purchaseData.unitType}`,
      cost: totalCost,
      supplierId: purchaseData.supplierId,
      supplierName: supplier.name,
      userId: user.id,
      userName: user.name || 'Usuario',
      createdAt: new Date(),
    }

    // Actualizar stock del producto
    setProducts(prev => prev.map(p => 
      p.id === purchaseData.productId 
        ? { ...p, stock: p.stock + quantityInGrams, updatedAt: new Date() }
        : p
    ))

    // Agregar movimiento a la lista
    setPurchases(prev => [newMovement, ...prev])

    // Cambiar a la pestaña de historial para ver el resultado
    setActiveTab('history')
  }

  // Función para convertir unidades a gramos
  const convertToGrams = (quantity: number, unitType: string): number => {
    switch (unitType) {
      case 'gramos':
        return quantity
      case 'media_libra':
        return quantity * 226.8 // 1/2 libra = 226.8 gramos
      case 'libra':
        return quantity * 453.6 // 1 libra = 453.6 gramos
      case 'kilogramo':
        return quantity * 1000 // 1 kg = 1000 gramos
      default:
        return quantity
    }
  }

  // Función para manejar la edición de compras
  const handleEditPurchase = (purchase: InventoryMovement) => {
    setSelectedPurchase(purchase)
    setEditModalOpen(true)
  }

  // Función para manejar la eliminación de compras
  const handleDeletePurchase = (purchase: InventoryMovement) => {
    setSelectedPurchase(purchase)
    setDeleteModalOpen(true)
  }

  // Función para guardar los cambios de edición
  const handleSaveEdit = async (purchaseData: {
    id: string
    quantity: number
    unitType: 'gramos' | 'media_libra' | 'libra' | 'kilogramo'
    unitCost: number
    supplierId: string
    notes?: string
  }) => {
    if (!selectedPurchase) return

    const quantityInGrams = convertToGrams(purchaseData.quantity, purchaseData.unitType)
    const totalCost = purchaseData.quantity * purchaseData.unitCost
    const supplier = suppliers.find(s => s.id === purchaseData.supplierId)
    const product = products.find(p => p.id === selectedPurchase.productId)

    // Calcular la diferencia de stock
    const oldQuantityInGrams = selectedPurchase.quantity
    const stockDifference = quantityInGrams - oldQuantityInGrams

    // Crear el reason actualizado
    const unitName = {
      'gramos': 'gramos',
      'media_libra': 'media_libra',
      'libra': 'libra',
      'kilogramo': 'kilogramo'
    }[purchaseData.unitType]

    const reason = `Compra: ${purchaseData.quantity} ${unitName}${purchaseData.notes ? ` - ${purchaseData.notes}` : ''}`

    // Actualizar la compra
    const updatedPurchase: InventoryMovement = {
      ...selectedPurchase,
      quantity: quantityInGrams,
      cost: totalCost,
      supplierId: purchaseData.supplierId,
      supplierName: supplier?.name || 'Proveedor desconocido',
      reason,
      updatedAt: new Date()
    }

    // Actualizar la lista de compras
    setPurchases(prev => prev.map(p =>
      p.id === purchaseData.id ? updatedPurchase : p
    ))

    // Actualizar el stock del producto
    if (product && stockDifference !== 0) {
      setProducts(prev => prev.map(p =>
        p.id === selectedPurchase.productId
          ? { ...p, stock: p.stock + stockDifference, updatedAt: new Date() }
          : p
      ))
    }

    setEditModalOpen(false)
    setSelectedPurchase(null)
  }

  // Función para confirmar la eliminación
  const handleConfirmDelete = async () => {
    if (!selectedPurchase) return

    // Restar la cantidad del stock del producto
    setProducts(prev => prev.map(p =>
      p.id === selectedPurchase.productId
        ? { ...p, stock: p.stock - selectedPurchase.quantity, updatedAt: new Date() }
        : p
    ))

    // Eliminar la compra de la lista
    setPurchases(prev => prev.filter(p => p.id !== selectedPurchase.id))

    setDeleteModalOpen(false)
    setSelectedPurchase(null)
  }

  const stats = {
    totalPurchases: purchases.length,
    totalSpent: purchases.reduce((sum, p) => sum + (p.cost || 0), 0),
    activeSuppliers: suppliers.filter(s => s.isActive).length,
    avgPurchaseValue: purchases.length > 0 
      ? purchases.reduce((sum, p) => sum + (p.cost || 0), 0) / purchases.length 
      : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeaderSimple 
        title="Compras de Inventario"
        subtitle="Gestión de compras a proveedores y entradas de stock"
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header de compras */}
        <PurchasesHeader 
          stats={stats}
        />

        {/* Estadísticas */}
        <PurchasesStats 
          stats={stats}
          isLoading={isLoading}
        />

        {/* Tabs de navegación */}
        <PurchasesTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          purchasesCount={purchases.length}
          suppliersCount={suppliers.length}
        />

        {/* Contenido según tab activo */}
        {activeTab === 'overview' && (
          <PurchasesOverview
            purchases={purchases.slice(0, 5)} // Últimas 5 compras
            suppliers={suppliers.slice(0, 3)} // Top 3 proveedores
            isLoading={isLoading}
          />
        )}

        {activeTab === 'new' && (
          <NewPurchaseForm
            products={products}
            suppliers={suppliers}
            onSubmit={handleNewPurchase}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'history' && (
          <PurchasesHistory
            purchases={purchases}
            isLoading={isLoading}
            onEdit={handleEditPurchase}
            onDelete={handleDeletePurchase}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersManagement
            suppliers={suppliers}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Modales */}
      <EditPurchaseModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedPurchase(null)
        }}
        purchase={selectedPurchase}
        products={products}
        suppliers={suppliers}
        onSave={handleSaveEdit}
      />

      <DeletePurchaseModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedPurchase(null)
        }}
        purchase={selectedPurchase}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

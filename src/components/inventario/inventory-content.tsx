'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { 
  Product, 
  InventoryMovement, 
  StockAlert, 
  Supplier,
  MOCK_PRODUCTS, 
  MOCK_SUPPLIERS,
  getInventoryStats,
  getStockAlerts,
  getInventoryMovements,
  generateRestockSuggestions
} from '@/lib/mock-data'
import { DashboardHeaderSimple } from '@/components/dashboard/dashboard-header-simple'
import { 
  InventoryHeader, 
  InventoryStats, 
  InventoryTabs,
  StockOverview,
  AlertsPanel,
  MovementsHistory,
  RestockSuggestions,
  SuppliersManagement
} from './inventory-components'

interface InventoryContentProps {
  user: User
}

export function InventoryContent({ user }: InventoryContentProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [restockSuggestions, setRestockSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'movements' | 'restock' | 'suppliers'>('overview')

  useEffect(() => {
    loadInventoryData()
  }, [])

  const loadInventoryData = async () => {
    try {
      setIsLoading(true)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setProducts(MOCK_PRODUCTS)
      setSuppliers(MOCK_SUPPLIERS)
      setMovements(getInventoryMovements())
      setAlerts(getStockAlerts())
      setRestockSuggestions(generateRestockSuggestions())
    } catch (error) {
      console.error('Error loading inventory data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadInventoryData()
  }

  const handleStockAdjustment = (productId: string, newStock: number, reason: string) => {
    // Actualizar stock del producto
    setProducts(prev => prev.map(p => 
      p.id === productId 
        ? { ...p, stock: newStock, updatedAt: new Date() }
        : p
    ))

    // Agregar movimiento de inventario
    const product = products.find(p => p.id === productId)
    if (product) {
      const movement: InventoryMovement = {
        id: Math.random().toString(36).substr(2, 9),
        productId,
        productName: product.name,
        type: 'ajuste',
        quantity: newStock - product.stock,
        reason,
        userId: user.id,
        userName: user.name || 'Usuario',
        createdAt: new Date(),
      }
      
      setMovements(prev => [movement, ...prev])
    }

    // Actualizar alertas
    setAlerts(getStockAlerts())
    setRestockSuggestions(generateRestockSuggestions())
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const handleCreatePurchaseOrder = (suggestions: any[]) => {
    // Simular creación de orden de compra
    alert(`Orden de compra creada para ${suggestions.length} productos.\nTotal estimado: $${suggestions.reduce((sum, s) => sum + s.estimatedCost, 0).toLocaleString()}`)
    
    // Actualizar sugerencias
    setRestockSuggestions(generateRestockSuggestions())
  }

  const stats = getInventoryStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header del Dashboard */}
      <DashboardHeaderSimple 
        user={user} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header de inventario */}
        <InventoryHeader 
          stats={stats}
        />

        {/* Estadísticas */}
        <InventoryStats 
          stats={stats}
          isLoading={isLoading}
        />

        {/* Tabs de navegación */}
        <InventoryTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alertsCount={alerts.length}
          restockCount={restockSuggestions.length}
        />

        {/* Contenido según tab activo */}
        {activeTab === 'overview' && (
          <StockOverview
            products={products}
            isLoading={isLoading}
            onStockAdjustment={handleStockAdjustment}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsPanel
            alerts={alerts}
            isLoading={isLoading}
            onResolveAlert={handleResolveAlert}
          />
        )}

        {activeTab === 'movements' && (
          <MovementsHistory
            movements={movements}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'restock' && (
          <RestockSuggestions
            suggestions={restockSuggestions}
            isLoading={isLoading}
            onCreatePurchaseOrder={handleCreatePurchaseOrder}
          />
        )}

        {activeTab === 'suppliers' && (
          <SuppliersManagement
            suppliers={suppliers}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

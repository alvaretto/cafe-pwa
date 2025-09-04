'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  Eye,
  Edit,
  Plus,
  Minus,
  Check,
  X,
  Clock,
  Truck,
  Star,
  ArrowUpDown,
  ShoppingCart,
  AlertCircle,
  Activity,
  Users,
  Calendar
} from 'lucide-react'
import { Product, InventoryMovement, StockAlert, Supplier } from '@/lib/mock-data'

// Header de inventario
interface InventoryHeaderProps {
  stats: any
}

export function InventoryHeader({ stats }: InventoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Control de Inventario</h1>
        <p className="text-amber-700 mt-1">
          Sistema inteligente con alertas automáticas, predicción de demanda y gestión de proveedores
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {stats.alerts.critical > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            {stats.alerts.critical} Críticas
          </Badge>
        )}
        {stats.alerts.high > 0 && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {stats.alerts.high} Altas
          </Badge>
        )}
      </div>
    </div>
  )
}

// Estadísticas de inventario
interface InventoryStatsProps {
  stats: any
  isLoading: boolean
}

export function InventoryStats({ stats, isLoading }: InventoryStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Valor Total',
      value: formatCurrency(stats.totalValue),
      subtitle: `${stats.totalStock.toLocaleString()}g en stock`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Productos Activos',
      value: stats.activeProducts.toString(),
      subtitle: `de ${stats.totalProducts} productos`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Alertas Activas',
      value: stats.alerts.total.toString(),
      subtitle: `${stats.alerts.critical} críticas`,
      icon: AlertTriangle,
      color: stats.alerts.critical > 0 ? 'text-red-600' : 'text-orange-600',
      bgColor: stats.alerts.critical > 0 ? 'bg-red-100' : 'bg-orange-100',
    },
    {
      title: 'Rotación Promedio',
      value: `${stats.avgTurnover.toFixed(1)}x`,
      subtitle: 'veces por mes',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        
        return (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gray-900">
                {card.value}
              </div>
              <p className="text-xs text-gray-600">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Tabs de navegación
interface InventoryTabsProps {
  activeTab: string
  onTabChange: (tab: 'overview' | 'alerts' | 'movements' | 'restock' | 'suppliers') => void
  alertsCount: number
  restockCount: number
}

export function InventoryTabs({ activeTab, onTabChange, alertsCount, restockCount }: InventoryTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle, badge: alertsCount },
    { id: 'movements', label: 'Movimientos', icon: Activity },
    { id: 'restock', label: 'Reabastecimiento', icon: ShoppingCart, badge: restockCount },
    { id: 'suppliers', label: 'Proveedores', icon: Truck },
  ]

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => onTabChange(tab.id as any)}
                className={`flex-1 min-w-0 rounded-none border-b-2 transition-colors ${
                  isActive 
                    ? 'border-amber-600 bg-amber-50 text-amber-700' 
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="truncate">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <Badge 
                    variant={isActive ? "default" : "secondary"} 
                    className="ml-2 text-xs"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Resumen de stock
interface StockOverviewProps {
  products: Product[]
  isLoading: boolean
  onStockAdjustment: (productId: string, newStock: number, reason: string) => void
}

export function StockOverview({ products, isLoading, onStockAdjustment }: StockOverviewProps) {
  const [showAdjustModal, setShowAdjustModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [adjustmentData, setAdjustmentData] = useState({ newStock: 0, reason: '' })

  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product)
    setAdjustmentData({ newStock: product.stock, reason: '' })
    setShowAdjustModal(true)
  }

  const handleSaveAdjustment = () => {
    if (selectedProduct && adjustmentData.reason.trim()) {
      onStockAdjustment(selectedProduct.id, adjustmentData.newStock, adjustmentData.reason)
      setShowAdjustModal(false)
      setSelectedProduct(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const stockPercentage = (product.stock / (product.minStock * 2)) * 100
          const isLowStock = product.stock <= product.minStock
          const isOutOfStock = product.stock === 0
          
          return (
            <Card key={product.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                      {product.name}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAdjustStock(product)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Barra de stock */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Stock actual</span>
                      <span className={`font-medium ${
                        isOutOfStock ? 'text-red-600' : 
                        isLowStock ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {product.stock}g
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          isOutOfStock ? 'bg-red-500' :
                          isLowStock ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, stockPercentage))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Mínimo: {product.minStock}g</span>
                      <span>Óptimo: {product.minStock * 2}g</span>
                    </div>
                  </div>

                  {/* Estado y acciones */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isOutOfStock ? (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Agotado
                        </Badge>
                      ) : isLowStock ? (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Stock Bajo
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          OK
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      SKU: {product.sku}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Modal de ajuste de stock */}
      <Dialog open={showAdjustModal} onOpenChange={setShowAdjustModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar Stock</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-medium text-gray-900">{selectedProduct.name}</h4>
                <p className="text-sm text-gray-600">Stock actual: {selectedProduct.stock}g</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newStock">Nuevo Stock (gramos)</Label>
                <Input
                  id="newStock"
                  type="number"
                  value={adjustmentData.newStock}
                  onChange={(e) => setAdjustmentData(prev => ({ 
                    ...prev, 
                    newStock: parseInt(e.target.value) || 0 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo del Ajuste</Label>
                <Textarea
                  id="reason"
                  value={adjustmentData.reason}
                  onChange={(e) => setAdjustmentData(prev => ({ 
                    ...prev, 
                    reason: e.target.value 
                  }))}
                  placeholder="Ej: Inventario físico, producto dañado, etc."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAdjustModal(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveAdjustment}
                  disabled={!adjustmentData.reason.trim()}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Guardar Ajuste
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// Panel de alertas
interface AlertsPanelProps {
  alerts: StockAlert[]
  isLoading: boolean
  onResolveAlert: (alertId: string) => void
}

export function AlertsPanel({ alerts, isLoading, onResolveAlert }: AlertsPanelProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (alerts.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Check className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Todo en orden!</h3>
          <p className="text-gray-600 text-center">
            No hay alertas de stock activas en este momento.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      default: return 'border-blue-500 bg-blue-50'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-5 w-5 text-red-600" />
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'medium': return <Clock className="h-5 w-5 text-yellow-600" />
      default: return <AlertTriangle className="h-5 w-5 text-blue-600" />
    }
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)}`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{alert.productName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Stock actual: <span className="font-medium">{alert.currentStock}g</span> •
                    Mínimo requerido: <span className="font-medium">{alert.minStock}g</span>
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Severidad: {alert.severity.toUpperCase()}</span>
                    <span>•</span>
                    <span>{alert.createdAt.toLocaleDateString('es-CO')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResolveAlert(alert.id)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Resolver
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Historial de movimientos
interface MovementsHistoryProps {
  movements: InventoryMovement[]
  isLoading: boolean
}

export function MovementsHistory({ movements, isLoading }: MovementsHistoryProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entrada': return <Plus className="h-4 w-4 text-green-600" />
      case 'salida': return <Minus className="h-4 w-4 text-red-600" />
      case 'ajuste': return <ArrowUpDown className="h-4 w-4 text-blue-600" />
      case 'merma': return <X className="h-4 w-4 text-orange-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'entrada': return 'text-green-600 bg-green-50'
      case 'salida': return 'text-red-600 bg-red-50'
      case 'ajuste': return 'text-blue-600 bg-blue-50'
      case 'merma': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Historial de Movimientos
          <Badge variant="secondary" className="ml-2">
            {movements.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {movements.map((movement) => (
            <div key={movement.id} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className={`p-2 rounded-full ${getMovementColor(movement.type)}`}>
                {getMovementIcon(movement.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">{movement.productName}</h4>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}g
                    </div>
                    {movement.cost && (
                      <div className="text-xs text-gray-500">
                        ${movement.cost.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  {movement.reason}
                  {movement.supplierName && (
                    <span className="ml-2 text-blue-600">• {movement.supplierName}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Por: {movement.userName}</span>
                  <span>{movement.createdAt.toLocaleString('es-CO')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Sugerencias de reabastecimiento
interface RestockSuggestionsProps {
  suggestions: any[]
  isLoading: boolean
  onCreatePurchaseOrder: (suggestions: any[]) => void
}

export function RestockSuggestions({ suggestions, isLoading, onCreatePurchaseOrder }: RestockSuggestionsProps) {
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])

  const handleToggleSelection = (productId: string) => {
    setSelectedSuggestions(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const handleSelectAll = () => {
    if (selectedSuggestions.length === suggestions.length) {
      setSelectedSuggestions([])
    } else {
      setSelectedSuggestions(suggestions.map(s => s.productId))
    }
  }

  const selectedItems = suggestions.filter(s => selectedSuggestions.includes(s.productId))
  const totalCost = selectedItems.reduce((sum, s) => sum + s.estimatedCost, 0)

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Check className="h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock Óptimo</h3>
          <p className="text-gray-600 text-center">
            Todos los productos tienen stock suficiente en este momento.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      default: return 'border-blue-500 bg-blue-50'
    }
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Sugerencias de Reabastecimiento
            <Badge variant="secondary" className="ml-2">
              {suggestions.length}
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedSuggestions.length === suggestions.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
            </Button>
            {selectedSuggestions.length > 0 && (
              <Button
                onClick={() => onCreatePurchaseOrder(selectedItems)}
                className="bg-amber-600 hover:bg-amber-700"
              >
                Crear Orden (${totalCost.toLocaleString()})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.productId}
              className={`border-l-4 p-4 rounded-lg ${getUrgencyColor(suggestion.urgency)}`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedSuggestions.includes(suggestion.productId)}
                  onChange={() => handleToggleSelection(suggestion.productId)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">{suggestion.productName}</h4>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${suggestion.estimatedCost.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {suggestion.suggestedOrder}g sugeridos
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500">Stock actual:</span>
                      <div className="font-medium text-red-600">{suggestion.currentStock}g</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Stock mínimo:</span>
                      <div className="font-medium">{suggestion.minStock}g</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Urgencia:</span>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          suggestion.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                          suggestion.urgency === 'high' ? 'bg-orange-100 text-orange-800' :
                          suggestion.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {suggestion.urgency.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Gestión de proveedores
interface SuppliersManagementProps {
  suppliers: Supplier[]
  isLoading: boolean
}

export function SuppliersManagement({ suppliers, isLoading }: SuppliersManagementProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {suppliers.map((supplier) => (
        <Card key={supplier.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                  {supplier.name}
                </CardTitle>
                <p className="text-sm text-gray-600">{supplier.contactName}</p>
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(supplier.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {supplier.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <Badge
                variant={supplier.isActive ? "secondary" : "outline"}
                className={supplier.isActive ? "bg-green-100 text-green-800" : ""}
              >
                {supplier.isActive ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-800">
                    {supplier.totalOrders}
                  </div>
                  <div className="text-blue-600 text-xs">Órdenes</div>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-800">
                    {formatCurrency(supplier.totalSpent)}
                  </div>
                  <div className="text-green-600 text-xs">Total</div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                {supplier.email && (
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-2" />
                    {supplier.email}
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-2" />
                    {supplier.phone}
                  </div>
                )}
                {supplier.address && (
                  <div className="flex items-start">
                    <Users className="h-3 w-3 mr-2 mt-0.5" />
                    <span className="line-clamp-2">{supplier.address}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-gray-500">
                  Desde {supplier.createdAt.toLocaleDateString('es-CO')}
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

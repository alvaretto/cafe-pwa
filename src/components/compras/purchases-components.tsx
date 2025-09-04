'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ShoppingCart, 
  Plus, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp,
  Calendar,
  FileText,
  Truck,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { Product, Supplier, InventoryMovement } from '@/lib/mock-data'

// Header de compras
interface PurchasesHeaderProps {
  stats: any
}

export function PurchasesHeader({ stats }: PurchasesHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compras de Inventario</h1>
        <p className="text-gray-600 mt-1">
          {stats.totalPurchases} compras realizadas • {formatCurrency(stats.totalSpent)} invertido
        </p>
      </div>
      <div className="mt-4 sm:mt-0">
        <Button className="bg-amber-600 hover:bg-amber-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Compra
        </Button>
      </div>
    </div>
  )
}

// Estadísticas de compras
interface PurchasesStatsProps {
  stats: any
  isLoading: boolean
}

export function PurchasesStats({ stats, isLoading }: PurchasesStatsProps) {
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
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Compras',
      value: stats.totalPurchases.toString(),
      subtitle: 'compras realizadas',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Invertido',
      value: formatCurrency(stats.totalSpent),
      subtitle: 'en compras de inventario',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Proveedores Activos',
      value: stats.activeSuppliers.toString(),
      subtitle: 'proveedores disponibles',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Compra Promedio',
      value: formatCurrency(stats.avgPurchaseValue),
      subtitle: 'valor promedio por compra',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {card.value}
            </div>
            <p className="text-xs text-gray-600">
              {card.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Tabs de navegación
interface PurchasesTabsProps {
  activeTab: string
  onTabChange: (tab: 'overview' | 'new' | 'history' | 'suppliers') => void
  purchasesCount: number
  suppliersCount: number
}

export function PurchasesTabs({ 
  activeTab, 
  onTabChange, 
  purchasesCount, 
  suppliersCount 
}: PurchasesTabsProps) {
  const tabs = [
    {
      id: 'overview',
      label: 'Resumen',
      icon: Package,
      count: null
    },
    {
      id: 'new',
      label: 'Nueva Compra',
      icon: Plus,
      count: null
    },
    {
      id: 'history',
      label: 'Historial',
      icon: FileText,
      count: purchasesCount
    },
    {
      id: 'suppliers',
      label: 'Proveedores',
      icon: Truck,
      count: suppliersCount
    }
  ]

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600 bg-amber-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
              {tab.count !== null && (
                <Badge variant="secondary" className="ml-2">
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Resumen de compras
interface PurchasesOverviewProps {
  purchases: InventoryMovement[]
  suppliers: Supplier[]
  isLoading: boolean
}

export function PurchasesOverview({ purchases, suppliers, isLoading }: PurchasesOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Últimas compras */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-blue-600" />
            Últimas Compras
          </CardTitle>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay compras registradas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{purchase.productName}</h4>
                    <p className="text-sm text-gray-500">
                      {purchase.supplierName} • {formatDate(purchase.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatCurrency(purchase.cost || 0)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(purchase.quantity / 1000).toFixed(1)} kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top proveedores */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Truck className="h-5 w-5 mr-2 text-purple-600" />
            Principales Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{supplier.name}</h4>
                  <p className="text-sm text-gray-500">{supplier.contactName}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full mr-1 ${
                          i < supplier.rating ? 'bg-yellow-400' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {supplier.totalOrders} órdenes
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Formulario para nueva compra
interface NewPurchaseFormProps {
  products: Product[]
  suppliers: Supplier[]
  onSubmit: (data: {
    productId: string
    supplierId: string
    quantity: number
    unitType: 'gramos' | 'media_libra' | 'libra' | 'kilogramo'
    unitCost: number
    notes?: string
  }) => void
  isLoading: boolean
}

export function NewPurchaseForm({ products, suppliers, onSubmit, isLoading }: NewPurchaseFormProps) {
  const [formData, setFormData] = useState({
    productId: '',
    supplierId: '',
    quantity: '',
    unitType: 'kilogramo' as 'gramos' | 'media_libra' | 'libra' | 'kilogramo',
    unitCost: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.productId || !formData.supplierId || !formData.quantity || !formData.unitCost) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }

    setIsSubmitting(true)

    try {
      await onSubmit({
        productId: formData.productId,
        supplierId: formData.supplierId,
        quantity: parseFloat(formData.quantity),
        unitType: formData.unitType,
        unitCost: parseFloat(formData.unitCost),
        notes: formData.notes || undefined
      })

      // Limpiar formulario
      setFormData({
        productId: '',
        supplierId: '',
        quantity: '',
        unitType: 'kilogramo',
        unitCost: '',
        notes: ''
      })

      alert('Compra registrada exitosamente')
    } catch (error) {
      console.error('Error al registrar compra:', error)
      alert('Error al registrar la compra')
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedProduct = products.find(p => p.id === formData.productId)
  const totalCost = formData.quantity && formData.unitCost
    ? parseFloat(formData.quantity) * parseFloat(formData.unitCost)
    : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Plus className="h-5 w-5 mr-2 text-amber-600" />
          Registrar Nueva Compra
        </CardTitle>
        <p className="text-sm text-gray-600">
          Ingresa los detalles de la compra para actualizar el inventario automáticamente
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Producto */}
            <div className="space-y-2">
              <Label htmlFor="product">Producto *</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, productId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - Stock: {(product.stock / 1000).toFixed(1)} kg
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Proveedor */}
            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor *</Label>
              <Select
                value={formData.supplierId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.filter(s => s.isActive).map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.contactName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Cantidad *</Label>
              <Input
                id="quantity"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej: 25"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>

            {/* Unidad */}
            <div className="space-y-2">
              <Label htmlFor="unitType">Unidad de Medida *</Label>
              <Select
                value={formData.unitType}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, unitType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gramos">Gramos</SelectItem>
                  <SelectItem value="media_libra">Media Libra (226.8g)</SelectItem>
                  <SelectItem value="libra">Libra (453.6g)</SelectItem>
                  <SelectItem value="kilogramo">Kilogramo (1000g)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Costo unitario */}
            <div className="space-y-2">
              <Label htmlFor="unitCost">Costo por Unidad *</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ej: 15000"
                value={formData.unitCost}
                onChange={(e) => setFormData(prev => ({ ...prev, unitCost: e.target.value }))}
              />
            </div>

            {/* Total calculado */}
            <div className="space-y-2">
              <Label>Costo Total</Label>
              <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                <span className="text-lg font-semibold text-green-600">
                  {formatCurrency(totalCost)}
                </span>
              </div>
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Información adicional sobre la compra..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Información del producto seleccionado */}
          {selectedProduct && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Información del Producto</h4>
              <div className="grid gap-2 text-sm">
                <p><span className="font-medium">Stock actual:</span> {(selectedProduct.stock / 1000).toFixed(1)} kg</p>
                <p><span className="font-medium">Precio de venta:</span> {formatCurrency(selectedProduct.price)}</p>
                <p><span className="font-medium">Categoría:</span> {selectedProduct.category}</p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                productId: '',
                supplierId: '',
                quantity: '',
                unitType: 'kilogramo',
                unitCost: '',
                notes: ''
              })}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              className="bg-amber-600 hover:bg-amber-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Compra'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Historial de compras
interface PurchasesHistoryProps {
  purchases: InventoryMovement[]
  isLoading: boolean
}

export function PurchasesHistory({ purchases, isLoading }: PurchasesHistoryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatQuantity = (quantity: number) => {
    if (quantity >= 1000) {
      return `${(quantity / 1000).toFixed(1)} kg`
    }
    return `${quantity.toFixed(0)} g`
  }

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-600" />
          Historial de Compras
        </CardTitle>
        <p className="text-sm text-gray-600">
          Registro completo de todas las compras realizadas
        </p>
      </CardHeader>
      <CardContent>
        {purchases.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay compras registradas</h3>
            <p className="text-gray-500 mb-6">
              Comienza registrando tu primera compra de inventario
            </p>
            <Button className="bg-amber-600 hover:bg-amber-700">
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primera Compra
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div key={purchase.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{purchase.productName}</h4>
                    <Badge variant="outline" className="text-xs">
                      {purchase.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">{purchase.supplierName}</span> • {formatDate(purchase.createdAt)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {purchase.reason}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 mb-1">
                    {formatCurrency(purchase.cost || 0)}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    {formatQuantity(purchase.quantity)}
                  </p>
                  <div className="flex items-center text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completado
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-6 w-32 mb-3" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center">
              <Truck className="h-5 w-5 mr-2 text-purple-600" />
              Gestión de Proveedores
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Administra tu red de proveedores de café
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                <div className="flex items-center">
                  {supplier.isActive ? (
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  ) : (
                    <Badge variant="secondary">Inactivo</Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Contacto:</span> {supplier.contactName}</p>
                <p><span className="font-medium">Teléfono:</span> {supplier.phone}</p>
                <p><span className="font-medium">Email:</span> {supplier.email}</p>
                <p><span className="font-medium">Órdenes:</span> {supplier.totalOrders}</p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-2 rounded-full mr-1 ${
                        i < supplier.rating ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500 ml-2">
                    {supplier.rating}/5
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Editar
                  </Button>
                  <Button size="sm" variant="outline">
                    Ver Historial
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

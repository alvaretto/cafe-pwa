'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  ShoppingCart, 
  History, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Package,
  BarChart3,
  Calendar,
  Clock
} from 'lucide-react'

// Header de ventas
interface SalesHeaderProps {
  currentView: 'pos' | 'history'
  onViewChange: (view: 'pos' | 'history') => void
  stats: any
}

export function SalesHeader({ currentView, onViewChange, stats }: SalesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Sistema de Ventas</h1>
        <p className="text-amber-700 mt-1">
          Punto de venta inteligente con carrito, facturación y análisis en tiempo real
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant={currentView === 'pos' ? 'default' : 'outline'}
          onClick={() => onViewChange('pos')}
          className={currentView === 'pos' ? 'bg-amber-600 hover:bg-amber-700' : ''}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Punto de Venta
        </Button>
        <Button 
          variant={currentView === 'history' ? 'default' : 'outline'}
          onClick={() => onViewChange('history')}
          className={currentView === 'history' ? 'bg-amber-600 hover:bg-amber-700' : ''}
        >
          <History className="h-4 w-4 mr-2" />
          Historial
        </Button>
      </div>
    </div>
  )
}

// Estadísticas de ventas
interface SalesStatsProps {
  stats: any
  isLoading: boolean
}

export function SalesStats({ stats, isLoading }: SalesStatsProps) {
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
      title: 'Ventas Hoy',
      value: formatCurrency(stats.today.total),
      subtitle: `${stats.today.count} transacciones`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Ventas Semana',
      value: formatCurrency(stats.week.total),
      subtitle: `${stats.week.count} transacciones`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Ventas Mes',
      value: formatCurrency(stats.month.total),
      subtitle: `${stats.month.count} transacciones`,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Total Histórico',
      value: formatCurrency(stats.total.total),
      subtitle: `${stats.total.count} transacciones`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
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

// Selector de productos para el POS
interface ProductSelectorProps {
  products: any[]
  onAddToCart: (product: any, quantity: number, unitType: string) => void
  isLoading: boolean
}

export function ProductSelector({ products, onAddToCart, isLoading }: ProductSelectorProps) {
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
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
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
          <Package className="h-5 w-5 mr-2" />
          Seleccionar Productos
          <Badge variant="secondary" className="ml-2">
            {products.length} disponibles
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="border border-gray-200 hover:border-amber-300 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900 mb-1">
                      {product.name}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Stock</div>
                    <div className={`text-sm font-medium ${
                      product.stock <= product.minStock ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {product.stock}g
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {/* Botones de venta rápida */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddToCart(product, 1, 'media_libra')}
                      className="text-xs"
                      disabled={product.stock < 227}
                    >
                      Media Libra
                      <div className="text-xs text-gray-500 ml-1">
                        {formatCurrency(product.pricePerHalfPound)}
                      </div>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onAddToCart(product, 1, 'libra')}
                      className="text-xs"
                      disabled={product.stock < 454}
                    >
                      Libra
                      <div className="text-xs text-gray-500 ml-1">
                        {formatCurrency(product.pricePerPound)}
                      </div>
                    </Button>
                  </div>
                  
                  {/* Venta por gramos */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Gramos"
                      min="1"
                      max={product.stock}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const quantity = parseInt((e.target as HTMLInputElement).value)
                          if (quantity > 0 && quantity <= product.stock) {
                            onAddToCart(product, quantity, 'gramos')
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }
                      }}
                    />
                    <div className="text-xs text-gray-500">
                      ${product.pricePerGram}/g
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface DashboardMetrics {
  sales: {
    today: number
    thisWeek: number
    thisMonth: number
    growth: number
  }
  customers: {
    total: number
    new: number
    active: number
    retention: number
  }
  inventory: {
    lowStock: number
    outOfStock: number
    totalValue: number
    turnover: number
  }
  revenue: {
    today: number
    thisWeek: number
    thisMonth: number
    profit: number
  }
}

interface MetricsCardsProps {
  metrics: DashboardMetrics | null
  isLoading: boolean
}

export function MetricsCardsSimple({ metrics, isLoading }: MetricsCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CO').format(num)
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

  if (!metrics) return null

  const cards = [
    {
      title: 'Ventas del Mes',
      value: formatCurrency(metrics.sales.thisMonth),
      change: metrics.sales.growth,
      changeText: 'vs mes anterior',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Clientes Activos',
      value: formatNumber(metrics.customers.active),
      change: metrics.customers.retention,
      changeText: 'tasa de retención',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Ventas Hoy',
      value: formatCurrency(metrics.sales.today),
      change: 12.5, // Simulado
      changeText: 'vs ayer',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Valor Inventario',
      value: formatCurrency(metrics.inventory.totalValue),
      change: metrics.inventory.turnover,
      changeText: 'rotación mensual',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const isPositive = card.change >= 0
        const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight
        
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
              <div className="flex items-center text-xs text-gray-600">
                <TrendIcon 
                  className={`h-3 w-3 mr-1 ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`} 
                />
                <span className={`font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(card.change).toFixed(1)}%
                </span>
                <span className="ml-1">{card.changeText}</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

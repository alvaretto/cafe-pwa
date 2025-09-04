'use client'

import { DashboardMetrics } from '@/types'
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
import { formatCurrency, formatNumber, calculatePercentageChange } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface MetricsCardsProps {
  metrics: DashboardMetrics | null
  isLoading: boolean
}

export function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
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
      change: calculatePercentageChange(metrics.sales.today - 50000, metrics.sales.today),
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
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn('p-2 rounded-full', card.bgColor)}>
                <Icon className={cn('h-4 w-4', card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">
                {card.value}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendIcon 
                  className={cn(
                    'h-3 w-3 mr-1',
                    isPositive ? 'text-green-600' : 'text-red-600'
                  )} 
                />
                <span className={cn(
                  'font-medium',
                  isPositive ? 'text-green-600' : 'text-red-600'
                )}>
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

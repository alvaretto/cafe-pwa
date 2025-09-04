'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, Package, ShoppingCart } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

interface InventoryAlertsProps {
  isLoading: boolean
}

export function InventoryAlerts({ isLoading }: InventoryAlertsProps) {
  // Datos simulados de alertas de inventario
  const alerts = [
    {
      id: '1',
      productName: 'Café Arábica Premium',
      currentStock: 150, // gramos
      minimumStock: 500,
      status: 'critical',
      category: 'Café Arábica',
      lastRestock: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 días atrás
    },
    {
      id: '2',
      productName: 'Mezcla del Mirador',
      currentStock: 0,
      minimumStock: 300,
      status: 'out_of_stock',
      category: 'Mezclas Especiales',
      lastRestock: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 días atrás
    },
    {
      id: '3',
      productName: 'Café Robusta Intenso',
      currentStock: 250,
      minimumStock: 400,
      status: 'low',
      category: 'Café Robusta',
      lastRestock: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 días atrás
    },
  ]

  const getStatusBadge = (status: string) => {
    const badges = {
      critical: { label: 'Crítico', variant: 'destructive' as const, color: 'text-red-600' },
      out_of_stock: { label: 'Agotado', variant: 'destructive' as const, color: 'text-red-600' },
      low: { label: 'Bajo', variant: 'warning' as const, color: 'text-orange-600' },
    }
    return badges[status as keyof typeof badges] || { label: 'Normal', variant: 'outline' as const, color: 'text-gray-600' }
  }

  const getStockPercentage = (current: number, minimum: number) => {
    if (current === 0) return 0
    return Math.round((current / minimum) * 100)
  }

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)} kg`
    }
    return `${grams} g`
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Alertas de Inventario
          <Badge variant="destructive" className="ml-2">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const badge = getStatusBadge(alert.status)
            const percentage = getStockPercentage(alert.currentStock, alert.minimumStock)
            
            return (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded bg-orange-100">
                  <Package className="h-4 w-4 text-orange-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">
                      {alert.productName}
                    </h4>
                    <Badge variant={badge.variant} className="text-xs">
                      {badge.label}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {alert.category}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Stock actual:</span>
                      <span className={`font-medium ${badge.color}`}>
                        {formatWeight(alert.currentStock)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Stock mínimo:</span>
                      <span>{formatWeight(alert.minimumStock)}</span>
                    </div>
                    
                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          percentage === 0
                            ? 'bg-red-500'
                            : percentage < 50
                            ? 'bg-red-400'
                            : percentage < 80
                            ? 'bg-orange-400'
                            : 'bg-green-400'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage}% del mínimo</span>
                      <span>
                        Último restock: {alert.lastRestock.toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t space-y-2">
          <Button size="sm" className="w-full">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Generar Orden de Compra
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            Ver Todo el Inventario
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

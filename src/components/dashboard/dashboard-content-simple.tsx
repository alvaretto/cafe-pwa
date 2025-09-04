'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { DashboardHeaderSimple } from './dashboard-header-simple'
import { MetricsCardsSimple } from './metrics-cards-simple'
import {
  SalesChartSimple,
  RecentActivitySimple,
  AIInsightsSimple,
  QuickActionsSimple,
  NotificationCenterSimple
} from './dashboard-components-simple'
import { InventoryAlerts } from './inventory-alerts'

interface DashboardContentProps {
  user: User
}

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

export function DashboardContentSimple({ user }: DashboardContentProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Forzar false para desarrollo

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Simular carga de datos del dashboard
      const mockMetrics: DashboardMetrics = {
        sales: {
          today: 125000,
          thisWeek: 850000,
          thisMonth: 3200000,
          growth: 15.5,
        },
        customers: {
          total: 245,
          new: 12,
          active: 189,
          retention: 78.5,
        },
        inventory: {
          lowStock: 3,
          outOfStock: 1,
          totalValue: 2500000,
          turnover: 4.2,
        },
        revenue: {
          today: 125000,
          thisWeek: 850000,
          thisMonth: 3200000,
          profit: 45.2,
        },
      }

      // Sin delay para desarrollo - carga inmediata
      console.log('🔧 Dashboard: Cargando datos...')
      setMetrics(mockMetrics)
      console.log('🔧 Dashboard: Datos cargados, cambiando isLoading a false')
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadDashboardData()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header del Dashboard */}
      <DashboardHeaderSimple 
        user={user} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Métricas principales */}
        <MetricsCardsSimple metrics={metrics} isLoading={isLoading} />

        {/* Grid principal */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Columna izquierda - 2/3 del ancho */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico de ventas */}
            <SalesChartSimple isLoading={isLoading} />
            
            {/* Actividad reciente */}
            <RecentActivitySimple isLoading={isLoading} />
          </div>

          {/* Columna derecha - 1/3 del ancho */}
          <div className="space-y-6">
            {/* Centro de notificaciones */}
            <NotificationCenterSimple />
            
            {/* Alertas de inventario - Fixed */}
            <InventoryAlerts isLoading={isLoading} />
            
            {/* Insights de IA */}
            <AIInsightsSimple isLoading={isLoading} />
            
            {/* Acciones rápidas */}
            <QuickActionsSimple user={user} />
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { User, DashboardMetrics } from '@/types'
import { DashboardHeader } from './dashboard-header'
import { MetricsCards } from './metrics-cards'
import { SalesChart } from './sales-chart'
import { RecentActivity } from './recent-activity'
import { InventoryAlerts } from './inventory-alerts'
import { AIInsights } from './ai-insights'
import { QuickActions } from './quick-actions'
import { NotificationCenter } from './notification-center'
import { useToast } from '@/hooks/use-toast'

interface DashboardContentProps {
  user: User
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Simular carga de datos del dashboard
      // En producción, esto haría llamadas a las APIs reales
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

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos del dashboard',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadDashboardData()
    toast({
      title: 'Datos actualizados',
      description: 'El dashboard se ha actualizado correctamente',
      variant: 'success',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header del Dashboard */}
      <DashboardHeader 
        user={user} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Métricas principales */}
        <MetricsCards metrics={metrics} isLoading={isLoading} />

        {/* Grid principal */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Columna izquierda - 2/3 del ancho */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfico de ventas */}
            <SalesChart isLoading={isLoading} />
            
            {/* Actividad reciente */}
            <RecentActivity isLoading={isLoading} />
          </div>

          {/* Columna derecha - 1/3 del ancho */}
          <div className="space-y-6">
            {/* Centro de notificaciones */}
            <NotificationCenter />
            
            {/* Alertas de inventario */}
            <InventoryAlerts isLoading={isLoading} />
            
            {/* Insights de IA */}
            <AIInsights isLoading={isLoading} />
            
            {/* Acciones rápidas */}
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  BarChart3,
  Bell,
  AlertTriangle,
  Package,
  ShoppingCart,
  Users,
  Coffee,
  DollarSign,
  Plus,
  Settings,
  Brain,
  RefreshCw,
  Lightbulb,
  TrendingUp,
  X,
  Info,
  Rocket
} from 'lucide-react'
import { DeploymentPanelCompact } from './deployment-panel'
import { QuickConfigModal } from './quick-config-modal'

// Gráfico de ventas simplificado
export function SalesChartSimple({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-amber-600" />
          Ventas Mensuales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-amber-50 to-blue-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-amber-600 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-800 mb-2">Gráfico Interactivo</p>
            <p className="text-sm text-gray-600">Visualización de ventas por mes</p>
            <p className="text-xs text-gray-500 mt-2">Próximamente: Recharts integrado</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Actividad reciente
export function RecentActivitySimple({ isLoading }: { isLoading: boolean }) {
  const activities = [
    { id: 1, type: 'sale', title: 'Nueva venta', description: '500g Café Arábica Premium', amount: 27500, time: '5 min' },
    { id: 2, type: 'customer', title: 'Nuevo cliente', description: 'Ana Martínez registrada', time: '15 min' },
    { id: 3, type: 'inventory', title: 'Stock actualizado', description: 'Reabastecimiento Mezcla del Mirador', time: '30 min' },
    { id: 4, type: 'sale', title: 'Venta completada', description: '1 libra Café Orgánico', amount: 35000, time: '45 min' },
  ]

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="p-2 rounded-full bg-amber-100">
                <ShoppingCart className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500">{activity.time} atrás</span>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">
                      ${activity.amount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Centro de notificaciones
export function NotificationCenterSimple() {
  const notifications = [
    { id: 1, title: 'Stock bajo', message: 'Café Arábica Premium necesita reabastecimiento', priority: 'high' },
    { id: 2, title: 'Nueva venta', message: 'Venta completada por $27,500', priority: 'normal' },
    { id: 3, title: 'Cliente VIP', message: 'María García alcanzó 300 puntos', priority: 'normal' },
  ]

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notificaciones
          <Badge variant="destructive" className="ml-2">3</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
              <div className="p-1.5 rounded-full bg-orange-100">
                <Info className="h-3 w-3 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                <p className="text-xs text-gray-600">{notification.message}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Alertas de inventario
export function InventoryAlertsSimple({ isLoading }: { isLoading: boolean }) {
  const alerts = [
    { id: 1, product: 'Café Arábica Premium', current: 150, minimum: 500, status: 'critical' },
    { id: 2, product: 'Mezcla del Mirador', current: 0, minimum: 300, status: 'out_of_stock' },
    { id: 3, product: 'Café Robusta Intenso', current: 250, minimum: 400, status: 'low' },
  ]

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
          Alertas de Inventario
          <Badge variant="destructive" className="ml-2">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">{alert.product}</h4>
                <Badge variant="destructive" className="text-xs">
                  {alert.status === 'out_of_stock' ? 'Agotado' : 'Bajo'}
                </Badge>
              </div>
              <div className="text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Stock actual: {alert.current}g</span>
                  <span>Mínimo: {alert.minimum}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button size="sm" className="w-full mt-4 bg-amber-600 hover:bg-amber-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Generar Orden de Compra
        </Button>
      </CardContent>
    </Card>
  )
}

// Insights de IA
export function AIInsightsSimple({ isLoading }: { isLoading: boolean }) {
  const insights = [
    { id: 1, title: 'Tendencia Positiva', description: 'Las ventas han aumentado 15% en las últimas 2 semanas', confidence: 92 },
    { id: 2, title: 'Patrón de Compra', description: 'Los clientes VIP prefieren comprar los viernes por la tarde', confidence: 87 },
    { id: 3, title: 'Optimización', description: 'El Café Robusta tiene rotación lenta. Considera promociones', confidence: 84 },
  ]

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          Insights de IA
        </CardTitle>
        <Button variant="ghost" size="sm">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="p-4 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">{insight.title}</h4>
                <span className="text-xs font-medium text-green-600">{insight.confidence}%</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
              <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
                <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-700">Recomendación basada en análisis de IA</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">Powered by Google Gemini AI</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Acciones rápidas
export function QuickActionsSimple({ user }: { user?: any }) {
  const [showConfigModal, setShowConfigModal] = useState(false)
  const isAdmin = user?.role === 'ADMIN'

  const actions = [
    { id: 'new-sale', title: 'Nueva Venta', icon: ShoppingCart, color: 'text-green-600', bgColor: 'bg-green-100' },
    { id: 'add-customer', title: 'Nuevo Cliente', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { id: 'add-product', title: 'Nuevo Producto', icon: Coffee, color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { id: 'update-inventory', title: 'Actualizar Stock', icon: Package, color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { id: 'add-expense', title: 'Registrar Gasto', icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-100' },
    { id: 'settings', title: 'Configuración', icon: Settings, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  ]

  return (
    <>
      <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                variant="ghost"
                className="h-auto p-3 flex flex-col items-center space-y-2 hover:bg-gray-50 transition-colors"
                onClick={() => {
                  if (action.id === 'settings') {
                    setShowConfigModal(true)
                  } else {
                    alert(`Funcionalidad "${action.title}" próximamente`)
                  }
                }}
              >
                <div className={`p-2 rounded-full ${action.bgColor}`}>
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <span className="text-xs font-medium text-center">{action.title}</span>
              </Button>
            )
          })}

          {/* Panel de Deployment - Solo para ADMIN */}
          {isAdmin && (
            <DeploymentPanelCompact />
          )}
        </div>
      </CardContent>
      </Card>

      {/* Modal de configuración rápida - Temporalmente deshabilitado */}
      {/* <QuickConfigModal
        open={showConfigModal}
        onOpenChange={setShowConfigModal}
      /> */}
    </>
  )
}

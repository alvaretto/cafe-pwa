'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Plus,
  ShoppingCart,
  Users,
  Package,
  FileText,
  Settings,
  Coffee,
  DollarSign,
  Rocket
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DeploymentPanelCompact } from './deployment-panel'
import { User } from '@/types'

interface QuickActionsProps {
  user?: User
}

export function QuickActions({ user }: QuickActionsProps) {
  const router = useRouter()
  const isAdmin = user?.role === 'ADMIN'

  const actions = [
    {
      id: 'new-sale',
      title: 'Nueva Venta',
      description: 'Registrar una nueva venta',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/ventas/nueva',
    },
    {
      id: 'add-customer',
      title: 'Nuevo Cliente',
      description: 'Agregar cliente al sistema',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/clientes/nuevo',
    },
    {
      id: 'add-product',
      title: 'Nuevo Producto',
      description: 'Agregar producto al catálogo',
      icon: Coffee,
      color: 'text-coffee-600',
      bgColor: 'bg-coffee-100',
      href: '/productos/nuevo',
    },
    {
      id: 'update-inventory',
      title: 'Actualizar Stock',
      description: 'Modificar inventario',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/inventario',
    },
    {
      id: 'add-expense',
      title: 'Registrar Gasto',
      description: 'Agregar nuevo gasto',
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/gastos/nuevo',
    },
    {
      id: 'generate-report',
      title: 'Generar Reporte',
      description: 'Crear reporte personalizado',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/reportes',
    },
  ]

  const handleAction = (href: string) => {
    router.push(href)
  }

  return (
    <Card>
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
                className="h-auto p-3 flex flex-col items-center space-y-2 hover:bg-muted/50 transition-colors"
                onClick={() => handleAction(action.href)}
              >
                <div className={`p-2 rounded-full ${action.bgColor}`}>
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium leading-tight">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {action.description}
                  </p>
                </div>
              </Button>
            )
          })}

          {/* Panel de Deployment - Solo para ADMIN */}
          {isAdmin && (
            <DeploymentPanelCompact />
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => router.push('/configuracion')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

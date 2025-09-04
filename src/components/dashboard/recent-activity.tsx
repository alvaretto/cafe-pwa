'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { ShoppingCart, User, Package, DollarSign } from 'lucide-react'

interface RecentActivityProps {
  isLoading: boolean
}

export function RecentActivity({ isLoading }: RecentActivityProps) {
  // Datos simulados de actividad reciente
  const activities = [
    {
      id: '1',
      type: 'sale',
      title: 'Nueva venta realizada',
      description: 'Venta de 500g Café Arábica Premium a Juan Pérez',
      amount: 27500,
      user: 'María González',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: '2',
      type: 'customer',
      title: 'Nuevo cliente registrado',
      description: 'Ana Martínez se registró en el sistema',
      user: 'Carlos Rodríguez',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: '3',
      type: 'inventory',
      title: 'Stock actualizado',
      description: 'Reabastecimiento de Mezcla del Mirador - 2kg',
      user: 'María González',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: '4',
      type: 'sale',
      title: 'Venta completada',
      description: 'Venta de 1 libra Café Orgánico a Carlos López',
      amount: 35000,
      user: 'Ana Martínez',
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutos atrás
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: '5',
      type: 'expense',
      title: 'Gasto registrado',
      description: 'Compra de insumos de empaque',
      amount: -15000,
      user: 'María González',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hora atrás
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ]

  const getActivityBadge = (type: string) => {
    const badges = {
      sale: { label: 'Venta', variant: 'default' as const },
      customer: { label: 'Cliente', variant: 'secondary' as const },
      inventory: { label: 'Inventario', variant: 'outline' as const },
      expense: { label: 'Gasto', variant: 'destructive' as const },
    }
    return badges[type as keyof typeof badges] || { label: 'Actividad', variant: 'default' as const }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
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
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            const badge = getActivityBadge(activity.type)
            
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`p-2 rounded-full ${activity.bgColor}`}>
                  <Icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium truncate">
                      {activity.title}
                    </h4>
                    <Badge variant={badge.variant} className="text-xs">
                      {badge.label}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs bg-coffee-100 text-coffee-800">
                          {getUserInitials(activity.user)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{activity.user}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {activity.amount && (
                        <span className={`font-medium ${
                          activity.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(Math.abs(activity.amount))}
                        </span>
                      )}
                      <span>{formatDateTime(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t text-center">
          <button className="text-sm text-primary hover:underline">
            Ver toda la actividad
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

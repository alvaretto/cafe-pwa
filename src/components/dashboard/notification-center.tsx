'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, X, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { useNotifications } from '@/components/notifications/notification-provider'
import { formatDateTime } from '@/lib/utils'
import { NotificationType, NotificationPriority } from '@/types'

export function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()
  
  const unreadNotifications = notifications.filter(n => !n.isRead).slice(0, 5)

  const getNotificationIcon = (type: NotificationType) => {
    const icons = {
      SISTEMA: Info,
      VENTA: CheckCircle,
      INVENTARIO: AlertTriangle,
      CLIENTE: Info,
      RECORDATORIO: Bell,
      ALERTA: AlertTriangle,
    }
    return icons[type] || Info
  }

  const getNotificationColor = (priority: NotificationPriority) => {
    const colors = {
      BAJA: 'text-blue-600 bg-blue-100',
      NORMAL: 'text-gray-600 bg-gray-100',
      ALTA: 'text-orange-600 bg-orange-100',
      CRITICA: 'text-red-600 bg-red-100',
    }
    return colors[priority] || colors.NORMAL
  }

  const getPriorityBadge = (priority: NotificationPriority) => {
    const badges = {
      BAJA: { label: 'Baja', variant: 'secondary' as const },
      NORMAL: { label: 'Normal', variant: 'outline' as const },
      ALTA: { label: 'Alta', variant: 'warning' as const },
      CRITICA: { label: 'Crítica', variant: 'destructive' as const },
    }
    return badges[priority] || badges.NORMAL
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notificaciones
          {unreadNotifications.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadNotifications.length}
            </Badge>
          )}
        </CardTitle>
        {unreadNotifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            Marcar todas como leídas
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {unreadNotifications.length === 0 ? (
          <div className="text-center py-6">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No tienes notificaciones nuevas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {unreadNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              const colorClass = getNotificationColor(notification.priority)
              const badge = getPriorityBadge(notification.priority)
              
              return (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-1.5 rounded-full ${colorClass}`}>
                    <Icon className="h-3 w-3" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium truncate">
                        {notification.title}
                      </h4>
                      <div className="flex items-center space-x-1">
                        <Badge variant={badge.variant} className="text-xs">
                          {badge.label}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        {notifications.length > 5 && (
          <div className="mt-4 pt-4 border-t text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              Ver todas las notificaciones
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

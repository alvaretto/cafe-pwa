/**
 * Modal de configuración rápida con pestañas para el dashboard
 * CRM Tinto del Mirador
 */

'use client'

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  Settings, 
  User, 
  Bell, 
  Palette,
  X,
  Save,
  RotateCcw
} from 'lucide-react'

interface QuickConfigModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickConfigModal({ open, onOpenChange }: QuickConfigModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'appearance'>('general')
  const [hasChanges, setHasChanges] = useState(false)

  // Estados de configuración
  const [generalConfig, setGeneralConfig] = useState({
    autoRefresh: true,
    showMetrics: true,
    compactMode: false,
    enableSounds: true
  })

  const [notificationConfig, setNotificationConfig] = useState({
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    salesAlerts: true,
    systemAlerts: false
  })

  const [appearanceConfig, setAppearanceConfig] = useState({
    theme: 'light',
    accentColor: 'amber',
    fontSize: 'medium',
    animations: true
  })

  const handleSave = () => {
    // Aquí se guardarían las configuraciones
    console.log('Saving configurations:', {
      general: generalConfig,
      notifications: notificationConfig,
      appearance: appearanceConfig
    })
    setHasChanges(false)
    onOpenChange(false)
  }

  const handleReset = () => {
    setGeneralConfig({
      autoRefresh: true,
      showMetrics: true,
      compactMode: false,
      enableSounds: true
    })
    setNotificationConfig({
      emailNotifications: true,
      pushNotifications: true,
      lowStockAlerts: true,
      salesAlerts: true,
      systemAlerts: false
    })
    setAppearanceConfig({
      theme: 'light',
      accentColor: 'amber',
      fontSize: 'medium',
      animations: true
    })
    setHasChanges(false)
  }

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Configuración General</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Auto-actualización</label>
              <p className="text-xs text-gray-600">Actualizar datos automáticamente cada 5 minutos</p>
            </div>
            <Switch
              checked={generalConfig.autoRefresh}
              onCheckedChange={(checked) => {
                setGeneralConfig(prev => ({ ...prev, autoRefresh: checked }))
                setHasChanges(true)
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Mostrar métricas</label>
              <p className="text-xs text-gray-600">Mostrar tarjetas de métricas en el dashboard</p>
            </div>
            <Switch
              checked={generalConfig.showMetrics}
              onCheckedChange={(checked) => {
                setGeneralConfig(prev => ({ ...prev, showMetrics: checked }))
                setHasChanges(true)
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Modo compacto</label>
              <p className="text-xs text-gray-600">Reducir espaciado para mostrar más información</p>
            </div>
            <Switch
              checked={generalConfig.compactMode}
              onCheckedChange={(checked) => {
                setGeneralConfig(prev => ({ ...prev, compactMode: checked }))
                setHasChanges(true)
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Sonidos del sistema</label>
              <p className="text-xs text-gray-600">Reproducir sonidos para notificaciones</p>
            </div>
            <Switch
              checked={generalConfig.enableSounds}
              onCheckedChange={(checked) => {
                setGeneralConfig(prev => ({ ...prev, enableSounds: checked }))
                setHasChanges(true)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notificaciones</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Notificaciones por email</label>
              <p className="text-xs text-gray-600">Recibir notificaciones importantes por correo</p>
            </div>
            <Switch
              checked={notificationConfig.emailNotifications}
              onCheckedChange={(checked) => {
                setNotificationConfig(prev => ({ ...prev, emailNotifications: checked }))
                setHasChanges(true)
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Notificaciones push</label>
              <p className="text-xs text-gray-600">Notificaciones en tiempo real en el navegador</p>
            </div>
            <Switch
              checked={notificationConfig.pushNotifications}
              onCheckedChange={(checked) => {
                setNotificationConfig(prev => ({ ...prev, pushNotifications: checked }))
                setHasChanges(true)
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Alertas de stock bajo</label>
              <p className="text-xs text-gray-600">Notificar cuando los productos tengan poco stock</p>
            </div>
            <Switch
              checked={notificationConfig.lowStockAlerts}
              onCheckedChange={(checked) => {
                setNotificationConfig(prev => ({ ...prev, lowStockAlerts: checked }))
                setHasChanges(true)
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Alertas de ventas</label>
              <p className="text-xs text-gray-600">Notificar sobre nuevas ventas y objetivos</p>
            </div>
            <Switch
              checked={notificationConfig.salesAlerts}
              onCheckedChange={(checked) => {
                setNotificationConfig(prev => ({ ...prev, salesAlerts: checked }))
                setHasChanges(true)
              }}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Alertas del sistema</label>
              <p className="text-xs text-gray-600">Notificaciones técnicas y de mantenimiento</p>
            </div>
            <Switch
              checked={notificationConfig.systemAlerts}
              onCheckedChange={(checked) => {
                setNotificationConfig(prev => ({ ...prev, systemAlerts: checked }))
                setHasChanges(true)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Apariencia</h3>
        
        <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-blue-600" />
            <p className="text-sm text-blue-700">
              <strong>Próximamente:</strong> Personalización completa de temas y colores
            </p>
          </div>
        </div>

        <div className="space-y-4 opacity-50">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Tema</label>
              <p className="text-xs text-gray-600">Claro, oscuro o automático</p>
            </div>
            <Badge variant="secondary">Próximamente</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Color de acento</label>
              <p className="text-xs text-gray-600">Color principal de la interfaz</p>
            </div>
            <Badge variant="secondary">Próximamente</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <label className="text-sm font-medium">Tamaño de fuente</label>
              <p className="text-xs text-gray-600">Pequeño, mediano o grande</p>
            </div>
            <Badge variant="secondary">Próximamente</Badge>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuración Rápida</span>
              </DialogTitle>
              <DialogDescription>
                Personaliza tu experiencia en el dashboard
              </DialogDescription>
            </div>
            
            {hasChanges && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Cambios pendientes
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <div className="px-6 pb-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notificaciones</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center space-x-2">
                <Palette className="h-4 w-4" />
                <span>Apariencia</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
            <div className="p-6 pt-2">
              <TabsContent value="general" className="mt-0">
                {renderGeneralTab()}
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                {renderNotificationsTab()}
              </TabsContent>
              
              <TabsContent value="appearance" className="mt-0">
                {renderAppearanceTab()}
              </TabsContent>
            </div>
          </div>

          <div className="flex justify-between items-center p-6 pt-4 border-t">
            <Button variant="outline" onClick={handleReset} disabled={!hasChanges}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Restablecer
            </Button>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

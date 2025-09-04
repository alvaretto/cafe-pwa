'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Settings,
  Save,
  RotateCcw,
  Building,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Monitor,
  Smartphone,
  Mail,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  ShoppingCart,
  Eye,
  EyeOff,
  Database
} from 'lucide-react'
import { SystemConfig, UserPreferences } from '@/lib/mock-data'

// Header de configuración
interface ConfigHeaderProps {
  stats: any
  hasChanges: boolean
  onSave: () => void
  onReset: () => void
}

export function ConfigHeader({ stats, hasChanges, onSave, onReset }: ConfigHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Configuración del Sistema</h1>
        <p className="text-amber-700 mt-1">
          Personalización de temas, preferencias de usuario y configuración empresarial
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {hasChanges && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 animate-pulse">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Cambios sin guardar
          </Badge>
        )}
        <Button 
          variant="outline"
          onClick={onReset}
          disabled={!hasChanges}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restaurar
        </Button>
        <Button 
          onClick={onSave}
          disabled={!hasChanges}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}

// Estadísticas de configuración
interface ConfigStatsProps {
  stats: any
  categories: any[]
  isLoading: boolean
}

export function ConfigStats({ stats, categories, isLoading }: ConfigStatsProps) {
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

  const cards = [
    {
      title: 'Configuraciones',
      value: stats.totalConfigs.toString(),
      subtitle: `${categories.length} categorías`,
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Última Actualización',
      value: stats.lastUpdated ? 'Hoy' : 'Nunca',
      subtitle: stats.lastUpdated ? stats.lastUpdated.toLocaleDateString('es-CO') : 'Sin cambios',
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Estado',
      value: stats.hasUnsavedChanges ? 'Pendiente' : 'Guardado',
      subtitle: stats.hasUnsavedChanges ? 'cambios sin guardar' : 'todo actualizado',
      icon: stats.hasUnsavedChanges ? AlertTriangle : CheckCircle,
      color: stats.hasUnsavedChanges ? 'text-orange-600' : 'text-green-600',
      bgColor: stats.hasUnsavedChanges ? 'bg-orange-100' : 'bg-green-100',
    },
    {
      title: 'Categorías',
      value: categories.length.toString(),
      subtitle: 'secciones disponibles',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        
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
              <p className="text-xs text-gray-600">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Tabs de navegación
interface ConfigTabsProps {
  activeTab: string
  onTabChange: (tab: 'overview' | 'system' | 'user' | 'company' | 'notifications' | 'security' | 'backups') => void
  categoriesCount: number
  hasChanges: boolean
}

export function ConfigTabs({ activeTab, onTabChange, categoriesCount, hasChanges }: ConfigTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Resumen', icon: Monitor },
    { id: 'system', label: 'Sistema', icon: Settings, badge: categoriesCount },
    { id: 'user', label: 'Usuario', icon: User },
    { id: 'company', label: 'Empresa', icon: Building },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'backups', label: 'BackUps', icon: Database },
  ]

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => onTabChange(tab.id as any)}
                className={`flex-1 min-w-0 rounded-none border-b-2 transition-colors ${
                  isActive 
                    ? 'border-amber-600 bg-amber-50 text-amber-700' 
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="truncate">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <Badge 
                    variant={isActive ? "default" : "secondary"} 
                    className="ml-2 text-xs"
                  >
                    {tab.badge}
                  </Badge>
                )}
                {hasChanges && isActive && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-2" />
                )}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Configuración del sistema (placeholder)
interface SystemSettingsProps {
  config: SystemConfig[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onConfigChange: (key: string, value: any) => void
  isLoading: boolean
}

export function SystemSettings({ config, selectedCategory, onCategoryChange, onConfigChange, isLoading }: SystemSettingsProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Settings className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración del Sistema</h3>
        <p className="text-gray-600 text-center">
          Funcionalidad de configuración avanzada próximamente disponible.
        </p>
      </CardContent>
    </Card>
  )
}

// Configuración de usuario
interface UserSettingsProps {
  preferences: UserPreferences | null
  onPreferencesChange: (preferences: Partial<UserPreferences>) => void
  isLoading: boolean
}

export function UserSettings({ preferences, onPreferencesChange, isLoading }: UserSettingsProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!preferences) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <User className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar preferencias</h3>
          <p className="text-gray-600 text-center">
            No se pudieron cargar las preferencias de usuario.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Apariencia */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Palette className="h-5 w-5 mr-2" />
            Apariencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value) => onPreferencesChange({ theme: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="auto">Automático</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select
                value={preferences.language}
                onValueChange={(value) => onPreferencesChange({ language: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formato y Localización */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Formato y Localización
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select
                value={preferences.currency}
                onValueChange={(value) => onPreferencesChange({ currency: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COP">Peso Colombiano (COP)</SelectItem>
                  <SelectItem value="USD">Dólar Americano (USD)</SelectItem>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Formato de Fecha</Label>
              <Select
                value={preferences.dateFormat}
                onValueChange={(value) => onPreferencesChange({ dateFormat: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Zona Horaria</Label>
            <Input
              id="timezone"
              value={preferences.timezone}
              onChange={(e) => onPreferencesChange({ timezone: e.target.value })}
              placeholder="America/Bogota"
            />
          </div>
        </CardContent>
      </Card>

      {/* Dashboard */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Monitor className="h-5 w-5 mr-2" />
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="layout">Layout</Label>
              <Select
                value={preferences.dashboard.layout}
                onValueChange={(value) => onPreferencesChange({
                  dashboard: { ...preferences.dashboard, layout: value as any }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Por Defecto</SelectItem>
                  <SelectItem value="compact">Compacto</SelectItem>
                  <SelectItem value="detailed">Detallado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refreshInterval">Intervalo de Actualización (segundos)</Label>
              <Input
                id="refreshInterval"
                type="number"
                value={preferences.dashboard.refreshInterval / 1000}
                onChange={(e) => onPreferencesChange({
                  dashboard: {
                    ...preferences.dashboard,
                    refreshInterval: parseInt(e.target.value) * 1000
                  }
                })}
                min="30"
                max="3600"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Configuración de empresa (placeholder)
interface CompanySettingsProps {
  config: SystemConfig[]
  onConfigChange: (key: string, value: any) => void
  isLoading: boolean
}

export function CompanySettings({ config, onConfigChange, isLoading }: CompanySettingsProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Building className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración de Empresa</h3>
        <p className="text-gray-600 text-center">
          Funcionalidad de configuración empresarial próximamente disponible.
        </p>
      </CardContent>
    </Card>
  )
}

// Configuración de notificaciones
interface NotificationSettingsProps {
  config: SystemConfig[]
  userPreferences: UserPreferences | null
  onConfigChange: (key: string, value: any) => void
  onPreferencesChange: (preferences: Partial<UserPreferences>) => void
  isLoading: boolean
}

export function NotificationSettings({
  config,
  userPreferences,
  onConfigChange,
  onPreferencesChange,
  isLoading
}: NotificationSettingsProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!userPreferences) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar preferencias</h3>
          <p className="text-gray-600 text-center">
            No se pudieron cargar las preferencias de notificaciones.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Canales de notificación */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Canales de Notificación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Notificaciones por Email</h4>
                  <p className="text-sm text-gray-600">Recibir notificaciones importantes por correo electrónico</p>
                </div>
              </div>
              <Switch
                checked={userPreferences.notifications.email}
                onCheckedChange={(checked) => onPreferencesChange({
                  notifications: { ...userPreferences.notifications, email: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium">Notificaciones Push</h4>
                  <p className="text-sm text-gray-600">Recibir notificaciones push en dispositivos móviles</p>
                </div>
              </div>
              <Switch
                checked={userPreferences.notifications.push}
                onCheckedChange={(checked) => onPreferencesChange({
                  notifications: { ...userPreferences.notifications, push: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Monitor className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium">Notificaciones de Escritorio</h4>
                  <p className="text-sm text-gray-600">Mostrar notificaciones en el navegador</p>
                </div>
              </div>
              <Switch
                checked={userPreferences.notifications.desktop}
                onCheckedChange={(checked) => onPreferencesChange({
                  notifications: { ...userPreferences.notifications, desktop: checked }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tipos de notificación */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Tipos de Notificación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-medium">Stock Bajo</h4>
                  <p className="text-sm text-gray-600">Alertas cuando los productos tienen stock bajo</p>
                </div>
              </div>
              <Switch
                checked={userPreferences.notifications.lowStock}
                onCheckedChange={(checked) => onPreferencesChange({
                  notifications: { ...userPreferences.notifications, lowStock: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium">Nuevas Ventas</h4>
                  <p className="text-sm text-gray-600">Notificaciones de nuevas transacciones de venta</p>
                </div>
              </div>
              <Switch
                checked={userPreferences.notifications.newSales}
                onCheckedChange={(checked) => onPreferencesChange({
                  notifications: { ...userPreferences.notifications, newSales: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Reportes Diarios</h4>
                  <p className="text-sm text-gray-600">Resumen diario de actividades y métricas</p>
                </div>
              </div>
              <Switch
                checked={userPreferences.notifications.dailyReports}
                onCheckedChange={(checked) => onPreferencesChange({
                  notifications: { ...userPreferences.notifications, dailyReports: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium">Reportes Semanales</h4>
                  <p className="text-sm text-gray-600">Resumen semanal de rendimiento y análisis</p>
                </div>
              </div>
              <Switch
                checked={userPreferences.notifications.weeklyReports}
                onCheckedChange={(checked) => onPreferencesChange({
                  notifications: { ...userPreferences.notifications, weeklyReports: checked }
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Configuración de seguridad (placeholder)
interface SecuritySettingsProps {
  config: SystemConfig[]
  onConfigChange: (key: string, value: any) => void
  isLoading: boolean
}

export function SecuritySettings({ config, onConfigChange, isLoading }: SecuritySettingsProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Configuración de Seguridad</h3>
        <p className="text-gray-600 text-center">
          Funcionalidad de configuración de seguridad próximamente disponible.
        </p>
      </CardContent>
    </Card>
  )
}

// Resumen de configuración
interface ConfigOverviewProps {
  categories: any[]
  systemConfig: SystemConfig[]
  userPreferences: UserPreferences | null
  stats: any
  isLoading: boolean
}

export function ConfigOverview({ categories, systemConfig, userPreferences, stats, isLoading }: ConfigOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Settings,
      Building,
      ShoppingCart,
      Package,
      Bell,
      Shield,
    }
    return icons[iconName] || Settings
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Categorías de configuración */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Categorías de Configuración
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.icon)
              
              return (
                <div key={category.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <Icon className="h-4 w-4 text-amber-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{category.description}</p>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant="secondary" className="text-xs">
                      {category.count} configs
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preferencias de usuario */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <User className="h-5 w-5 mr-2" />
            Preferencias de Usuario
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userPreferences ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tema:</span>
                    <span className="font-medium capitalize">{userPreferences.theme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Idioma:</span>
                    <span className="font-medium">{userPreferences.language === 'es' ? 'Español' : 'English'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Moneda:</span>
                    <span className="font-medium">{userPreferences.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zona Horaria:</span>
                    <span className="font-medium text-xs">{userPreferences.timezone}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className={`font-medium ${userPreferences.notifications.email ? 'text-green-600' : 'text-red-600'}`}>
                      {userPreferences.notifications.email ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Push:</span>
                    <span className={`font-medium ${userPreferences.notifications.push ? 'text-green-600' : 'text-red-600'}`}>
                      {userPreferences.notifications.push ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Desktop:</span>
                    <span className={`font-medium ${userPreferences.notifications.desktop ? 'text-green-600' : 'text-red-600'}`}>
                      {userPreferences.notifications.desktop ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Layout:</span>
                    <span className="font-medium capitalize">{userPreferences.dashboard.layout}</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Última actualización: {userPreferences.updatedAt.toLocaleDateString('es-CO')}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No se pudieron cargar las preferencias</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

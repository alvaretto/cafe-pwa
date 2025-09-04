'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { 
  SystemConfig,
  UserPreferences,
  MOCK_SYSTEM_CONFIG,
  getSystemConfig,
  getConfigCategories,
  getUserPreferences,
  updateConfigValue,
  updateUserPreferences
} from '@/lib/mock-data'
import { DashboardHeaderSimple } from '@/components/dashboard/dashboard-header-simple'
import {
  ConfigHeader,
  ConfigStats,
  ConfigTabs,
  ConfigOverview,
  SystemSettings,
  UserSettings,
  CompanySettings,
  NotificationSettings,
  SecuritySettings
} from './config-components'
import { BackupSettings } from './backup-settings'

interface ConfigContentProps {
  user: User
}

export function ConfigContent({ user }: ConfigContentProps) {
  const [systemConfig, setSystemConfig] = useState<SystemConfig[]>([])
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'system' | 'user' | 'company' | 'notifications' | 'security' | 'backups'>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string>('general')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadConfigData()
  }, [])

  const loadConfigData = async () => {
    try {
      setIsLoading(true)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSystemConfig(MOCK_SYSTEM_CONFIG)
      setCategories(getConfigCategories())
      setUserPreferences(getUserPreferences(user.id))
    } catch (error) {
      console.error('Error loading config data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadConfigData()
  }

  const handleSystemConfigChange = (key: string, value: any) => {
    setSystemConfig(prev =>
      prev.map(config =>
        config.key === key
          ? { ...config, value, updatedBy: user.name || 'Usuario', updatedAt: new Date() }
          : config
      )
    )
    setHasChanges(true)
  }

  const handleUserPreferencesChange = (preferences: Partial<UserPreferences>) => {
    if (userPreferences) {
      const updatedPreferences = {
        ...userPreferences,
        ...preferences,
        updatedAt: new Date()
      }

      // Actualizar el estado local
      setUserPreferences(updatedPreferences)

      // Guardar inmediatamente en localStorage
      updateUserPreferences(user.id, updatedPreferences)

      console.log('✅ User preferences updated immediately:', updatedPreferences)
      setHasChanges(true)
    }
  }

  const handleSaveChanges = async () => {
    try {
      // Guardar configuración del sistema
      systemConfig.forEach(config => {
        if (config.updatedBy) {
          updateConfigValue(config.key, config.value, user.name || 'Usuario')
        }
      })

      // Guardar preferencias de usuario
      if (userPreferences) {
        updateUserPreferences(user.id, userPreferences)
      }

      setHasChanges(false)
      
      // Mostrar mensaje de éxito
      alert('Configuración guardada exitosamente')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Error al guardar la configuración')
    }
  }

  const handleResetToDefaults = () => {
    if (confirm('¿Estás seguro de que quieres restaurar la configuración por defecto? Se perderán todos los cambios.')) {
      loadConfigData()
      setHasChanges(false)
    }
  }

  const stats = {
    totalConfigs: systemConfig.length,
    categoriesCount: categories.length,
    lastUpdated: systemConfig
      .filter(c => c.updatedAt)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0))[0]?.updatedAt,
    hasUnsavedChanges: hasChanges,
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
        {/* Header de configuración */}
        <ConfigHeader 
          stats={stats}
          hasChanges={hasChanges}
          onSave={handleSaveChanges}
          onReset={handleResetToDefaults}
        />

        {/* Estadísticas */}
        <ConfigStats 
          stats={stats}
          categories={categories}
          isLoading={isLoading}
        />

        {/* Tabs de navegación */}
        <ConfigTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          categoriesCount={categories.length}
          hasChanges={hasChanges}
        />

        {/* Contenido según tab activo */}
        {activeTab === 'overview' && (
          <ConfigOverview
            categories={categories}
            systemConfig={systemConfig}
            userPreferences={userPreferences}
            stats={stats}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'system' && (
          <SystemSettings
            config={systemConfig}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onConfigChange={handleSystemConfigChange}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'user' && (
          <UserSettings
            preferences={userPreferences}
            onPreferencesChange={handleUserPreferencesChange}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'company' && (
          <CompanySettings
            config={systemConfig.filter(c => c.category === 'empresa')}
            onConfigChange={handleSystemConfigChange}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationSettings
            config={systemConfig.filter(c => c.category === 'notificaciones')}
            userPreferences={userPreferences}
            onConfigChange={handleSystemConfigChange}
            onPreferencesChange={handleUserPreferencesChange}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySettings
            config={systemConfig.filter(c => c.category === 'seguridad')}
            onConfigChange={handleSystemConfigChange}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'backups' && (
          <BackupSettings
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

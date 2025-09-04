'use client'

import { useState, useEffect, useCallback } from 'react'
import { UserPreferences, DEFAULT_USER_PREFERENCES } from '@/lib/mock-data'
import { getCurrentUser } from '@/lib/auth-simple'

const USER_PREFERENCES_KEY = 'tinto-user-preferences'

/**
 * Hook para manejar las preferencias de usuario con persistencia en localStorage
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar preferencias desde localStorage
  const loadPreferences = useCallback(() => {
    try {
      const user = getCurrentUser()
      if (!user) {
        setPreferences(null)
        setIsLoading(false)
        return
      }

      // Intentar cargar desde localStorage
      const stored = localStorage.getItem(`${USER_PREFERENCES_KEY}-${user.id}`)
      
      if (stored) {
        const parsedPreferences = JSON.parse(stored)
        setPreferences(parsedPreferences)
      } else {
        // Si no hay preferencias guardadas, usar las por defecto
        const defaultPreferences: UserPreferences = {
          userId: user.id,
          ...DEFAULT_USER_PREFERENCES,
        }
        setPreferences(defaultPreferences)
        // Guardar las preferencias por defecto
        localStorage.setItem(`${USER_PREFERENCES_KEY}-${user.id}`, JSON.stringify(defaultPreferences))
      }
    } catch (error) {
      console.error('Error loading user preferences:', error)
      // En caso de error, usar preferencias por defecto
      const user = getCurrentUser()
      if (user) {
        const defaultPreferences: UserPreferences = {
          userId: user.id,
          ...DEFAULT_USER_PREFERENCES,
        }
        setPreferences(defaultPreferences)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Guardar preferencias en localStorage
  const savePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    try {
      const user = getCurrentUser()
      if (!user || !preferences) return

      const updatedPreferences: UserPreferences = {
        ...preferences,
        ...newPreferences,
        updatedAt: new Date(),
      }

      setPreferences(updatedPreferences)
      localStorage.setItem(`${USER_PREFERENCES_KEY}-${user.id}`, JSON.stringify(updatedPreferences))
      
      console.log('User preferences saved:', updatedPreferences)
      return true
    } catch (error) {
      console.error('Error saving user preferences:', error)
      return false
    }
  }, [preferences])

  // Actualizar tema específicamente
  const updateTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    return savePreferences({ theme })
  }, [savePreferences])

  // Cargar preferencias al montar el componente
  useEffect(() => {
    loadPreferences()
  }, [loadPreferences])

  // Recargar preferencias cuando cambie el usuario
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith(USER_PREFERENCES_KEY)) {
        loadPreferences()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [loadPreferences])

  return {
    preferences,
    isLoading,
    savePreferences,
    updateTheme,
    loadPreferences,
  }
}

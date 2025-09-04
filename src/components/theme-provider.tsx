'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'
import { useUserPreferences } from '@/hooks/use-user-preferences'

// Componente interno que sincroniza el tema con las preferencias del usuario
function ThemeSynchronizer() {
  const { setTheme, theme: currentTheme } = useTheme()
  const { preferences, isLoading } = useUserPreferences()
  const [hasInitialized, setHasInitialized] = useState(false)
  const [lastSyncedTheme, setLastSyncedTheme] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && preferences && !hasInitialized) {
      // Sincronización inicial del tema con las preferencias del usuario
      if (preferences.theme) {
        console.log('🎨 Initial theme synchronization:', {
          preferenceTheme: preferences.theme,
          currentTheme
        })
        setTheme(preferences.theme)
        setLastSyncedTheme(preferences.theme)
        setHasInitialized(true)
      }
    }
  }, [preferences, isLoading, setTheme, hasInitialized, currentTheme])

  // Sincronización reactiva solo si las preferencias cambian externamente
  useEffect(() => {
    if (hasInitialized && preferences?.theme && preferences.theme !== lastSyncedTheme) {
      // Solo sincronizar si el tema en preferencias es diferente al último sincronizado
      // Esto evita loops infinitos con cambios manuales
      console.log('🔄 External theme preference change detected:', {
        newTheme: preferences.theme,
        lastSynced: lastSyncedTheme,
        currentTheme
      })

      setTimeout(() => {
        setTheme(preferences.theme)
        setLastSyncedTheme(preferences.theme)
      }, 50) // Pequeño delay para evitar conflictos
    }
  }, [preferences?.theme, lastSyncedTheme, hasInitialized, setTheme, currentTheme])

  return null
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSynchronizer />
      {children}
    </NextThemesProvider>
  )
}

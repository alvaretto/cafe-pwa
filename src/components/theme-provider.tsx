'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'
import { useUserPreferences } from '@/hooks/use-user-preferences'

// Componente interno que sincroniza el tema con las preferencias del usuario
function ThemeSynchronizer() {
  const { setTheme } = useTheme()
  const { preferences, isLoading } = useUserPreferences()
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    if (!isLoading && preferences && !hasInitialized) {
      // Sincronizar el tema con las preferencias del usuario
      if (preferences.theme) {
        console.log('🎨 Synchronizing theme with user preferences:', preferences.theme)
        setTheme(preferences.theme)
        setHasInitialized(true)
      }
    }
  }, [preferences, isLoading, setTheme, hasInitialized])

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

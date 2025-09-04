'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, createMockUser } from '@/lib/auth-simple'
import { User } from '@/types'
import { DashboardContentSimple } from './dashboard-content-simple'
import { DashboardDevBypass } from './dashboard-dev-bypass'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Función para detectar modo desarrollo
function isDevelopmentMode(): boolean {
  return (
    process.env.NODE_ENV === 'development' ||
    typeof window !== 'undefined' && window.location.hostname === 'localhost' ||
    typeof window !== 'undefined' && window.location.hostname === '127.0.0.1' ||
    typeof window !== 'undefined' && window.location.port === '3000'
  )
}

export function DashboardPageClient() {
  // BYPASS COMPLETO: Si estamos en desarrollo, renderizar directamente
  if (isDevelopmentMode()) {
    console.log('🔧 BYPASS ACTIVADO: Renderizando dashboard directamente en modo desarrollo')
    return <DashboardDevBypass />
  }

  // MODO PRODUCCIÓN: Lógica normal de autenticación
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkProductionAuth = async () => {
      try {
        console.log('🔒 MODO PRODUCCIÓN: Verificando autenticación...')
        setIsLoading(true)
        setError(null)

        const currentUser = getCurrentUser()

        if (!currentUser) {
          console.log('❌ No hay usuario autenticado, redirigiendo...')
          router.push('/')
          return
        }

        console.log('✅ Usuario autenticado:', currentUser.name)
        setUser(currentUser)

      } catch (err) {
        console.error('❌ Error al verificar autenticación:', err)
        setError('Error al cargar la sesión de usuario')
      } finally {
        setIsLoading(false)
      }
    }

    checkProductionAuth()
  }, [router])

  // Estado de carga mejorado
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Cargando Dashboard</h2>
          <p className="text-amber-700 text-sm">Verificando autenticación y cargando datos...</p>
          <div className="mt-4 w-full bg-amber-200 rounded-full h-1">
            <div className="bg-amber-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-xs text-amber-600 mt-2">Esto debería tomar solo unos segundos...</p>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error de Carga</h2>
          <p className="text-red-700 text-sm mb-6">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Reintentar
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full"
            >
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Estado sin usuario (redirigiendo)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-amber-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-blue-700">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return <DashboardContentSimple user={user} />
}

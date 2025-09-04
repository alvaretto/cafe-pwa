'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-simple'
import { User } from '@/types'
import { Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AuthWrapperProps {
  children: (user: User) => React.ReactNode
  loadingMessage?: string
  redirectTo?: string
}

export function AuthWrapper({ 
  children, 
  loadingMessage = "Cargando...", 
  redirectTo = "/" 
}: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 AuthWrapper: Iniciando verificación de autenticación...')
        setIsLoading(true)
        setError(null)

        // Pequeño delay para evitar flashes de carga
        await new Promise(resolve => setTimeout(resolve, 100))

        console.log('🔍 AuthWrapper: Llamando a getCurrentUser()...')
        const currentUser = getCurrentUser()

        if (!currentUser) {
          console.log('❌ AuthWrapper: No hay usuario autenticado, redirigiendo a:', redirectTo)
          router.push(redirectTo)
          return
        }

        console.log('✅ AuthWrapper: Usuario autenticado exitosamente:', {
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role
        })
        setUser(currentUser)
      } catch (err) {
        console.error('❌ AuthWrapper: Error al verificar autenticación:', err)
        setError('Error al cargar la sesión de usuario')
      } finally {
        console.log('🏁 AuthWrapper: Finalizando verificación de autenticación')
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, redirectTo])

  // Estado de carga mejorado
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center max-w-md mx-auto p-6">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-amber-800 mb-2">Cargando</h2>
          <p className="text-amber-700 text-sm">{loadingMessage}</p>
          <div className="mt-4 w-full bg-amber-200 rounded-full h-1">
            <div className="bg-amber-600 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
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
              onClick={() => router.push(redirectTo)}
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

  return <>{children(user)}</>
}

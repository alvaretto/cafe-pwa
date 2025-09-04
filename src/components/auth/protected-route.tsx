'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2, Coffee } from 'lucide-react'
import { LandingPageSimple } from '@/components/landing/landing-page-simple'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (status === 'loading') return // Aún cargando

    if (!session?.user) {
      // Usuario no autenticado - mostrar landing page con modal de login
      console.log('🔒 ProtectedRoute: Usuario no autenticado, mostrando login')
      setShowLogin(true)
      return
    }

    if (requireAdmin && session.user.role !== 'ADMIN') {
      // Usuario no es admin pero la ruta lo requiere
      console.log('🔒 ProtectedRoute: Usuario no es admin, redirigiendo a dashboard')
      router.push('/dashboard')
      return
    }

    // Usuario autenticado y con permisos correctos
    console.log('✅ ProtectedRoute: Usuario autenticado correctamente')
    setShowLogin(false)
  }, [session, status, requireAdmin, router, pathname])

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Coffee className="h-8 w-8 text-amber-600 mr-2 animate-pulse" />
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
          <p className="text-amber-700 font-medium">Verificando autenticación...</p>
          <p className="text-amber-600 text-sm mt-2">Tinto del Mirador CRM</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, mostrar landing page con modal de login
  if (showLogin || !session?.user) {
    return <LandingPageSimple />
  }

  // Si requiere admin y no es admin, mostrar mensaje de acceso denegado
  if (requireAdmin && session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="flex items-center justify-center mb-4">
            <Coffee className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-amber-900 mb-2">Acceso Restringido</h1>
          <p className="text-amber-700 mb-6">
            Esta sección requiere permisos de administrador.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Ir al Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Usuario autenticado y con permisos correctos - mostrar contenido
  return <>{children}</>
}

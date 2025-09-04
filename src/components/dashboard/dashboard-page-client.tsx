'use client'

import { useSession } from 'next-auth/react'
import { DashboardContentSimple } from './dashboard-content-simple'
import { Loader2, Coffee } from 'lucide-react'

export function DashboardPageClient() {
  const { data: session, status } = useSession()

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Coffee className="h-8 w-8 text-amber-600 mr-2 animate-pulse" />
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
          <p className="text-amber-700 font-medium">Cargando dashboard...</p>
          <p className="text-amber-600 text-sm mt-2">Tinto del Mirador CRM</p>
        </div>
      </div>
    )
  }

  // Si no hay sesión, no debería llegar aquí (ProtectedRoute lo maneja)
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Coffee className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <p className="text-amber-700 font-medium">Error de autenticación</p>
        </div>
      </div>
    )
  }

  // Convertir usuario de NextAuth al formato esperado
  const user = {
    id: session.user.id,
    name: session.user.name || 'Usuario',
    email: session.user.email || '',
    role: session.user.role as 'ADMIN' | 'VENDEDOR',
    image: session.user.image,
    emailVerified: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
  }

  return <DashboardContentSimple user={user} />
}

'use client'

import { createMockUser } from '@/lib/auth-simple'
import { DashboardContentSimple } from './dashboard-content-simple'
import { Coffee } from 'lucide-react'

/**
 * Componente de bypass para desarrollo que renderiza directamente el dashboard
 * sin verificaciones de autenticación ni estados de carga
 */
export function DashboardDevBypass() {
  // Crear usuario mock directamente
  const mockUser = createMockUser()
  
  console.log('🔧 DashboardDevBypass: Renderizando dashboard directamente con usuario mock')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Banner de modo desarrollo */}
      <div className="bg-amber-100 border-b border-amber-200 px-4 py-2">
        <div className="container mx-auto flex items-center justify-center space-x-2">
          <Coffee className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            MODO DESARROLLO - Bypass de autenticación activo
          </span>
          <Coffee className="h-4 w-4 text-amber-600" />
        </div>
      </div>
      
      {/* Contenido del dashboard */}
      <DashboardContentSimple user={mockUser} />
    </div>
  )
}

import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ConfigPageClient } from '@/components/configuracion/config-page-client'

export const metadata: Metadata = {
  title: 'Configuración - Tinto del Mirador CRM',
  description: 'Configuración del sistema con personalización de temas, preferencias de usuario, configuración empresarial y gestión de notificaciones',
}

export default function ConfigPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <ConfigPageClient />
    </ProtectedRoute>
  )
}

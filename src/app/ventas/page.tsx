import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { SalesPageClient } from '@/components/ventas/sales-page-client'

export const metadata: Metadata = {
  title: 'Ventas - Tinto del Mirador CRM',
  description: 'Sistema de punto de venta con carrito inteligente, facturación automática y análisis de ventas',
}

export default function SalesPage() {
  return (
    <ProtectedRoute>
      <SalesPageClient />
    </ProtectedRoute>
  )
}

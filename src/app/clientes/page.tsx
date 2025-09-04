import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { CustomersPageClient } from '@/components/clientes/customers-page-client'

export const metadata: Metadata = {
  title: 'Clientes - Tinto del Mirador CRM',
  description: 'CRM completo con gestión de clientes, historial de compras, programa de fidelización y segmentación automática',
}

export default function CustomersPage() {
  return (
    <ProtectedRoute>
      <CustomersPageClient />
    </ProtectedRoute>
  )
}

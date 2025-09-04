import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ReportsPageClient } from '@/components/reportes/reports-page-client'

export const metadata: Metadata = {
  title: 'Reportes - Tinto del Mirador CRM',
  description: 'Sistema de reportes ejecutivos con análisis avanzado, gráficos interactivos, filtros personalizables y exportación múltiple',
}

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <ReportsPageClient />
    </ProtectedRoute>
  )
}

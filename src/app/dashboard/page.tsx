import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { DashboardPageClient } from '@/components/dashboard/dashboard-page-client'

export const metadata: Metadata = {
  title: 'Dashboard - Tinto del Mirador CRM',
  description: 'Panel de control principal con métricas, análisis y gestión integral del negocio',
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageClient />
    </ProtectedRoute>
  )
}

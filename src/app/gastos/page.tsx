import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ExpensesPageClient } from '@/components/gastos/expenses-page-client'

export const metadata: Metadata = {
  title: 'Gastos - Tinto del Mirador CRM',
  description: 'Control de gastos empresariales con categorización, presupuestos, análisis comparativo y reportes financieros avanzados',
}

export default function ExpensesPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <ExpensesPageClient />
    </ProtectedRoute>
  )
}

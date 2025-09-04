import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InventoryPageClient } from '@/components/inventario/inventory-page-client'

export const metadata: Metadata = {
  title: 'Inventario - Tinto del Mirador CRM',
  description: 'Control de inventario inteligente con alertas automáticas, predicción de demanda, gestión de proveedores y análisis avanzado',
}

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <InventoryPageClient />
    </ProtectedRoute>
  )
}

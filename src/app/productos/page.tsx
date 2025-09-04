import { Metadata } from 'next'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ProductsPageClient } from '@/components/productos/products-page-client'

export const metadata: Metadata = {
  title: 'Productos - Tinto del Mirador CRM',
  description: 'Gestión completa de productos de café con precios múltiples, categorización y análisis de costos',
}

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <ProductsPageClient />
    </ProtectedRoute>
  )
}

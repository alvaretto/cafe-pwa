import { Metadata } from 'next'
import { SalesPageClient } from '@/components/ventas/sales-page-client'

export const metadata: Metadata = {
  title: 'Ventas - Tinto del Mirador CRM',
  description: 'Sistema de punto de venta con carrito inteligente, facturación automática y análisis de ventas',
}

export default function SalesPage() {
  return <SalesPageClient />
}

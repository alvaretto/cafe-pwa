import { Metadata } from 'next'
import { PurchasesPageClient } from '@/components/compras/purchases-page-client'

export const metadata: Metadata = {
  title: 'Compras - Tinto del Mirador CRM',
  description: 'Gestión de compras de inventario y proveedores',
}

export default function PurchasesPage() {
  return <PurchasesPageClient />
}

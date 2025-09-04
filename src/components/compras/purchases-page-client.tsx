'use client'

import { PurchasesContent } from './purchases-content'
import { AuthWrapper } from '@/components/common/auth-wrapper'

export function PurchasesPageClient() {
  return (
    <AuthWrapper
      loadingMessage="Cargando módulo de compras y proveedores..."
      redirectTo="/"
    >
      {(user) => <PurchasesContent user={user} />}
    </AuthWrapper>
  )
}

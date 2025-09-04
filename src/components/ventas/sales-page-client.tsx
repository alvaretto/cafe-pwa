'use client'

import { SalesContent } from './sales-content'
import { AuthWrapper } from '@/components/common/auth-wrapper'

export function SalesPageClient() {
  return (
    <AuthWrapper
      loadingMessage="Cargando punto de venta y productos..."
      redirectTo="/"
    >
      {(user) => <SalesContent user={user} />}
    </AuthWrapper>
  )
}

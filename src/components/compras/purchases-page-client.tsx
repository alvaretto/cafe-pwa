'use client'

import { PurchasesContent } from './purchases-content'
import { createMockUser } from '@/lib/auth-simple'

export function PurchasesPageClient() {
  // Para desarrollo, usar directamente un usuario mock
  const user = createMockUser()

  return <PurchasesContent user={user} />
}

'use client'

import { useSession } from 'next-auth/react'
import { User, UserRole } from '@/types'

export function useAuth() {
  const { data: session, status } = useSession()

  const user: User | null = session?.user ? {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
    role: session.user.role,
    isActive: true, // Asumimos que está activo si tiene sesión
    lastLogin: new Date(), // Placeholder
    emailVerified: new Date(), // Placeholder
    twoFactorEnabled: false, // Placeholder
    biometricEnabled: false, // Placeholder
    createdAt: new Date(), // Placeholder
    updatedAt: new Date(), // Placeholder
  } : null

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    isAdmin: session?.user?.role === UserRole.ADMIN,
    isVendedor: session?.user?.role === UserRole.VENDEDOR,
  }
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-simple'
import { User } from '@/types'
import { ConfigContent } from './config-content'
import { Loader2 } from 'lucide-react'

export function ConfigPageClient() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = getCurrentUser()
      
      if (!currentUser) {
        router.push('/')
        return
      }
      
      // Solo administradores pueden acceder a configuración
      if (currentUser.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }
      
      setUser(currentUser)
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-amber-700">Cargando configuración del sistema...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // El useEffect redirigirá
  }

  return <ConfigContent user={user} />
}

'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LandingPageSimple } from '@/components/landing/landing-page-simple'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Si el usuario está autenticado, redirigir al dashboard
    if (session?.user) {
      router.push('/dashboard')
    }
  }, [session, router])

  // Mostrar loading mientras se verifica la sesión
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-amber-700">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, mostrar landing page con modal de login
  return <LandingPageSimple />
}
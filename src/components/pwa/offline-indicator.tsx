'use client'

import { WifiOff } from 'lucide-react'
import { usePWA } from './pwa-provider'

export function OfflineIndicator() {
  const { isOnline } = usePWA()

  if (isOnline) {
    return null
  }

  return (
    <div className="offline-indicator">
      <div className="flex items-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span>Sin conexión - Trabajando offline</span>
      </div>
    </div>
  )
}

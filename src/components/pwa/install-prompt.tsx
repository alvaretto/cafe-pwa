'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePWA } from './pwa-provider'

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Mostrar el prompt después de 30 segundos si es instalable y no está instalada
    const timer = setTimeout(() => {
      if (isInstallable && !isInstalled && !dismissed) {
        setShowPrompt(true)
      }
    }, 30000)

    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled, dismissed])

  useEffect(() => {
    // Verificar si el usuario ya dismissió el prompt anteriormente
    const wasDismissed = localStorage.getItem('pwa-install-dismissed')
    if (wasDismissed) {
      setDismissed(true)
    }
  }, [])

  const handleInstall = () => {
    installApp()
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showPrompt || !isInstallable || isInstalled) {
    return null
  }

  return (
    <div className="pwa-install-prompt">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Smartphone className="h-6 w-6 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-primary-foreground">
            Instalar Tinto del Mirador
          </h3>
          <p className="text-sm text-primary-foreground/80">
            Instala nuestra app para una mejor experiencia y acceso offline
          </p>
        </div>
        <div className="flex-shrink-0 flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleInstall}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Instalar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}

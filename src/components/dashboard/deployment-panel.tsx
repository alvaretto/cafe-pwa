/**
 * Panel principal de deployment para el dashboard
 * CRM Tinto del Mirador
 */

'use client'

import { useState } from 'react'
import { Rocket, Settings, Clock, CheckCircle, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useDeployment } from '@/hooks/use-deployment'
import { useDeploymentConfig } from '@/hooks/use-deployment-config'
import { DeploymentModal } from './deployment-modal'
import { cn } from '@/lib/utils'

/**
 * Componente principal del panel de deployment
 */
export function DeploymentPanel() {
  const [showModal, setShowModal] = useState(false)
  
  const {
    state,
    deploy,
    cancelDeployment,
    reset,
    isDeploying,
    canDeploy,
    hasError,
    isSuccess
  } = useDeployment({
    onSuccess: (url) => {
      console.log('Deployment successful:', url)
    },
    onError: (error) => {
      console.error('Deployment failed:', error)
    }
  })

  const {
    activeConfig,
    hasConfigs,
    isWizardCompleted,
    canDeploy: configCanDeploy
  } = useDeploymentConfig()

  /**
   * Maneja el click del botón principal de deployment
   */
  const handleDeployClick = () => {
    if (!activeConfig) {
      setShowModal(true)
      return
    }

    if (canDeploy && configCanDeploy) {
      setShowModal(true)
    }
  }

  /**
   * Obtiene el estado visual del deployment
   */
  const getDeploymentStatus = () => {
    if (isDeploying) {
      return {
        icon: Clock,
        label: 'Desplegando',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    }

    if (hasError) {
      return {
        icon: XCircle,
        label: 'Error',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    }

    if (isSuccess) {
      return {
        icon: CheckCircle,
        label: 'Exitoso',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    }

    return {
      icon: Rocket,
      label: 'Listo',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    }
  }

  const status = getDeploymentStatus()
  const StatusIcon = status.icon

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-lg">Deployment a Producción</CardTitle>
            </div>
            
            {/* Badge de estado */}
            <Badge 
              variant="outline" 
              className={cn(
                "flex items-center space-x-1",
                status.color,
                status.bgColor,
                status.borderColor
              )}
            >
              <StatusIcon className="h-3 w-3" />
              <span>{status.label}</span>
            </Badge>
          </div>
          
          <CardDescription>
            Despliega la aplicación a producción de forma segura y automatizada
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Información de configuración */}
          {activeConfig && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">{activeConfig.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {activeConfig.platform}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Progreso del deployment */}
          {isDeploying && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {state.currentStep || 'Iniciando...'}
                </span>
                <span className="font-medium">{state.progress}%</span>
              </div>
              
              <Progress value={state.progress} className="h-2" />
              
              {/* Último log */}
              {state.logs.length > 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono">
                  {state.logs[state.logs.length - 1]?.split('] ')[1] || state.logs[state.logs.length - 1]}
                </div>
              )}
            </div>
          )}

          {/* Información del último deployment */}
          {(isSuccess || hasError) && state.deploymentUrl && (
            <div className="space-y-2">
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">URL de producción:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(state.deploymentUrl, '_blank')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ver sitio
                </Button>
              </div>
            </div>
          )}

          {/* Error information */}
          {hasError && state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Error en deployment:</p>
                  <p className="mt-1">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex space-x-2 pt-2">
            {/* Botón principal de deployment */}
            <Button
              onClick={handleDeployClick}
              disabled={!configCanDeploy || isDeploying}
              className="flex-1"
              size="lg"
            >
              {isDeploying ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Desplegando...
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4 mr-2" />
                  {!hasConfigs ? 'Configurar Deployment' : 'Desplegar a Producción'}
                </>
              )}
            </Button>

            {/* Botón de cancelar (solo visible durante deployment) */}
            {isDeploying && (
              <Button
                variant="outline"
                onClick={cancelDeployment}
                size="lg"
              >
                Cancelar
              </Button>
            )}

            {/* Botón de reset (solo visible después de error o éxito) */}
            {(hasError || isSuccess) && !isDeploying && (
              <Button
                variant="outline"
                onClick={reset}
                size="lg"
              >
                Limpiar
              </Button>
            )}
          </div>

          {/* Advertencias de configuración */}
          {!isWizardCompleted && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium">Configuración incompleta</p>
                  <p className="mt-1">
                    Completa la configuración inicial para habilitar el deployment automático.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!hasConfigs && isWizardCompleted && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Settings className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">Sin configuraciones</p>
                  <p className="mt-1">
                    Crea una configuración de deployment para comenzar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de deployment */}
      <DeploymentModal
        open={showModal}
        onOpenChange={setShowModal}
        onDeploy={(config) => {
          if (config) {
            deploy(config)
          }
          setShowModal(false)
        }}
      />
    </>
  )
}

/**
 * Versión compacta del panel para usar en acciones rápidas
 */
export function DeploymentPanelCompact() {
  const [showModal, setShowModal] = useState(false)
  
  const { isDeploying, canDeploy } = useDeployment()
  const { activeConfig, canDeploy: configCanDeploy } = useDeploymentConfig()

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={!configCanDeploy || isDeploying}
        className="w-full h-auto p-3 flex flex-col items-center space-y-2 hover:bg-gray-50 transition-colors"
        variant="ghost"
      >
        <div className="p-2 rounded-full bg-purple-100">
          {isDeploying ? (
            <Clock className="h-5 w-5 text-purple-600 animate-spin" />
          ) : (
            <Rocket className="h-5 w-5 text-purple-600" />
          )}
        </div>
        <span className="text-xs font-medium text-center">
          {isDeploying ? 'Desplegando...' : 'Deploy a Producción'}
        </span>
      </Button>

      <DeploymentModal
        open={showModal}
        onOpenChange={setShowModal}
        onDeploy={(config) => {
          setShowModal(false)
        }}
      />
    </>
  )
}

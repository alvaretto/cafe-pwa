/**
 * Modal de deployment con interfaz fullscreen y stepper
 * CRM Tinto del Mirador
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Rocket,
  ExternalLink,
  Download,
  X,
  Settings,
  Play,
  FileText
} from 'lucide-react'
import { DeploymentConfig } from '@/types/deployment'
import { useDeployment } from '@/hooks/use-deployment'
import { useDeploymentConfig } from '@/hooks/use-deployment-config'
import { DeploymentLogs } from './deployment-logs'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface DeploymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeploy?: (config: DeploymentConfig | null) => void
}

/**
 * Pasos del proceso de deployment
 */
const DEPLOYMENT_STEPS = [
  {
    id: 'validations',
    name: 'Validaciones',
    description: 'Verificando estado del proyecto'
  },
  {
    id: 'build',
    name: 'Build',
    description: 'Compilando aplicación'
  },
  {
    id: 'test',
    name: 'Tests',
    description: 'Ejecutando pruebas'
  },
  {
    id: 'deploy',
    name: 'Deploy',
    description: 'Desplegando a producción'
  },
  {
    id: 'verify',
    name: 'Verificación',
    description: 'Validando deployment'
  }
]

export function DeploymentModal({ open, onOpenChange, onDeploy }: DeploymentModalProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'logs' | 'history'>('config')
  const [currentView, setCurrentView] = useState<'config' | 'confirm' | 'deploy' | 'result'>('config')
  const [confirmationChecked, setConfirmationChecked] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState<DeploymentConfig | null>(null)

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
      setCurrentView('result')
    },
    onError: (error) => {
      setCurrentView('result')
    }
  })

  const {
    activeConfig,
    configs,
    hasConfigs,
    isWizardCompleted
  } = useDeploymentConfig()

  // Resetear estado cuando se abre el modal
  useEffect(() => {
    if (open) {
      setActiveTab('config')
      setCurrentView(hasConfigs ? 'config' : 'config')
      setConfirmationChecked(false)
      setSelectedConfig(activeConfig)

      if (state.status !== 'idle') {
        if (isDeploying) {
          setCurrentView('deploy')
          setActiveTab('logs')
        } else if (hasError || isSuccess) {
          setCurrentView('result')
          setActiveTab('logs')
        }
      }
    }
  }, [open, hasConfigs, activeConfig, state.status, isDeploying, hasError, isSuccess])

  /**
   * Maneja el inicio del deployment
   */
  const handleStartDeployment = () => {
    if (!selectedConfig) return

    setCurrentView('deploy')
    setActiveTab('logs')
    deploy(selectedConfig)
    onDeploy?.(selectedConfig)
  }

  /**
   * Maneja la cancelación del deployment
   */
  const handleCancel = () => {
    if (isDeploying) {
      cancelDeployment()
    }
    onOpenChange(false)
  }

  /**
   * Obtiene el paso actual basado en el estado
   */
  const getCurrentStepIndex = () => {
    switch (state.status) {
      case 'validating':
        return 0
      case 'building':
        return 1
      case 'testing':
        return 2
      case 'deploying':
        return 3
      case 'success':
      case 'error':
        return 4
      default:
        return -1
    }
  }

  const currentStepIndex = getCurrentStepIndex()

  /**
   * Renderiza el historial de deployments
   */
  const renderHistoryView = () => (
    <div className="space-y-4">
      <div className="text-center">
        <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Historial de Deployments</h3>
        <p className="text-gray-600">
          Registro de deployments anteriores y su estado
        </p>
      </div>

      <div className="space-y-3">
        {/* Ejemplo de historial - en una implementación real vendría de una API */}
        <div className="p-4 border rounded-lg bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Deployment exitoso</p>
                <p className="text-sm text-gray-600">hace 2 horas</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              v1.2.3
            </Badge>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium">Deployment fallido</p>
                <p className="text-sm text-gray-600">hace 1 día</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              v1.2.2
            </Badge>
          </div>
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Deployment exitoso</p>
                <p className="text-sm text-gray-600">hace 3 días</p>
              </div>
            </div>
            <Badge variant="secondary">
              v1.2.1
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Renderiza la vista de configuración
   */
  const renderConfigView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Configuración de Deployment</h3>
        <p className="text-gray-600">
          Selecciona la configuración para desplegar a producción
        </p>
      </div>

      {hasConfigs ? (
        <div className="space-y-3">
          {configs.map((config) => (
            <div
              key={config.id}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-colors",
                selectedConfig?.id === config.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => setSelectedConfig(config)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2",
                    selectedConfig?.id === config.id
                      ? "border-purple-500 bg-purple-500"
                      : "border-gray-300"
                  )} />
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{config.name}</span>
                      {config.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Predeterminada
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 capitalize">
                      {config.platform}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    // TODO: Abrir configuración
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            No hay configuraciones de deployment disponibles
          </p>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Crear Configuración
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancelar
        </Button>
        
        <Button
          onClick={() => setCurrentView('confirm')}
          disabled={!selectedConfig}
        >
          Continuar
        </Button>
      </div>
    </div>
  )

  /**
   * Renderiza la vista de confirmación
   */
  const renderConfirmView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Confirmar Deployment</h3>
        <p className="text-gray-600">
          Estás a punto de desplegar a producción
        </p>
      </div>

      {selectedConfig && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Detalles del deployment:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Configuración:</span>
              <span className="font-medium">{selectedConfig.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Plataforma:</span>
              <span className="font-medium capitalize">{selectedConfig.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rama:</span>
              <span className="font-medium">main</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timestamp:</span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-700">
            <p className="font-medium mb-1">Advertencia importante:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Este deployment afectará el sitio de producción</li>
              <li>Los usuarios podrían experimentar interrupciones temporales</li>
              <li>Asegúrate de que todos los cambios han sido probados</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="confirm-deployment"
          checked={confirmationChecked}
          onCheckedChange={(checked) => setConfirmationChecked(checked as boolean)}
        />
        <label
          htmlFor="confirm-deployment"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Entiendo que esto desplegará a producción y acepto la responsabilidad
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setCurrentView('config')}>
          Atrás
        </Button>
        
        <Button
          onClick={handleStartDeployment}
          disabled={!confirmationChecked}
          className="bg-red-600 hover:bg-red-700"
        >
          <Play className="h-4 w-4 mr-2" />
          Desplegar a Producción
        </Button>
      </div>
    </div>
  )

  /**
   * Renderiza la vista de deployment en progreso
   */
  const renderDeployView = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="relative">
          <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          {isDeploying && (
            <div className="absolute -top-1 -right-1">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse" />
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {isDeploying ? 'Deployment en Progreso' : 'Deployment Completado'}
        </h3>
        <p className="text-gray-600">
          {isDeploying 
            ? 'Por favor espera mientras se despliega la aplicación'
            : 'El proceso de deployment ha finalizado'
          }
        </p>
      </div>

      {/* Stepper */}
      <div className="space-y-4">
        {DEPLOYMENT_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex
          const isCompleted = index < currentStepIndex
          const isFailed = hasError && index === currentStepIndex

          return (
            <div key={step.id} className="flex items-center space-x-3">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                isCompleted
                  ? "bg-green-500 text-white"
                  : isFailed
                  ? "bg-red-500 text-white"
                  : isActive
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              )}>
                {isCompleted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : isFailed ? (
                  <XCircle className="h-4 w-4" />
                ) : isActive ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  index + 1
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "font-medium",
                    isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-600"
                  )}>
                    {step.name}
                  </span>
                  
                  {isActive && (
                    <span className="text-sm text-gray-500">
                      {state.progress}%
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">{step.description}</p>
                
                {isActive && (
                  <Progress value={state.progress} className="h-1 mt-2" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Logs en tiempo real */}
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Logs del deployment:</h4>
        <DeploymentLogs logs={state.logs} maxHeight="200px" />
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between pt-4">
        {isDeploying ? (
          <Button variant="outline" onClick={cancelDeployment}>
            Cancelar Deployment
          </Button>
        ) : (
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        )}
        
        {!isDeploying && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                const logsText = state.logs.join('\n')
                const blob = new Blob([logsText], { type: 'text/plain' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `deployment-logs-${new Date().toISOString()}.txt`
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar Logs
            </Button>
            
            {state.deploymentUrl && (
              <Button
                onClick={() => window.open(state.deploymentUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Sitio
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )

  /**
   * Renderiza la vista de resultado
   */
  const renderResultView = () => (
    <div className="space-y-6">
      <div className="text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-green-700">
              ¡Deployment Exitoso!
            </h3>
            <p className="text-gray-600">
              La aplicación se desplegó correctamente a producción
            </p>
          </>
        ) : (
          <>
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-700">
              Deployment Falló
            </h3>
            <p className="text-gray-600">
              Ocurrió un error durante el proceso de deployment
            </p>
          </>
        )}
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Error:</h4>
          <p className="text-sm text-red-700">{state.error}</p>
        </div>
      )}

      {state.deploymentUrl && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">URL de producción:</h4>
          <div className="flex items-center justify-between">
            <code className="text-sm text-green-700 bg-white px-2 py-1 rounded">
              {state.deploymentUrl}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(state.deploymentUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
        
        <div className="flex space-x-2">
          {hasError && (
            <Button
              variant="outline"
              onClick={() => {
                reset()
                setCurrentView('config')
              }}
            >
              Intentar de Nuevo
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => {
              const logsText = state.logs.join('\n')
              const blob = new Blob([logsText], { type: 'text/plain' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `deployment-logs-${new Date().toISOString()}.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar Logs
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Deployment a Producción</DialogTitle>
              <DialogDescription>
                Sistema de deployment automatizado para el CRM Tinto del Mirador
              </DialogDescription>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'config' | 'logs' | 'history')}>
          <div className="px-6 pb-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configuración</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Logs</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Historial</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="max-h-[calc(90vh-180px)]">
            <div className="p-6 pt-2">
              <TabsContent value="config" className="mt-0">
                {currentView === 'config' && renderConfigView()}
                {currentView === 'confirm' && renderConfirmView()}
              </TabsContent>

              <TabsContent value="logs" className="mt-0">
                {(currentView === 'deploy' || currentView === 'result') && renderDeployView()}
                {currentView === 'result' && renderResultView()}
                {currentView === 'config' && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Los logs aparecerán aquí durante el deployment
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                {renderHistoryView()}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Hook personalizado para manejar el estado y lógica de deployment
 * CRM Tinto del Mirador
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  DeploymentState, 
  DeploymentStatus, 
  DeploymentConfig, 
  ValidationResult, 
  DeploymentStep,
  DeploymentLog
} from '@/types/deployment'
import { runCompleteDemo } from '@/lib/deployment/demo-deployment'
import { useToast } from '@/hooks/use-toast'

/**
 * Configuración del hook de deployment
 */
interface UseDeploymentOptions {
  onSuccess?: (deploymentUrl: string) => void
  onError?: (error: string) => void
  onStatusChange?: (status: DeploymentStatus) => void
  autoSaveLog?: boolean
}

/**
 * Hook principal para manejar deployments
 */
export function useDeployment(options: UseDeploymentOptions = {}) {
  const { toast } = useToast()
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // Estado principal del deployment
  const [state, setState] = useState<DeploymentState>({
    status: 'idle',
    progress: 0,
    validations: [],
    steps: [],
    logs: []
  })

  // Estado de configuración
  const [config, setConfig] = useState<DeploymentConfig | null>(null)

  /**
   * Actualiza el estado de forma segura
   */
  const updateState = useCallback((updates: Partial<DeploymentState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates }
      
      // Notificar cambio de status si es diferente
      if (updates.status && updates.status !== prev.status) {
        options.onStatusChange?.(updates.status)
      }
      
      return newState
    })
  }, [options])

  /**
   * Agrega un log al estado
   */
  const addLog = useCallback((message: string, type: 'info' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`
    
    updateState({
      logs: [...state.logs, logEntry]
    })
  }, [state.logs, updateState])

  /**
   * Actualiza un step específico
   */
  const updateStep = useCallback((stepId: string, updates: Partial<DeploymentStep>) => {
    setState(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      )
    }))
  }, [])

  /**
   * Ejecuta el deployment completo usando la versión demo
   */
  const runDemoDeployment = useCallback(async (deploymentConfig: DeploymentConfig) => {
    try {
      const deploymentUrl = await runCompleteDemo(deploymentConfig, {
        onStatusChange: (status) => {
          updateState({ status })
        },
        onValidationComplete: (validations) => {
          updateState({ validations, progress: 20 })
          addLog('Validaciones completadas exitosamente')
        },
        onStepProgress: (step) => {
          updateStep(step.id, step)

          // Actualizar progreso global basado en el paso actual
          let globalProgress = 0
          switch (step.id) {
            case 'build':
              globalProgress = 20 + (step.progress! * 0.3) // 20-50%
              break
            case 'deploy':
              globalProgress = 50 + (step.progress! * 0.3) // 50-80%
              break
            case 'health-checks':
              globalProgress = 80 + (step.progress! * 0.2) // 80-100%
              break
          }
          updateState({ progress: Math.round(globalProgress) })
        },
        onStepComplete: (step) => {
          updateStep(step.id, step)
          addLog(`Completado: ${step.name}`)
        },
        onLog: (step, log) => {
          updateStep(step.id, { logs: [...step.logs, log] })
          addLog(log.split('] ')[1] || log)
        },
        onComplete: (url) => {
          updateState({
            deploymentUrl: url,
            progress: 100,
            status: 'success'
          })
          addLog(`🎉 Deployment completado exitosamente: ${url}`)
        },
        onError: (error) => {
          updateState({ status: 'error', error })
          addLog(`Error en deployment: ${error}`, 'error')
        }
      })

      return deploymentUrl
    } catch (error: any) {
      addLog(`Error crítico en deployment: ${error.message}`, 'error')
      updateState({ status: 'error', error: error.message })
      throw error
    }
  }, [updateState, addLog, updateStep])

  // Las funciones anteriores se reemplazan por la versión demo

  /**
   * Ejecuta el proceso completo de deployment
   */
  const deploy = useCallback(async (deploymentConfig: DeploymentConfig) => {
    // Verificar si ya hay un deployment en progreso
    if (state.status !== 'idle' && state.status !== 'error' && state.status !== 'success') {
      toast({
        title: 'Deployment en progreso',
        description: 'Ya hay un deployment ejecutándose',
        variant: 'destructive'
      })
      return
    }

    // Configurar abort controller para cancelación
    abortControllerRef.current = new AbortController()

    // Inicializar estado
    setConfig(deploymentConfig)
    updateState({
      status: 'validating',
      progress: 0,
      validations: [],
      steps: [],
      logs: [],
      error: undefined,
      deploymentUrl: undefined,
      startTime: new Date()
    })

    try {
      // Ejecutar deployment demo completo
      const deploymentUrl = await runDemoDeployment(deploymentConfig)

      toast({
        title: 'Deployment exitoso',
        description: 'La aplicación se desplegó correctamente (demo)',
        variant: 'default'
      })

      options.onSuccess?.(deploymentUrl)
    } catch (error: any) {
      toast({
        title: 'Error en deployment',
        description: error.message,
        variant: 'destructive'
      })

      options.onError?.(error.message)
    }
  }, [
    state.status,
    toast,
    updateState,
    runDemoDeployment,
    options
  ])

  /**
   * Cancela el deployment en progreso
   */
  const cancelDeployment = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    updateState({ status: 'cancelled' })
    addLog('Deployment cancelado por el usuario', 'warning')
    
    toast({
      title: 'Deployment cancelado',
      description: 'El proceso de deployment fue cancelado',
      variant: 'default'
    })
  }, [updateState, addLog, toast])

  /**
   * Resetea el estado del deployment
   */
  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      validations: [],
      steps: [],
      logs: []
    })
    setConfig(null)
  }, [])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    // Estado
    state,
    config,
    
    // Acciones
    deploy,
    cancelDeployment,
    reset,
    
    // Utilidades
    isDeploying: state.status !== 'idle' && state.status !== 'success' && state.status !== 'error',
    canDeploy: state.status === 'idle' || state.status === 'success' || state.status === 'error',
    hasError: state.status === 'error',
    isSuccess: state.status === 'success'
  }
}

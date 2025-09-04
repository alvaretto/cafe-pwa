/**
 * Hook para gestionar configuraciones de deployment y wizard de setup
 * CRM Tinto del Mirador
 */

import { useState, useCallback, useEffect } from 'react'
import { 
  DeploymentConfig, 
  DeploymentSetupWizard, 
  HostingPlatform 
} from '@/types/deployment'
import { createDemoConfig } from '@/lib/deployment/demo-deployment'
import { useToast } from '@/hooks/use-toast'

/**
 * Configuración por defecto para el wizard
 */
const DEFAULT_WIZARD_STATE: DeploymentSetupWizard = {
  currentStep: 0,
  totalSteps: 5,
  completed: false,
  steps: {
    platform: {
      completed: false
    },
    authentication: {
      completed: false,
      tokenValidated: false
    },
    environment: {
      completed: false,
      variablesConfigured: false,
      requiredVariables: [
        'DATABASE_URL',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL',
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'GEMINI_API_KEY'
      ],
      missingVariables: []
    },
    testing: {
      completed: false,
      buildSuccessful: false,
      testsPass: false
    },
    deployment: {
      completed: false,
      firstDeploymentSuccessful: false
    }
  }
}

/**
 * Hook principal para configuración de deployment
 */
export function useDeploymentConfig() {
  const { toast } = useToast()
  
  // Estado del wizard
  const [wizard, setWizard] = useState<DeploymentSetupWizard>(DEFAULT_WIZARD_STATE)
  
  // Configuraciones guardadas
  const [configs, setConfigs] = useState<DeploymentConfig[]>([])
  const [activeConfig, setActiveConfig] = useState<DeploymentConfig | null>(null)
  
  // Estado de carga
  const [loading, setLoading] = useState(false)

  /**
   * Carga las configuraciones desde localStorage
   */
  const loadConfigs = useCallback(async () => {
    try {
      const saved = localStorage.getItem('deployment-configs')
      if (saved) {
        const parsedConfigs = JSON.parse(saved)
        setConfigs(parsedConfigs)
        
        // Buscar configuración activa
        const active = parsedConfigs.find((c: DeploymentConfig) => c.isDefault)
        if (active) {
          setActiveConfig(active)
        }
      }

      // Cargar estado del wizard
      const savedWizard = localStorage.getItem('deployment-wizard')
      if (savedWizard) {
        setWizard(JSON.parse(savedWizard))
      }
    } catch (error) {
      console.error('Error loading deployment configs:', error)
    }
  }, [])

  /**
   * Guarda las configuraciones en localStorage
   */
  const saveConfigs = useCallback((newConfigs: DeploymentConfig[]) => {
    try {
      localStorage.setItem('deployment-configs', JSON.stringify(newConfigs))
      setConfigs(newConfigs)
    } catch (error) {
      console.error('Error saving deployment configs:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron guardar las configuraciones',
        variant: 'destructive'
      })
    }
  }, [toast])

  /**
   * Guarda el estado del wizard
   */
  const saveWizardState = useCallback((newWizard: DeploymentSetupWizard) => {
    try {
      localStorage.setItem('deployment-wizard', JSON.stringify(newWizard))
      setWizard(newWizard)
    } catch (error) {
      console.error('Error saving wizard state:', error)
    }
  }, [])

  /**
   * Detecta automáticamente la plataforma de hosting (demo)
   */
  const detectPlatform = useCallback(async (): Promise<HostingPlatform | null> => {
    setLoading(true)

    try {
      // Simular detección
      await new Promise(resolve => setTimeout(resolve, 1000))
      const detected: HostingPlatform = 'vercel'

      toast({
        title: 'Plataforma detectada',
        description: `Se detectó configuración para ${detected} (demo)`,
        variant: 'default'
      })

      return detected
    } catch (error) {
      console.error('Error detecting platform:', error)
      return null
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Verifica si el CLI de una plataforma está instalado (demo)
   */
  const checkCLI = useCallback(async (platform: HostingPlatform): Promise<boolean> => {
    try {
      // Simular verificación
      await new Promise(resolve => setTimeout(resolve, 500))

      toast({
        title: 'CLI verificado',
        description: `CLI de ${platform} disponible (demo)`,
        variant: 'default'
      })

      return true
    } catch (error) {
      console.error('Error checking CLI:', error)
      return false
    }
  }, [toast])

  /**
   * Valida un token de autenticación
   */
  const validateToken = useCallback(async (
    platform: HostingPlatform, 
    token: string
  ): Promise<boolean> => {
    setLoading(true)
    
    try {
      // Aquí implementarías la validación específica para cada plataforma
      // Por ahora, simulamos la validación
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Validación básica: el token no debe estar vacío
      const isValid = token.trim().length > 0
      
      if (isValid) {
        toast({
          title: 'Token válido',
          description: `Autenticación con ${platform} exitosa`,
          variant: 'default'
        })
      } else {
        toast({
          title: 'Token inválido',
          description: 'El token proporcionado no es válido',
          variant: 'destructive'
        })
      }
      
      return isValid
    } catch (error) {
      console.error('Error validating token:', error)
      toast({
        title: 'Error de validación',
        description: 'No se pudo validar el token',
        variant: 'destructive'
      })
      return false
    } finally {
      setLoading(false)
    }
  }, [toast])

  /**
   * Verifica las variables de entorno requeridas
   */
  const checkEnvironmentVariables = useCallback((): { 
    configured: boolean
    missing: string[] 
  } => {
    const required = wizard.steps.environment.requiredVariables
    const missing: string[] = []
    
    for (const varName of required) {
      if (!process.env[varName] || process.env[varName]?.trim() === '') {
        missing.push(varName)
      }
    }
    
    return {
      configured: missing.length === 0,
      missing
    }
  }, [wizard.steps.environment.requiredVariables])

  /**
   * Crea una nueva configuración de deployment
   */
  const createConfig = useCallback((
    name: string,
    platform: HostingPlatform,
    settings: DeploymentConfig['settings']
  ): DeploymentConfig => {
    const config: DeploymentConfig = {
      id: `config-${Date.now()}`,
      name,
      platform,
      isDefault: configs.length === 0, // Primera configuración es default
      settings,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const newConfigs = [...configs, config]
    saveConfigs(newConfigs)
    
    if (config.isDefault) {
      setActiveConfig(config)
    }
    
    toast({
      title: 'Configuración creada',
      description: `Configuración "${name}" creada exitosamente`,
      variant: 'default'
    })
    
    return config
  }, [configs, saveConfigs, toast])

  /**
   * Actualiza una configuración existente
   */
  const updateConfig = useCallback((
    id: string, 
    updates: Partial<DeploymentConfig>
  ) => {
    const newConfigs = configs.map(config => 
      config.id === id 
        ? { ...config, ...updates, updatedAt: new Date() }
        : config
    )
    
    saveConfigs(newConfigs)
    
    // Actualizar configuración activa si es la que se está editando
    if (activeConfig?.id === id) {
      const updated = newConfigs.find(c => c.id === id)
      if (updated) {
        setActiveConfig(updated)
      }
    }
    
    toast({
      title: 'Configuración actualizada',
      description: 'Los cambios se guardaron correctamente',
      variant: 'default'
    })
  }, [configs, activeConfig, saveConfigs, toast])

  /**
   * Elimina una configuración
   */
  const deleteConfig = useCallback((id: string) => {
    const configToDelete = configs.find(c => c.id === id)
    if (!configToDelete) return
    
    const newConfigs = configs.filter(c => c.id !== id)
    
    // Si eliminamos la configuración activa, seleccionar otra
    if (activeConfig?.id === id) {
      const newActive = newConfigs.find(c => c.isDefault) || newConfigs[0] || null
      setActiveConfig(newActive)
    }
    
    saveConfigs(newConfigs)
    
    toast({
      title: 'Configuración eliminada',
      description: `Configuración "${configToDelete.name}" eliminada`,
      variant: 'default'
    })
  }, [configs, activeConfig, saveConfigs, toast])

  /**
   * Establece una configuración como predeterminada
   */
  const setDefaultConfig = useCallback((id: string) => {
    const newConfigs = configs.map(config => ({
      ...config,
      isDefault: config.id === id,
      updatedAt: config.id === id ? new Date() : config.updatedAt
    }))
    
    saveConfigs(newConfigs)
    
    const newActive = newConfigs.find(c => c.id === id)
    if (newActive) {
      setActiveConfig(newActive)
    }
    
    toast({
      title: 'Configuración predeterminada',
      description: 'Configuración establecida como predeterminada',
      variant: 'default'
    })
  }, [configs, saveConfigs, toast])

  /**
   * Avanza al siguiente paso del wizard
   */
  const nextWizardStep = useCallback(() => {
    if (wizard.currentStep < wizard.totalSteps - 1) {
      const newWizard = {
        ...wizard,
        currentStep: wizard.currentStep + 1
      }
      saveWizardState(newWizard)
    }
  }, [wizard, saveWizardState])

  /**
   * Retrocede al paso anterior del wizard
   */
  const previousWizardStep = useCallback(() => {
    if (wizard.currentStep > 0) {
      const newWizard = {
        ...wizard,
        currentStep: wizard.currentStep - 1
      }
      saveWizardState(newWizard)
    }
  }, [wizard, saveWizardState])

  /**
   * Actualiza un paso específico del wizard
   */
  const updateWizardStep = useCallback((
    stepName: keyof DeploymentSetupWizard['steps'],
    updates: Partial<DeploymentSetupWizard['steps'][typeof stepName]>
  ) => {
    const newWizard = {
      ...wizard,
      steps: {
        ...wizard.steps,
        [stepName]: {
          ...wizard.steps[stepName],
          ...updates
        }
      }
    }
    
    saveWizardState(newWizard)
  }, [wizard, saveWizardState])

  /**
   * Completa el wizard
   */
  const completeWizard = useCallback(() => {
    const newWizard = {
      ...wizard,
      completed: true,
      currentStep: wizard.totalSteps - 1
    }
    
    saveWizardState(newWizard)
    
    toast({
      title: 'Configuración completada',
      description: 'El sistema de deployment está listo para usar',
      variant: 'default'
    })
  }, [wizard, saveWizardState, toast])

  /**
   * Reinicia el wizard
   */
  const resetWizard = useCallback(() => {
    saveWizardState(DEFAULT_WIZARD_STATE)
    
    toast({
      title: 'Wizard reiniciado',
      description: 'Puedes volver a configurar el deployment',
      variant: 'default'
    })
  }, [saveWizardState, toast])

  // Cargar configuraciones al montar
  useEffect(() => {
    loadConfigs()

    // Si no hay configuraciones, crear una demo por defecto
    if (configs.length === 0) {
      const demoConfig = createDemoConfig()
      setConfigs([demoConfig])
      setActiveConfig(demoConfig)
    }
  }, [loadConfigs, configs.length])

  // Verificar variables de entorno cuando cambie el wizard
  useEffect(() => {
    const envCheck = checkEnvironmentVariables()
    
    if (envCheck.missing.length !== wizard.steps.environment.missingVariables.length) {
      updateWizardStep('environment', {
        variablesConfigured: envCheck.configured,
        missingVariables: envCheck.missing
      })
    }
  }, [wizard.steps.environment.missingVariables.length, checkEnvironmentVariables, updateWizardStep])

  return {
    // Estado
    wizard,
    configs,
    activeConfig,
    loading,
    
    // Configuraciones
    createConfig,
    updateConfig,
    deleteConfig,
    setDefaultConfig,
    
    // Wizard
    nextWizardStep,
    previousWizardStep,
    updateWizardStep,
    completeWizard,
    resetWizard,
    
    // Utilidades
    detectPlatform,
    checkCLI,
    validateToken,
    checkEnvironmentVariables,
    
    // Estado computado
    hasConfigs: configs.length > 0,
    isWizardCompleted: wizard.completed,
    canDeploy: wizard.completed && activeConfig !== null
  }
}

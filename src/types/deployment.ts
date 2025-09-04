/**
 * Tipos TypeScript para el sistema de deployment automatizado
 * CRM Tinto del Mirador
 */

// Estados del proceso de deployment
export type DeploymentStatus = 
  | 'idle'
  | 'validating'
  | 'building'
  | 'testing'
  | 'deploying'
  | 'success'
  | 'error'
  | 'cancelled'

// Tipos de validación pre-deployment
export type ValidationType = 
  | 'git-status'
  | 'git-branch'
  | 'dependencies'
  | 'environment'
  | 'services'
  | 'database'
  | 'build-test'

// Estado de una validación individual
export interface ValidationResult {
  type: ValidationType
  status: 'pending' | 'running' | 'success' | 'error' | 'warning'
  message: string
  details?: string
  timestamp: Date
}

// Plataformas de hosting soportadas
export type HostingPlatform = 'vercel' | 'netlify' | 'manual'

// Configuración de deployment
export interface DeploymentConfig {
  id: string
  name: string
  platform: HostingPlatform
  isDefault: boolean
  settings: {
    // Configuración específica de Vercel
    vercel?: {
      token: string
      projectId?: string
      teamId?: string
      domain?: string
    }
    // Configuración específica de Netlify
    netlify?: {
      token: string
      siteId?: string
      domain?: string
    }
    // Variables de entorno específicas para producción
    environmentVariables: Record<string, string>
    // Configuraciones de build
    buildCommand?: string
    outputDirectory?: string
    installCommand?: string
  }
  createdAt: Date
  updatedAt: Date
}

// Etapas del proceso de deployment
export interface DeploymentStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'success' | 'error' | 'skipped'
  startTime?: Date
  endTime?: Date
  duration?: number
  logs: string[]
  progress?: number // 0-100
}

// Log de deployment
export interface DeploymentLog {
  id: string
  userId: string
  status: DeploymentStatus
  platform: HostingPlatform
  configId: string
  startedAt: Date
  completedAt?: Date
  duration?: number
  commitHash?: string
  branch: string
  deploymentUrl?: string
  buildId?: string
  steps: DeploymentStep[]
  validations: ValidationResult[]
  logs: string[]
  error?: {
    code: string
    message: string
    stack?: string
    step?: string
  }
  metadata: {
    nodeVersion: string
    npmVersion: string
    nextVersion: string
    buildSize?: number
    bundleAnalysis?: {
      totalSize: number
      jsSize: number
      cssSize: number
      imageSize: number
    }
  }
}

// Estado global del deployment
export interface DeploymentState {
  status: DeploymentStatus
  currentStep?: string
  progress: number
  config?: DeploymentConfig
  validations: ValidationResult[]
  steps: DeploymentStep[]
  logs: string[]
  error?: string
  deploymentUrl?: string
  startTime?: Date
  estimatedTimeRemaining?: number
}

// Configuración de health check
export interface HealthCheckConfig {
  url: string
  timeout: number
  retries: number
  interval: number
  expectedStatus: number
  expectedContent?: string
}

// Resultado de health check
export interface HealthCheckResult {
  success: boolean
  status: number
  responseTime: number
  error?: string
  timestamp: Date
}

// Configuración de notificaciones
export interface NotificationConfig {
  email: {
    enabled: boolean
    recipients: string[]
    onSuccess: boolean
    onError: boolean
  }
  slack?: {
    enabled: boolean
    webhookUrl: string
    channel: string
  }
  discord?: {
    enabled: boolean
    webhookUrl: string
  }
}

// Configuración de rollback
export interface RollbackConfig {
  enabled: boolean
  autoRollback: boolean
  healthCheckTimeout: number
  previousDeploymentId?: string
}

// Configuración completa del wizard de setup
export interface DeploymentSetupWizard {
  currentStep: number
  totalSteps: number
  completed: boolean
  steps: {
    platform: {
      completed: boolean
      selectedPlatform?: HostingPlatform
    }
    authentication: {
      completed: boolean
      tokenValidated: boolean
    }
    environment: {
      completed: boolean
      variablesConfigured: boolean
      requiredVariables: string[]
      missingVariables: string[]
    }
    testing: {
      completed: boolean
      buildSuccessful: boolean
      testsPass: boolean
    }
    deployment: {
      completed: boolean
      firstDeploymentSuccessful: boolean
    }
  }
}

// Tipos para comandos de CLI
export interface CLICommand {
  command: string
  args: string[]
  cwd: string
  timeout?: number
  env?: Record<string, string>
}

// Resultado de ejecución de comando
export interface CLIResult {
  success: boolean
  exitCode: number
  stdout: string
  stderr: string
  duration: number
  command: string
}

// Configuración de rate limiting
export interface RateLimitConfig {
  maxDeploymentsPerHour: number
  maxDeploymentsPerDay: number
  cooldownPeriod: number // en minutos
}

// Información del usuario para deployment
export interface DeploymentUser {
  id: string
  email: string
  role: 'ADMIN' | 'VENDEDOR'
  lastDeployment?: Date
  deploymentsToday: number
  deploymentsThisHour: number
}

// Configuración de seguridad
export interface SecurityConfig {
  requireReauth: boolean
  reauthTimeout: number // en minutos
  requireConfirmation: boolean
  allowedBranches: string[]
  blockedFiles: string[]
}

// Métricas de deployment
export interface DeploymentMetrics {
  totalDeployments: number
  successfulDeployments: number
  failedDeployments: number
  averageDuration: number
  lastDeployment?: Date
  deploymentFrequency: {
    daily: number
    weekly: number
    monthly: number
  }
  errorRates: {
    buildErrors: number
    deploymentErrors: number
    healthCheckErrors: number
  }
}

// Configuración de backup
export interface BackupConfig {
  enabled: boolean
  retentionDays: number
  includeDatabase: boolean
  includeUploads: boolean
  storageLocation: string
}

// Tipos para webhooks
export interface WebhookConfig {
  url: string
  secret?: string
  events: ('deployment.started' | 'deployment.completed' | 'deployment.failed')[]
  headers?: Record<string, string>
}

// Payload de webhook
export interface WebhookPayload {
  event: string
  deployment: {
    id: string
    status: DeploymentStatus
    platform: HostingPlatform
    url?: string
    duration?: number
    error?: string
  }
  user: {
    id: string
    email: string
  }
  timestamp: Date
}

// Configuración de monitoreo
export interface MonitoringConfig {
  enabled: boolean
  healthChecks: HealthCheckConfig[]
  alerting: {
    email: string[]
    slack?: string
    thresholds: {
      responseTime: number
      errorRate: number
      uptime: number
    }
  }
}

// Tipos para análisis de bundle
export interface BundleAnalysis {
  totalSize: number
  gzippedSize: number
  files: {
    path: string
    size: number
    gzippedSize: number
    type: 'js' | 'css' | 'html' | 'image' | 'font' | 'other'
  }[]
  chunks: {
    name: string
    size: number
    files: string[]
  }[]
  warnings: string[]
  recommendations: string[]
}

// Configuración de optimización
export interface OptimizationConfig {
  minifyJs: boolean
  minifyCss: boolean
  optimizeImages: boolean
  generateSourceMaps: boolean
  bundleAnalysis: boolean
  treeshaking: boolean
}

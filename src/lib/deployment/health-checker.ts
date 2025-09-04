/**
 * Sistema de Health Checks para verificaciones post-deployment
 * CRM Tinto del Mirador
 */

import { HealthCheckConfig, HealthCheckResult, DeploymentStep } from '@/types/deployment'

/**
 * Interfaz para callbacks de health checks
 */
interface HealthCheckCallbacks {
  onCheckStart?: (check: HealthCheckConfig) => void
  onCheckComplete?: (check: HealthCheckConfig, result: HealthCheckResult) => void
  onCheckError?: (check: HealthCheckConfig, error: string) => void
  onProgress?: (current: number, total: number) => void
}

/**
 * Clase principal para ejecutar health checks
 */
export class HealthChecker {
  private callbacks: HealthCheckCallbacks

  constructor(callbacks: HealthCheckCallbacks = {}) {
    this.callbacks = callbacks
  }

  /**
   * Ejecuta un health check individual
   */
  async runHealthCheck(config: HealthCheckConfig): Promise<HealthCheckResult> {
    this.callbacks.onCheckStart?.(config)

    const startTime = Date.now()
    let attempt = 0

    while (attempt < config.retries) {
      try {
        const result = await this.performCheck(config)
        
        if (result.success) {
          this.callbacks.onCheckComplete?.(config, result)
          return result
        }

        attempt++
        
        // Esperar antes del siguiente intento (excepto en el último)
        if (attempt < config.retries) {
          await this.sleep(config.interval)
        }
      } catch (error: any) {
        attempt++
        
        if (attempt >= config.retries) {
          const failedResult: HealthCheckResult = {
            success: false,
            status: 0,
            responseTime: Date.now() - startTime,
            error: error.message,
            timestamp: new Date()
          }
          
          this.callbacks.onCheckError?.(config, error.message)
          return failedResult
        }
        
        // Esperar antes del siguiente intento
        await this.sleep(config.interval)
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    const failedResult: HealthCheckResult = {
      success: false,
      status: 0,
      responseTime: Date.now() - startTime,
      error: `Failed after ${config.retries} attempts`,
      timestamp: new Date()
    }

    this.callbacks.onCheckError?.(config, `Failed after ${config.retries} attempts`)
    return failedResult
  }

  /**
   * Ejecuta múltiples health checks
   */
  async runHealthChecks(configs: HealthCheckConfig[]): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = []

    for (let i = 0; i < configs.length; i++) {
      this.callbacks.onProgress?.(i + 1, configs.length)
      
      const result = await this.runHealthCheck(configs[i])
      results.push(result)

      // Si un check crítico falla, podemos decidir parar
      if (!result.success && this.isCriticalCheck(configs[i])) {
        console.warn(`Critical health check failed: ${configs[i].url}`)
      }
    }

    return results
  }

  /**
   * Realiza el check HTTP real
   */
  private async performCheck(config: HealthCheckConfig): Promise<HealthCheckResult> {
    const startTime = Date.now()
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), config.timeout)

      const response = await fetch(config.url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Tinto-del-Mirador-CRM-HealthChecker/1.0',
          'Accept': 'text/html,application/json,*/*'
        }
      })

      clearTimeout(timeoutId)
      
      const responseTime = Date.now() - startTime
      const success = response.status === config.expectedStatus

      // Verificar contenido si se especifica
      let contentCheck = true
      if (config.expectedContent && success) {
        try {
          const text = await response.text()
          contentCheck = text.includes(config.expectedContent)
        } catch {
          contentCheck = false
        }
      }

      return {
        success: success && contentCheck,
        status: response.status,
        responseTime,
        error: success && contentCheck ? undefined : `Expected status ${config.expectedStatus}, got ${response.status}`,
        timestamp: new Date()
      }
    } catch (error: any) {
      return {
        success: false,
        status: 0,
        responseTime: Date.now() - startTime,
        error: error.name === 'AbortError' ? 'Request timeout' : error.message,
        timestamp: new Date()
      }
    }
  }

  /**
   * Determina si un check es crítico
   */
  private isCriticalCheck(config: HealthCheckConfig): boolean {
    // Los checks de la página principal y API son críticos
    return config.url.includes('/api/') || 
           config.url.endsWith('/') || 
           config.url.includes('/dashboard')
  }

  /**
   * Utilidad para esperar
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

/**
 * Configuraciones predeterminadas de health checks para el CRM
 */
export function getDefaultHealthChecks(baseUrl: string): HealthCheckConfig[] {
  return [
    {
      url: baseUrl,
      timeout: 10000,
      retries: 3,
      interval: 2000,
      expectedStatus: 200,
      expectedContent: 'Tinto del Mirador'
    },
    {
      url: `${baseUrl}/dashboard`,
      timeout: 15000,
      retries: 3,
      interval: 2000,
      expectedStatus: 200,
      expectedContent: 'Dashboard'
    },
    {
      url: `${baseUrl}/api/health`,
      timeout: 5000,
      retries: 2,
      interval: 1000,
      expectedStatus: 200
    },
    {
      url: `${baseUrl}/productos`,
      timeout: 10000,
      retries: 2,
      interval: 2000,
      expectedStatus: 200
    },
    {
      url: `${baseUrl}/ventas`,
      timeout: 10000,
      retries: 2,
      interval: 2000,
      expectedStatus: 200
    }
  ]
}

/**
 * Ejecuta health checks como parte del proceso de deployment
 */
export async function runPostDeploymentHealthChecks(
  deploymentUrl: string,
  callbacks: {
    onStepStart?: (step: DeploymentStep) => void
    onStepProgress?: (step: DeploymentStep, progress: number) => void
    onStepComplete?: (step: DeploymentStep) => void
    onStepError?: (step: DeploymentStep, error: string) => void
    onLog?: (step: DeploymentStep, log: string) => void
  } = {}
): Promise<DeploymentStep> {
  const step: DeploymentStep = {
    id: 'health-checks',
    name: 'Verificaciones de Salud',
    description: 'Verificando que la aplicación funcione correctamente',
    status: 'running',
    startTime: new Date(),
    logs: [],
    progress: 0
  }

  callbacks.onStepStart?.(step)

  try {
    const healthChecks = getDefaultHealthChecks(deploymentUrl)
    const checker = new HealthChecker({
      onCheckStart: (check) => {
        const log = `Verificando: ${check.url}`
        step.logs.push(log)
        callbacks.onLog?.(step, log)
      },
      onCheckComplete: (check, result) => {
        const log = `✓ ${check.url} - ${result.responseTime}ms (${result.status})`
        step.logs.push(log)
        callbacks.onLog?.(step, log)
      },
      onCheckError: (check, error) => {
        const log = `✗ ${check.url} - Error: ${error}`
        step.logs.push(log)
        callbacks.onLog?.(step, log)
      },
      onProgress: (current, total) => {
        const progress = Math.round((current / total) * 100)
        step.progress = progress
        callbacks.onStepProgress?.(step, progress)
      }
    })

    const results = await checker.runHealthChecks(healthChecks)
    
    step.endTime = new Date()
    step.duration = step.endTime.getTime() - step.startTime!.getTime()

    // Analizar resultados
    const failedChecks = results.filter(r => !r.success)
    const criticalFailures = failedChecks.filter((_, index) => 
      checker['isCriticalCheck'](healthChecks[index])
    )

    if (criticalFailures.length > 0) {
      step.status = 'error'
      const errorMsg = `${criticalFailures.length} verificación(es) crítica(s) fallaron`
      step.logs.push(errorMsg)
      callbacks.onStepError?.(step, errorMsg)
    } else if (failedChecks.length > 0) {
      step.status = 'success' // Éxito con advertencias
      const warningMsg = `${failedChecks.length} verificación(es) no crítica(s) fallaron`
      step.logs.push(`⚠️ ${warningMsg}`)
      callbacks.onLog?.(step, `⚠️ ${warningMsg}`)
      callbacks.onStepComplete?.(step)
    } else {
      step.status = 'success'
      step.progress = 100
      const successMsg = `Todas las verificaciones pasaron exitosamente`
      step.logs.push(`✅ ${successMsg}`)
      callbacks.onLog?.(step, `✅ ${successMsg}`)
      callbacks.onStepComplete?.(step)
    }

    return step
  } catch (error: any) {
    step.endTime = new Date()
    step.duration = step.endTime.getTime() - step.startTime!.getTime()
    step.status = 'error'
    
    const errorMsg = `Error en verificaciones de salud: ${error.message}`
    step.logs.push(errorMsg)
    callbacks.onStepError?.(step, errorMsg)
    
    return step
  }
}

/**
 * Crea un endpoint de health check para la aplicación
 */
export function createHealthCheckEndpoint() {
  return {
    path: '/api/health',
    handler: async () => {
      try {
        // Verificar conexión a base de datos
        const { PrismaClient } = await import('@prisma/client')
        const prisma = new PrismaClient()
        
        await prisma.$queryRaw`SELECT 1`
        await prisma.$disconnect()

        // Verificar servicios externos críticos
        const services = await Promise.allSettled([
          // Firebase
          fetch('https://firebase.googleapis.com', { method: 'HEAD' }),
          // Gemini AI (si está configurado)
          process.env.GEMINI_API_KEY ? 
            fetch('https://generativelanguage.googleapis.com', { method: 'HEAD' }) : 
            Promise.resolve()
        ])

        const serviceStatus = services.map(result => result.status === 'fulfilled')
        const allServicesOk = serviceStatus.every(status => status)

        return {
          status: 'ok',
          timestamp: new Date().toISOString(),
          version: process.env.npm_package_version || '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          database: 'connected',
          services: {
            firebase: serviceStatus[0] ? 'ok' : 'error',
            gemini: serviceStatus[1] ? 'ok' : 'error'
          },
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          healthy: allServicesOk
        }
      } catch (error: any) {
        return {
          status: 'error',
          timestamp: new Date().toISOString(),
          error: error.message,
          healthy: false
        }
      }
    }
  }
}

/**
 * Monitorea la salud de la aplicación continuamente
 */
export class ContinuousHealthMonitor {
  private interval: NodeJS.Timeout | null = null
  private isRunning = false

  constructor(
    private url: string,
    private intervalMs: number = 60000, // 1 minuto por defecto
    private onHealthChange?: (healthy: boolean, result: HealthCheckResult) => void
  ) {}

  start() {
    if (this.isRunning) return

    this.isRunning = true
    
    const check = async () => {
      const checker = new HealthChecker()
      const config: HealthCheckConfig = {
        url: `${this.url}/api/health`,
        timeout: 10000,
        retries: 2,
        interval: 1000,
        expectedStatus: 200
      }

      const result = await checker.runHealthCheck(config)
      this.onHealthChange?.(result.success, result)
    }

    // Ejecutar check inicial
    check()

    // Programar checks periódicos
    this.interval = setInterval(check, this.intervalMs)
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.isRunning = false
  }

  isMonitoring(): boolean {
    return this.isRunning
  }
}

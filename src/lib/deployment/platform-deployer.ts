/**
 * Integración con plataformas de hosting para deployment automatizado
 * CRM Tinto del Mirador
 */

import { DeploymentStep, DeploymentConfig, HostingPlatform, CLICommand, CLIResult } from '@/types/deployment'

// Detectar si estamos en el cliente
const isClient = typeof window !== 'undefined'

/**
 * Interfaz para callbacks de deployment
 */
interface DeploymentCallbacks {
  onStepStart?: (step: DeploymentStep) => void
  onStepProgress?: (step: DeploymentStep, progress: number) => void
  onStepComplete?: (step: DeploymentStep) => void
  onStepError?: (step: DeploymentStep, error: string) => void
  onLog?: (step: DeploymentStep, log: string) => void
}

/**
 * Clase base para deployers de plataformas
 */
abstract class PlatformDeployer {
  protected config: DeploymentConfig
  protected callbacks: DeploymentCallbacks

  constructor(config: DeploymentConfig, callbacks: DeploymentCallbacks = {}) {
    this.config = config
    this.callbacks = callbacks
  }

  abstract checkCLI(): Promise<boolean>
  abstract authenticate(): Promise<boolean>
  abstract deploy(): Promise<DeploymentStep>
  abstract setEnvironmentVariables(): Promise<boolean>
  abstract getDeploymentUrl(): Promise<string | null>

  protected async executeCommand(
    command: CLICommand,
    step: DeploymentStep,
    progressPattern?: RegExp
  ): Promise<CLIResult> {
    const startTime = Date.now()

    if (isClient) {
      // Simulación para el cliente
      return this.simulateCommand(command, step, startTime)
    }

    // Implementación real para el servidor
    return this.executeRealCommand(command, step, progressPattern, startTime)
  }

  private async simulateCommand(
    command: CLICommand,
    step: DeploymentStep,
    startTime: number
  ): Promise<CLIResult> {
    const cmdString = `${command.command} ${command.args.join(' ')}`

    // Simular progreso
    const steps = [
      'Iniciando deployment...',
      'Subiendo archivos...',
      'Configurando variables de entorno...',
      'Ejecutando build en la plataforma...',
      'Deployment completado exitosamente'
    ]

    for (let i = 0; i < steps.length; i++) {
      const progress = Math.round(((i + 1) / steps.length) * 100)
      const message = `[${new Date().toISOString()}] ${steps[i]}`

      step.logs.push(message)
      step.progress = progress

      this.callbacks.onLog?.(step, message)
      this.callbacks.onStepProgress?.(step, progress)

      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000))
    }

    // Simular URL de deployment
    const deploymentUrl = `https://tinto-del-mirador-${Date.now()}.vercel.app`
    step.logs.push(`Deployment URL: ${deploymentUrl}`)

    return {
      success: true,
      exitCode: 0,
      stdout: `Deployment successful!\nURL: ${deploymentUrl}`,
      stderr: '',
      duration: Date.now() - startTime,
      command: cmdString
    }
  }

  private async executeRealCommand(
    command: CLICommand,
    step: DeploymentStep,
    progressPattern: RegExp | undefined,
    startTime: number
  ): Promise<CLIResult> {
    try {
      const { spawn } = await import('child_process')

      return new Promise((resolve) => {
        const childProcess = spawn(command.command, command.args, {
          cwd: command.cwd,
          env: { ...process.env, ...command.env },
          stdio: ['pipe', 'pipe', 'pipe']
        })

        let stdout = ''
        let stderr = ''

        // Timeout handling
        const timeout = command.timeout || 600000 // 10 minutos por defecto
        const timeoutId = setTimeout(() => {
          childProcess.kill('SIGTERM')
          resolve({
            success: false,
            exitCode: -1,
            stdout,
            stderr: stderr + '\nError: Command timed out',
            duration: Date.now() - startTime,
            command: `${command.command} ${command.args.join(' ')}`
          })
        }, timeout)

        // Handle stdout
        childProcess.stdout?.on('data', (data: Buffer) => {
          const text = data.toString()
          stdout += text
          step.logs.push(text)
          this.callbacks.onLog?.(step, text)

          // Detectar progreso si se proporciona un patrón
          if (progressPattern) {
            const match = text.match(progressPattern)
            if (match && match[1]) {
              const progress = parseInt(match[1])
              step.progress = Math.min(progress, 100)
              this.callbacks.onStepProgress?.(step, step.progress)
            }
          }
        })

        // Handle stderr
        childProcess.stderr?.on('data', (data: Buffer) => {
          const text = data.toString()
          stderr += text
          step.logs.push(`[ERROR] ${text}`)
          this.callbacks.onLog?.(step, `[ERROR] ${text}`)
        })

        // Handle process completion
        childProcess.on('close', (code) => {
          clearTimeout(timeoutId)
          resolve({
            success: code === 0,
            exitCode: code || 0,
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            duration: Date.now() - startTime,
            command: `${command.command} ${command.args.join(' ')}`
          })
        })

        // Handle process errors
        process.on('error', (error) => {
          clearTimeout(timeoutId)
          resolve({
            success: false,
            exitCode: -1,
            stdout,
            stderr: stderr + '\n' + error.message,
            duration: Date.now() - startTime,
            command: `${command.command} ${command.args.join(' ')}`
          })
        })
      })
    } catch (error: any) {
      return {
        success: false,
        exitCode: -1,
        stdout: '',
        stderr: error.message,
        duration: Date.now() - startTime,
        command: `${command.command} ${command.args.join(' ')}`
      }
    }
  }
}

/**
 * Deployer para Vercel
 */
export class VercelDeployer extends PlatformDeployer {
  async checkCLI(): Promise<boolean> {
    try {
      const result = await this.executeCommand(
        {
          command: 'vercel',
          args: ['--version'],
          cwd: process.cwd()
        },
        { id: 'check-cli', name: 'Check CLI', description: '', status: 'running', logs: [] }
      )
      return result.success
    } catch {
      return false
    }
  }

  async authenticate(): Promise<boolean> {
    if (!this.config.settings.vercel?.token) {
      return false
    }

    try {
      const result = await this.executeCommand(
        {
          command: 'vercel',
          args: ['whoami'],
          cwd: process.cwd(),
          env: {
            VERCEL_TOKEN: this.config.settings.vercel.token
          }
        },
        { id: 'auth', name: 'Authentication', description: '', status: 'running', logs: [] }
      )
      return result.success
    } catch {
      return false
    }
  }

  async deploy(): Promise<DeploymentStep> {
    const step: DeploymentStep = {
      id: 'vercel-deploy',
      name: 'Deployment a Vercel',
      description: 'Desplegando aplicación a Vercel',
      status: 'running',
      startTime: new Date(),
      logs: [],
      progress: 0
    }

    this.callbacks.onStepStart?.(step)

    try {
      // Preparar argumentos de deployment
      const args = ['--prod', '--yes']
      
      if (this.config.settings.vercel?.projectId) {
        args.push('--scope', this.config.settings.vercel.projectId)
      }

      const result = await this.executeCommand(
        {
          command: 'vercel',
          args,
          cwd: process.cwd(),
          timeout: 900000, // 15 minutos
          env: {
            VERCEL_TOKEN: this.config.settings.vercel?.token || '',
            VERCEL_PROJECT_ID: this.config.settings.vercel?.projectId || '',
            VERCEL_TEAM_ID: this.config.settings.vercel?.teamId || ''
          }
        },
        step,
        /Building.*?(\d+)%/ // Patrón para detectar progreso
      )

      step.endTime = new Date()
      step.duration = step.endTime.getTime() - step.startTime!.getTime()

      if (result.success) {
        step.status = 'success'
        step.progress = 100
        
        // Extraer URL de deployment del output
        const urlMatch = result.stdout.match(/https:\/\/[^\s]+\.vercel\.app/i)
        if (urlMatch) {
          step.logs.push(`Deployment URL: ${urlMatch[0]}`)
        }
        
        this.callbacks.onStepComplete?.(step)
      } else {
        step.status = 'error'
        const errorMsg = `Vercel deployment failed: ${result.stderr || result.stdout}`
        this.callbacks.onStepError?.(step, errorMsg)
      }

      return step
    } catch (error: any) {
      step.endTime = new Date()
      step.duration = step.endTime.getTime() - step.startTime!.getTime()
      step.status = 'error'
      
      const errorMsg = `Vercel deployment error: ${error.message}`
      this.callbacks.onStepError?.(step, errorMsg)
      
      return step
    }
  }

  async setEnvironmentVariables(): Promise<boolean> {
    if (!this.config.settings.environmentVariables || 
        Object.keys(this.config.settings.environmentVariables).length === 0) {
      return true // No hay variables que configurar
    }

    try {
      for (const [key, value] of Object.entries(this.config.settings.environmentVariables)) {
        const result = await this.executeCommand(
          {
            command: 'vercel',
            args: ['env', 'add', key, 'production'],
            cwd: process.cwd(),
            env: {
              VERCEL_TOKEN: this.config.settings.vercel?.token || ''
            }
          },
          { id: 'env-vars', name: 'Environment Variables', description: '', status: 'running', logs: [] }
        )

        if (!result.success) {
          console.error(`Failed to set environment variable ${key}:`, result.stderr)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error setting environment variables:', error)
      return false
    }
  }

  async getDeploymentUrl(): Promise<string | null> {
    try {
      const result = await this.executeCommand(
        {
          command: 'vercel',
          args: ['ls', '--limit', '1'],
          cwd: process.cwd(),
          env: {
            VERCEL_TOKEN: this.config.settings.vercel?.token || ''
          }
        },
        { id: 'get-url', name: 'Get URL', description: '', status: 'running', logs: [] }
      )

      if (result.success) {
        // Extraer URL del output
        const urlMatch = result.stdout.match(/https:\/\/[^\s]+\.vercel\.app/i)
        return urlMatch ? urlMatch[0] : null
      }

      return null
    } catch {
      return null
    }
  }
}

/**
 * Deployer para Netlify
 */
export class NetlifyDeployer extends PlatformDeployer {
  async checkCLI(): Promise<boolean> {
    try {
      const result = await this.executeCommand(
        {
          command: 'netlify',
          args: ['--version'],
          cwd: process.cwd()
        },
        { id: 'check-cli', name: 'Check CLI', description: '', status: 'running', logs: [] }
      )
      return result.success
    } catch {
      return false
    }
  }

  async authenticate(): Promise<boolean> {
    if (!this.config.settings.netlify?.token) {
      return false
    }

    try {
      const result = await this.executeCommand(
        {
          command: 'netlify',
          args: ['status'],
          cwd: process.cwd(),
          env: {
            NETLIFY_AUTH_TOKEN: this.config.settings.netlify.token
          }
        },
        { id: 'auth', name: 'Authentication', description: '', status: 'running', logs: [] }
      )
      return result.success
    } catch {
      return false
    }
  }

  async deploy(): Promise<DeploymentStep> {
    const step: DeploymentStep = {
      id: 'netlify-deploy',
      name: 'Deployment a Netlify',
      description: 'Desplegando aplicación a Netlify',
      status: 'running',
      startTime: new Date(),
      logs: [],
      progress: 0
    }

    this.callbacks.onStepStart?.(step)

    try {
      // Preparar argumentos de deployment
      const args = ['deploy', '--prod', '--dir', '.next']
      
      if (this.config.settings.netlify?.siteId) {
        args.push('--site', this.config.settings.netlify.siteId)
      }

      const result = await this.executeCommand(
        {
          command: 'netlify',
          args,
          cwd: process.cwd(),
          timeout: 900000, // 15 minutos
          env: {
            NETLIFY_AUTH_TOKEN: this.config.settings.netlify?.token || '',
            NETLIFY_SITE_ID: this.config.settings.netlify?.siteId || ''
          }
        },
        step,
        /Uploading.*?(\d+)%/ // Patrón para detectar progreso
      )

      step.endTime = new Date()
      step.duration = step.endTime.getTime() - step.startTime!.getTime()

      if (result.success) {
        step.status = 'success'
        step.progress = 100
        
        // Extraer URL de deployment del output
        const urlMatch = result.stdout.match(/https:\/\/[^\s]+\.netlify\.app/i)
        if (urlMatch) {
          step.logs.push(`Deployment URL: ${urlMatch[0]}`)
        }
        
        this.callbacks.onStepComplete?.(step)
      } else {
        step.status = 'error'
        const errorMsg = `Netlify deployment failed: ${result.stderr || result.stdout}`
        this.callbacks.onStepError?.(step, errorMsg)
      }

      return step
    } catch (error: any) {
      step.endTime = new Date()
      step.duration = step.endTime.getTime() - step.startTime!.getTime()
      step.status = 'error'
      
      const errorMsg = `Netlify deployment error: ${error.message}`
      this.callbacks.onStepError?.(step, errorMsg)
      
      return step
    }
  }

  async setEnvironmentVariables(): Promise<boolean> {
    if (!this.config.settings.environmentVariables || 
        Object.keys(this.config.settings.environmentVariables).length === 0) {
      return true // No hay variables que configurar
    }

    try {
      for (const [key, value] of Object.entries(this.config.settings.environmentVariables)) {
        const result = await this.executeCommand(
          {
            command: 'netlify',
            args: ['env:set', key, value],
            cwd: process.cwd(),
            env: {
              NETLIFY_AUTH_TOKEN: this.config.settings.netlify?.token || '',
              NETLIFY_SITE_ID: this.config.settings.netlify?.siteId || ''
            }
          },
          { id: 'env-vars', name: 'Environment Variables', description: '', status: 'running', logs: [] }
        )

        if (!result.success) {
          console.error(`Failed to set environment variable ${key}:`, result.stderr)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Error setting environment variables:', error)
      return false
    }
  }

  async getDeploymentUrl(): Promise<string | null> {
    try {
      const result = await this.executeCommand(
        {
          command: 'netlify',
          args: ['status'],
          cwd: process.cwd(),
          env: {
            NETLIFY_AUTH_TOKEN: this.config.settings.netlify?.token || '',
            NETLIFY_SITE_ID: this.config.settings.netlify?.siteId || ''
          }
        },
        { id: 'get-url', name: 'Get URL', description: '', status: 'running', logs: [] }
      )

      if (result.success) {
        // Extraer URL del output
        const urlMatch = result.stdout.match(/https:\/\/[^\s]+\.netlify\.app/i)
        return urlMatch ? urlMatch[0] : null
      }

      return null
    } catch {
      return null
    }
  }
}

/**
 * Factory para crear deployers según la plataforma
 */
export function createDeployer(
  platform: HostingPlatform,
  config: DeploymentConfig,
  callbacks: DeploymentCallbacks = {}
): PlatformDeployer | null {
  switch (platform) {
    case 'vercel':
      return new VercelDeployer(config, callbacks)
    case 'netlify':
      return new NetlifyDeployer(config, callbacks)
    case 'manual':
      return null // Manual deployment no requiere deployer
    default:
      return null
  }
}

/**
 * Detecta automáticamente la plataforma de hosting preferida
 */
export async function detectHostingPlatform(): Promise<HostingPlatform | null> {
  if (isClient) {
    // Simulación para el cliente - por defecto sugerir Vercel
    await new Promise(resolve => setTimeout(resolve, 1000))
    return 'vercel'
  }

  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const cwd = process.cwd()

    // Verificar archivos de configuración específicos de plataformas
    const files = await fs.readdir(cwd)

    // Vercel
    if (files.includes('vercel.json') || files.includes('.vercel')) {
      return 'vercel'
    }

    // Netlify
    if (files.includes('netlify.toml') || files.includes('.netlify')) {
      return 'netlify'
    }

    // Verificar package.json para scripts específicos
    const packageJsonPath = path.join(cwd, 'package.json')
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'))

    if (packageJson.scripts) {
      if (packageJson.scripts.deploy && packageJson.scripts.deploy.includes('vercel')) {
        return 'vercel'
      }

      if (packageJson.scripts.deploy && packageJson.scripts.deploy.includes('netlify')) {
        return 'netlify'
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Verifica si una plataforma CLI está instalada
 */
export async function checkPlatformCLI(platform: HostingPlatform): Promise<boolean> {
  if (platform === 'manual') return true

  if (isClient) {
    // Simulación para el cliente
    await new Promise(resolve => setTimeout(resolve, 500))
    return true // Simular que está instalado
  }

  try {
    const { spawn } = await import('child_process')
    const command = platform === 'vercel' ? 'vercel' : 'netlify'
    const result = await new Promise<boolean>((resolve) => {
      const process = spawn(command, ['--version'], { stdio: 'ignore' })

      process.on('close', (code) => {
        resolve(code === 0)
      })

      process.on('error', () => {
        resolve(false)
      })
    })

    return result
  } catch {
    return false
  }
}

/**
 * Obtiene instrucciones de instalación para una plataforma CLI
 */
export function getCLIInstallInstructions(platform: HostingPlatform): string {
  switch (platform) {
    case 'vercel':
      return `Para instalar Vercel CLI:
npm install -g vercel

Luego autentica con:
vercel login`

    case 'netlify':
      return `Para instalar Netlify CLI:
npm install -g netlify-cli

Luego autentica con:
netlify login`

    case 'manual':
      return 'Deployment manual no requiere CLI adicional.'

    default:
      return 'Plataforma no soportada.'
  }
}

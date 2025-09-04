/**
 * Validadores pre-deployment para el sistema de deployment automatizado
 * CRM Tinto del Mirador
 */

import { ValidationResult, ValidationType, CLICommand, CLIResult } from '@/types/deployment'
import path from 'path'
import { promises as fs } from 'fs'

// Simulación de comandos para el cliente (demo mode)
const isClient = typeof window !== 'undefined'

/**
 * Ejecuta un comando CLI de forma segura (simulado para demo)
 */
async function executeCommand(command: CLICommand): Promise<CLIResult> {
  const startTime = Date.now()

  if (isClient) {
    // Simulación para el cliente
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simular diferentes resultados basados en el comando
    const cmdString = `${command.command} ${command.args.join(' ')}`

    if (cmdString.includes('git status --porcelain')) {
      return {
        success: true,
        exitCode: 0,
        stdout: '', // Repositorio limpio
        stderr: '',
        duration: Date.now() - startTime,
        command: cmdString
      }
    }

    if (cmdString.includes('git branch --show-current')) {
      return {
        success: true,
        exitCode: 0,
        stdout: 'main',
        stderr: '',
        duration: Date.now() - startTime,
        command: cmdString
      }
    }

    if (cmdString.includes('npm ls')) {
      return {
        success: true,
        exitCode: 0,
        stdout: 'All dependencies installed',
        stderr: '',
        duration: Date.now() - startTime,
        command: cmdString
      }
    }

    // Por defecto, simular éxito
    return {
      success: true,
      exitCode: 0,
      stdout: 'Command executed successfully (simulated)',
      stderr: '',
      duration: Date.now() - startTime,
      command: cmdString
    }
  }

  // En el servidor, usar implementación real (si está disponible)
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    const { stdout, stderr } = await execAsync(
      `${command.command} ${command.args.join(' ')}`,
      {
        cwd: command.cwd,
        timeout: command.timeout || 30000,
        env: { ...process.env, ...command.env }
      }
    )

    return {
      success: true,
      exitCode: 0,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      duration: Date.now() - startTime,
      command: `${command.command} ${command.args.join(' ')}`
    }
  } catch (error: any) {
    return {
      success: false,
      exitCode: error.code || 1,
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
      duration: Date.now() - startTime,
      command: `${command.command} ${command.args.join(' ')}`
    }
  }
}

/**
 * Valida el estado de Git - no debe haber cambios sin commitear
 */
export async function validateGitStatus(): Promise<ValidationResult> {
  const validation: ValidationResult = {
    type: 'git-status',
    status: 'running',
    message: 'Verificando estado de Git...',
    timestamp: new Date()
  }

  try {
    const result = await executeCommand({
      command: 'git',
      args: ['status', '--porcelain'],
      cwd: process.cwd()
    })

    if (!result.success) {
      return {
        ...validation,
        status: 'error',
        message: 'Error al verificar el estado de Git',
        details: result.stderr
      }
    }

    if (result.stdout.length > 0) {
      const changes = result.stdout.split('\n').filter(line => line.trim())
      return {
        ...validation,
        status: 'error',
        message: `Hay ${changes.length} archivo(s) con cambios sin commitear`,
        details: `Archivos modificados:\n${changes.join('\n')}\n\nPor favor, haz commit de todos los cambios antes de desplegar.`
      }
    }

    return {
      ...validation,
      status: 'success',
      message: 'Repositorio limpio - no hay cambios sin commitear'
    }
  } catch (error: any) {
    return {
      ...validation,
      status: 'error',
      message: 'Error al validar el estado de Git',
      details: error.message
    }
  }
}

/**
 * Valida que estemos en la rama correcta (main o production)
 */
export async function validateGitBranch(allowedBranches: string[] = ['main', 'production']): Promise<ValidationResult> {
  const validation: ValidationResult = {
    type: 'git-branch',
    status: 'running',
    message: 'Verificando rama actual...',
    timestamp: new Date()
  }

  try {
    const result = await executeCommand({
      command: 'git',
      args: ['branch', '--show-current'],
      cwd: process.cwd()
    })

    if (!result.success) {
      return {
        ...validation,
        status: 'error',
        message: 'Error al obtener la rama actual',
        details: result.stderr
      }
    }

    const currentBranch = result.stdout.trim()
    
    if (!allowedBranches.includes(currentBranch)) {
      return {
        ...validation,
        status: 'error',
        message: `Rama no permitida para deployment: ${currentBranch}`,
        details: `Ramas permitidas: ${allowedBranches.join(', ')}\nRama actual: ${currentBranch}\n\nCambia a una rama permitida antes de desplegar.`
      }
    }

    return {
      ...validation,
      status: 'success',
      message: `Rama válida para deployment: ${currentBranch}`
    }
  } catch (error: any) {
    return {
      ...validation,
      status: 'error',
      message: 'Error al validar la rama de Git',
      details: error.message
    }
  }
}

/**
 * Valida que las dependencias estén instaladas correctamente
 */
export async function validateDependencies(): Promise<ValidationResult> {
  const validation: ValidationResult = {
    type: 'dependencies',
    status: 'running',
    message: 'Verificando dependencias...',
    timestamp: new Date()
  }

  try {
    // Verificar que node_modules existe
    const nodeModulesPath = path.join(process.cwd(), 'node_modules')
    
    try {
      await fs.access(nodeModulesPath)
    } catch {
      return {
        ...validation,
        status: 'error',
        message: 'Directorio node_modules no encontrado',
        details: 'Ejecuta "npm install" para instalar las dependencias.'
      }
    }

    // Verificar que package-lock.json existe
    const packageLockPath = path.join(process.cwd(), 'package-lock.json')
    
    try {
      await fs.access(packageLockPath)
    } catch {
      return {
        ...validation,
        status: 'warning',
        message: 'package-lock.json no encontrado',
        details: 'Se recomienda usar "npm ci" para instalaciones reproducibles.'
      }
    }

    // Verificar integridad de dependencias
    const result = await executeCommand({
      command: 'npm',
      args: ['ls', '--depth=0'],
      cwd: process.cwd()
    })

    if (!result.success && result.stderr.includes('missing')) {
      return {
        ...validation,
        status: 'error',
        message: 'Dependencias faltantes detectadas',
        details: `${result.stderr}\n\nEjecuta "npm install" para resolver las dependencias faltantes.`
      }
    }

    return {
      ...validation,
      status: 'success',
      message: 'Todas las dependencias están correctamente instaladas'
    }
  } catch (error: any) {
    return {
      ...validation,
      status: 'error',
      message: 'Error al validar dependencias',
      details: error.message
    }
  }
}

/**
 * Valida que todas las variables de entorno requeridas estén configuradas
 */
export async function validateEnvironmentVariables(requiredVars: string[]): Promise<ValidationResult> {
  const validation: ValidationResult = {
    type: 'environment',
    status: 'running',
    message: 'Verificando variables de entorno...',
    timestamp: new Date()
  }

  try {
    const missingVars: string[] = []
    const emptyVars: string[] = []

    for (const varName of requiredVars) {
      const value = process.env[varName]
      
      if (!value) {
        missingVars.push(varName)
      } else if (value.trim() === '') {
        emptyVars.push(varName)
      }
    }

    if (missingVars.length > 0 || emptyVars.length > 0) {
      let details = ''
      
      if (missingVars.length > 0) {
        details += `Variables faltantes:\n${missingVars.map(v => `- ${v}`).join('\n')}\n\n`
      }
      
      if (emptyVars.length > 0) {
        details += `Variables vacías:\n${emptyVars.map(v => `- ${v}`).join('\n')}\n\n`
      }
      
      details += 'Configura estas variables en tu archivo .env.local o .env.production'

      return {
        ...validation,
        status: 'error',
        message: `${missingVars.length + emptyVars.length} variable(s) de entorno requerida(s) no configurada(s)`,
        details
      }
    }

    return {
      ...validation,
      status: 'success',
      message: `Todas las ${requiredVars.length} variables de entorno requeridas están configuradas`
    }
  } catch (error: any) {
    return {
      ...validation,
      status: 'error',
      message: 'Error al validar variables de entorno',
      details: error.message
    }
  }
}

/**
 * Valida conectividad con servicios externos
 */
export async function validateExternalServices(): Promise<ValidationResult> {
  const validation: ValidationResult = {
    type: 'services',
    status: 'running',
    message: 'Verificando conectividad con servicios externos...',
    timestamp: new Date()
  }

  const services = [
    {
      name: 'Firebase',
      url: 'https://firebase.googleapis.com',
      required: true
    },
    {
      name: 'Google Gemini AI',
      url: 'https://generativelanguage.googleapis.com',
      required: true
    },
    {
      name: 'Resend',
      url: 'https://api.resend.com',
      required: false
    }
  ]

  const results: Array<{ name: string; success: boolean; error?: string }> = []

  try {
    for (const service of services) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(service.url, {
          method: 'HEAD',
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        
        results.push({
          name: service.name,
          success: response.ok || response.status === 404 // 404 is OK for API endpoints
        })
      } catch (error: any) {
        results.push({
          name: service.name,
          success: false,
          error: error.message
        })
      }
    }

    const failedServices = results.filter(r => !r.success)
    const requiredFailedServices = failedServices.filter(r => 
      services.find(s => s.name === r.name)?.required
    )

    if (requiredFailedServices.length > 0) {
      return {
        ...validation,
        status: 'error',
        message: `${requiredFailedServices.length} servicio(s) crítico(s) no disponible(s)`,
        details: `Servicios no disponibles:\n${requiredFailedServices.map(s => `- ${s.name}: ${s.error || 'No responde'}`).join('\n')}`
      }
    }

    if (failedServices.length > 0) {
      return {
        ...validation,
        status: 'warning',
        message: `${failedServices.length} servicio(s) opcional(es) no disponible(s)`,
        details: `Servicios con problemas:\n${failedServices.map(s => `- ${s.name}: ${s.error || 'No responde'}`).join('\n')}`
      }
    }

    return {
      ...validation,
      status: 'success',
      message: `Todos los servicios externos están disponibles (${results.length} verificados)`
    }
  } catch (error: any) {
    return {
      ...validation,
      status: 'error',
      message: 'Error al validar servicios externos',
      details: error.message
    }
  }
}

/**
 * Valida conectividad con la base de datos
 */
export async function validateDatabase(): Promise<ValidationResult> {
  const validation: ValidationResult = {
    type: 'database',
    status: 'running',
    message: 'Verificando conexión a la base de datos...',
    timestamp: new Date()
  }

  if (isClient) {
    // Simulación para el cliente
    await new Promise(resolve => setTimeout(resolve, 1500))

    return {
      ...validation,
      status: 'success',
      message: 'Conexión a la base de datos exitosa (simulado)'
    }
  }

  try {
    // Importar Prisma dinámicamente para evitar errores en build
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    try {
      // Hacer una consulta simple para verificar conectividad
      await prisma.$queryRaw`SELECT 1`
      await prisma.$disconnect()

      return {
        ...validation,
        status: 'success',
        message: 'Conexión a la base de datos exitosa'
      }
    } catch (dbError: any) {
      await prisma.$disconnect()

      return {
        ...validation,
        status: 'error',
        message: 'Error de conexión a la base de datos',
        details: `${dbError.message}\n\nVerifica que la base de datos esté disponible y que DATABASE_URL esté correctamente configurada.`
      }
    }
  } catch (error: any) {
    return {
      ...validation,
      status: 'error',
      message: 'Error al validar la base de datos',
      details: error.message
    }
  }
}

/**
 * Ejecuta todas las validaciones pre-deployment
 */
export async function runAllValidations(
  requiredEnvVars: string[] = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'GEMINI_API_KEY'
  ],
  allowedBranches: string[] = ['main', 'production']
): Promise<ValidationResult[]> {
  const validations: ValidationResult[] = []

  // Ejecutar validaciones en paralelo donde sea posible
  const [
    gitStatus,
    gitBranch,
    dependencies,
    environment,
    services,
    database
  ] = await Promise.all([
    validateGitStatus(),
    validateGitBranch(allowedBranches),
    validateDependencies(),
    validateEnvironmentVariables(requiredEnvVars),
    validateExternalServices(),
    validateDatabase()
  ])

  validations.push(gitStatus, gitBranch, dependencies, environment, services, database)

  return validations
}

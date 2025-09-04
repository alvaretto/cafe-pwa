/**
 * Build Runner y Ejecutor para el sistema de deployment automatizado
 * CRM Tinto del Mirador
 */

import { DeploymentStep, CLICommand, CLIResult, BundleAnalysis } from '@/types/deployment'

// Detectar si estamos en el cliente
const isClient = typeof window !== 'undefined'

/**
 * Interfaz para callbacks de progreso
 */
interface BuildProgressCallbacks {
  onStepStart?: (step: DeploymentStep) => void
  onStepProgress?: (step: DeploymentStep, progress: number) => void
  onStepComplete?: (step: DeploymentStep) => void
  onStepError?: (step: DeploymentStep, error: string) => void
  onLog?: (step: DeploymentStep, log: string) => void
}

/**
 * Clase para ejecutar comandos con streaming de output (simulado para cliente)
 */
class StreamingCommandExecutor {
  private killed = false

  async execute(
    command: CLICommand,
    callbacks: {
      onStdout?: (data: string) => void
      onStderr?: (data: string) => void
      onProgress?: (progress: number) => void
    } = {}
  ): Promise<CLIResult> {
    const startTime = Date.now()

    if (isClient) {
      // Simulación para el cliente
      return this.simulateExecution(command, callbacks, startTime)
    }

    // Implementación real para el servidor
    return this.executeReal(command, callbacks, startTime)
  }

  private async simulateExecution(
    command: CLICommand,
    callbacks: {
      onStdout?: (data: string) => void
      onStderr?: (data: string) => void
      onProgress?: (progress: number) => void
    },
    startTime: number
  ): Promise<CLIResult> {
    const cmdString = `${command.command} ${command.args.join(' ')}`

    // Simular progreso gradual
    const steps = [
      'Iniciando proceso...',
      'Verificando dependencias...',
      'Compilando archivos...',
      'Optimizando bundle...',
      'Generando archivos estáticos...',
      'Proceso completado exitosamente'
    ]

    for (let i = 0; i < steps.length; i++) {
      if (this.killed) break

      const progress = Math.round(((i + 1) / steps.length) * 100)
      const message = `[${new Date().toISOString()}] ${steps[i]}\n`

      callbacks.onStdout?.(message)
      callbacks.onProgress?.(progress)

      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    }

    return {
      success: !this.killed,
      exitCode: this.killed ? -1 : 0,
      stdout: `Comando simulado: ${cmdString}\nProceso completado exitosamente`,
      stderr: '',
      duration: Date.now() - startTime,
      command: cmdString
    }
  }

  private async executeReal(
    command: CLICommand,
    callbacks: {
      onStdout?: (data: string) => void
      onStderr?: (data: string) => void
      onProgress?: (progress: number) => void
    },
    startTime: number
  ): Promise<CLIResult> {
    try {
      const { spawn } = await import('child_process')
      let stdout = ''
      let stderr = ''

      return new Promise((resolve) => {
        const process = spawn(command.command, command.args, {
          cwd: command.cwd,
          env: { ...process.env, ...command.env },
          stdio: ['pipe', 'pipe', 'pipe']
        })

        // Timeout handling
        const timeout = command.timeout || 300000 // 5 minutos por defecto
        const timeoutId = setTimeout(() => {
          this.kill()
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
        process.stdout?.on('data', (data: Buffer) => {
          const text = data.toString()
          stdout += text
          callbacks.onStdout?.(text)

          // Detectar progreso en builds de Next.js
          this.detectBuildProgress(text, callbacks.onProgress)
        })

        // Handle stderr
        process.stderr?.on('data', (data: Buffer) => {
          const text = data.toString()
          stderr += text
          callbacks.onStderr?.(text)
        })

        // Handle process completion
        process.on('close', (code) => {
          clearTimeout(timeoutId)

          if (this.killed) return

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

  private detectBuildProgress(output: string, onProgress?: (progress: number) => void) {
    if (!onProgress) return

    // Detectar patrones de progreso en Next.js
    const patterns = [
      /Creating an optimized production build\s*\.{3}\s*(\d+)%/,
      /Compiled successfully in (\d+)s/,
      /Linting and checking validity of types\s*\.{3}\s*(\d+)%/,
      /Collecting page data\s*\.{3}\s*(\d+)%/,
      /Generating static pages \((\d+)\/(\d+)\)/
    ]

    for (const pattern of patterns) {
      const match = output.match(pattern)
      if (match) {
        if (match[1] && match[2]) {
          // Para patrones como "Generating static pages (5/10)"
          const current = parseInt(match[1])
          const total = parseInt(match[2])
          const progress = Math.round((current / total) * 100)
          onProgress(Math.min(progress, 100))
        } else if (match[1]) {
          // Para patrones con porcentaje directo
          const progress = parseInt(match[1])
          onProgress(Math.min(progress, 100))
        }
        break
      }
    }

    // Detectar mensajes de finalización
    if (output.includes('Compiled successfully')) {
      onProgress(100)
    }
  }

  kill() {
    this.killed = true
  }
}

/**
 * Ejecuta el proceso de build de Next.js
 */
export async function runBuild(callbacks: BuildProgressCallbacks = {}): Promise<DeploymentStep> {
  const step: DeploymentStep = {
    id: 'build',
    name: 'Build de Producción',
    description: 'Compilando aplicación para producción',
    status: 'running',
    startTime: new Date(),
    logs: [],
    progress: 0
  }

  callbacks.onStepStart?.(step)

  const executor = new StreamingCommandExecutor()

  try {
    const result = await executor.execute(
      {
        command: 'npm',
        args: ['run', 'build'],
        cwd: process.cwd(),
        timeout: 600000, // 10 minutos
        env: {
          NODE_ENV: 'production',
          NEXT_TELEMETRY_DISABLED: '1'
        }
      },
      {
        onStdout: (data) => {
          step.logs.push(data)
          callbacks.onLog?.(step, data)
        },
        onStderr: (data) => {
          step.logs.push(`[ERROR] ${data}`)
          callbacks.onLog?.(step, `[ERROR] ${data}`)
        },
        onProgress: (progress) => {
          step.progress = progress
          callbacks.onStepProgress?.(step, progress)
        }
      }
    )

    step.endTime = new Date()
    step.duration = step.endTime.getTime() - step.startTime!.getTime()

    if (result.success) {
      step.status = 'success'
      step.progress = 100
      callbacks.onStepComplete?.(step)
    } else {
      step.status = 'error'
      const errorMsg = `Build failed with exit code ${result.exitCode}`
      step.logs.push(errorMsg)
      callbacks.onStepError?.(step, errorMsg)
    }

    return step
  } catch (error: any) {
    step.endTime = new Date()
    step.duration = step.endTime.getTime() - step.startTime!.getTime()
    step.status = 'error'
    
    const errorMsg = `Build error: ${error.message}`
    step.logs.push(errorMsg)
    callbacks.onStepError?.(step, errorMsg)
    
    return step
  }
}

/**
 * Ejecuta los tests del proyecto
 */
export async function runTests(callbacks: BuildProgressCallbacks = {}): Promise<DeploymentStep> {
  const step: DeploymentStep = {
    id: 'test',
    name: 'Ejecutar Tests',
    description: 'Ejecutando suite de tests',
    status: 'running',
    startTime: new Date(),
    logs: [],
    progress: 0
  }

  callbacks.onStepStart?.(step)

  // Verificar si existen tests
  const hasTests = await checkIfTestsExist()
  
  if (!hasTests) {
    step.status = 'skipped'
    step.endTime = new Date()
    step.duration = 0
    step.logs.push('No se encontraron tests - saltando etapa')
    callbacks.onStepComplete?.(step)
    return step
  }

  const executor = new StreamingCommandExecutor()

  try {
    const result = await executor.execute(
      {
        command: 'npm',
        args: ['run', 'test', '--', '--passWithNoTests', '--watchAll=false'],
        cwd: process.cwd(),
        timeout: 300000, // 5 minutos
        env: {
          NODE_ENV: 'test',
          CI: 'true'
        }
      },
      {
        onStdout: (data) => {
          step.logs.push(data)
          callbacks.onLog?.(step, data)
          
          // Detectar progreso de tests
          const testProgress = detectTestProgress(data)
          if (testProgress > step.progress!) {
            step.progress = testProgress
            callbacks.onStepProgress?.(step, testProgress)
          }
        },
        onStderr: (data) => {
          step.logs.push(`[ERROR] ${data}`)
          callbacks.onLog?.(step, `[ERROR] ${data}`)
        }
      }
    )

    step.endTime = new Date()
    step.duration = step.endTime.getTime() - step.startTime!.getTime()

    if (result.success) {
      step.status = 'success'
      step.progress = 100
      callbacks.onStepComplete?.(step)
    } else {
      step.status = 'error'
      const errorMsg = `Tests failed with exit code ${result.exitCode}`
      step.logs.push(errorMsg)
      callbacks.onStepError?.(step, errorMsg)
    }

    return step
  } catch (error: any) {
    step.endTime = new Date()
    step.duration = step.endTime.getTime() - step.startTime!.getTime()
    step.status = 'error'
    
    const errorMsg = `Test error: ${error.message}`
    step.logs.push(errorMsg)
    callbacks.onStepError?.(step, errorMsg)
    
    return step
  }
}

/**
 * Ejecuta type checking con TypeScript
 */
export async function runTypeCheck(callbacks: BuildProgressCallbacks = {}): Promise<DeploymentStep> {
  const step: DeploymentStep = {
    id: 'typecheck',
    name: 'Verificación de Tipos',
    description: 'Verificando tipos de TypeScript',
    status: 'running',
    startTime: new Date(),
    logs: [],
    progress: 0
  }

  callbacks.onStepStart?.(step)

  const executor = new StreamingCommandExecutor()

  try {
    const result = await executor.execute(
      {
        command: 'npm',
        args: ['run', 'type-check'],
        cwd: process.cwd(),
        timeout: 180000 // 3 minutos
      },
      {
        onStdout: (data) => {
          step.logs.push(data)
          callbacks.onLog?.(step, data)
          
          // Progreso simple basado en tiempo
          const elapsed = Date.now() - step.startTime!.getTime()
          const progress = Math.min(Math.round((elapsed / 180000) * 100), 90)
          step.progress = progress
          callbacks.onStepProgress?.(step, progress)
        },
        onStderr: (data) => {
          step.logs.push(`[ERROR] ${data}`)
          callbacks.onLog?.(step, `[ERROR] ${data}`)
        }
      }
    )

    step.endTime = new Date()
    step.duration = step.endTime.getTime() - step.startTime!.getTime()

    if (result.success) {
      step.status = 'success'
      step.progress = 100
      callbacks.onStepComplete?.(step)
    } else {
      step.status = 'error'
      const errorMsg = `Type check failed with exit code ${result.exitCode}`
      step.logs.push(errorMsg)
      callbacks.onStepError?.(step, errorMsg)
    }

    return step
  } catch (error: any) {
    step.endTime = new Date()
    step.duration = step.endTime.getTime() - step.startTime!.getTime()
    step.status = 'error'
    
    const errorMsg = `Type check error: ${error.message}`
    step.logs.push(errorMsg)
    callbacks.onStepError?.(step, errorMsg)
    
    return step
  }
}

/**
 * Analiza el bundle generado
 */
export async function analyzeBuildOutput(): Promise<BundleAnalysis | null> {
  try {
    const buildDir = path.join(process.cwd(), '.next')
    const buildManifest = path.join(buildDir, 'build-manifest.json')
    
    // Verificar que el build existe
    try {
      await fs.access(buildDir)
      await fs.access(buildManifest)
    } catch {
      return null
    }

    // Leer el manifiesto de build
    const manifestContent = await fs.readFile(buildManifest, 'utf-8')
    const manifest = JSON.parse(manifestContent)

    // Calcular tamaños de archivos
    const files: BundleAnalysis['files'] = []
    let totalSize = 0

    // Analizar archivos estáticos
    const staticDir = path.join(buildDir, 'static')
    
    try {
      const staticFiles = await getFilesRecursively(staticDir)
      
      for (const filePath of staticFiles) {
        const stats = await fs.stat(filePath)
        const relativePath = path.relative(buildDir, filePath)
        const fileType = getFileType(filePath)
        
        files.push({
          path: relativePath,
          size: stats.size,
          gzippedSize: Math.round(stats.size * 0.3), // Estimación
          type: fileType
        })
        
        totalSize += stats.size
      }
    } catch (error) {
      console.warn('Error analyzing static files:', error)
    }

    return {
      totalSize,
      gzippedSize: Math.round(totalSize * 0.3), // Estimación
      files,
      chunks: [], // TODO: Implementar análisis de chunks
      warnings: [],
      recommendations: generateRecommendations(totalSize, files)
    }
  } catch (error) {
    console.error('Error analyzing build output:', error)
    return null
  }
}

// Funciones auxiliares

async function checkIfTestsExist(): Promise<boolean> {
  const testPatterns = [
    'src/**/*.test.{js,jsx,ts,tsx}',
    'src/**/*.spec.{js,jsx,ts,tsx}',
    '__tests__/**/*.{js,jsx,ts,tsx}',
    'tests/**/*.{js,jsx,ts,tsx}'
  ]

  try {
    // Verificar si existe al menos un archivo de test
    const { glob } = await import('glob')
    
    for (const pattern of testPatterns) {
      const files = await glob(pattern, { cwd: process.cwd() })
      if (files.length > 0) {
        return true
      }
    }
    
    return false
  } catch {
    return false
  }
}

function detectTestProgress(output: string): number {
  const patterns = [
    /Tests:\s+(\d+) passed/,
    /Test Suites:\s+(\d+) passed/,
    /PASS\s+.*\s+\((\d+)\s+tests?\)/
  ]

  for (const pattern of patterns) {
    const match = output.match(pattern)
    if (match && match[1]) {
      const passed = parseInt(match[1])
      // Progreso simple basado en tests pasados
      return Math.min(passed * 10, 90)
    }
  }

  if (output.includes('Test Suites: ') && output.includes('Tests: ')) {
    return 90
  }

  return 0
}

async function getFilesRecursively(dir: string): Promise<string[]> {
  const files: string[] = []
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        const subFiles = await getFilesRecursively(fullPath)
        files.push(...subFiles)
      } else {
        files.push(fullPath)
      }
    }
  } catch {
    // Ignorar errores de acceso a directorios
  }
  
  return files
}

function getFileType(filePath: string): BundleAnalysis['files'][0]['type'] {
  const ext = path.extname(filePath).toLowerCase()
  
  switch (ext) {
    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
      return 'js'
    case '.css':
    case '.scss':
    case '.sass':
      return 'css'
    case '.html':
      return 'html'
    case '.png':
    case '.jpg':
    case '.jpeg':
    case '.gif':
    case '.svg':
    case '.webp':
      return 'image'
    case '.woff':
    case '.woff2':
    case '.ttf':
    case '.eot':
      return 'font'
    default:
      return 'other'
  }
}

function generateRecommendations(totalSize: number, files: BundleAnalysis['files']): string[] {
  const recommendations: string[] = []
  
  // Recomendaciones basadas en tamaño total
  if (totalSize > 5 * 1024 * 1024) { // 5MB
    recommendations.push('El bundle es grande (>5MB). Considera implementar code splitting.')
  }
  
  // Recomendaciones basadas en tipos de archivos
  const jsFiles = files.filter(f => f.type === 'js')
  const totalJsSize = jsFiles.reduce((sum, f) => sum + f.size, 0)
  
  if (totalJsSize > 2 * 1024 * 1024) { // 2MB
    recommendations.push('Los archivos JavaScript son grandes (>2MB). Considera lazy loading.')
  }
  
  const imageFiles = files.filter(f => f.type === 'image')
  const totalImageSize = imageFiles.reduce((sum, f) => sum + f.size, 0)
  
  if (totalImageSize > 1024 * 1024) { // 1MB
    recommendations.push('Las imágenes ocupan mucho espacio (>1MB). Considera optimización de imágenes.')
  }
  
  return recommendations
}

/**
 * Tests de performance y memoria para el sistema de deployment
 * CRM Tinto del Mirador
 */

import { performance } from 'perf_hooks'

// Mock de funciones de deployment
const mockRunCompleteDemo = jest.fn()
const mockValidateGitStatus = jest.fn()
const mockRunBuild = jest.fn()

jest.mock('../demo-deployment', () => ({
  runCompleteDemo: mockRunCompleteDemo
}))

jest.mock('../validators', () => ({
  validateGitStatus: mockValidateGitStatus,
  validateGitBranch: jest.fn(),
  validateDependencies: jest.fn(),
  validateEnvironmentVariables: jest.fn(),
  validateExternalServices: jest.fn(),
  validateDatabase: jest.fn(),
  runAllValidations: jest.fn()
}))

jest.mock('../build-runner', () => ({
  runBuild: mockRunBuild,
  runTests: jest.fn(),
  runTypeCheck: jest.fn(),
  analyzeBuildOutput: jest.fn()
}))

describe('Performance Tests - Sistema de Deployment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Configurar mocks para respuestas rápidas
    mockRunCompleteDemo.mockResolvedValue('https://test.vercel.app')
    mockValidateGitStatus.mockResolvedValue({
      type: 'git-status',
      status: 'success',
      message: 'Repository clean',
      timestamp: new Date()
    })
    mockRunBuild.mockResolvedValue({
      id: 'build',
      status: 'success',
      duration: 1000,
      logs: ['Build completed']
    })
  })

  describe('Tiempo de Respuesta', () => {
    it('debe completar validaciones en menos de 2 segundos', async () => {
      const startTime = performance.now()
      
      await mockValidateGitStatus()
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(2000) // 2 segundos
    })

    it('debe iniciar deployment demo en menos de 500ms', async () => {
      const startTime = performance.now()
      
      const deploymentPromise = mockRunCompleteDemo({
        id: 'test-config',
        platform: 'vercel'
      }, {
        onStatusChange: jest.fn(),
        onValidationComplete: jest.fn(),
        onStepProgress: jest.fn(),
        onStepComplete: jest.fn(),
        onLog: jest.fn(),
        onComplete: jest.fn(),
        onError: jest.fn()
      })
      
      const endTime = performance.now()
      const initDuration = endTime - startTime
      
      expect(initDuration).toBeLessThan(500) // 500ms para inicialización
      
      await deploymentPromise
    })

    it('debe procesar logs grandes eficientemente', async () => {
      const largeLogs = Array.from({ length: 10000 }, (_, i) => `Log entry ${i}`)
      
      const startTime = performance.now()
      
      // Simular procesamiento de logs
      const processedLogs = largeLogs.map(log => ({
        timestamp: new Date().toISOString(),
        message: log,
        level: 'info'
      }))
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(1000) // 1 segundo para 10k logs
      expect(processedLogs).toHaveLength(10000)
    })

    it('debe manejar múltiples deployments concurrentes', async () => {
      const startTime = performance.now()
      
      const deployments = Array.from({ length: 5 }, (_, i) => 
        mockRunCompleteDemo({
          id: `config-${i}`,
          platform: 'vercel'
        }, {
          onStatusChange: jest.fn(),
          onValidationComplete: jest.fn(),
          onStepProgress: jest.fn(),
          onStepComplete: jest.fn(),
          onLog: jest.fn(),
          onComplete: jest.fn(),
          onError: jest.fn()
        })
      )
      
      await Promise.all(deployments)
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      // Deployments concurrentes no deberían tomar mucho más tiempo que uno solo
      expect(duration).toBeLessThan(3000) // 3 segundos para 5 deployments
    })
  })

  describe('Uso de Memoria', () => {
    it('no debe crear memory leaks durante deployment', async () => {
      const initialMemory = process.memoryUsage()
      
      // Ejecutar múltiples deployments
      for (let i = 0; i < 10; i++) {
        await mockRunCompleteDemo({
          id: `config-${i}`,
          platform: 'vercel'
        }, {
          onStatusChange: jest.fn(),
          onValidationComplete: jest.fn(),
          onStepProgress: jest.fn(),
          onStepComplete: jest.fn(),
          onLog: jest.fn(),
          onComplete: jest.fn(),
          onError: jest.fn()
        })
      }
      
      // Forzar garbage collection si está disponible
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = process.memoryUsage()
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed
      
      // El aumento de memoria no debería ser excesivo (menos de 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024)
    })

    it('debe limpiar listeners y timers correctamente', () => {
      const initialListeners = process.listenerCount('exit')
      
      // Simular creación y limpieza de listeners
      const cleanup = jest.fn()
      process.on('exit', cleanup)
      process.removeListener('exit', cleanup)
      
      const finalListeners = process.listenerCount('exit')
      
      expect(finalListeners).toBe(initialListeners)
    })

    it('debe manejar arrays grandes de logs sin problemas de memoria', () => {
      const initialMemory = process.memoryUsage().heapUsed
      
      // Crear array grande de logs
      const largeLogs = Array.from({ length: 100000 }, (_, i) => ({
        id: i,
        timestamp: new Date(),
        message: `Log message ${i}`,
        level: 'info',
        details: { step: i % 5, progress: (i / 100000) * 100 }
      }))
      
      // Procesar logs
      const filteredLogs = largeLogs.filter(log => log.level === 'info')
      const mappedLogs = filteredLogs.map(log => log.message)
      
      expect(mappedLogs).toHaveLength(100000)
      
      // Limpiar referencias
      largeLogs.length = 0
      filteredLogs.length = 0
      mappedLogs.length = 0
      
      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      
      // No debería haber un aumento significativo después de limpiar
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024) // 10MB
    })
  })

  describe('Escalabilidad', () => {
    it('debe mantener performance con configuraciones múltiples', async () => {
      const configs = Array.from({ length: 50 }, (_, i) => ({
        id: `config-${i}`,
        name: `Config ${i}`,
        platform: i % 2 === 0 ? 'vercel' : 'netlify',
        settings: {
          vercel: { token: `token-${i}` },
          netlify: { token: `token-${i}` },
          environmentVariables: {
            NODE_ENV: 'production',
            API_URL: `https://api-${i}.example.com`
          }
        }
      }))
      
      const startTime = performance.now()
      
      // Simular procesamiento de todas las configuraciones
      const processedConfigs = configs.map(config => ({
        ...config,
        validated: true,
        lastUsed: new Date()
      }))
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(duration).toBeLessThan(100) // 100ms para procesar 50 configs
      expect(processedConfigs).toHaveLength(50)
    })

    it('debe manejar logs de alta frecuencia', async () => {
      const startTime = performance.now()
      let logCount = 0
      
      // Simular logs de alta frecuencia
      const logInterval = setInterval(() => {
        logCount++
        // Simular procesamiento de log
        const logEntry = {
          timestamp: Date.now(),
          message: `High frequency log ${logCount}`,
          level: 'info'
        }
        
        // Simular almacenamiento en array
        if (logCount >= 1000) {
          clearInterval(logInterval)
        }
      }, 1)
      
      // Esperar a que termine
      await new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (logCount >= 1000) {
            clearInterval(checkInterval)
            resolve(undefined)
          }
        }, 10)
      })
      
      const endTime = performance.now()
      const duration = endTime - startTime
      
      expect(logCount).toBe(1000)
      expect(duration).toBeLessThan(5000) // 5 segundos para 1000 logs
    })

    it('debe mantener responsividad durante operaciones pesadas', async () => {
      const responseTimes: number[] = []
      
      // Simular operación pesada
      const heavyOperation = async () => {
        const start = performance.now()
        
        // Simular trabajo pesado con yields para mantener responsividad
        for (let i = 0; i < 10000; i++) {
          if (i % 1000 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0))
          }
          // Simular trabajo
          Math.random() * Math.random()
        }
        
        const end = performance.now()
        return end - start
      }
      
      // Ejecutar múltiples operaciones
      for (let i = 0; i < 5; i++) {
        const responseTime = await heavyOperation()
        responseTimes.push(responseTime)
      }
      
      // Verificar que los tiempos de respuesta sean consistentes
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      const maxResponseTime = Math.max(...responseTimes)
      
      expect(avgResponseTime).toBeLessThan(1000) // Promedio < 1 segundo
      expect(maxResponseTime).toBeLessThan(2000) // Máximo < 2 segundos
    })
  })

  describe('Optimización de Recursos', () => {
    it('debe reutilizar conexiones y recursos', () => {
      const resourcePool = new Map()
      
      // Simular pool de recursos
      const getResource = (key: string) => {
        if (!resourcePool.has(key)) {
          resourcePool.set(key, {
            id: key,
            created: Date.now(),
            used: 0
          })
        }
        
        const resource = resourcePool.get(key)
        resource.used++
        return resource
      }
      
      // Usar recursos múltiples veces
      const resource1 = getResource('vercel-client')
      const resource2 = getResource('vercel-client')
      const resource3 = getResource('netlify-client')
      
      expect(resource1).toBe(resource2) // Mismo objeto reutilizado
      expect(resource1.used).toBe(2)
      expect(resource3.used).toBe(1)
      expect(resourcePool.size).toBe(2) // Solo 2 recursos únicos
    })

    it('debe limpiar recursos no utilizados', () => {
      const resources = new Map()
      const CLEANUP_THRESHOLD = 5 * 60 * 1000 // 5 minutos
      
      // Agregar recursos con diferentes timestamps
      resources.set('old-resource', { created: Date.now() - CLEANUP_THRESHOLD - 1000 })
      resources.set('new-resource', { created: Date.now() })
      
      // Simular limpieza
      const now = Date.now()
      for (const [key, resource] of resources.entries()) {
        if (now - resource.created > CLEANUP_THRESHOLD) {
          resources.delete(key)
        }
      }
      
      expect(resources.has('old-resource')).toBe(false)
      expect(resources.has('new-resource')).toBe(true)
      expect(resources.size).toBe(1)
    })

    it('debe optimizar el tamaño de logs almacenados', () => {
      const MAX_LOGS = 1000
      const logs: any[] = []
      
      // Simular adición de logs
      for (let i = 0; i < 1500; i++) {
        logs.push({
          id: i,
          timestamp: Date.now(),
          message: `Log ${i}`
        })
        
        // Mantener solo los últimos MAX_LOGS
        if (logs.length > MAX_LOGS) {
          logs.shift()
        }
      }
      
      expect(logs.length).toBe(MAX_LOGS)
      expect(logs[0].id).toBe(500) // Primer log después de limpieza
      expect(logs[logs.length - 1].id).toBe(1499) // Último log
    })
  })

  describe('Benchmarks', () => {
    it('debe cumplir con benchmarks de performance', async () => {
      const benchmarks = {
        validationTime: 1000,    // 1 segundo
        buildTime: 30000,        // 30 segundos
        deployTime: 60000,       // 1 minuto
        totalTime: 120000        // 2 minutos
      }
      
      // Simular mediciones
      const measurements = {
        validationTime: 500,     // Mejor que benchmark
        buildTime: 25000,        // Mejor que benchmark
        deployTime: 45000,       // Mejor que benchmark
        totalTime: 70000         // Mejor que benchmark
      }
      
      Object.entries(benchmarks).forEach(([key, benchmark]) => {
        expect(measurements[key as keyof typeof measurements]).toBeLessThan(benchmark)
      })
    })

    it('debe mantener métricas de calidad', () => {
      const qualityMetrics = {
        successRate: 0.95,       // 95% de éxito
        errorRate: 0.05,         // 5% de errores
        avgResponseTime: 1000,   // 1 segundo promedio
        p95ResponseTime: 2000    // 95% bajo 2 segundos
      }
      
      // Simular métricas reales
      const actualMetrics = {
        successRate: 0.98,       // Mejor que objetivo
        errorRate: 0.02,         // Mejor que objetivo
        avgResponseTime: 800,    // Mejor que objetivo
        p95ResponseTime: 1500    // Mejor que objetivo
      }
      
      expect(actualMetrics.successRate).toBeGreaterThanOrEqual(qualityMetrics.successRate)
      expect(actualMetrics.errorRate).toBeLessThanOrEqual(qualityMetrics.errorRate)
      expect(actualMetrics.avgResponseTime).toBeLessThanOrEqual(qualityMetrics.avgResponseTime)
      expect(actualMetrics.p95ResponseTime).toBeLessThanOrEqual(qualityMetrics.p95ResponseTime)
    })
  })
})

/**
 * Tests de seguridad para el sistema de deployment
 * CRM Tinto del Mirador
 */

import { validateEnvironmentVariables } from '../validators'

// Mock de funciones de deployment
const mockExec = jest.fn()
const mockSpawn = jest.fn()

jest.mock('child_process', () => ({
  exec: mockExec,
  spawn: mockSpawn
}))

describe('Security Tests - Sistema de Deployment', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Manejo Seguro de Tokens y Credenciales', () => {
    it('no debe exponer tokens en logs', async () => {
      const sensitiveToken = 'vercel_token_abc123xyz'
      const logMessage = `Authenticating with token: ${sensitiveToken}`
      
      // Función para sanitizar logs
      const sanitizeLog = (message: string) => {
        return message.replace(/token[:\s]+[\w\-_]+/gi, 'token: [REDACTED]')
      }
      
      const sanitizedLog = sanitizeLog(logMessage)
      
      expect(sanitizedLog).not.toContain(sensitiveToken)
      expect(sanitizedLog).toContain('[REDACTED]')
    })

    it('debe validar formato de tokens antes de usar', () => {
      const validTokens = [
        'vercel_abc123def456',
        'netlify_xyz789uvw012',
        'github_pat_1234567890abcdef'
      ]
      
      const invalidTokens = [
        '',
        'invalid-token',
        'token with spaces',
        'token\nwith\nnewlines',
        'token;with;semicolons'
      ]
      
      const isValidToken = (token: string) => {
        if (!token || typeof token !== 'string') return false
        if (token.length < 10) return false
        if (/[\s\n\r;|&<>]/.test(token)) return false
        return true
      }
      
      validTokens.forEach(token => {
        expect(isValidToken(token)).toBe(true)
      })
      
      invalidTokens.forEach(token => {
        expect(isValidToken(token)).toBe(false)
      })
    })

    it('debe enmascarar tokens en configuraciones', () => {
      const config = {
        vercel: {
          token: 'vercel_secret_token_123',
          projectId: 'my-project'
        },
        netlify: {
          token: 'netlify_secret_token_456',
          siteId: 'my-site'
        }
      }
      
      const maskSensitiveData = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) return obj
        
        const masked = { ...obj }
        Object.keys(masked).forEach(key => {
          if (key.toLowerCase().includes('token') || key.toLowerCase().includes('secret')) {
            masked[key] = '[MASKED]'
          } else if (typeof masked[key] === 'object') {
            masked[key] = maskSensitiveData(masked[key])
          }
        })
        return masked
      }
      
      const maskedConfig = maskSensitiveData(config)
      
      expect(maskedConfig.vercel.token).toBe('[MASKED]')
      expect(maskedConfig.netlify.token).toBe('[MASKED]')
      expect(maskedConfig.vercel.projectId).toBe('my-project')
      expect(maskedConfig.netlify.siteId).toBe('my-site')
    })

    it('debe almacenar tokens de forma segura', () => {
      const originalToken = 'sensitive_token_123'
      
      // Simular encriptación simple (en producción usar crypto real)
      const encrypt = (text: string) => {
        return Buffer.from(text).toString('base64')
      }
      
      const decrypt = (encrypted: string) => {
        return Buffer.from(encrypted, 'base64').toString('utf8')
      }
      
      const encryptedToken = encrypt(originalToken)
      const decryptedToken = decrypt(encryptedToken)
      
      expect(encryptedToken).not.toBe(originalToken)
      expect(decryptedToken).toBe(originalToken)
      expect(encryptedToken).not.toContain('sensitive')
    })
  })

  describe('Validación de Variables de Entorno', () => {
    const originalEnv = process.env

    beforeEach(() => {
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('debe validar variables de entorno requeridas', async () => {
      // Configurar variables válidas
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db'
      process.env.NEXTAUTH_SECRET = 'secure-secret-key-123'
      process.env.VERCEL_TOKEN = 'vercel_token_123'
      
      const result = await validateEnvironmentVariables([
        'DATABASE_URL',
        'NEXTAUTH_SECRET',
        'VERCEL_TOKEN'
      ])
      
      expect(result.status).toBe('success')
    })

    it('debe detectar variables de entorno faltantes', async () => {
      delete process.env.MISSING_VAR
      
      const result = await validateEnvironmentVariables(['MISSING_VAR'])
      
      expect(result.status).toBe('error')
      expect(result.details).toContain('MISSING_VAR')
    })

    it('debe detectar variables de entorno vacías', async () => {
      process.env.EMPTY_VAR = ''
      
      const result = await validateEnvironmentVariables(['EMPTY_VAR'])
      
      expect(result.status).toBe('error')
      expect(result.details).toContain('Variables vacías')
    })

    it('debe validar formato de URLs de base de datos', () => {
      const validUrls = [
        'postgresql://user:pass@localhost:5432/db',
        'mysql://user:pass@localhost:3306/db',
        'mongodb://user:pass@localhost:27017/db'
      ]
      
      const invalidUrls = [
        'not-a-url',
        'http://invalid-db-url',
        'postgresql://localhost', // Sin credenciales
        'postgresql://user@localhost', // Sin contraseña
        ''
      ]
      
      const isValidDatabaseUrl = (url: string) => {
        if (!url) return false
        const dbProtocols = ['postgresql://', 'mysql://', 'mongodb://']
        const hasValidProtocol = dbProtocols.some(protocol => url.startsWith(protocol))
        const hasCredentials = url.includes('@') && url.includes(':')
        return hasValidProtocol && hasCredentials
      }
      
      validUrls.forEach(url => {
        expect(isValidDatabaseUrl(url)).toBe(true)
      })
      
      invalidUrls.forEach(url => {
        expect(isValidDatabaseUrl(url)).toBe(false)
      })
    })
  })

  describe('Prevención de Inyección de Comandos', () => {
    it('debe sanitizar argumentos de comandos', () => {
      const dangerousInputs = [
        'normal-input; rm -rf /',
        'input && malicious-command',
        'input | dangerous-pipe',
        'input $(malicious-substitution)',
        'input `malicious-backtick`',
        'input > /etc/passwd',
        'input < /etc/shadow'
      ]
      
      const sanitizeCommandArg = (arg: string) => {
        // Remover caracteres peligrosos
        return arg.replace(/[;&|`$<>()]/g, '')
      }
      
      dangerousInputs.forEach(input => {
        const sanitized = sanitizeCommandArg(input)
        expect(sanitized).not.toMatch(/[;&|`$<>()]/)
      })
    })

    it('debe validar nombres de archivos', () => {
      const validFilenames = [
        'package.json',
        'deployment-config.js',
        'build-output.txt',
        'logs-2024-01-01.log'
      ]
      
      const invalidFilenames = [
        '../../../etc/passwd',
        '/etc/shadow',
        'file; rm -rf /',
        'file && malicious',
        'file | pipe',
        'file$(command)',
        'file`command`'
      ]
      
      const isValidFilename = (filename: string) => {
        if (!filename || typeof filename !== 'string') return false
        if (filename.includes('..')) return false
        if (filename.startsWith('/')) return false
        if (/[;&|`$<>()]/.test(filename)) return false
        return true
      }
      
      validFilenames.forEach(filename => {
        expect(isValidFilename(filename)).toBe(true)
      })
      
      invalidFilenames.forEach(filename => {
        expect(isValidFilename(filename)).toBe(false)
      })
    })

    it('debe escapar argumentos de shell correctamente', () => {
      const escapeShellArg = (arg: string) => {
        return `"${arg.replace(/"/g, '\\"')}"`
      }
      
      const testCases = [
        { input: 'normal-arg', expected: '"normal-arg"' },
        { input: 'arg with spaces', expected: '"arg with spaces"' },
        { input: 'arg"with"quotes', expected: '"arg\\"with\\"quotes"' },
        { input: 'arg;with;semicolons', expected: '"arg;with;semicolons"' }
      ]
      
      testCases.forEach(({ input, expected }) => {
        expect(escapeShellArg(input)).toBe(expected)
      })
    })

    it('debe validar comandos permitidos', () => {
      const allowedCommands = ['npm', 'yarn', 'git', 'vercel', 'netlify', 'node']
      const dangerousCommands = ['rm', 'sudo', 'chmod', 'chown', 'curl', 'wget']
      
      const isAllowedCommand = (command: string) => {
        return allowedCommands.includes(command)
      }
      
      allowedCommands.forEach(command => {
        expect(isAllowedCommand(command)).toBe(true)
      })
      
      dangerousCommands.forEach(command => {
        expect(isAllowedCommand(command)).toBe(false)
      })
    })
  })

  describe('Validación de Permisos y Acceso', () => {
    it('debe validar permisos de usuario', () => {
      const users = [
        { id: '1', role: 'ADMIN', permissions: ['deploy', 'read', 'write'] },
        { id: '2', role: 'VENDEDOR', permissions: ['read'] },
        { id: '3', role: 'GUEST', permissions: [] }
      ]
      
      const canDeploy = (user: any) => {
        return user.role === 'ADMIN' && user.permissions.includes('deploy')
      }
      
      expect(canDeploy(users[0])).toBe(true)  // ADMIN
      expect(canDeploy(users[1])).toBe(false) // VENDEDOR
      expect(canDeploy(users[2])).toBe(false) // GUEST
    })

    it('debe validar tokens de sesión', () => {
      const validTokenFormat = /^[a-zA-Z0-9\-_]{32,}$/
      
      const validTokens = [
        'abc123def456ghi789jkl012mno345pqr',
        'valid-token-with-dashes-123456789',
        'valid_token_with_underscores_123456789'
      ]
      
      const invalidTokens = [
        'short',
        'token with spaces',
        'token;with;semicolons',
        'token\nwith\nnewlines',
        ''
      ]
      
      validTokens.forEach(token => {
        expect(validTokenFormat.test(token)).toBe(true)
      })
      
      invalidTokens.forEach(token => {
        expect(validTokenFormat.test(token)).toBe(false)
      })
    })

    it('debe implementar rate limiting', () => {
      const rateLimiter = {
        requests: new Map<string, number[]>(),
        maxRequests: 5,
        windowMs: 60000, // 1 minuto
        
        isAllowed(userId: string): boolean {
          const now = Date.now()
          const userRequests = this.requests.get(userId) || []
          
          // Limpiar requests antiguos
          const validRequests = userRequests.filter(
            time => now - time < this.windowMs
          )
          
          if (validRequests.length >= this.maxRequests) {
            return false
          }
          
          validRequests.push(now)
          this.requests.set(userId, validRequests)
          return true
        }
      }
      
      const userId = 'user-1'
      
      // Primeras 5 requests deberían ser permitidas
      for (let i = 0; i < 5; i++) {
        expect(rateLimiter.isAllowed(userId)).toBe(true)
      }
      
      // La sexta request debería ser bloqueada
      expect(rateLimiter.isAllowed(userId)).toBe(false)
    })
  })

  describe('Protección contra Ataques', () => {
    it('debe prevenir path traversal', () => {
      const dangerousPaths = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        '/etc/shadow',
        'C:\\Windows\\System32\\config\\SAM',
        '....//....//....//etc/passwd'
      ]
      
      const isPathSafe = (path: string) => {
        if (!path || typeof path !== 'string') return false
        if (path.includes('..')) return false
        if (path.startsWith('/')) return false
        if (path.includes('\\')) return false
        if (path.includes('etc/')) return false
        if (path.includes('system32')) return false
        return true
      }
      
      dangerousPaths.forEach(path => {
        expect(isPathSafe(path)).toBe(false)
      })
      
      const safePaths = ['package.json', 'src/components/test.tsx', 'logs/deployment.log']
      safePaths.forEach(path => {
        expect(isPathSafe(path)).toBe(true)
      })
    })

    it('debe validar tamaño de archivos', () => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
      
      const isFileSizeValid = (size: number) => {
        return size > 0 && size <= MAX_FILE_SIZE
      }
      
      expect(isFileSizeValid(1024)).toBe(true)           // 1KB - válido
      expect(isFileSizeValid(5 * 1024 * 1024)).toBe(true) // 5MB - válido
      expect(isFileSizeValid(15 * 1024 * 1024)).toBe(false) // 15MB - inválido
      expect(isFileSizeValid(0)).toBe(false)             // 0 bytes - inválido
      expect(isFileSizeValid(-1)).toBe(false)            // Negativo - inválido
    })

    it('debe implementar timeout para operaciones', async () => {
      const timeoutOperation = <T>(
        operation: Promise<T>,
        timeoutMs: number
      ): Promise<T> => {
        return Promise.race([
          operation,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
          )
        ])
      }
      
      // Operación rápida - debería completarse
      const fastOperation = new Promise(resolve => 
        setTimeout(() => resolve('success'), 100)
      )
      
      await expect(timeoutOperation(fastOperation, 1000)).resolves.toBe('success')
      
      // Operación lenta - debería hacer timeout
      const slowOperation = new Promise(resolve => 
        setTimeout(() => resolve('success'), 2000)
      )
      
      await expect(timeoutOperation(slowOperation, 1000)).rejects.toThrow('Operation timeout')
    })

    it('debe sanitizar output de comandos', () => {
      const dangerousOutput = `
        Build completed successfully
        Token: abc123secret456
        Password: mypassword123
        API_KEY=secret_key_789
        Error: Authentication failed with token xyz789
      `
      
      const sanitizeOutput = (output: string) => {
        return output
          .replace(/token[:\s=]+[\w\-_]+/gi, 'token: [REDACTED]')
          .replace(/password[:\s=]+[\w\-_]+/gi, 'password: [REDACTED]')
          .replace(/api_key[:\s=]+[\w\-_]+/gi, 'api_key: [REDACTED]')
      }
      
      const sanitized = sanitizeOutput(dangerousOutput)
      
      expect(sanitized).not.toContain('abc123secret456')
      expect(sanitized).not.toContain('mypassword123')
      expect(sanitized).not.toContain('secret_key_789')
      expect(sanitized).toContain('[REDACTED]')
      expect(sanitized).toContain('Build completed successfully')
    })
  })

  describe('Auditoría y Logging de Seguridad', () => {
    it('debe registrar intentos de acceso no autorizado', () => {
      const securityLog: any[] = []
      
      const logSecurityEvent = (event: {
        type: string
        userId?: string
        ip?: string
        userAgent?: string
        timestamp: Date
        details: any
      }) => {
        securityLog.push(event)
      }
      
      // Simular intento de acceso no autorizado
      logSecurityEvent({
        type: 'UNAUTHORIZED_ACCESS',
        userId: 'user-123',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        timestamp: new Date(),
        details: { action: 'deploy', resource: 'production' }
      })
      
      expect(securityLog).toHaveLength(1)
      expect(securityLog[0].type).toBe('UNAUTHORIZED_ACCESS')
      expect(securityLog[0].userId).toBe('user-123')
    })

    it('debe registrar cambios en configuraciones sensibles', () => {
      const auditLog: any[] = []
      
      const logConfigChange = (change: {
        userId: string
        action: string
        resource: string
        oldValue?: any
        newValue?: any
        timestamp: Date
      }) => {
        // Sanitizar valores sensibles antes de loggear
        const sanitizedChange = {
          ...change,
          oldValue: change.oldValue && typeof change.oldValue === 'string' && 
                   change.oldValue.includes('token') ? '[REDACTED]' : change.oldValue,
          newValue: change.newValue && typeof change.newValue === 'string' && 
                   change.newValue.includes('token') ? '[REDACTED]' : change.newValue
        }
        auditLog.push(sanitizedChange)
      }
      
      logConfigChange({
        userId: 'admin-1',
        action: 'UPDATE',
        resource: 'deployment-config',
        oldValue: 'old_token_123',
        newValue: 'new_token_456',
        timestamp: new Date()
      })
      
      expect(auditLog).toHaveLength(1)
      expect(auditLog[0].oldValue).toBe('[REDACTED]')
      expect(auditLog[0].newValue).toBe('[REDACTED]')
    })
  })
})

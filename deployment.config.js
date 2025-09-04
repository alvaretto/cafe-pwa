/**
 * Configuración de deployment para CRM Tinto del Mirador
 * Este archivo define las configuraciones por defecto para el sistema de deployment automatizado
 */

module.exports = {
  // Configuración general
  general: {
    // Nombre del proyecto
    projectName: 'Tinto del Mirador CRM',
    
    // Versión del sistema de deployment
    version: '1.0.0',
    
    // Timeout por defecto para comandos (en milisegundos)
    defaultTimeout: 600000, // 10 minutos
    
    // Directorio de trabajo
    workingDirectory: process.cwd(),
    
    // Archivos a excluir del deployment
    excludeFiles: [
      '.env.local',
      '.env.development',
      'node_modules',
      '.git',
      '*.log',
      'coverage',
      '.nyc_output'
    ]
  },

  // Validaciones pre-deployment
  validations: {
    // Variables de entorno requeridas
    requiredEnvironmentVariables: [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL',
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'GEMINI_API_KEY'
    ],
    
    // Variables de entorno opcionales
    optionalEnvironmentVariables: [
      'RESEND_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ],
    
    // Ramas permitidas para deployment
    allowedBranches: ['main', 'production', 'master'],
    
    // Verificar que no hay cambios sin commitear
    checkGitStatus: true,
    
    // Verificar conectividad con servicios externos
    checkExternalServices: true,
    
    // Servicios externos a verificar
    externalServices: [
      {
        name: 'Firebase',
        url: 'https://firebase.googleapis.com',
        required: true,
        timeout: 5000
      },
      {
        name: 'Google Gemini AI',
        url: 'https://generativelanguage.googleapis.com',
        required: true,
        timeout: 5000
      },
      {
        name: 'Resend',
        url: 'https://api.resend.com',
        required: false,
        timeout: 5000
      }
    ]
  },

  // Configuración de build
  build: {
    // Comando de build
    buildCommand: 'npm run build',
    
    // Comando de type checking
    typeCheckCommand: 'npm run type-check',
    
    // Comando de tests
    testCommand: 'npm run test',
    
    // Directorio de output
    outputDirectory: '.next',
    
    // Verificar que el build genera archivos
    verifyBuildOutput: true,
    
    // Tamaño máximo del bundle (en bytes)
    maxBundleSize: 10 * 1024 * 1024, // 10MB
    
    // Generar análisis de bundle
    generateBundleAnalysis: true
  },

  // Configuración de plataformas
  platforms: {
    // Configuración de Vercel
    vercel: {
      // CLI command
      cliCommand: 'vercel',
      
      // Argumentos por defecto
      defaultArgs: ['--prod', '--yes'],
      
      // Variables de entorno específicas
      environmentVariables: {
        'VERCEL_TOKEN': process.env.VERCEL_TOKEN,
        'VERCEL_PROJECT_ID': process.env.VERCEL_PROJECT_ID,
        'VERCEL_TEAM_ID': process.env.VERCEL_TEAM_ID
      },
      
      // Timeout específico
      timeout: 900000, // 15 minutos
      
      // Configuración de dominio
      domain: process.env.VERCEL_DOMAIN,
      
      // Configuración de proyecto
      projectSettings: {
        framework: 'nextjs',
        buildCommand: 'npm run build',
        outputDirectory: '.next',
        installCommand: 'npm ci',
        devCommand: 'npm run dev'
      }
    },

    // Configuración de Netlify
    netlify: {
      // CLI command
      cliCommand: 'netlify',
      
      // Argumentos por defecto
      defaultArgs: ['deploy', '--prod'],
      
      // Variables de entorno específicas
      environmentVariables: {
        'NETLIFY_AUTH_TOKEN': process.env.NETLIFY_AUTH_TOKEN,
        'NETLIFY_SITE_ID': process.env.NETLIFY_SITE_ID
      },
      
      // Timeout específico
      timeout: 900000, // 15 minutos
      
      // Configuración de sitio
      siteSettings: {
        buildCommand: 'npm run build',
        publishDirectory: '.next',
        functionsDirectory: 'netlify/functions'
      }
    }
  },

  // Configuración de health checks
  healthChecks: {
    // Habilitar health checks post-deployment
    enabled: true,
    
    // Timeout para cada check
    timeout: 10000, // 10 segundos
    
    // Número de reintentos
    retries: 3,
    
    // Intervalo entre reintentos
    retryInterval: 2000, // 2 segundos
    
    // Checks por defecto
    defaultChecks: [
      {
        path: '/',
        expectedStatus: 200,
        expectedContent: 'Tinto del Mirador',
        timeout: 10000
      },
      {
        path: '/dashboard',
        expectedStatus: 200,
        expectedContent: 'Dashboard',
        timeout: 15000
      },
      {
        path: '/api/health',
        expectedStatus: 200,
        timeout: 5000
      }
    ]
  },

  // Configuración de notificaciones
  notifications: {
    // Habilitar notificaciones
    enabled: true,
    
    // Notificaciones por email
    email: {
      enabled: true,
      service: 'resend',
      from: process.env.NOTIFICATION_EMAIL_FROM || 'noreply@tintodelmirador.com',
      recipients: [
        process.env.ADMIN_EMAIL
      ].filter(Boolean),
      
      // Plantillas de email
      templates: {
        success: {
          subject: '✅ Deployment exitoso - Tinto del Mirador CRM',
          template: 'deployment-success'
        },
        error: {
          subject: '❌ Error en deployment - Tinto del Mirador CRM',
          template: 'deployment-error'
        }
      }
    },
    
    // Notificaciones por Slack (opcional)
    slack: {
      enabled: false,
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: '#deployments',
      username: 'Deployment Bot'
    },
    
    // Notificaciones por Discord (opcional)
    discord: {
      enabled: false,
      webhookUrl: process.env.DISCORD_WEBHOOK_URL
    }
  },

  // Configuración de seguridad
  security: {
    // Requerir re-autenticación
    requireReauth: true,
    
    // Timeout para re-autenticación (en minutos)
    reauthTimeout: 30,
    
    // Requerir confirmación explícita
    requireConfirmation: true,
    
    // Rate limiting
    rateLimit: {
      maxDeploymentsPerHour: 5,
      maxDeploymentsPerDay: 20,
      cooldownPeriod: 5 // minutos
    },
    
    // Roles permitidos para deployment
    allowedRoles: ['ADMIN'],
    
    // Archivos bloqueados (no se pueden desplegar si existen)
    blockedFiles: [
      '.env',
      'secrets.json',
      'private-key.pem'
    ]
  },

  // Configuración de logging
  logging: {
    // Nivel de logging
    level: 'info', // 'debug', 'info', 'warn', 'error'
    
    // Guardar logs en base de datos
    saveToDatabase: true,
    
    // Retención de logs (en días)
    retentionDays: 90,
    
    // Incluir logs detallados
    includeDetailedLogs: true,
    
    // Incluir stack traces en errores
    includeStackTraces: true
  },

  // Configuración de rollback
  rollback: {
    // Habilitar rollback automático
    enabled: true,
    
    // Timeout para health checks antes de rollback
    healthCheckTimeout: 60000, // 1 minuto
    
    // Rollback automático en caso de fallo
    autoRollback: true
  },

  // Configuración de monitoreo
  monitoring: {
    // Habilitar monitoreo continuo
    enabled: true,
    
    // Intervalo de monitoreo (en milisegundos)
    interval: 60000, // 1 minuto
    
    // Umbrales de alerta
    thresholds: {
      responseTime: 5000, // 5 segundos
      errorRate: 0.05, // 5%
      uptime: 0.99 // 99%
    }
  },

  // Configuración de backup
  backup: {
    // Habilitar backup antes del deployment
    enabled: false,
    
    // Incluir base de datos en backup
    includeDatabase: true,
    
    // Incluir archivos subidos
    includeUploads: true,
    
    // Retención de backups (en días)
    retentionDays: 30,
    
    // Ubicación de almacenamiento
    storageLocation: process.env.BACKUP_STORAGE_LOCATION || './backups'
  }
}

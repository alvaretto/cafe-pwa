import { NextResponse } from 'next/server'
import { checkDBHealth } from '@/lib/prisma'

export async function GET() {
  try {
    // Verificar salud de la base de datos
    const dbHealth = await checkDBHealth()
    
    // Verificar variables de entorno críticas
    const requiredEnvVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    ]
    
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
    
    const health = {
      status: dbHealth.status === 'healthy' && missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: dbHealth,
      environment_variables: {
        status: missingEnvVars.length === 0 ? 'ok' : 'missing',
        missing: missingEnvVars,
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }
    
    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : 503,
    })
  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Función para conectar a la base de datos
export async function connectDB() {
  try {
    await prisma.$connect()
    console.log('✅ Conexión a la base de datos establecida')
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error)
    throw error
  }
}

// Función para desconectar de la base de datos
export async function disconnectDB() {
  try {
    await prisma.$disconnect()
    console.log('✅ Desconexión de la base de datos exitosa')
  } catch (error) {
    console.error('❌ Error desconectando de la base de datos:', error)
    throw error
  }
}

// Función para verificar la salud de la base de datos
export async function checkDBHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { status: 'healthy', timestamp: new Date().toISOString() }
  } catch (error) {
    console.error('❌ Error en verificación de salud de la base de datos:', error)
    return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() }
  }
}

export default prisma

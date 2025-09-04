#!/usr/bin/env node

/**
 * Script para inicializar usuarios de demo en la base de datos
 * Ejecutar con: node scripts/init-demo-users.js
 */

const { PrismaClient } = require('@prisma/client')
const { createUserWithEmailAndPassword } = require('firebase/auth')
const { initializeApp } = require('firebase/app')
const { getAuth } = require('firebase/auth')

// Configuración de Firebase (usando variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const prisma = new PrismaClient()

// Usuarios de demo
const demoUsers = [
  {
    email: 'admin@tintodel-mirador.com',
    password: 'admin123',
    name: 'Administrador Demo',
    role: 'ADMIN',
  },
  {
    email: 'vendedor@tintodel-mirador.com',
    password: 'vendedor123',
    name: 'Vendedor Demo',
    role: 'VENDEDOR',
  },
]

async function initDemoUsers() {
  console.log('🚀 Inicializando usuarios de demo...')

  try {
    // Verificar si ya existen usuarios
    const existingUsers = await prisma.user.findMany({
      where: {
        email: {
          in: demoUsers.map(user => user.email)
        }
      }
    })

    if (existingUsers.length > 0) {
      console.log('✅ Los usuarios de demo ya existen:')
      existingUsers.forEach(user => {
        console.log(`   - ${user.email} (${user.role})`)
      })
      return
    }

    // Crear usuarios en la base de datos
    for (const userData of demoUsers) {
      try {
        const user = await prisma.user.create({
          data: {
            email: userData.email,
            name: userData.name,
            role: userData.role,
            isActive: true,
            emailVerified: new Date(),
            twoFactorEnabled: false,
            biometricEnabled: false,
          }
        })

        console.log(`✅ Usuario creado: ${user.email} (${user.role})`)
      } catch (error) {
        console.error(`❌ Error creando usuario ${userData.email}:`, error.message)
      }
    }

    console.log('\n🎉 Usuarios de demo inicializados correctamente!')
    console.log('\n📋 Credenciales de acceso:')
    console.log('   👤 Administrador:')
    console.log('      Email: admin@tintodel-mirador.com')
    console.log('      Password: admin123')
    console.log('   👤 Vendedor:')
    console.log('      Email: vendedor@tintodel-mirador.com')
    console.log('      Password: vendedor123')

  } catch (error) {
    console.error('❌ Error inicializando usuarios de demo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  initDemoUsers()
}

module.exports = { initDemoUsers }

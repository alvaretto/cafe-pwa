'use client'

import { User, UserRole } from '@/types'

// Usuarios simulados para la demo
const DEMO_USERS = [
  {
    id: '1',
    email: 'admin@tintomirador.com',
    name: 'Administrador',
    role: UserRole.ADMIN,
    password: 'admin123',
    isActive: true,
    lastLogin: new Date(),
    emailVerified: new Date(),
    twoFactorEnabled: false,
    biometricEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'maria@tintomirador.com',
    name: 'María González',
    role: UserRole.VENDEDOR,
    password: 'vendedor123',
    isActive: true,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    emailVerified: new Date(),
    twoFactorEnabled: false,
    biometricEnabled: false,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'carlos@tintomirador.com',
    name: 'Carlos Rodríguez',
    role: UserRole.VENDEDOR,
    password: 'vendedor123',
    isActive: true,
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    emailVerified: new Date(),
    twoFactorEnabled: false,
    biometricEnabled: false,
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date(),
  },
  {
    id: '4',
    email: 'ana@tintomirador.com',
    name: 'Ana Martínez',
    role: UserRole.VENDEDOR,
    password: 'vendedor123',
    isActive: true,
    lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
    emailVerified: new Date(),
    twoFactorEnabled: false,
    biometricEnabled: false,
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date(),
  },
  {
    id: '5',
    email: 'luis@tintomirador.com',
    name: 'Luis Fernández',
    role: UserRole.VENDEDOR,
    password: 'vendedor123',
    isActive: true,
    lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
    emailVerified: new Date(),
    twoFactorEnabled: false,
    biometricEnabled: false,
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date(),
  },
]

// Simular localStorage para el estado de autenticación
const AUTH_KEY = 'tinto-auth-user'

/**
 * Verifica si estamos en modo desarrollo
 */
function isDevelopmentMode(): boolean {
  // Verificar múltiples formas de detectar desarrollo
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev' ||
    typeof window !== 'undefined' && window.location.hostname === 'localhost' ||
    typeof window !== 'undefined' && window.location.hostname === '127.0.0.1' ||
    typeof window !== 'undefined' && window.location.port === '3000'
  )
}

/**
 * Crea un usuario mock para desarrollo (sin localStorage)
 */
export function createMockUser(): User {
  return {
    id: 'dev-admin-001',
    name: 'Administrador Desarrollo',
    email: 'admin@tintodel mirador.com',
    role: 'ADMIN' as const,
    image: null,
    emailVerified: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    lastLogin: new Date(),
  }
}

/**
 * Realiza auto-login en modo desarrollo
 */
function performAutoLogin(): User {
  console.log('🔧 Modo desarrollo detectado: Realizando auto-login con usuario administrador')
  const adminUser = DEMO_USERS[0] // Usuario administrador
  const { password: _, ...userWithoutPassword } = adminUser
  const authenticatedUser = {
    ...userWithoutPassword,
    lastLogin: new Date(),
  }

  // Guardar en localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authenticatedUser))
  }

  return authenticatedUser
}

/**
 * Obtiene el usuario actual desde localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(AUTH_KEY)
    if (!stored) {
      // En modo desarrollo, auto-login con usuario admin
      if (isDevelopmentMode()) {
        return performAutoLogin()
      }
      return null
    }

    const userData = JSON.parse(stored)
    return {
      ...userData,
      lastLogin: new Date(userData.lastLogin),
      emailVerified: userData.emailVerified ? new Date(userData.emailVerified) : null,
      createdAt: new Date(userData.createdAt),
      updatedAt: new Date(userData.updatedAt),
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    // En caso de error y modo desarrollo, intentar auto-login
    if (isDevelopmentMode()) {
      try {
        return performAutoLogin()
      } catch (autoLoginError) {
        console.error('Error en auto-login:', autoLoginError)
      }
    }
    return null
  }
}

/**
 * Inicia sesión con email y contraseña
 */
export async function signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const user = DEMO_USERS.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return { user: null, error: 'Credenciales inválidas' }
  }
  
  // Crear objeto de usuario sin la contraseña
  const { password: _, ...userWithoutPassword } = user
  const authenticatedUser = {
    ...userWithoutPassword,
    lastLogin: new Date(),
  }
  
  // Guardar en localStorage
  localStorage.setItem(AUTH_KEY, JSON.stringify(authenticatedUser))
  
  return { user: authenticatedUser, error: null }
}

/**
 * Registra un nuevo usuario
 */
export async function signUp(email: string, password: string, name: string): Promise<{ user: User | null; error: string | null }> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Verificar si el usuario ya existe
  const existingUser = DEMO_USERS.find(u => u.email === email)
  if (existingUser) {
    return { user: null, error: 'El usuario ya existe' }
  }
  
  // Crear nuevo usuario
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    role: UserRole.VENDEDOR,
    isActive: true,
    lastLogin: new Date(),
    emailVerified: new Date(),
    twoFactorEnabled: false,
    biometricEnabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  
  // Guardar en localStorage
  localStorage.setItem(AUTH_KEY, JSON.stringify(newUser))
  
  return { user: newUser, error: null }
}

/**
 * Cierra sesión
 */
export function signOut(): void {
  localStorage.removeItem(AUTH_KEY)
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

/**
 * Hook para usar la autenticación
 */
export function useAuth() {
  const user = getCurrentUser()
  
  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    isVendedor: user?.role === UserRole.VENDEDOR,
    signIn,
    signUp,
    signOut,
  }
}

/**
 * Obtiene credenciales de demo para testing
 */
export function getDemoCredentials() {
  return {
    admin: {
      email: 'admin@tintomirador.com',
      password: 'admin123',
    },
    vendedor: {
      email: 'maria@tintomirador.com',
      password: 'vendedor123',
    },
  }
}

/**
 * Verifica si el usuario tiene permisos para acceder a un módulo específico
 */
export function hasPermission(user: User | null, module: string): boolean {
  if (!user) return false

  // El administrador tiene acceso a todo
  if (user.role === UserRole.ADMIN) return true

  // Permisos específicos para vendedores
  const vendedorPermissions = [
    'dashboard',
    'productos',
    'ventas',
    'clientes',
    'inventario',
    'reportes'
  ]

  // Los vendedores NO tienen acceso a:
  // - gastos
  // - configuracion
  // - gestion de usuarios

  return vendedorPermissions.includes(module.toLowerCase())
}

/**
 * Obtiene todos los usuarios del sistema (solo para admin)
 */
export function getAllUsers(): User[] {
  return DEMO_USERS.map(user => ({
    ...user,
    // No devolver la contraseña por seguridad
    password: undefined
  })) as User[]
}

/**
 * Obtiene las credenciales de todos los vendedores para testing
 */
export function getVendedoresCredentials() {
  return [
    { email: 'maria@tintomirador.com', password: 'vendedor123', name: 'María González' },
    { email: 'carlos@tintomirador.com', password: 'vendedor123', name: 'Carlos Rodríguez' },
    { email: 'ana@tintomirador.com', password: 'vendedor123', name: 'Ana Martínez' },
    { email: 'luis@tintomirador.com', password: 'vendedor123', name: 'Luis Fernández' },
  ]
}

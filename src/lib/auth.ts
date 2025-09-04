import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { auth } from '@/config/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  sendEmailVerification,
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from 'firebase/auth'
import { prisma } from '@/lib/prisma'
import { User, UserRole } from '@/types'

/**
 * Obtiene el usuario actual autenticado (server-side)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return null
    }

    // Buscar el usuario completo en la base de datos
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!dbUser || !dbUser.isActive) {
      return null
    }

    // Convertir a nuestro tipo User
    const user: User = {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || 'Usuario',
      image: dbUser.image || '',
      role: dbUser.role as UserRole,
      isActive: dbUser.isActive,
      lastLogin: dbUser.lastLogin || new Date(),
      emailVerified: dbUser.emailVerified || new Date(),
      twoFactorEnabled: dbUser.twoFactorEnabled,
      biometricEnabled: dbUser.biometricEnabled,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    }

    return user
  } catch (error) {
    console.error('Error fetching current user:', error)
    return null
  }
}

/**
 * Inicia sesión con email y contraseña
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Actualizar último login en la base de datos
    await prisma.user.update({
      where: { email },
      data: { lastLogin: new Date() },
    })

    return { user: userCredential.user, error: null }
  } catch (error: any) {
    console.error('Error signing in:', error)
    return { user: null, error: error.message }
  }
}

/**
 * Registra un nuevo usuario
 */
export async function signUpWithEmail(
  email: string, 
  password: string, 
  name: string,
  role: UserRole = UserRole.VENDEDOR
) {
  try {
    // Crear usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Actualizar perfil en Firebase
    await updateProfile(userCredential.user, { displayName: name })
    
    // Enviar email de verificación
    await sendEmailVerification(userCredential.user)
    
    // Crear usuario en la base de datos
    const dbUser = await prisma.user.create({
      data: {
        email,
        name,
        role,
        isActive: true,
        twoFactorEnabled: false,
        biometricEnabled: false,
      },
    })

    return { user: userCredential.user, dbUser, error: null }
  } catch (error: any) {
    console.error('Error signing up:', error)
    return { user: null, dbUser: null, error: error.message }
  }
}

/**
 * Cierra sesión
 */
export async function signOutUser() {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    console.error('Error signing out:', error)
    return { error: error.message }
  }
}

/**
 * Envía email de recuperación de contraseña
 */
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error: any) {
    console.error('Error sending password reset email:', error)
    return { error: error.message }
  }
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export async function hasRole(userId: string, role: UserRole): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    })

    return Boolean(user?.isActive) && user?.role === role
  } catch (error) {
    console.error('Error checking user role:', error)
    return false
  }
}

/**
 * Verifica si el usuario es administrador
 */
export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, UserRole.ADMIN)
}

/**
 * Verifica si el usuario puede acceder a un recurso
 */
export async function canAccess(userId: string, resource: string): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    })

    if (!user?.isActive) return false

    // Los administradores tienen acceso a todo
    if (user.role === UserRole.ADMIN) return true

    // Definir permisos por recurso para vendedores
    const vendedorPermissions = [
      'dashboard',
      'sales',
      'customers',
      'products',
      'inventory',
      'reports',
    ]

    return vendedorPermissions.includes(resource)
  } catch (error) {
    console.error('Error checking access:', error)
    return false
  }
}

/**
 * Configura autenticación de dos factores
 */
export async function setupTwoFactor(phoneNumber: string) {
  try {
    const user = auth.currentUser
    if (!user) throw new Error('No user logged in')

    // Configurar reCAPTCHA
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    })

    // Obtener sesión multifactor
    const multiFactorSession = await multiFactor(user).getSession()

    // Crear proveedor de teléfono
    const phoneAuthCredential = PhoneAuthProvider.credential(phoneNumber, '')
    const phoneInfoOptions = {
      phoneNumber,
      session: multiFactorSession,
    }

    // Enviar código de verificación
    // Simulación para desarrollo - en producción usar Firebase
    const verificationId = 'mock-verification-id'

    return { verificationId, error: null }
  } catch (error: any) {
    console.error('Error setting up 2FA:', error)
    return { verificationId: null, error: error.message }
  }
}

/**
 * Verifica código de dos factores
 */
export async function verifyTwoFactor(verificationId: string, verificationCode: string) {
  try {
    const user = auth.currentUser
    if (!user) throw new Error('No user logged in')

    // Crear credencial de teléfono
    const phoneCredential = PhoneAuthProvider.credential(verificationId, verificationCode)
    
    // Crear assertion multifactor
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneCredential)
    
    // Enrollar el factor
    await multiFactor(user).enroll(multiFactorAssertion, 'Phone Number')

    // Actualizar en la base de datos
    await prisma.user.update({
      where: { email: user.email! },
      data: { twoFactorEnabled: true },
    })

    return { error: null }
  } catch (error: any) {
    console.error('Error verifying 2FA:', error)
    return { error: error.message }
  }
}

/**
 * Registra actividad del usuario para auditoría
 */
export async function logUserActivity(
  userId: string,
  action: string,
  entity: string,
  entityId?: string,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId || null,
        oldValues: oldValues ? JSON.stringify(oldValues) : null,
        newValues: newValues ? JSON.stringify(newValues) : null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      } as any,
    })
  } catch (error) {
    console.error('Error logging user activity:', error)
  }
}

/**
 * Obtiene el historial de actividad de un usuario
 */
export async function getUserActivity(userId: string, limit: number = 50) {
  try {
    const activities = await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return activities
  } catch (error) {
    console.error('Error fetching user activity:', error)
    return []
  }
}

/**
 * Desactiva un usuario
 */
export async function deactivateUser(userId: string, deactivatedBy: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    })

    // Registrar la actividad
    await logUserActivity(
      deactivatedBy,
      'DEACTIVATE_USER',
      'User',
      userId,
      { isActive: true },
      { isActive: false }
    )

    return { user, error: null }
  } catch (error: any) {
    console.error('Error deactivating user:', error)
    return { user: null, error: error.message }
  }
}

/**
 * Activa un usuario
 */
export async function activateUser(userId: string, activatedBy: string) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { isActive: true },
    })

    // Registrar la actividad
    await logUserActivity(
      activatedBy,
      'ACTIVATE_USER',
      'User',
      userId,
      { isActive: false },
      { isActive: true }
    )

    return { user, error: null }
  } catch (error: any) {
    console.error('Error activating user:', error)
    return { user: null, error: error.message }
  }
}

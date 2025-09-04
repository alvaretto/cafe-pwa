import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getMessaging, isSupported } from 'firebase/messaging'

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Validar configuración (solo advertir en desarrollo)
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar])
if (missingVars.length > 0) {
  console.warn('⚠️ Missing Firebase environment variables:', missingVars)
  console.warn('📝 Please configure Firebase in .env.local for full functionality')
}

// Inicializar Firebase App solo si tenemos configuración válida
let app: any = null
let auth: any = null
let db: any = null
let storage: any = null

if (missingVars.length === 0) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} else {
  console.warn('🔥 Firebase not initialized - using mock services for development')
}

export { auth, db, storage }

// Configurar emuladores en desarrollo
if (process.env.NODE_ENV === 'development') {
  // Auth emulator
  if (!auth.config.emulator) {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true })
  }
  
  // Firestore emulator
  if (!db._delegate._databaseId.projectId.includes('demo-')) {
    connectFirestoreEmulator(db, 'localhost', 8080)
  }
  
  // Storage emulator
  if (!storage._delegate._host.includes('localhost')) {
    connectStorageEmulator(storage, 'localhost', 9199)
  }
}

// Inicializar Firebase Messaging (solo en el cliente y si es compatible)
export const getMessagingInstance = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getMessaging(app)
  }
  return null
}

// Configuración de autenticación
export const authConfig = {
  // Configurar proveedores de autenticación
  providers: {
    email: true,
    google: true,
    phone: true,
  },
  // Configuración de 2FA
  mfa: {
    enabled: true,
    enforced: false, // No obligatorio por defecto
  },
  // Configuración de sesión
  session: {
    persistence: 'local', // 'local', 'session', 'none'
    timeout: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  },
}

// Configuración de Firestore
export const firestoreConfig = {
  // Configuración de cache
  cache: {
    sizeBytes: 40 * 1024 * 1024, // 40 MB
  },
  // Configuración de offline
  offline: {
    enabled: true,
  },
}

// Configuración de Storage
export const storageConfig = {
  // Configuración de uploads
  maxFileSize: 10 * 1024 * 1024, // 10 MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  // Rutas de almacenamiento
  paths: {
    receipts: 'receipts',
    products: 'products',
    users: 'users',
    reports: 'reports',
  },
}

// Configuración de notificaciones push
export const messagingConfig = {
  vapidKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  // Configuración de notificaciones
  notifications: {
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    sound: '/sounds/notification.mp3',
  },
}

export default app

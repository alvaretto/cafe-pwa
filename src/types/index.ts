// Tipos principales del sistema

// Tipos de usuario y autenticación
export interface User {
  id: string
  email: string
  name?: string
  image?: string
  role: UserRole
  isActive: boolean
  lastLogin?: Date
  emailVerified?: Date
  twoFactorEnabled: boolean
  biometricEnabled: boolean
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR'
}

// Tipos de cliente
export interface Customer {
  id: string
  // Campos requeridos
  nombres: string // Obligatorio
  apellidos: string // Obligatorio
  celular: string // Obligatorio - formato colombiano
  direccionCasa: string // Obligatorio
  email: string // Obligatorio - con validación

  // Campos opcionales
  direccionTrabajo?: string // Opcional
  birthMonth?: number // Opcional (1-12)
  birthDay?: number // Opcional (1-31)

  // Campos existentes conservados
  coffeePreferences?: string
  notes?: string
  isActive: boolean
  segment: CustomerSegment
  loyaltyPoints: number
  totalSpent: number
  lastPurchase?: Date
  createdAt: Date
  updatedAt: Date
}

export enum CustomerSegment {
  NUEVO = 'NUEVO',
  POTENCIAL = 'POTENCIAL',
  OCASIONAL = 'OCASIONAL',
  FRECUENTE = 'FRECUENTE',
  VIP = 'VIP',
  EN_RIESGO = 'EN_RIESGO'
}

// Tipos de producto
export interface Product {
  id: string
  name: string
  description?: string
  sku?: string
  barcode?: string
  qrCode?: string
  pricePerPound: number
  pricePerHalfPound: number
  pricePerKilo: number
  pricePerGram: number
  cost?: number
  margin?: number
  isActive: boolean
  categoryId: string
  category?: ProductCategory
  createdAt: Date
  updatedAt: Date
}

export interface ProductCategory {
  id: string
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export enum UnitType {
  GRAMO = 'GRAMO',
  MEDIA_LIBRA = 'MEDIA_LIBRA',
  LIBRA = 'LIBRA',
  KILOGRAMO = 'KILOGRAMO'
}

// Tipos de venta
export interface Sale {
  id: string
  saleNumber: string
  customerId?: string
  customer?: Customer
  sellerId: string
  seller?: User
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentMethod: PaymentMethod
  agreedPaymentDate?: Date // Fecha acordada para pagos a crédito
  status: SaleStatus
  notes?: string
  items: SaleItem[]
  createdAt: Date
  updatedAt: Date
}

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  product?: Product
  quantity: number
  unitType: UnitType
  unitPrice: number
  totalPrice: number
  createdAt: Date
}

export enum PaymentMethod {
  EFECTIVO = 'EFECTIVO',
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  TRANSFERENCIA = 'TRANSFERENCIA',
  DIGITAL = 'DIGITAL',
  CREDITO = 'CREDITO'
}

export enum SaleStatus {
  PENDIENTE = 'PENDIENTE',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  DEVUELTA = 'DEVUELTA'
}

// Tipos de gastos
export interface Expense {
  id: string
  categoryId: string
  category?: ExpenseCategory
  subcategory?: string
  description: string
  amount: number
  paymentMethod: PaymentMethod
  receipt?: string
  notes?: string
  expenseDate: Date
  userId: string
  user?: User
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseCategory {
  id: string
  name: string
  description?: string
  monthlyBudget?: number
  color: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Tipos de inventario
export interface InventoryItem {
  id: string
  productId: string
  product?: Product
  currentStock: number
  minimumStock: number
  maximumStock?: number
  supplier?: string
  lastRestockDate?: Date
  expirationDate?: Date
  location?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface InventoryMovement {
  id: string
  inventoryItemId: string
  type: MovementType
  quantity: number
  reason?: string
  reference?: string
  userId?: string
  createdAt: Date
}

export enum MovementType {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  AJUSTE = 'AJUSTE',
  DEVOLUCION = 'DEVOLUCION'
}

// Tipos de notificaciones
export interface Notification {
  id: string
  userId?: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  isRead: boolean
  actionUrl?: string
  metadata?: Record<string, any>
  createdAt: Date
  readAt?: Date
  updatedAt: Date
}

export enum NotificationType {
  SISTEMA = 'SISTEMA',
  VENTA = 'VENTA',
  INVENTARIO = 'INVENTARIO',
  CLIENTE = 'CLIENTE',
  RECORDATORIO = 'RECORDATORIO',
  ALERTA = 'ALERTA'
}

export enum NotificationPriority {
  BAJA = 'BAJA',
  NORMAL = 'NORMAL',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA'
}

// Tipos de configuración
export interface SystemConfig {
  id: string
  key: string
  value: string
  description?: string
  category: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// Tipos de reportes
export interface ReportData {
  title: string
  description?: string
  data: any[]
  metadata: {
    generatedAt: Date
    period: {
      start: Date
      end: Date
    }
    filters?: Record<string, any>
    totalRecords: number
  }
}

export interface DashboardMetrics {
  sales: {
    today: number
    thisWeek: number
    thisMonth: number
    growth: number
  }
  customers: {
    total: number
    new: number
    active: number
    retention: number
  }
  inventory: {
    lowStock: number
    outOfStock: number
    totalValue: number
    turnover: number
  }
  revenue: {
    today: number
    thisWeek: number
    thisMonth: number
    profit: number
  }
}

// Tipos de formularios
export interface CreateSaleForm {
  customerId?: string
  items: {
    productId: string
    quantity: number
    unitType: UnitType
  }[]
  discount?: number
  tax?: number
  paymentMethod: PaymentMethod
  agreedPaymentDate?: Date // Requerido para pagos a crédito
  notes?: string
}

export interface CreateCustomerForm {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  alternativePhone?: string
  homeAddress?: string
  workAddress?: string
  birthMonth?: number
  birthDay?: number
  coffeePreferences?: string
  notes?: string
}

export interface CreateProductForm {
  name: string
  description?: string
  categoryId: string
  sku?: string
  barcode?: string
  pricePerPound: number
  pricePerHalfPound: number
  pricePerKilo: number
  pricePerGram: number
  cost?: number
}

// Tipos de API
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, any>
}

// Tipos de estado global
export interface AppState {
  user: User | null
  isLoading: boolean
  error: string | null
  theme: 'light' | 'dark' | 'system'
  language: string
  currency: string
  notifications: Notification[]
}

// Tipos de configuración de la aplicación
export interface AppConfig {
  name: string
  version: string
  description: string
  author: string
  homepage: string
  repository: string
  license: string
  features: {
    pwa: boolean
    offline: boolean
    notifications: boolean
    biometric: boolean
    multiLanguage: boolean
    darkMode: boolean
  }
  limits: {
    maxFileSize: number
    maxUsers: number
    maxProducts: number
    maxCustomers: number
  }
  integrations: {
    gemini: boolean
    firebase: boolean
    analytics: boolean
    payments: boolean
  }
}

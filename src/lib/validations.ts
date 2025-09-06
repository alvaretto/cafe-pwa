import { z } from 'zod'
import { UserRole, CustomerSegment, PaymentMethod, SaleStatus, UnitType, MovementType, NotificationType, NotificationPriority } from '@/types'

// Validaciones de usuario
export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  role: z.nativeEnum(UserRole),
  isActive: z.boolean().default(true),
  twoFactorEnabled: z.boolean().default(false),
  biometricEnabled: z.boolean().default(false),
})

export const createUserSchema = userSchema.extend({
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export const updateUserSchema = userSchema.partial().extend({
  id: z.string().cuid(),
})

// Validaciones de cliente
export const customerSchema = z.object({
  // Campos requeridos
  nombres: z.string()
    .min(2, 'Los nombres deben tener al menos 2 caracteres')
    .max(50, 'Los nombres no pueden exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los nombres solo pueden contener letras y espacios'),
  apellidos: z.string()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(50, 'Los apellidos no pueden exceder 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'Los apellidos solo pueden contener letras y espacios'),
  celular: z.string()
    .regex(/^\+57\s(3[0-2][0-9]|35[0-1])\s\d{3}\s\d{4}$/, 'Formato de celular inválido. Use: +57 3XX XXX XXXX'),
  direccionCasa: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  email: z.string().email('Formato de correo electrónico inválido'),

  // Campos opcionales
  direccionTrabajo: z.string()
    .min(10, 'La dirección de trabajo debe tener al menos 10 caracteres')
    .max(200, 'La dirección de trabajo no puede exceder 200 caracteres')
    .optional(),
  birthMonth: z.number().min(1).max(12).optional(),
  birthDay: z.number().min(1).max(31).optional(),

  // Campos existentes conservados
  coffeePreferences: z.string().optional(),
  notes: z.string().optional(),
  segment: z.nativeEnum(CustomerSegment).default(CustomerSegment.NUEVO),
})

export const updateCustomerSchema = customerSchema.partial().extend({
  id: z.string().cuid(),
})

// Validaciones de categoría de producto
export const productCategorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
})

export const updateProductCategorySchema = productCategorySchema.partial().extend({
  id: z.string().cuid(),
})

// Validaciones de producto
export const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  qrCode: z.string().optional(),
  pricePerPound: z.number().positive('El precio por libra debe ser positivo'),
  pricePerHalfPound: z.number().positive('El precio por media libra debe ser positivo'),
  pricePerKilo: z.number().positive('El precio por kilogramo debe ser positivo'),
  pricePerGram: z.number().positive('El precio por gramo debe ser positivo'),
  cost: z.number().positive('El costo debe ser positivo').optional(),
  margin: z.number().min(0).max(100, 'El margen debe estar entre 0 y 100%').optional(),
  isActive: z.boolean().default(true),
  categoryId: z.string().cuid('ID de categoría inválido'),
})

export const updateProductSchema = productSchema.partial().extend({
  id: z.string().cuid(),
})

// Validaciones de venta
export const saleItemSchema = z.object({
  productId: z.string().cuid('ID de producto inválido'),
  quantity: z.number().positive('La cantidad debe ser positiva'),
  unitType: z.nativeEnum(UnitType),
  unitPrice: z.number().positive('El precio unitario debe ser positivo'),
  totalPrice: z.number().positive('El precio total debe ser positivo'),
})

// Schema base para ventas (sin refinements)
const baseSaleSchema = z.object({
  customerId: z.string().cuid('ID de cliente inválido').optional(),
  sellerId: z.string().cuid('ID de vendedor inválido'),
  items: z.array(saleItemSchema).min(1, 'Debe haber al menos un item'),
  subtotal: z.number().positive('El subtotal debe ser positivo'),
  discount: z.number().min(0, 'El descuento no puede ser negativo').default(0),
  tax: z.number().min(0, 'El impuesto no puede ser negativo').default(0),
  total: z.number().positive('El total debe ser positivo'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  agreedPaymentDate: z.date().optional(),
  status: z.nativeEnum(SaleStatus).default(SaleStatus.COMPLETADA),
  notes: z.string().optional(),
})

// Schema completo con validaciones
export const saleSchema = baseSaleSchema.refine((data) => {
  // Si el método de pago es crédito, la fecha acordada es obligatoria y debe ser futura
  if (data.paymentMethod === PaymentMethod.CREDITO) {
    if (!data.agreedPaymentDate) {
      return false
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const agreedDate = new Date(data.agreedPaymentDate)
    agreedDate.setHours(0, 0, 0, 0)
    return agreedDate > today
  }
  return true
}, {
  message: 'Para pagos a crédito, la fecha acordada es obligatoria y debe ser posterior a hoy',
  path: ['agreedPaymentDate']
})

// Schema para actualizaciones (usa el schema base para poder usar .partial())
export const updateSaleSchema = baseSaleSchema.partial().extend({
  id: z.string().cuid(),
})

// Schema específico para el formulario de creación de ventas
export const createSaleFormSchema = z.object({
  customerId: z.string().cuid('ID de cliente inválido').optional(),
  items: z.array(z.object({
    productId: z.string().cuid('ID de producto inválido'),
    quantity: z.number().positive('La cantidad debe ser positiva'),
    unitType: z.nativeEnum(UnitType),
  })).min(1, 'Debe haber al menos un item'),
  discount: z.number().min(0, 'El descuento no puede ser negativo').optional(),
  tax: z.number().min(0, 'El impuesto no puede ser negativo').optional(),
  paymentMethod: z.nativeEnum(PaymentMethod),
  agreedPaymentDate: z.date().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // Si el método de pago es crédito, la fecha acordada es obligatoria y debe ser futura
  if (data.paymentMethod === PaymentMethod.CREDITO) {
    if (!data.agreedPaymentDate) {
      return false
    }
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const agreedDate = new Date(data.agreedPaymentDate)
    agreedDate.setHours(0, 0, 0, 0)
    return agreedDate > today
  }
  return true
}, {
  message: 'Para pagos a crédito, la fecha acordada es obligatoria y debe ser posterior a hoy',
  path: ['agreedPaymentDate']
})

// Validaciones de categoría de gasto
export const expenseCategorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  monthlyBudget: z.number().positive('El presupuesto mensual debe ser positivo').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'El color debe ser un código hexadecimal válido'),
  isActive: z.boolean().default(true),
})

export const updateExpenseCategorySchema = expenseCategorySchema.partial().extend({
  id: z.string().cuid(),
})

// Validaciones de gasto
export const expenseSchema = z.object({
  categoryId: z.string().cuid('ID de categoría inválido'),
  subcategory: z.string().optional(),
  description: z.string().min(2, 'La descripción debe tener al menos 2 caracteres'),
  amount: z.number().positive('El monto debe ser positivo'),
  paymentMethod: z.nativeEnum(PaymentMethod),
  receipt: z.string().url('URL de comprobante inválida').optional(),
  notes: z.string().optional(),
  expenseDate: z.date(),
  userId: z.string().cuid('ID de usuario inválido'),
})

export const updateExpenseSchema = expenseSchema.partial().extend({
  id: z.string().cuid(),
})

// Validaciones de inventario
export const inventoryItemSchema = z.object({
  productId: z.string().cuid('ID de producto inválido'),
  currentStock: z.number().min(0, 'El stock actual no puede ser negativo'),
  minimumStock: z.number().min(0, 'El stock mínimo no puede ser negativo'),
  maximumStock: z.number().positive('El stock máximo debe ser positivo').optional(),
  supplier: z.string().optional(),
  lastRestockDate: z.date().optional(),
  expirationDate: z.date().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
})

export const updateInventoryItemSchema = inventoryItemSchema.partial().extend({
  id: z.string().cuid(),
})

// Validaciones de movimiento de inventario
export const inventoryMovementSchema = z.object({
  inventoryItemId: z.string().cuid('ID de item de inventario inválido'),
  type: z.nativeEnum(MovementType),
  quantity: z.number().positive('La cantidad debe ser positiva'),
  reason: z.string().optional(),
  reference: z.string().optional(),
  userId: z.string().cuid('ID de usuario inválido').optional(),
})

// Validaciones de notificación
export const notificationSchema = z.object({
  userId: z.string().cuid('ID de usuario inválido').optional(),
  title: z.string().min(1, 'El título es requerido'),
  message: z.string().min(1, 'El mensaje es requerido'),
  type: z.nativeEnum(NotificationType),
  priority: z.nativeEnum(NotificationPriority).default(NotificationPriority.NORMAL),
  actionUrl: z.string().url('URL de acción inválida').optional(),
  metadata: z.record(z.any()).optional(),
})

// Validaciones de configuración del sistema
export const systemConfigSchema = z.object({
  key: z.string().min(1, 'La clave es requerida'),
  value: z.string().min(1, 'El valor es requerido'),
  description: z.string().optional(),
  category: z.string().default('general'),
  isPublic: z.boolean().default(false),
})

export const updateSystemConfigSchema = systemConfigSchema.partial().extend({
  id: z.string().cuid(),
})

// Validaciones de paginación
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  filters: z.record(z.any()).optional(),
})

// Validaciones de fechas
export const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine(data => data.startDate <= data.endDate, {
  message: 'La fecha de inicio debe ser anterior o igual a la fecha de fin',
  path: ['endDate'],
})

// Validaciones de reportes
export const reportSchema = z.object({
  type: z.string().min(1, 'El tipo de reporte es requerido'),
  dateRange: dateRangeSchema.optional(),
  filters: z.record(z.any()).optional(),
  format: z.enum(['json', 'csv', 'pdf', 'xlsx']).default('json'),
})

// Validaciones de autenticación
export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Funciones de utilidad para validación de clientes

/**
 * Valida todos los campos de un cliente
 */
export function validateCustomer(customer: {
  nombres: string
  apellidos: string
  celular: string
  direccionCasa: string
  email: string
  direccionTrabajo?: string
  birthMonth?: number
  birthDay?: number
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  // Validar nombres
  if (!customer.nombres.trim()) {
    errors.nombres = 'Los nombres son requeridos'
  } else if (customer.nombres.trim().length < 2) {
    errors.nombres = 'Los nombres deben tener al menos 2 caracteres'
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(customer.nombres.trim())) {
    errors.nombres = 'Los nombres solo pueden contener letras y espacios'
  }

  // Validar apellidos
  if (!customer.apellidos.trim()) {
    errors.apellidos = 'Los apellidos son requeridos'
  } else if (customer.apellidos.trim().length < 2) {
    errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres'
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(customer.apellidos.trim())) {
    errors.apellidos = 'Los apellidos solo pueden contener letras y espacios'
  }

  // Validar celular
  if (!customer.celular.trim()) {
    errors.celular = 'El número de celular es requerido'
  } else if (!/^\+57\s(3[0-2][0-9]|35[0-1])\s\d{3}\s\d{4}$/.test(customer.celular)) {
    errors.celular = 'Formato de celular inválido. Use: +57 3XX XXX XXXX'
  }

  // Validar dirección casa
  if (!customer.direccionCasa.trim()) {
    errors.direccionCasa = 'La dirección de casa es requerida'
  } else if (customer.direccionCasa.trim().length < 10) {
    errors.direccionCasa = 'La dirección debe tener al menos 10 caracteres'
  }

  // Validar email
  if (!customer.email.trim()) {
    errors.email = 'El correo electrónico es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    errors.email = 'Formato de correo electrónico inválido'
  }

  // Validar dirección trabajo (opcional)
  if (customer.direccionTrabajo && customer.direccionTrabajo.trim().length > 0) {
    if (customer.direccionTrabajo.trim().length < 10) {
      errors.direccionTrabajo = 'La dirección de trabajo debe tener al menos 10 caracteres'
    }
  }

  // Validar mes de cumpleaños
  if (customer.birthMonth !== undefined && customer.birthMonth !== null) {
    if (!Number.isInteger(customer.birthMonth) || customer.birthMonth < 1 || customer.birthMonth > 12) {
      errors.birthMonth = 'El mes debe estar entre 1 y 12'
    }
  }

  // Validar día de cumpleaños
  if (customer.birthDay !== undefined && customer.birthDay !== null) {
    if (!Number.isInteger(customer.birthDay) || customer.birthDay < 1 || customer.birthDay > 31) {
      errors.birthDay = 'El día debe estar entre 1 y 31'
    }

    // Validación específica por mes
    if (customer.birthMonth && customer.birthDay) {
      const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      const monthIndex = customer.birthMonth - 1
      const birthDay = customer.birthDay
      const maxDays = daysInMonth[monthIndex]
      if (maxDays && birthDay > maxDays) {
        errors.birthDay = `El mes ${customer.birthMonth} no tiene ${birthDay} días`
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Formatea un nombre completo
 */
export function formatFullName(nombres: string, apellidos: string): string {
  return `${nombres.trim()} ${apellidos.trim()}`
}

/**
 * Formatea un número de celular para mostrar
 */
export function formatCelular(celular: string): string {
  // Si ya está formateado, devolverlo tal como está
  if (celular.includes('+57')) {
    return celular
  }

  // Si es solo números, formatear
  const numbers = celular.replace(/\D/g, '')
  if (numbers.length === 10 && numbers.startsWith('3')) {
    return `+57 ${numbers.substring(0, 3)} ${numbers.substring(3, 6)} ${numbers.substring(6)}`
  }

  return celular
}

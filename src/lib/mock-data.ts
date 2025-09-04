// Datos simulados para la aplicación
import { ExpenseCategory } from '@/types'

export interface Product {
  id: string
  name: string
  description: string
  category: string
  sku: string
  barcode?: string
  qrCode?: string
  pricePerGram: number
  pricePerHalfPound: number
  pricePerPound: number
  pricePerKilo: number
  cost: number
  margin: number
  isActive: boolean
  stock: number
  minStock: number
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  isActive: boolean
  productCount: number
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Café Arábica',
    description: 'Café de alta calidad con sabor suave y aromático',
    isActive: true,
    productCount: 4,
  },
  {
    id: '2',
    name: 'Café Robusta',
    description: 'Café con mayor contenido de cafeína y sabor más fuerte',
    isActive: true,
    productCount: 2,
  },
  {
    id: '3',
    name: 'Mezclas Especiales',
    description: 'Mezclas únicas de diferentes tipos de café',
    isActive: true,
    productCount: 3,
  },
  {
    id: '4',
    name: 'Café Orgánico',
    description: 'Café cultivado sin químicos, certificado orgánico',
    isActive: true,
    productCount: 2,
  },
]

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Café Arábica Premium',
    description: 'Café arábica de origen colombiano, tostado medio con notas frutales y florales',
    category: 'Café Arábica',
    sku: 'ARA001',
    barcode: '7701234567890',
    qrCode: 'QR-ARA001',
    pricePerGram: 55,
    pricePerHalfPound: 13000,
    pricePerPound: 25000,
    pricePerKilo: 55000,
    cost: 15000,
    margin: 66.67,
    isActive: true,
    stock: 2268, // gramos (5.0 lb)
    minStock: 454, // gramos (1.0 lb)
    image: '/images/arabica-premium.jpg',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Café Robusta Intenso',
    description: 'Café robusta con sabor intenso y mayor contenido de cafeína, ideal para espresso',
    category: 'Café Robusta',
    sku: 'ROB001',
    barcode: '7701234567891',
    qrCode: 'QR-ROB001',
    pricePerGram: 44,
    pricePerHalfPound: 10500,
    pricePerPound: 20000,
    pricePerKilo: 44000,
    cost: 12000,
    margin: 66.67,
    isActive: true,
    stock: 1814, // gramos (4.0 lb)
    minStock: 227, // gramos (0.5 lb)
    image: '/images/robusta-intenso.jpg',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Mezcla del Mirador',
    description: 'Mezcla especial de la casa con 70% arábica y 30% robusta, notas achocolatadas',
    category: 'Mezclas Especiales',
    sku: 'MIR001',
    barcode: '7701234567892',
    qrCode: 'QR-MIR001',
    pricePerGram: 66,
    pricePerHalfPound: 15500,
    pricePerPound: 30000,
    pricePerKilo: 66000,
    cost: 18000,
    margin: 66.67,
    isActive: true,
    stock: 4990, // gramos (11.0 lb)
    minStock: 907, // gramos (2.0 lb)
    image: '/images/mezcla-mirador.jpg',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '4',
    name: 'Café Orgánico Certificado',
    description: 'Café orgánico certificado, cultivado sin químicos con métodos sostenibles',
    category: 'Café Orgánico',
    sku: 'ORG001',
    barcode: '7701234567893',
    qrCode: 'QR-ORG001',
    pricePerGram: 77,
    pricePerHalfPound: 18000,
    pricePerPound: 35000,
    pricePerKilo: 77000,
    cost: 22000,
    margin: 59.09,
    isActive: true,
    stock: 136, // gramos (0.3 lb) - Stock crítico
    minStock: 454, // gramos (1.0 lb)
    image: '/images/organico-certificado.jpg',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    name: 'Café Descafeinado',
    description: 'Café arábica descafeinado mediante proceso de agua, mantiene el sabor original',
    category: 'Café Arábica',
    sku: 'DEC001',
    barcode: '7701234567894',
    qrCode: 'QR-DEC001',
    pricePerGram: 60,
    pricePerHalfPound: 14000,
    pricePerPound: 27000,
    pricePerKilo: 60000,
    cost: 16000,
    margin: 68.75,
    isActive: true,
    stock: 900,
    minStock: 200,
    image: '/images/descafeinado.jpg',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-19'),
  },
  {
    id: '6',
    name: 'Espresso Blend',
    description: 'Mezcla perfecta para espresso con cuerpo intenso y crema persistente',
    category: 'Mezclas Especiales',
    sku: 'ESP001',
    barcode: '7701234567895',
    qrCode: 'QR-ESP001',
    pricePerGram: 72,
    pricePerHalfPound: 17000,
    pricePerPound: 32000,
    pricePerKilo: 72000,
    cost: 19000,
    margin: 68.42,
    isActive: true,
    stock: 2100,
    minStock: 500,
    image: '/images/espresso-blend.jpg',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-21'),
  },
  {
    id: '7',
    name: 'Café Tostado Oscuro',
    description: 'Café con tostado oscuro, sabor intenso y notas ahumadas',
    category: 'Café Robusta',
    sku: 'OSC001',
    barcode: '7701234567896',
    qrCode: 'QR-OSC001',
    pricePerGram: 48,
    pricePerHalfPound: 11500,
    pricePerPound: 22000,
    pricePerKilo: 48000,
    cost: 13000,
    margin: 69.23,
    isActive: true,
    stock: 1600,
    minStock: 350,
    image: '/images/tostado-oscuro.jpg',
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: '8',
    name: 'Café de Origen Huila',
    description: 'Café de origen único del departamento del Huila, notas cítricas y dulces',
    category: 'Café Arábica',
    sku: 'HUI001',
    barcode: '7701234567897',
    qrCode: 'QR-HUI001',
    pricePerGram: 85,
    pricePerHalfPound: 20000,
    pricePerPound: 38000,
    pricePerKilo: 85000,
    cost: 25000,
    margin: 65.79,
    isActive: true,
    stock: 800,
    minStock: 150,
    image: '/images/origen-huila.jpg',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-24'),
  },
]

// Funciones de utilidad para trabajar con los datos simulados
export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find(product => product.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return MOCK_PRODUCTS.filter(product => product.category === category && product.isActive)
}

export function getCategoryById(id: string): Category | undefined {
  return MOCK_CATEGORIES.find(category => category.id === id)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return MOCK_PRODUCTS.filter(product => 
    product.isActive && (
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.sku.toLowerCase().includes(lowercaseQuery)
    )
  )
}

export function getLowStockProducts(): Product[] {
  return MOCK_PRODUCTS.filter(product => 
    product.isActive && product.stock <= product.minStock
  )
}

export function getProductStats() {
  const activeProducts = MOCK_PRODUCTS.filter(p => p.isActive)
  const totalValue = activeProducts.reduce((sum, p) => sum + (p.stock * p.pricePerGram), 0)
  const lowStockCount = getLowStockProducts().length
  const avgMargin = activeProducts.reduce((sum, p) => sum + p.margin, 0) / activeProducts.length

  return {
    totalProducts: activeProducts.length,
    totalCategories: MOCK_CATEGORIES.filter(c => c.isActive).length,
    totalValue,
    lowStockCount,
    avgMargin,
  }
}

// Tipos y datos para ventas
export interface SaleItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitType: 'gramos' | 'media_libra' | 'libra' | 'kilo'
  unitPrice: number
  totalPrice: number
}

export interface Sale {
  id: string
  saleNumber: string
  customerId?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'transferencia' | 'digital' | 'credito'
  agreedPaymentDate?: Date // Fecha acordada para pagos a crédito
  paymentStatus: 'pendiente' | 'completado' | 'cancelado' | 'devuelto'
  notes?: string
  sellerId: string
  sellerName: string
  createdAt: Date
  updatedAt: Date
}

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
  totalPurchases: number
  totalSpent: number
  loyaltyPoints: number
  isVip: boolean
  segment: 'NUEVO' | 'POTENCIAL' | 'OCASIONAL' | 'FRECUENTE' | 'VIP' | 'EN_RIESGO'
  lastPurchase?: Date
  createdAt: Date
  updatedAt: Date
}

// Datos simulados de clientes expandidos
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    nombres: 'María Elena',
    apellidos: 'González Vargas',
    celular: '+57 300 123 4567',
    direccionCasa: 'Calle 123 #45-67, Bogotá',
    email: 'maria.gonzalez@email.com',
    direccionTrabajo: 'Carrera 7 #32-16, Centro Bogotá',
    birthMonth: 3,
    birthDay: 15,
    coffeePreferences: 'Café arábica, tostado medio',
    notes: 'Cliente VIP, prefiere entregas en la mañana',
    totalPurchases: 15,
    totalSpent: 450000,
    loyaltyPoints: 450,
    isVip: true,
    segment: 'VIP',
    lastPurchase: new Date('2025-08-20'),
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2025-08-20'),
  },
  {
    id: '2',
    nombres: 'Carlos Alberto',
    apellidos: 'Rodríguez Mendoza',
    celular: '+57 301 234 5678',
    direccionCasa: 'Carrera 45 #12-34, Medellín',
    email: 'carlos.rodriguez@email.com',
    direccionTrabajo: 'Zona Industrial, Medellín',
    birthMonth: 7,
    birthDay: 22,
    coffeePreferences: 'Café fuerte, sin azúcar',
    totalPurchases: 8,
    totalSpent: 240000,
    loyaltyPoints: 240,
    isVip: false,
    segment: 'FRECUENTE',
    lastPurchase: new Date('2025-08-18'),
    createdAt: new Date('2023-09-10'),
    updatedAt: new Date('2025-08-18'),
  },
  {
    id: '3',
    nombres: 'Ana Sofía',
    apellidos: 'Martínez López',
    celular: '+57 302 345 6789',
    direccionCasa: 'Avenida 80 #25-15, Cali',
    email: 'ana.martinez@email.com',
    direccionTrabajo: 'Centro Comercial Chipichape, Cali',
    birthMonth: 11,
    birthDay: 8,
    coffeePreferences: 'Café orgánico, con leche de almendras',
    notes: 'Excelente cliente, siempre puntual en pagos',
    totalPurchases: 22,
    totalSpent: 680000,
    loyaltyPoints: 680,
    isVip: true,
    segment: 'VIP',
    lastPurchase: new Date('2025-08-22'),
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2025-08-22'),
  },
  {
    id: '4',
    nombres: 'Luis Fernando',
    apellidos: 'Pérez Castillo',
    celular: '+57 303 456 7890',
    direccionCasa: 'Calle 50 #30-20, Barranquilla',
    email: 'luis.perez@email.com',
    birthMonth: 5,
    birthDay: 12,
    coffeePreferences: 'Café colombiano tradicional',
    totalPurchases: 5,
    totalSpent: 125000,
    loyaltyPoints: 125,
    isVip: false,
    segment: 'OCASIONAL',
    lastPurchase: new Date('2025-08-15'),
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2025-08-15'),
  },
  {
    id: '5',
    nombres: 'Carmen Lucía',
    apellidos: 'Torres Herrera',
    celular: '+57 304 567 8901',
    direccionCasa: 'Carrera 15 #40-25, Bucaramanga',
    email: 'carmen.torres@email.com',
    direccionTrabajo: 'Universidad Pontificia Bolivariana, Bucaramanga',
    birthMonth: 9,
    birthDay: 3,
    coffeePreferences: 'Café descafeinado, con canela',
    notes: 'Profesora universitaria, pedidos regulares',
    totalPurchases: 18,
    totalSpent: 520000,
    loyaltyPoints: 520,
    isVip: true,
    segment: 'VIP',
    lastPurchase: new Date('2025-08-24'),
    createdAt: new Date('2023-04-12'),
    updatedAt: new Date('2025-08-24'),
  },
  {
    id: '6',
    nombres: 'Roberto',
    apellidos: 'Silva Moreno',
    celular: '+57 305 678 9012',
    direccionCasa: 'Calle 72 #11-45, Bogotá',
    email: 'roberto.silva@email.com',
    birthMonth: 1,
    birthDay: 28,
    coffeePreferences: 'Café negro, sin azúcar',
    totalPurchases: 2,
    totalSpent: 65000,
    loyaltyPoints: 65,
    isVip: false,
    segment: 'NUEVO',
    lastPurchase: new Date('2025-08-15'),
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2025-08-15'),
  },
  {
    id: '7',
    nombres: 'Patricia',
    apellidos: 'Ramírez Gómez',
    celular: '+57 306 789 0123',
    direccionCasa: 'Avenida Las Palmas #55-30, Medellín',
    email: 'patricia.ramirez@email.com',
    direccionTrabajo: 'Clínica Las Vegas, Medellín',
    birthMonth: 6,
    birthDay: 18,
    coffeePreferences: 'Café con leche, azúcar morena',
    notes: 'Médica, horarios variables',
    totalPurchases: 12,
    totalSpent: 340000,
    loyaltyPoints: 340,
    isVip: false,
    segment: 'FRECUENTE',
    lastPurchase: new Date('2025-08-19'),
    createdAt: new Date('2023-07-08'),
    updatedAt: new Date('2025-08-19'),
  },
  {
    id: '8',
    nombres: 'Diego Alejandro',
    apellidos: 'Morales Jiménez',
    celular: '+57 307 890 1234',
    direccionCasa: 'Calle 85 #20-10, Bogotá',
    email: 'diego.morales@email.com',
    direccionTrabajo: 'Torre Colpatria, Bogotá',
    birthMonth: 12,
    birthDay: 5,
    coffeePreferences: 'Café premium, tostado oscuro',
    notes: 'Ejecutivo, cliente desde el inicio',
    totalPurchases: 25,
    totalSpent: 750000,
    loyaltyPoints: 750,
    isVip: true,
    segment: 'VIP',
    lastPurchase: new Date('2025-08-25'),
    createdAt: new Date('2023-02-28'),
    updatedAt: new Date('2025-08-25'),
  },
  {
    id: 'cust-009',
    nombres: 'Patricia',
    apellidos: 'Morales Vega',
    celular: '+57 315 234 5678',
    direccionCasa: 'Calle 45 #23-67, Barrio La Esperanza',
    email: 'patricia.morales@email.com',
    direccionTrabajo: 'Centro Comercial Plaza Mayor, Local 45',
    birthMonth: 9,
    birthDay: 14,
    coffeePreferences: 'Café suave, con leche deslactosada',
    notes: 'Cliente potencial, muestra interés en productos premium',
    totalPurchases: 3,
    totalSpent: 120000,
    loyaltyPoints: 120,
    isVip: false,
    segment: 'POTENCIAL',
    lastPurchase: new Date('2025-08-12'),
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2025-08-12'),
  },
  {
    id: 'cust-010',
    nombres: 'Roberto',
    apellidos: 'Silva Herrera',
    celular: '+57 301 876 5432',
    direccionCasa: 'Carrera 78 #34-12, Barrio San José',
    email: 'roberto.silva@email.com',
    birthMonth: 4,
    birthDay: 8,
    coffeePreferences: 'Café negro, muy fuerte',
    notes: 'Cliente inactivo, no compra desde hace meses',
    totalPurchases: 2,
    totalSpent: 45000,
    loyaltyPoints: 45,
    isVip: false,
    segment: 'EN_RIESGO',
    lastPurchase: new Date('2023-09-15'),
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2023-09-15'),
  },
  {
    id: 'cust-011',
    nombres: 'Claudia',
    apellidos: 'Ramírez Torres',
    celular: '+57 320 654 3210',
    direccionCasa: 'Avenida 68 #45-23, Barrio El Prado',
    email: 'claudia.ramirez@email.com',
    direccionTrabajo: 'Universidad Nacional, Facultad de Ingeniería',
    birthMonth: 11,
    birthDay: 30,
    coffeePreferences: 'Café orgánico, sin azúcar',
    notes: 'Profesora universitaria, cliente en riesgo por inactividad',
    totalPurchases: 8,
    totalSpent: 180000,
    loyaltyPoints: 180,
    isVip: false,
    segment: 'EN_RIESGO',
    lastPurchase: new Date('2023-08-20'),
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-08-20'),
  },
]

// Datos simulados de ventas
export const MOCK_SALES: Sale[] = [
  {
    id: '1',
    saleNumber: 'VTA-2024-001',
    customerId: '1',
    customerName: 'María González',
    customerEmail: 'maria.gonzalez@email.com',
    customerPhone: '+57 300 123 4567',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Café Arábica Premium',
        quantity: 500,
        unitType: 'gramos',
        unitPrice: 55,
        totalPrice: 27500,
      },
    ],
    subtotal: 27500,
    tax: 0,
    discount: 0,
    total: 27500,
    paymentMethod: 'efectivo',
    paymentStatus: 'completado',
    notes: 'Cliente frecuente',
    sellerId: '2',
    sellerName: 'María González',
    createdAt: new Date('2024-01-25T10:30:00'),
    updatedAt: new Date('2024-01-25T10:30:00'),
  },
  {
    id: '2',
    saleNumber: 'VTA-2024-002',
    customerId: '2',
    customerName: 'Carlos Rodríguez',
    items: [
      {
        id: '2',
        productId: '3',
        productName: 'Mezcla del Mirador',
        quantity: 1,
        unitType: 'libra',
        unitPrice: 30000,
        totalPrice: 30000,
      },
      {
        id: '3',
        productId: '4',
        productName: 'Café Orgánico Certificado',
        quantity: 250,
        unitType: 'gramos',
        unitPrice: 77,
        totalPrice: 19250,
      },
    ],
    subtotal: 49250,
    tax: 0,
    discount: 2500,
    total: 46750,
    paymentMethod: 'tarjeta_credito',
    paymentStatus: 'completado',
    notes: 'Descuento por compra múltiple',
    sellerId: '2',
    sellerName: 'María González',
    createdAt: new Date('2024-01-25T14:15:00'),
    updatedAt: new Date('2024-01-25T14:15:00'),
  },
  {
    id: '3',
    saleNumber: 'VTA-2024-003',
    customerId: '3',
    customerName: 'Carlos Rodríguez',
    customerEmail: 'carlos.rodriguez@email.com',
    customerPhone: '+57 300 123 4567',
    items: [
      {
        id: '5',
        productId: '1',
        productName: 'Café Especial Huila',
        quantity: 2000, // 2 kilos
        unitType: 'gramos',
        unitPrice: 18.5,
        totalPrice: 37000,
      },
      {
        id: '6',
        productId: '3',
        productName: 'Café Descafeinado',
        quantity: 500, // 500 gramos
        unitType: 'gramos',
        unitPrice: 22,
        totalPrice: 11000,
      },
    ],
    subtotal: 48000,
    tax: 0,
    discount: 0,
    total: 48000,
    paymentMethod: 'credito',
    agreedPaymentDate: new Date('2024-02-15'), // Fecha acordada para el pago
    paymentStatus: 'pendiente',
    notes: 'Cliente corporativo - Pago a 30 días',
    sellerId: '1',
    sellerName: 'Juan Pérez',
    createdAt: new Date('2024-01-26T09:00:00'),
    updatedAt: new Date('2024-01-26T09:00:00'),
  },
  {
    id: '4',
    saleNumber: 'VTA-2024-004',
    customerId: '4',
    customerName: 'Ana Martínez',
    customerEmail: 'ana.martinez@email.com',
    customerPhone: '+57 301 987 6543',
    items: [
      {
        id: '7',
        productId: '2',
        productName: 'Café Premium Nariño',
        quantity: 1500, // 1.5 kilos
        unitType: 'gramos',
        unitPrice: 20,
        totalPrice: 30000,
      },
    ],
    subtotal: 30000,
    tax: 0,
    discount: 1500, // 5% descuento
    total: 28500,
    paymentMethod: 'credito',
    agreedPaymentDate: new Date('2024-02-10'), // Fecha acordada para el pago
    paymentStatus: 'pendiente',
    notes: 'Cliente VIP - Descuento aplicado - Pago acordado para el 10 de febrero',
    sellerId: '2',
    sellerName: 'María González',
    createdAt: new Date('2024-01-26T16:30:00'),
    updatedAt: new Date('2024-01-26T16:30:00'),
  },
]

// Funciones de utilidad para ventas
export function getSaleById(id: string): Sale | undefined {
  return MOCK_SALES.find(sale => sale.id === id)
}



export function getSalesByDateRange(startDate: Date, endDate: Date): Sale[] {
  return MOCK_SALES.filter(sale =>
    sale.createdAt >= startDate && sale.createdAt <= endDate
  )
}

export function getSalesStats() {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const todaySales = MOCK_SALES.filter(sale => sale.createdAt >= startOfDay)
  const weekSales = MOCK_SALES.filter(sale => sale.createdAt >= startOfWeek)
  const monthSales = MOCK_SALES.filter(sale => sale.createdAt >= startOfMonth)

  return {
    today: {
      count: todaySales.length,
      total: todaySales.reduce((sum, sale) => sum + sale.total, 0),
    },
    week: {
      count: weekSales.length,
      total: weekSales.reduce((sum, sale) => sum + sale.total, 0),
    },
    month: {
      count: monthSales.length,
      total: monthSales.reduce((sum, sale) => sum + sale.total, 0),
    },
    total: {
      count: MOCK_SALES.length,
      total: MOCK_SALES.reduce((sum, sale) => sum + sale.total, 0),
    },
  }
}

// Funciones de utilidad para clientes
export function searchCustomers(query: string): Customer[] {
  const lowercaseQuery = query.toLowerCase()
  return MOCK_CUSTOMERS.filter(customer =>
    customer.nombres.toLowerCase().includes(lowercaseQuery) ||
    customer.apellidos.toLowerCase().includes(lowercaseQuery) ||
    customer.email.toLowerCase().includes(lowercaseQuery) ||
    customer.celular.toLowerCase().includes(lowercaseQuery) ||
    customer.direccionCasa.toLowerCase().includes(lowercaseQuery) ||
    customer.direccionTrabajo?.toLowerCase().includes(lowercaseQuery) ||
    customer.coffeePreferences?.toLowerCase().includes(lowercaseQuery) ||
    customer.notes?.toLowerCase().includes(lowercaseQuery)
  )
}

export function getVipCustomers(): Customer[] {
  return MOCK_CUSTOMERS.filter(customer => customer.isVip)
}

export function getNewCustomers(days: number = 30): Customer[] {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  return MOCK_CUSTOMERS.filter(customer => customer.createdAt >= cutoffDate)
}

export function getTopCustomers(limit: number = 10): Customer[] {
  return [...MOCK_CUSTOMERS]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, limit)
}

export function getCustomersBySegment() {
  const vip = MOCK_CUSTOMERS.filter(c => c.segment === 'VIP')
  const frecuente = MOCK_CUSTOMERS.filter(c => c.segment === 'FRECUENTE')
  const ocasional = MOCK_CUSTOMERS.filter(c => c.segment === 'OCASIONAL')
  const potencial = MOCK_CUSTOMERS.filter(c => c.segment === 'POTENCIAL')
  const nuevo = MOCK_CUSTOMERS.filter(c => c.segment === 'NUEVO')
  const enRiesgo = MOCK_CUSTOMERS.filter(c => c.segment === 'EN_RIESGO')

  return {
    vip: vip.length,
    frecuente: frecuente.length,
    ocasional: ocasional.length,
    potencial: potencial.length,
    nuevo: nuevo.length,
    enRiesgo: enRiesgo.length,
    total: MOCK_CUSTOMERS.length,
    // Mantener compatibilidad con código existente
    regular: frecuente.length + ocasional.length,
    new: nuevo.length + potencial.length,
  }
}

export function getCustomersStats() {
  const segments = getCustomersBySegment()
  const totalSpent = MOCK_CUSTOMERS.reduce((sum, customer) => sum + customer.totalSpent, 0)
  const avgSpent = totalSpent / MOCK_CUSTOMERS.length
  const avgPurchases = MOCK_CUSTOMERS.reduce((sum, customer) => sum + customer.totalPurchases, 0) / MOCK_CUSTOMERS.length
  const totalLoyaltyPoints = MOCK_CUSTOMERS.reduce((sum, customer) => sum + customer.loyaltyPoints, 0)

  return {
    total: MOCK_CUSTOMERS.length,
    vip: segments.vip,
    frecuente: segments.frecuente,
    ocasional: segments.ocasional,
    potencial: segments.potencial,
    nuevo: segments.nuevo,
    enRiesgo: segments.enRiesgo,
    // Mantener compatibilidad
    regular: segments.regular,
    new: segments.new,
    totalSpent,
    avgSpent,
    avgPurchases,
    totalLoyaltyPoints,
  }
}

export function getCustomerPurchaseHistory(customerId: string): Sale[] {
  return MOCK_SALES.filter(sale => sale.customerId === customerId)
}

// Tipos y datos para inventario
export interface InventoryMovement {
  id: string
  productId: string
  productName: string
  type: 'entrada' | 'salida' | 'ajuste' | 'merma'
  quantity: number
  reason: string
  cost?: number
  supplierId?: string
  supplierName?: string
  userId: string
  userName: string
  createdAt: Date
}

export interface Supplier {
  id: string
  name: string
  contactName: string
  email?: string
  phone?: string
  address?: string
  isActive: boolean
  totalOrders: number
  totalSpent: number
  rating: number
  createdAt: Date
  updatedAt: Date
}

export interface StockAlert {
  id: string
  productId: string
  productName: string
  currentStock: number
  minStock: number
  alertType: 'low_stock' | 'out_of_stock' | 'overstock'
  severity: 'low' | 'medium' | 'high' | 'critical'
  isResolved: boolean
  createdAt: Date
  resolvedAt?: Date
}

// Datos simulados de proveedores
export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Café del Valle S.A.S.',
    contactName: 'Juan Carlos Mendoza',
    email: 'ventas@cafedelvalle.com',
    phone: '+57 310 123 4567',
    address: 'Finca El Mirador, Huila, Colombia',
    isActive: true,
    totalOrders: 25,
    totalSpent: 15000000,
    rating: 4.8,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'Tostadora Premium Ltda.',
    contactName: 'María Elena Vargas',
    email: 'contacto@tostadorapremium.com',
    phone: '+57 311 234 5678',
    address: 'Zona Industrial, Medellín, Antioquia',
    isActive: true,
    totalOrders: 18,
    totalSpent: 8500000,
    rating: 4.5,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    name: 'Orgánicos de Colombia',
    contactName: 'Pedro Alejandro Ruiz',
    email: 'pedidos@organicoscolombia.com',
    phone: '+57 312 345 6789',
    address: 'Vereda La Esperanza, Nariño, Colombia',
    isActive: true,
    totalOrders: 12,
    totalSpent: 6200000,
    rating: 4.9,
    createdAt: new Date('2023-05-20'),
    updatedAt: new Date('2024-01-15'),
  },
]

// Datos simulados de movimientos de inventario
export const MOCK_INVENTORY_MOVEMENTS: InventoryMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Café Arábica Premium',
    type: 'entrada',
    quantity: 5000,
    reason: 'Compra a proveedor',
    cost: 75000,
    supplierId: '1',
    supplierName: 'Café del Valle S.A.S.',
    userId: '1',
    userName: 'Administrador',
    createdAt: new Date('2024-01-20T09:00:00'),
  },
  {
    id: '2',
    productId: '1',
    productName: 'Café Arábica Premium',
    type: 'salida',
    quantity: -500,
    reason: 'Venta al cliente',
    userId: '2',
    userName: 'María González',
    createdAt: new Date('2024-01-25T10:30:00'),
  },
  {
    id: '3',
    productId: '3',
    productName: 'Mezcla del Mirador',
    type: 'entrada',
    quantity: 3000,
    reason: 'Producción interna',
    cost: 54000,
    userId: '1',
    userName: 'Administrador',
    createdAt: new Date('2024-01-22T14:15:00'),
  },
  {
    id: '4',
    productId: '2',
    productName: 'Café Robusta Intenso',
    type: 'ajuste',
    quantity: -200,
    reason: 'Ajuste por inventario físico',
    userId: '1',
    userName: 'Administrador',
    createdAt: new Date('2024-01-23T16:45:00'),
  },
  {
    id: '5',
    productId: '4',
    productName: 'Café Orgánico Certificado',
    type: 'merma',
    quantity: -100,
    reason: 'Producto vencido',
    userId: '1',
    userName: 'Administrador',
    createdAt: new Date('2024-01-24T11:20:00'),
  },
]

// Datos simulados de alertas de stock
export const MOCK_STOCK_ALERTS: StockAlert[] = [
  {
    id: '1',
    productId: '2',
    productName: 'Café Robusta Intenso',
    currentStock: 250,
    minStock: 400,
    alertType: 'low_stock',
    severity: 'medium',
    isResolved: false,
    createdAt: new Date('2024-01-24T08:00:00'),
  },
  {
    id: '2',
    productId: '5',
    productName: 'Café Descafeinado',
    currentStock: 150,
    minStock: 200,
    alertType: 'low_stock',
    severity: 'high',
    isResolved: false,
    createdAt: new Date('2024-01-25T09:15:00'),
  },
  {
    id: '3',
    productId: '8',
    productName: 'Café de Origen Huila',
    currentStock: 50,
    minStock: 150,
    alertType: 'low_stock',
    severity: 'critical',
    isResolved: false,
    createdAt: new Date('2024-01-25T10:30:00'),
  },
]

// Funciones de utilidad para inventario
export function getInventoryMovements(productId?: string): InventoryMovement[] {
  if (productId) {
    return MOCK_INVENTORY_MOVEMENTS.filter(movement => movement.productId === productId)
  }
  return MOCK_INVENTORY_MOVEMENTS
}

export function getStockAlerts(severity?: string): StockAlert[] {
  let alerts = MOCK_STOCK_ALERTS.filter(alert => !alert.isResolved)

  if (severity) {
    alerts = alerts.filter(alert => alert.severity === severity)
  }

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder]
  })
}

export function getSupplierById(id: string): Supplier | undefined {
  return MOCK_SUPPLIERS.find(supplier => supplier.id === id)
}

export function getInventoryStats() {
  const totalProducts = MOCK_PRODUCTS.length
  const activeProducts = MOCK_PRODUCTS.filter(p => p.isActive).length
  const totalValue = MOCK_PRODUCTS.reduce((sum, p) => sum + (p.stock * p.pricePerGram), 0)
  const lowStockProducts = MOCK_PRODUCTS.filter(p => p.stock <= p.minStock).length
  const outOfStockProducts = MOCK_PRODUCTS.filter(p => p.stock === 0).length
  const totalStock = MOCK_PRODUCTS.reduce((sum, p) => sum + p.stock, 0)

  // Calcular rotación promedio (simulada)
  const avgTurnover = MOCK_PRODUCTS.reduce((sum, p) => sum + (p.stock > 0 ? 4.2 : 0), 0) / activeProducts

  // Alertas por severidad
  const alerts = getStockAlerts()
  const criticalAlerts = alerts.filter(a => a.severity === 'critical').length
  const highAlerts = alerts.filter(a => a.severity === 'high').length
  const mediumAlerts = alerts.filter(a => a.severity === 'medium').length

  return {
    totalProducts,
    activeProducts,
    totalValue,
    totalStock,
    lowStockProducts,
    outOfStockProducts,
    avgTurnover,
    alerts: {
      total: alerts.length,
      critical: criticalAlerts,
      high: highAlerts,
      medium: mediumAlerts,
    },
  }
}

export function predictDemand(productId: string, days: number = 30): number {
  // Simulación simple de predicción de demanda basada en ventas históricas
  const product = getProductById(productId)
  if (!product) return 0

  // Calcular ventas promedio diarias (simulado)
  const avgDailySales = Math.max(10, Math.floor(product.stock / 30)) // Simulación

  // Aplicar factores estacionales y tendencias (simulado)
  const seasonalFactor = 1.1 // 10% más en temporada alta
  const trendFactor = 1.05 // 5% crecimiento

  const predictedDemand = avgDailySales * days * seasonalFactor * trendFactor

  return Math.round(predictedDemand)
}

export function generateRestockSuggestions(): Array<{
  productId: string
  productName: string
  currentStock: number
  minStock: number
  suggestedOrder: number
  urgency: 'low' | 'medium' | 'high' | 'critical'
  estimatedCost: number
}> {
  return MOCK_PRODUCTS
    .filter(product => product.stock <= product.minStock * 1.5) // Productos que necesitan restock
    .map(product => {
      const predictedDemand = predictDemand(product.id, 30)
      const suggestedOrder = Math.max(
        product.minStock * 2 - product.stock, // Stock de seguridad
        predictedDemand - product.stock // Demanda predicha
      )

      let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low'
      if (product.stock === 0) urgency = 'critical'
      else if (product.stock <= product.minStock * 0.5) urgency = 'high'
      else if (product.stock <= product.minStock) urgency = 'medium'

      const estimatedCost = (suggestedOrder / 454) * product.cost // Convertir gramos a libras

      return {
        productId: product.id,
        productName: product.name,
        currentStock: product.stock,
        minStock: product.minStock,
        suggestedOrder: Math.round(suggestedOrder),
        urgency,
        estimatedCost: Math.round(estimatedCost),
      }
    })
    .sort((a, b) => {
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
    })
}

// Tipos y datos para gastos

export interface Expense {
  id: string
  categoryId: string
  categoryName: string
  title: string
  description?: string
  amount: number
  date: Date
  paymentMethod: 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'transferencia' | 'cheque' | 'credito'
  supplier?: string
  receiptUrl?: string
  receiptNumber?: string
  isRecurring: boolean
  recurringFrequency?: 'semanal' | 'quincenal' | 'mensual' | 'trimestral' | 'anual'
  tags: string[]
  userId: string
  userName: string
  isApproved: boolean
  approvedBy?: string
  approvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Budget {
  id: string
  categoryId: string
  categoryName: string
  monthlyLimit: number
  currentSpent: number
  year: number
  month: number
  alertThreshold: number // Porcentaje para alertas (ej: 80%)
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Datos simulados de categorías de gastos
export const MOCK_EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: '1',
    name: 'Materia Prima',
    description: 'Compra de café verde, insumos para tostado',
    color: '#10B981', // green-500
    isActive: true,
    monthlyBudget: 2000000,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Servicios Públicos',
    description: 'Electricidad, agua, gas, internet',
    color: '#3B82F6', // blue-500
    isActive: true,
    monthlyBudget: 300000,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Marketing y Publicidad',
    description: 'Redes sociales, material publicitario, eventos',
    color: '#8B5CF6', // violet-500
    isActive: true,
    monthlyBudget: 500000,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Transporte y Logística',
    description: 'Combustible, mantenimiento vehículos, envíos',
    color: '#F59E0B', // amber-500
    isActive: true,
    monthlyBudget: 400000,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '5',
    name: 'Equipos y Mantenimiento',
    description: 'Tostadora, molinos, balanzas, reparaciones',
    color: '#EF4444', // red-500
    isActive: true,
    monthlyBudget: 600000,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '6',
    name: 'Administrativos',
    description: 'Papelería, software, licencias, seguros',
    color: '#6B7280', // gray-500
    isActive: true,
    monthlyBudget: 250000,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
]

// Datos simulados de gastos
export const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    categoryId: '1',
    categoryName: 'Materia Prima',
    title: 'Compra café verde Huila',
    description: 'Café arábica premium para tostado, 50 kg',
    amount: 750000,
    date: new Date('2024-01-25'),
    paymentMethod: 'transferencia',
    supplier: 'Café del Valle S.A.S.',
    receiptNumber: 'FAC-2024-001',
    isRecurring: false,
    tags: ['cafe-verde', 'huila', 'arabica'],
    userId: '1',
    userName: 'Administrador',
    isApproved: true,
    approvedBy: 'Administrador',
    approvedAt: new Date('2024-01-25'),
    createdAt: new Date('2024-01-25T09:00:00'),
    updatedAt: new Date('2024-01-25T09:00:00'),
  },
  {
    id: '2',
    categoryId: '2',
    categoryName: 'Servicios Públicos',
    title: 'Factura de electricidad',
    description: 'Consumo eléctrico enero 2024',
    amount: 180000,
    date: new Date('2024-01-20'),
    paymentMethod: 'tarjeta_debito',
    supplier: 'Codensa',
    receiptNumber: 'ELE-2024-001',
    isRecurring: true,
    recurringFrequency: 'mensual',
    tags: ['electricidad', 'servicios'],
    userId: '1',
    userName: 'Administrador',
    isApproved: true,
    approvedBy: 'Administrador',
    approvedAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20T14:30:00'),
    updatedAt: new Date('2024-01-20T14:30:00'),
  },
  {
    id: '3',
    categoryId: '3',
    categoryName: 'Marketing y Publicidad',
    title: 'Campaña Facebook Ads',
    description: 'Publicidad en redes sociales para enero',
    amount: 120000,
    date: new Date('2024-01-15'),
    paymentMethod: 'tarjeta_credito',
    supplier: 'Meta Platforms',
    isRecurring: true,
    recurringFrequency: 'mensual',
    tags: ['facebook', 'publicidad', 'redes-sociales'],
    userId: '2',
    userName: 'María González',
    isApproved: true,
    approvedBy: 'Administrador',
    approvedAt: new Date('2024-01-16'),
    createdAt: new Date('2024-01-15T11:15:00'),
    updatedAt: new Date('2024-01-16T08:00:00'),
  },
  {
    id: '4',
    categoryId: '4',
    categoryName: 'Transporte y Logística',
    title: 'Combustible vehículo reparto',
    description: 'Gasolina para entregas domicilio',
    amount: 85000,
    date: new Date('2024-01-22'),
    paymentMethod: 'efectivo',
    tags: ['combustible', 'reparto'],
    userId: '2',
    userName: 'María González',
    isApproved: true,
    approvedBy: 'Administrador',
    approvedAt: new Date('2024-01-22'),
    createdAt: new Date('2024-01-22T16:45:00'),
    updatedAt: new Date('2024-01-22T16:45:00'),
  },
  {
    id: '5',
    categoryId: '5',
    categoryName: 'Equipos y Mantenimiento',
    title: 'Mantenimiento tostadora',
    description: 'Servicio técnico y repuestos tostadora principal',
    amount: 320000,
    date: new Date('2024-01-18'),
    paymentMethod: 'transferencia',
    supplier: 'Técnicos Especializados Ltda.',
    receiptNumber: 'SER-2024-005',
    isRecurring: false,
    tags: ['mantenimiento', 'tostadora', 'equipos'],
    userId: '1',
    userName: 'Administrador',
    isApproved: true,
    approvedBy: 'Administrador',
    approvedAt: new Date('2024-01-18'),
    createdAt: new Date('2024-01-18T10:20:00'),
    updatedAt: new Date('2024-01-18T10:20:00'),
  },
  {
    id: '6',
    categoryId: '6',
    categoryName: 'Administrativos',
    title: 'Licencia software contable',
    description: 'Suscripción mensual software de contabilidad',
    amount: 89000,
    date: new Date('2024-01-01'),
    paymentMethod: 'tarjeta_credito',
    supplier: 'Software Contable Pro',
    isRecurring: true,
    recurringFrequency: 'mensual',
    tags: ['software', 'contabilidad', 'licencia'],
    userId: '1',
    userName: 'Administrador',
    isApproved: true,
    approvedBy: 'Administrador',
    approvedAt: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01T08:00:00'),
    updatedAt: new Date('2024-01-01T08:00:00'),
  },
]

// Funciones de utilidad para gastos
export function getExpensesByDateRange(startDate: Date, endDate: Date): Expense[] {
  return MOCK_EXPENSES.filter(expense =>
    expense.date >= startDate && expense.date <= endDate
  )
}

export function getExpensesByCategory(categoryId: string): Expense[] {
  return MOCK_EXPENSES.filter(expense => expense.categoryId === categoryId)
}

export function getExpensesStats() {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)

  const thisMonthExpenses = getExpensesByDateRange(startOfMonth, today)
  const lastMonthExpenses = getExpensesByDateRange(startOfLastMonth, endOfLastMonth)

  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const growth = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0

  // Gastos por categoría este mes
  const categoryTotals = MOCK_EXPENSE_CATEGORIES.map(category => {
    const categoryExpenses = thisMonthExpenses.filter(e => e.categoryId === category.id)
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)
    const budget = category.monthlyBudget || 0
    const percentage = budget > 0 ? (total / budget) * 100 : 0

    return {
      categoryId: category.id,
      categoryName: category.name,
      color: category.color,
      total,
      budget,
      percentage,
      remaining: budget - total,
      isOverBudget: total > budget,
    }
  })

  // Gastos pendientes de aprobación
  const pendingExpenses = MOCK_EXPENSES.filter(e => !e.isApproved)

  return {
    thisMonth: {
      total: thisMonthTotal,
      count: thisMonthExpenses.length,
      growth,
    },
    lastMonth: {
      total: lastMonthTotal,
      count: lastMonthExpenses.length,
    },
    categories: categoryTotals,
    pending: {
      count: pendingExpenses.length,
      total: pendingExpenses.reduce((sum, e) => sum + e.amount, 0),
    },
    totalBudget: MOCK_EXPENSE_CATEGORIES.reduce((sum, c) => sum + (c.monthlyBudget || 0), 0),
  }
}

export function getBudgetAlerts() {
  const stats = getExpensesStats()

  return stats.categories
    .filter(category => category.percentage >= 80) // Alertar cuando se use 80% o más del presupuesto
    .map(category => ({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      percentage: category.percentage,
      severity: category.percentage >= 100 ? 'critical' :
                category.percentage >= 90 ? 'high' : 'medium',
      message: category.isOverBudget
        ? `Presupuesto excedido en ${((category.percentage - 100)).toFixed(1)}%`
        : `${category.percentage.toFixed(1)}% del presupuesto utilizado`,
    }))
    .sort((a, b) => b.percentage - a.percentage)
}

export function getRecurringExpenses(): Expense[] {
  return MOCK_EXPENSES.filter(expense => expense.isRecurring)
}

export function searchExpenses(query: string): Expense[] {
  const lowercaseQuery = query.toLowerCase()
  return MOCK_EXPENSES.filter(expense =>
    expense.title.toLowerCase().includes(lowercaseQuery) ||
    expense.description?.toLowerCase().includes(lowercaseQuery) ||
    expense.categoryName.toLowerCase().includes(lowercaseQuery) ||
    expense.supplier?.toLowerCase().includes(lowercaseQuery) ||
    expense.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export function getExpensesByPaymentMethod() {
  const methods = MOCK_EXPENSES.reduce((acc, expense) => {
    const method = expense.paymentMethod
    if (!acc[method]) {
      acc[method] = { count: 0, total: 0 }
    }
    acc[method].count++
    acc[method].total += expense.amount
    return acc
  }, {} as Record<string, { count: number; total: number }>)

  return Object.entries(methods).map(([method, data]) => ({
    method,
    count: data.count,
    total: data.total,
    percentage: (data.total / MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0)) * 100,
  }))
}

export function generateExpenseReport(startDate: Date, endDate: Date) {
  const expenses = getExpensesByDateRange(startDate, endDate)
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0)

  const byCategory = MOCK_EXPENSE_CATEGORIES.map(category => {
    const categoryExpenses = expenses.filter(e => e.categoryId === category.id)
    const total = categoryExpenses.reduce((sum, e) => sum + e.amount, 0)

    return {
      category: category.name,
      color: category.color,
      total,
      count: categoryExpenses.length,
      percentage: totalAmount > 0 ? (total / totalAmount) * 100 : 0,
      expenses: categoryExpenses,
    }
  }).filter(item => item.total > 0)

  const byPaymentMethod = getExpensesByPaymentMethod()

  return {
    period: { startDate, endDate },
    summary: {
      totalAmount,
      totalCount: expenses.length,
      averageAmount: expenses.length > 0 ? totalAmount / expenses.length : 0,
    },
    byCategory,
    byPaymentMethod,
    expenses,
  }
}

// Tipos y datos para reportes
export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'ventas' | 'productos' | 'clientes' | 'gastos' | 'inventario' | 'financiero' | 'ejecutivo'
  category: 'operacional' | 'financiero' | 'marketing' | 'ejecutivo'
  frequency: 'diario' | 'semanal' | 'mensual' | 'trimestral' | 'anual' | 'personalizado'
  isActive: boolean
  isScheduled: boolean
  nextRun?: Date
  lastRun?: Date
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface ReportData {
  id: string
  templateId: string
  templateName: string
  generatedAt: Date
  period: {
    start: Date
    end: Date
    label: string
  }
  data: any
  summary: {
    totalRecords: number
    totalValue: number
    keyMetrics: Record<string, number>
  }
  charts: Array<{
    type: 'line' | 'bar' | 'pie' | 'area'
    title: string
    data: any[]
  }>
  status: 'generating' | 'completed' | 'error'
  exportFormats: string[]
  createdBy: string
}

// Plantillas de reportes predefinidas
export const MOCK_REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: '1',
    name: 'Reporte Ejecutivo Mensual',
    description: 'Resumen ejecutivo completo con todas las métricas clave del negocio',
    type: 'ejecutivo',
    category: 'ejecutivo',
    frequency: 'mensual',
    isActive: true,
    isScheduled: true,
    nextRun: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    lastRun: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    createdBy: 'Administrador',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Análisis de Ventas Semanal',
    description: 'Análisis detallado de ventas, productos más vendidos y tendencias',
    type: 'ventas',
    category: 'operacional',
    frequency: 'semanal',
    isActive: true,
    isScheduled: true,
    nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdBy: 'Administrador',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    name: 'Reporte de Clientes VIP',
    description: 'Análisis de clientes VIP, comportamiento de compra y oportunidades',
    type: 'clientes',
    category: 'marketing',
    frequency: 'mensual',
    isActive: true,
    isScheduled: false,
    createdBy: 'María González',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '4',
    name: 'Control de Gastos Mensual',
    description: 'Análisis de gastos por categoría, presupuesto vs real y proyecciones',
    type: 'gastos',
    category: 'financiero',
    frequency: 'mensual',
    isActive: true,
    isScheduled: true,
    nextRun: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    lastRun: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    createdBy: 'Administrador',
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Estado de Inventario',
    description: 'Reporte de stock, rotación de productos y alertas de reabastecimiento',
    type: 'inventario',
    category: 'operacional',
    frequency: 'semanal',
    isActive: true,
    isScheduled: true,
    nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    lastRun: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdBy: 'Administrador',
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2024-01-20'),
  },
]

// Funciones de utilidad para reportes
export function getReportTemplates(category?: string): ReportTemplate[] {
  if (category) {
    return MOCK_REPORT_TEMPLATES.filter(template => template.category === category)
  }
  return MOCK_REPORT_TEMPLATES
}

export function generateExecutiveReport(startDate: Date, endDate: Date): ReportData {
  const salesStats = getSalesStats()
  const customersStats = getCustomersStats()
  const expensesStats = getExpensesStats()
  const inventoryStats = getInventoryStats()

  return {
    id: Math.random().toString(36).substr(2, 9),
    templateId: '1',
    templateName: 'Reporte Ejecutivo Mensual',
    generatedAt: new Date(),
    period: {
      start: startDate,
      end: endDate,
      label: `${startDate.toLocaleDateString('es-CO')} - ${endDate.toLocaleDateString('es-CO')}`,
    },
    data: {
      sales: salesStats,
      customers: customersStats,
      expenses: expensesStats,
      inventory: inventoryStats,
    },
    summary: {
      totalRecords: salesStats.total.count + customersStats.total + expensesStats.thisMonth.count,
      totalValue: salesStats.total.total,
      keyMetrics: {
        revenue: salesStats.total.total,
        customers: customersStats.total,
        expenses: expensesStats.thisMonth.total,
        inventoryValue: inventoryStats.totalValue,
        profit: salesStats.total.total - expensesStats.thisMonth.total,
      },
    },
    charts: [
      {
        type: 'line',
        title: 'Tendencia de Ventas',
        data: [
          { month: 'Ene', ventas: 45000, gastos: 32000 },
          { month: 'Feb', ventas: 52000, gastos: 35000 },
          { month: 'Mar', ventas: 48000, gastos: 33000 },
          { month: 'Abr', ventas: 61000, gastos: 38000 },
          { month: 'May', ventas: 55000, gastos: 36000 },
          { month: 'Jun', ventas: 67000, gastos: 41000 },
        ],
      },
      {
        type: 'pie',
        title: 'Distribución de Gastos',
        data: expensesStats.categories.map((cat: any) => ({
          name: cat.categoryName,
          value: cat.total,
          color: cat.color,
        })),
      },
      {
        type: 'bar',
        title: 'Productos Más Vendidos',
        data: [
          { product: 'Café Arábica Premium', ventas: 25000 },
          { product: 'Mezcla del Mirador', ventas: 18000 },
          { product: 'Café Orgánico', ventas: 15000 },
          { product: 'Café Robusta', ventas: 12000 },
        ],
      },
    ],
    status: 'completed',
    exportFormats: ['PDF', 'Excel', 'CSV'],
    createdBy: 'Sistema',
  }
}

export function generateSalesReport(startDate: Date, endDate: Date): ReportData {
  const salesInPeriod = getSalesByDateRange(startDate, endDate)
  const totalSales = salesInPeriod.reduce((sum, sale) => sum + sale.total, 0)

  return {
    id: Math.random().toString(36).substr(2, 9),
    templateId: '2',
    templateName: 'Análisis de Ventas Semanal',
    generatedAt: new Date(),
    period: {
      start: startDate,
      end: endDate,
      label: `${startDate.toLocaleDateString('es-CO')} - ${endDate.toLocaleDateString('es-CO')}`,
    },
    data: {
      sales: salesInPeriod,
      totalSales,
      averageTicket: salesInPeriod.length > 0 ? totalSales / salesInPeriod.length : 0,
    },
    summary: {
      totalRecords: salesInPeriod.length,
      totalValue: totalSales,
      keyMetrics: {
        transactions: salesInPeriod.length,
        revenue: totalSales,
        averageTicket: salesInPeriod.length > 0 ? totalSales / salesInPeriod.length : 0,
      },
    },
    charts: [
      {
        type: 'line',
        title: 'Ventas Diarias',
        data: [
          { day: 'Lun', ventas: 8500 },
          { day: 'Mar', ventas: 9200 },
          { day: 'Mié', ventas: 7800 },
          { day: 'Jue', ventas: 10500 },
          { day: 'Vie', ventas: 12000 },
          { day: 'Sáb', ventas: 15000 },
          { day: 'Dom', ventas: 11000 },
        ],
      },
    ],
    status: 'completed',
    exportFormats: ['PDF', 'Excel', 'CSV'],
    createdBy: 'Sistema',
  }
}

export function getReportsAnalytics() {
  const templates = MOCK_REPORT_TEMPLATES
  const activeTemplates = templates.filter(t => t.isActive)
  const scheduledTemplates = templates.filter(t => t.isScheduled)

  return {
    total: templates.length,
    active: activeTemplates.length,
    scheduled: scheduledTemplates.length,
    byCategory: {
      ejecutivo: templates.filter(t => t.category === 'ejecutivo').length,
      operacional: templates.filter(t => t.category === 'operacional').length,
      financiero: templates.filter(t => t.category === 'financiero').length,
      marketing: templates.filter(t => t.category === 'marketing').length,
    },
    byFrequency: {
      diario: templates.filter(t => t.frequency === 'diario').length,
      semanal: templates.filter(t => t.frequency === 'semanal').length,
      mensual: templates.filter(t => t.frequency === 'mensual').length,
      trimestral: templates.filter(t => t.frequency === 'trimestral').length,
      anual: templates.filter(t => t.frequency === 'anual').length,
    },
  }
}

// Tipos y datos para configuración
export interface SystemConfig {
  id: string
  category: 'general' | 'empresa' | 'ventas' | 'inventario' | 'notificaciones' | 'seguridad' | 'integraciones'
  key: string
  name: string
  description: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'file'
  value: any
  defaultValue: any
  options?: Array<{ label: string; value: any }>
  isRequired: boolean
  isVisible: boolean
  order: number
  updatedBy?: string
  updatedAt?: Date
}

export interface UserPreferences {
  userId: string
  theme: 'light' | 'dark' | 'auto'
  language: 'es' | 'en'
  currency: 'COP' | 'USD' | 'EUR'
  timezone: string
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  numberFormat: 'es-CO' | 'en-US' | 'en-GB'
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
    lowStock: boolean
    newSales: boolean
    dailyReports: boolean
    weeklyReports: boolean
  }
  dashboard: {
    layout: 'default' | 'compact' | 'detailed'
    widgets: string[]
    refreshInterval: number
  }
  updatedAt: Date
}

// Configuraciones del sistema
export const MOCK_SYSTEM_CONFIG: SystemConfig[] = [
  // Configuración General
  {
    id: '1',
    category: 'general',
    key: 'app_name',
    name: 'Nombre de la Aplicación',
    description: 'Nombre que aparece en el título y header de la aplicación',
    type: 'string',
    value: 'Tinto del Mirador CRM',
    defaultValue: 'Tinto del Mirador CRM',
    isRequired: true,
    isVisible: true,
    order: 1,
  },
  {
    id: '2',
    category: 'general',
    key: 'app_logo',
    name: 'Logo de la Aplicación',
    description: 'Logo que aparece en el header y documentos',
    type: 'file',
    value: '/logo.png',
    defaultValue: '/logo.png',
    isRequired: false,
    isVisible: true,
    order: 2,
  },
  {
    id: '3',
    category: 'general',
    key: 'primary_color',
    name: 'Color Primario',
    description: 'Color principal de la interfaz',
    type: 'color',
    value: '#D97706',
    defaultValue: '#D97706',
    isRequired: true,
    isVisible: true,
    order: 3,
  },
  {
    id: '4',
    category: 'general',
    key: 'default_language',
    name: 'Idioma por Defecto',
    description: 'Idioma predeterminado para nuevos usuarios',
    type: 'select',
    value: 'es',
    defaultValue: 'es',
    options: [
      { label: 'Español', value: 'es' },
      { label: 'English', value: 'en' },
    ],
    isRequired: true,
    isVisible: true,
    order: 4,
  },

  // Configuración de Empresa
  {
    id: '5',
    category: 'empresa',
    key: 'company_name',
    name: 'Nombre de la Empresa',
    description: 'Razón social de la empresa',
    type: 'string',
    value: 'Tinto del Mirador S.A.S.',
    defaultValue: 'Tinto del Mirador S.A.S.',
    isRequired: true,
    isVisible: true,
    order: 1,
  },
  {
    id: '6',
    category: 'empresa',
    key: 'company_nit',
    name: 'NIT/RUT',
    description: 'Número de identificación tributaria',
    type: 'string',
    value: '900.123.456-7',
    defaultValue: '',
    isRequired: true,
    isVisible: true,
    order: 2,
  },
  {
    id: '7',
    category: 'empresa',
    key: 'company_address',
    name: 'Dirección',
    description: 'Dirección física de la empresa',
    type: 'string',
    value: 'Calle 123 #45-67, Bogotá, Colombia',
    defaultValue: '',
    isRequired: true,
    isVisible: true,
    order: 3,
  },
  {
    id: '8',
    category: 'empresa',
    key: 'company_phone',
    name: 'Teléfono',
    description: 'Teléfono principal de contacto',
    type: 'string',
    value: '+57 (1) 234-5678',
    defaultValue: '',
    isRequired: true,
    isVisible: true,
    order: 4,
  },
  {
    id: '9',
    category: 'empresa',
    key: 'company_email',
    name: 'Email Corporativo',
    description: 'Email principal de la empresa',
    type: 'string',
    value: 'info@tintomirador.com',
    defaultValue: '',
    isRequired: true,
    isVisible: true,
    order: 5,
  },

  // Configuración de Ventas
  {
    id: '10',
    category: 'ventas',
    key: 'default_currency',
    name: 'Moneda por Defecto',
    description: 'Moneda utilizada en todas las transacciones',
    type: 'select',
    value: 'COP',
    defaultValue: 'COP',
    options: [
      { label: 'Peso Colombiano (COP)', value: 'COP' },
      { label: 'Dólar Americano (USD)', value: 'USD' },
      { label: 'Euro (EUR)', value: 'EUR' },
    ],
    isRequired: true,
    isVisible: true,
    order: 1,
  },
  {
    id: '11',
    category: 'ventas',
    key: 'tax_rate',
    name: 'Tasa de IVA (%)',
    description: 'Porcentaje de IVA aplicado a las ventas',
    type: 'number',
    value: 19,
    defaultValue: 19,
    isRequired: true,
    isVisible: true,
    order: 2,
  },
  {
    id: '12',
    category: 'ventas',
    key: 'receipt_footer',
    name: 'Pie de Factura',
    description: 'Texto que aparece al final de las facturas',
    type: 'string',
    value: 'Gracias por su compra. ¡Vuelva pronto!',
    defaultValue: 'Gracias por su compra. ¡Vuelva pronto!',
    isRequired: false,
    isVisible: true,
    order: 3,
  },

  // Configuración de Inventario
  {
    id: '13',
    category: 'inventario',
    key: 'low_stock_threshold',
    name: 'Umbral de Stock Bajo',
    description: 'Cantidad mínima para alertas de stock bajo',
    type: 'number',
    value: 100,
    defaultValue: 100,
    isRequired: true,
    isVisible: true,
    order: 1,
  },
  {
    id: '14',
    category: 'inventario',
    key: 'auto_reorder',
    name: 'Reorden Automático',
    description: 'Activar sugerencias automáticas de reabastecimiento',
    type: 'boolean',
    value: true,
    defaultValue: true,
    isRequired: false,
    isVisible: true,
    order: 2,
  },

  // Configuración de Notificaciones
  {
    id: '15',
    category: 'notificaciones',
    key: 'email_notifications',
    name: 'Notificaciones por Email',
    description: 'Enviar notificaciones importantes por email',
    type: 'boolean',
    value: true,
    defaultValue: true,
    isRequired: false,
    isVisible: true,
    order: 1,
  },
  {
    id: '16',
    category: 'notificaciones',
    key: 'daily_reports',
    name: 'Reportes Diarios',
    description: 'Enviar resumen diario de ventas por email',
    type: 'boolean',
    value: true,
    defaultValue: false,
    isRequired: false,
    isVisible: true,
    order: 2,
  },

  // Configuración de Seguridad
  {
    id: '21',
    category: 'seguridad',
    key: 'session_timeout',
    name: 'Tiempo de Sesión (minutos)',
    description: 'Tiempo en minutos antes de cerrar sesión automáticamente',
    type: 'number',
    value: 60,
    defaultValue: 60,
    isRequired: true,
    isVisible: true,
    order: 1,
  },
  {
    id: '22',
    category: 'seguridad',
    key: 'password_min_length',
    name: 'Longitud Mínima de Contraseña',
    description: 'Número mínimo de caracteres para contraseñas',
    type: 'number',
    value: 8,
    defaultValue: 8,
    isRequired: true,
    isVisible: true,
    order: 2,
  },
  {
    id: '23',
    category: 'seguridad',
    key: 'require_special_chars',
    name: 'Requerir Caracteres Especiales',
    description: 'Las contraseñas deben incluir caracteres especiales',
    type: 'boolean',
    value: true,
    defaultValue: true,
    isRequired: false,
    isVisible: true,
    order: 3,
  },
  {
    id: '24',
    category: 'seguridad',
    key: 'max_login_attempts',
    name: 'Intentos Máximos de Login',
    description: 'Número máximo de intentos de login antes de bloquear cuenta',
    type: 'number',
    value: 5,
    defaultValue: 5,
    isRequired: true,
    isVisible: true,
    order: 4,
  },
  {
    id: '25',
    category: 'seguridad',
    key: 'enable_two_factor',
    name: 'Autenticación de Dos Factores',
    description: 'Habilitar autenticación de dos factores para todos los usuarios',
    type: 'boolean',
    value: false,
    defaultValue: false,
    isRequired: false,
    isVisible: true,
    order: 5,
  },

  // Configuración de Ventas
  {
    id: '26',
    category: 'ventas',
    key: 'default_payment_method',
    name: 'Método de Pago por Defecto',
    description: 'Método de pago seleccionado por defecto en ventas',
    type: 'select',
    value: 'EFECTIVO',
    defaultValue: 'EFECTIVO',
    options: [
      { label: 'Efectivo', value: 'EFECTIVO' },
      { label: 'Tarjeta', value: 'TARJETA' },
      { label: 'Transferencia', value: 'TRANSFERENCIA' },
      { label: 'Crédito', value: 'CREDITO' },
    ],
    isRequired: true,
    isVisible: true,
    order: 1,
  },
  {
    id: '27',
    category: 'ventas',
    key: 'auto_print_receipt',
    name: 'Imprimir Recibo Automáticamente',
    description: 'Imprimir recibo automáticamente después de cada venta',
    type: 'boolean',
    value: true,
    defaultValue: true,
    isRequired: false,
    isVisible: true,
    order: 2,
  },
  {
    id: '28',
    category: 'ventas',
    key: 'discount_limit',
    name: 'Límite de Descuento (%)',
    description: 'Porcentaje máximo de descuento permitido',
    type: 'number',
    value: 20,
    defaultValue: 20,
    isRequired: true,
    isVisible: true,
    order: 3,
  },

  // Configuración de Inventario
  {
    id: '29',
    category: 'inventario',
    key: 'low_stock_threshold',
    name: 'Umbral de Stock Bajo (gramos)',
    description: 'Cantidad mínima en gramos para alertas de stock bajo',
    type: 'number',
    value: 500,
    defaultValue: 500,
    isRequired: true,
    isVisible: true,
    order: 1,
  },
  {
    id: '30',
    category: 'inventario',
    key: 'auto_reorder',
    name: 'Reorden Automático',
    description: 'Generar órdenes de compra automáticamente cuando el stock esté bajo',
    type: 'boolean',
    value: false,
    defaultValue: false,
    isRequired: false,
    isVisible: true,
    order: 2,
  },
  {
    id: '31',
    category: 'inventario',
    key: 'track_expiration',
    name: 'Rastrear Fechas de Vencimiento',
    description: 'Activar seguimiento de fechas de vencimiento de productos',
    type: 'boolean',
    value: true,
    defaultValue: true,
    isRequired: false,
    isVisible: true,
    order: 3,
  },
]

// Preferencias de usuario por defecto
export const DEFAULT_USER_PREFERENCES: Omit<UserPreferences, 'userId'> = {
  theme: 'light',
  language: 'es',
  currency: 'COP',
  timezone: 'America/Bogota',
  dateFormat: 'DD/MM/YYYY',
  numberFormat: 'es-CO',
  notifications: {
    email: true,
    push: true,
    desktop: true,
    lowStock: true,
    newSales: true,
    dailyReports: false,
    weeklyReports: true,
  },
  dashboard: {
    layout: 'default',
    widgets: ['sales', 'customers', 'inventory', 'expenses'],
    refreshInterval: 300000, // 5 minutos
  },
  updatedAt: new Date(),
}

// Funciones de utilidad para configuración
export function getSystemConfig(category?: string): SystemConfig[] {
  if (category) {
    return MOCK_SYSTEM_CONFIG.filter(config => config.category === category)
  }
  return MOCK_SYSTEM_CONFIG
}

export function getConfigValue(key: string): any {
  const config = MOCK_SYSTEM_CONFIG.find(c => c.key === key)
  return config ? config.value : null
}

export function updateConfigValue(key: string, value: any, updatedBy: string): boolean {
  const configIndex = MOCK_SYSTEM_CONFIG.findIndex(c => c.key === key)
  if (configIndex !== -1) {
    MOCK_SYSTEM_CONFIG[configIndex].value = value
    MOCK_SYSTEM_CONFIG[configIndex].updatedBy = updatedBy
    MOCK_SYSTEM_CONFIG[configIndex].updatedAt = new Date()
    return true
  }
  return false
}

export function getUserPreferences(userId: string): UserPreferences {
  // En una implementación real, esto vendría de la base de datos
  return {
    userId,
    ...DEFAULT_USER_PREFERENCES,
  }
}

export function updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): boolean {
  // En una implementación real, esto actualizaría la base de datos
  console.log('Updating user preferences:', { userId, preferences })
  return true
}

export function getConfigCategories() {
  const categories = [...new Set(MOCK_SYSTEM_CONFIG.map(c => c.category))]
  return categories.map(category => ({
    id: category,
    name: getCategoryName(category),
    description: getCategoryDescription(category),
    icon: getCategoryIcon(category),
    count: MOCK_SYSTEM_CONFIG.filter(c => c.category === category).length,
  }))
}

function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    general: 'General',
    empresa: 'Empresa',
    ventas: 'Ventas',
    inventario: 'Inventario',
    notificaciones: 'Notificaciones',
    seguridad: 'Seguridad',
    integraciones: 'Integraciones',
  }
  return names[category] || category
}

function getCategoryDescription(category: string): string {
  const descriptions: Record<string, string> = {
    general: 'Configuración general de la aplicación',
    empresa: 'Información y datos de la empresa',
    ventas: 'Configuración del módulo de ventas',
    inventario: 'Configuración del control de inventario',
    notificaciones: 'Preferencias de notificaciones',
    seguridad: 'Configuración de seguridad y acceso',
    integraciones: 'Configuración de servicios externos',
  }
  return descriptions[category] || ''
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    general: 'Settings',
    empresa: 'Building',
    ventas: 'ShoppingCart',
    inventario: 'Package',
    notificaciones: 'Bell',
    seguridad: 'Shield',
    integraciones: 'Plug',
  }
  return icons[category] || 'Settings'
}

// Funciones para gestión de categorías de gastos
export function createExpenseCategory(categoryData: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>): ExpenseCategory {
  const newCategory: ExpenseCategory = {
    ...categoryData,
    id: (MOCK_EXPENSE_CATEGORIES.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  MOCK_EXPENSE_CATEGORIES.push(newCategory)
  return newCategory
}

export function updateExpenseCategory(id: string, updates: Partial<ExpenseCategory>): ExpenseCategory | null {
  const index = MOCK_EXPENSE_CATEGORIES.findIndex(category => category.id === id)
  if (index === -1) return null

  MOCK_EXPENSE_CATEGORIES[index] = {
    ...MOCK_EXPENSE_CATEGORIES[index],
    ...updates,
    updatedAt: new Date(),
  }

  return MOCK_EXPENSE_CATEGORIES[index]
}

export function deleteExpenseCategory(id: string): boolean {
  const index = MOCK_EXPENSE_CATEGORIES.findIndex(category => category.id === id)
  if (index === -1) return false

  // Verificar que no tenga gastos asociados
  const hasExpenses = MOCK_EXPENSES.some(expense => expense.categoryId === id)
  if (hasExpenses) return false

  MOCK_EXPENSE_CATEGORIES.splice(index, 1)
  return true
}

export function getExpenseCategory(id: string): ExpenseCategory | null {
  return MOCK_EXPENSE_CATEGORIES.find(category => category.id === id) || null
}

export function getActiveExpenseCategories(): ExpenseCategory[] {
  return MOCK_EXPENSE_CATEGORIES.filter(category => category.isActive)
}

export function searchExpenseCategories(query: string): ExpenseCategory[] {
  const lowercaseQuery = query.toLowerCase()
  return MOCK_EXPENSE_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(lowercaseQuery) ||
    category.description?.toLowerCase().includes(lowercaseQuery)
  )
}

// Funciones de utilidad para ventas y clientes
export function getCustomerById(id: string): Customer | undefined {
  return MOCK_CUSTOMERS.find(customer => customer.id === id)
}

// Función para clasificar automáticamente a un cliente
export function classifyCustomer(customer: Customer): 'NUEVO' | 'POTENCIAL' | 'OCASIONAL' | 'FRECUENTE' | 'VIP' | 'EN_RIESGO' {
  const now = new Date()
  const daysSinceLastPurchase = customer.lastPurchase
    ? Math.floor((now.getTime() - customer.lastPurchase.getTime()) / (1000 * 60 * 60 * 24))
    : 999

  const daysSinceRegistration = Math.floor((now.getTime() - customer.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  const avgSpentPerPurchase = customer.totalPurchases > 0 ? customer.totalSpent / customer.totalPurchases : 0

  // Clientes en Riesgo: Sin compras en 90+ días O muy pocas compras con bajo gasto
  if (daysSinceLastPurchase > 90 ||
      (customer.totalPurchases <= 2 && daysSinceRegistration > 180) ||
      (customer.totalPurchases > 0 && avgSpentPerPurchase < 15000)) {
    return 'EN_RIESGO'
  }

  // Clientes VIP: 15+ compras O gasto total > 500,000 O gasto promedio > 40,000
  if (customer.totalPurchases >= 15 ||
      customer.totalSpent >= 500000 ||
      avgSpentPerPurchase >= 40000) {
    return 'VIP'
  }

  // Clientes Frecuentes: 8+ compras O gasto total > 250,000
  if (customer.totalPurchases >= 8 || customer.totalSpent >= 250000) {
    return 'FRECUENTE'
  }

  // Clientes Potenciales: 2-4 compras, gasto moderado, activos recientemente
  if (customer.totalPurchases >= 2 && customer.totalPurchases <= 4 &&
      avgSpentPerPurchase >= 25000 &&
      daysSinceLastPurchase <= 45) {
    return 'POTENCIAL'
  }

  // Clientes Ocasionales: 4-7 compras O gasto entre 100,000-250,000
  if ((customer.totalPurchases >= 4 && customer.totalPurchases <= 7) ||
      (customer.totalSpent >= 100000 && customer.totalSpent < 250000)) {
    return 'OCASIONAL'
  }

  // Clientes Nuevos: Por defecto para el resto
  return 'NUEVO'
}

// Función para aplicar clasificación automática a todos los clientes
export function updateCustomerSegments() {
  return MOCK_CUSTOMERS.map(customer => ({
    ...customer,
    segment: classifyCustomer(customer)
  }))
}

// Función para verificar inconsistencias en la clasificación
export function verifyCustomerClassification() {
  const inconsistencies: Array<{
    id: string,
    name: string,
    currentSegment: string,
    suggestedSegment: string,
    reason: string
  }> = []

  MOCK_CUSTOMERS.forEach(customer => {
    const suggestedSegment = classifyCustomer(customer)
    if (customer.segment !== suggestedSegment) {
      inconsistencies.push({
        id: customer.id,
        name: `${customer.nombres} ${customer.apellidos}`,
        currentSegment: customer.segment,
        suggestedSegment,
        reason: `Debería ser ${suggestedSegment} según criterios actuales`
      })
    }
  })

  return inconsistencies
}

// Función para obtener clientes por segmento específico
export function getCustomersBySpecificSegment(segment: 'NUEVO' | 'POTENCIAL' | 'OCASIONAL' | 'FRECUENTE' | 'VIP' | 'EN_RIESGO') {
  return MOCK_CUSTOMERS.filter(customer => customer.segment === segment)
}

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find(user => user.id === id)
}



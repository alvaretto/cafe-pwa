// Tipos contables según Plan Único de Contabilidad (PUC) 2025 - Colombia
// Implementación para CRM Tinto del Mirador

// ============================================================================
// CUENTAS CONTABLES SEGÚN PUC 2025
// ============================================================================

export interface AccountingAccount {
  id: string
  code: string // Código PUC (ej: 1435, 2205, 5105)
  name: string
  description: string
  group: AccountGroup
  subgroup: AccountSubgroup
  level: AccountLevel
  nature: AccountNature // Débito o Crédito
  isActive: boolean
  parentAccountId?: string
  createdAt: Date
  updatedAt: Date
}

// Grupos principales del PUC 2025
export enum AccountGroup {
  // ACTIVOS (1)
  ACTIVO = 'ACTIVO',
  
  // PASIVOS (2)
  PASIVO = 'PASIVO',
  
  // PATRIMONIO (3)
  PATRIMONIO = 'PATRIMONIO',
  
  // INGRESOS (4)
  INGRESOS = 'INGRESOS',
  
  // GASTOS (5)
  GASTOS = 'GASTOS',
  
  // COSTOS (6)
  COSTOS = 'COSTOS',
  
  // COSTOS DE PRODUCCIÓN O DE OPERACIÓN (7)
  COSTOS_PRODUCCION = 'COSTOS_PRODUCCION'
}

// Subgrupos específicos para inventarios y operaciones
export enum AccountSubgroup {
  // INVENTARIOS (14)
  INVENTARIO_MERCANCIAS = 'INVENTARIO_MERCANCIAS', // 14
  INVENTARIO_MATERIAS_PRIMAS = 'INVENTARIO_MATERIAS_PRIMAS', // 1405
  INVENTARIO_PRODUCTOS_PROCESO = 'INVENTARIO_PRODUCTOS_PROCESO', // 1410
  INVENTARIO_PRODUCTOS_TERMINADOS = 'INVENTARIO_PRODUCTOS_TERMINADOS', // 1430
  INVENTARIO_MERCANCIAS_NO_FABRICADAS = 'INVENTARIO_MERCANCIAS_NO_FABRICADAS', // 1435
  
  // CUENTAS POR PAGAR (22)
  PROVEEDORES_NACIONALES = 'PROVEEDORES_NACIONALES', // 2205
  PROVEEDORES_EXTRANJEROS = 'PROVEEDORES_EXTRANJEROS', // 2210
  CUENTAS_POR_PAGAR = 'CUENTAS_POR_PAGAR', // 2380
  
  // IMPUESTOS (24)
  IMPUESTOS_GRAVAMENES_TASAS = 'IMPUESTOS_GRAVAMENES_TASAS', // 24
  IVA_POR_PAGAR = 'IVA_POR_PAGAR', // 2408
  RETENCION_FUENTE = 'RETENCION_FUENTE', // 2365
  
  // GASTOS OPERACIONALES (51-52)
  GASTOS_ADMINISTRACION = 'GASTOS_ADMINISTRACION', // 51
  GASTOS_VENTAS = 'GASTOS_VENTAS', // 52
  
  // GASTOS NO OPERACIONALES (53-54)
  GASTOS_FINANCIEROS = 'GASTOS_FINANCIEROS', // 53
  OTROS_GASTOS = 'OTROS_GASTOS', // 54
}

export enum AccountLevel {
  GRUPO = 'GRUPO', // 1 dígito
  SUBGRUPO = 'SUBGRUPO', // 2 dígitos
  CUENTA = 'CUENTA', // 4 dígitos
  SUBCUENTA = 'SUBCUENTA', // 6 dígitos
  AUXILIAR = 'AUXILIAR' // 8+ dígitos
}

export enum AccountNature {
  DEBITO = 'DEBITO',
  CREDITO = 'CREDITO'
}

// ============================================================================
// MOVIMIENTOS CONTABLES
// ============================================================================

export interface AccountingEntry {
  id: string
  entryNumber: string // Número consecutivo del asiento
  date: Date
  description: string
  reference?: string // Referencia externa (factura, recibo, etc.)
  documentType: DocumentType
  documentNumber?: string
  totalDebit: number
  totalCredit: number
  isBalanced: boolean // Debe ser true (débitos = créditos)
  status: EntryStatus
  userId: string
  userName: string
  approvedBy?: string
  approvedAt?: Date
  details: AccountingEntryDetail[]
  createdAt: Date
  updatedAt: Date
}

export interface AccountingEntryDetail {
  id: string
  entryId: string
  accountId: string
  accountCode: string
  accountName: string
  debitAmount: number
  creditAmount: number
  description?: string
  reference?: string
  costCenterId?: string
  thirdPartyId?: string // ID del tercero (cliente, proveedor, etc.)
  thirdPartyName?: string
  createdAt: Date
}

export enum DocumentType {
  FACTURA_COMPRA = 'FACTURA_COMPRA',
  FACTURA_VENTA = 'FACTURA_VENTA',
  RECIBO_CAJA = 'RECIBO_CAJA',
  COMPROBANTE_EGRESO = 'COMPROBANTE_EGRESO',
  NOTA_CONTABLE = 'NOTA_CONTABLE',
  NOTA_INTERNA = 'NOTA_INTERNA',
  AJUSTE_INVENTARIO = 'AJUSTE_INVENTARIO',
  PROVISION = 'PROVISION',
  DEPRECIACION = 'DEPRECIACION'
}

export enum EntryStatus {
  BORRADOR = 'BORRADOR',
  PENDIENTE_APROBACION = 'PENDIENTE_APROBACION',
  APROBADO = 'APROBADO',
  ANULADO = 'ANULADO'
}

// ============================================================================
// INVENTARIOS SEGÚN PUC 2025
// ============================================================================

export interface InventoryAccountingMovement {
  id: string
  productId: string
  productName: string
  movementType: InventoryMovementType
  quantity: number
  unitCost: number // Costo unitario según PEPS
  totalCost: number
  accountingEntryId: string // Referencia al asiento contable
  reason: string
  supplierId?: string
  supplierName?: string
  documentType: DocumentType
  documentNumber?: string
  userId: string
  userName: string
  createdAt: Date
}

export enum InventoryMovementType {
  ENTRADA_COMPRA = 'ENTRADA_COMPRA', // Compra a proveedores
  SALIDA_VENTA = 'SALIDA_VENTA', // Venta a clientes
  AJUSTE_POSITIVO = 'AJUSTE_POSITIVO', // Ajuste por faltante en inventario
  AJUSTE_NEGATIVO = 'AJUSTE_NEGATIVO', // Ajuste por sobrante en inventario
  MERMA = 'MERMA', // Pérdida por deterioro
  DEVOLUCION_COMPRA = 'DEVOLUCION_COMPRA', // Devolución a proveedor
  DEVOLUCION_VENTA = 'DEVOLUCION_VENTA', // Devolución de cliente
  TRASLADO = 'TRASLADO' // Traslado entre ubicaciones
}

// ============================================================================
// VALORACIÓN DE INVENTARIOS - MÉTODO PEPS
// ============================================================================

export interface InventoryValuation {
  id: string
  productId: string
  productName: string
  method: ValuationMethod
  layers: InventoryLayer[] // Capas PEPS
  currentQuantity: number
  currentValue: number
  averageCost: number
  lastUpdated: Date
}

export interface InventoryLayer {
  id: string
  date: Date
  quantity: number
  remainingQuantity: number
  unitCost: number
  totalCost: number
  supplierId?: string
  documentNumber?: string
  isExhausted: boolean
}

export enum ValuationMethod {
  PEPS = 'PEPS', // Primeras Entradas, Primeras Salidas
  UEPS = 'UEPS', // Últimas Entradas, Primeras Salidas
  PROMEDIO_PONDERADO = 'PROMEDIO_PONDERADO'
}

// ============================================================================
// PROVISIONES Y DETERIORO
// ============================================================================

export interface InventoryProvision {
  id: string
  productId: string
  productName: string
  provisionType: ProvisionType
  originalValue: number
  provisionAmount: number
  provisionPercentage: number
  reason: string
  accountingEntryId: string
  status: ProvisionStatus
  createdBy: string
  approvedBy?: string
  createdAt: Date
  approvedAt?: Date
}

export enum ProvisionType {
  DETERIORO = 'DETERIORO', // Deterioro físico
  OBSOLESCENCIA = 'OBSOLESCENCIA', // Productos obsoletos
  LENTO_MOVIMIENTO = 'LENTO_MOVIMIENTO', // Productos de lento movimiento
  VENCIMIENTO = 'VENCIMIENTO' // Productos próximos a vencer
}

export enum ProvisionStatus {
  ACTIVA = 'ACTIVA',
  REVERSADA = 'REVERSADA',
  APLICADA = 'APLICADA'
}

// ============================================================================
// COMPRAS Y CUENTAS POR PAGAR
// ============================================================================

export interface PurchaseAccountingEntry {
  id: string
  purchaseId: string
  supplierId: string
  supplierName: string
  invoiceNumber: string
  invoiceDate: Date
  subtotal: number
  ivaAmount: number
  retentionAmount: number
  totalAmount: number
  paymentTerms: number // Días de plazo
  dueDate: Date
  accountingEntryId: string
  paymentStatus: PaymentStatus
  createdAt: Date
}

export enum PaymentStatus {
  PENDIENTE = 'PENDIENTE',
  PARCIAL = 'PARCIAL',
  PAGADO = 'PAGADO',
  VENCIDO = 'VENCIDO'
}

// ============================================================================
// CLASIFICACIÓN DE GASTOS SEGÚN PUC 2025
// ============================================================================

export interface ExpenseClassification {
  id: string
  expenseId: string
  accountCode: string
  accountName: string
  classification: ExpenseClassificationType
  subclassification?: string
  isOperational: boolean
  affectsCostOfSales: boolean
  taxDeductible: boolean
  createdAt: Date
}

export enum ExpenseClassificationType {
  // GASTOS DE ADMINISTRACIÓN (51)
  GASTOS_PERSONAL_ADMIN = 'GASTOS_PERSONAL_ADMIN', // 5105
  HONORARIOS = 'HONORARIOS', // 5110
  IMPUESTOS = 'IMPUESTOS', // 5115
  ARRENDAMIENTOS = 'ARRENDAMIENTOS', // 5120
  CONTRIBUCIONES_AFILIACIONES = 'CONTRIBUCIONES_AFILIACIONES', // 5125
  SEGUROS = 'SEGUROS', // 5130
  SERVICIOS = 'SERVICIOS', // 5135
  GASTOS_LEGALES = 'GASTOS_LEGALES', // 5140
  MANTENIMIENTO_REPARACIONES = 'MANTENIMIENTO_REPARACIONES', // 5145
  GASTOS_VIAJE = 'GASTOS_VIAJE', // 5150
  DEPRECIACIONES = 'DEPRECIACIONES', // 5160
  DIVERSOS = 'DIVERSOS', // 5195
  
  // GASTOS DE VENTAS (52)
  GASTOS_PERSONAL_VENTAS = 'GASTOS_PERSONAL_VENTAS', // 5205
  COMISIONES = 'COMISIONES', // 5210
  PUBLICIDAD = 'PUBLICIDAD', // 5220
  TRANSPORTE_FLETES = 'TRANSPORTE_FLETES', // 5225
  
  // GASTOS FINANCIEROS (53)
  GASTOS_BANCARIOS = 'GASTOS_BANCARIOS', // 5305
  INTERESES = 'INTERESES', // 5315
  
  // OTROS GASTOS (54)
  PERDIDA_VENTA_INVERSIONES = 'PERDIDA_VENTA_INVERSIONES', // 5405
  GASTOS_EXTRAORDINARIOS = 'GASTOS_EXTRAORDINARIOS', // 5495
}

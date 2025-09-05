// Utilidades contables según PUC 2025 - Colombia
// Implementación para CRM Tinto del Mirador

import {
  AccountingEntry,
  AccountingEntryDetail,
  InventoryAccountingMovement,
  InventoryValuation,
  InventoryLayer,
  InventoryMovementType,
  ValuationMethod,
  DocumentType,
  EntryStatus,
  ExpenseClassificationType,
  AccountGroup,
  AccountSubgroup
} from '@/types/accounting'

// ============================================================================
// CUENTAS CONTABLES PREDEFINIDAS SEGÚN PUC 2025
// ============================================================================

export const PUC_ACCOUNTS = {
  // INVENTARIOS (Grupo 14)
  INVENTARIO_MATERIAS_PRIMAS: '1405', // Materias primas
  INVENTARIO_PRODUCTOS_PROCESO: '1410', // Productos en proceso
  INVENTARIO_PRODUCTOS_TERMINADOS: '1430', // Productos terminados
  INVENTARIO_MERCANCIAS: '1435', // Mercancías no fabricadas por la empresa
  PROVISION_INVENTARIOS: '1499', // Provisiones para protección de inventarios
  
  // CUENTAS POR PAGAR (Grupo 22)
  PROVEEDORES_NACIONALES: '2205', // Proveedores nacionales
  CUENTAS_POR_PAGAR: '2380', // Acreedores varios
  
  // IMPUESTOS (Grupo 24)
  IVA_POR_PAGAR: '2408', // Impuesto a las ventas por pagar
  RETENCION_FUENTE: '2365', // Retención en la fuente
  
  // GASTOS DE ADMINISTRACIÓN (Grupo 51)
  GASTOS_PERSONAL: '5105', // Gastos de personal
  HONORARIOS: '5110', // Honorarios
  IMPUESTOS_ADMIN: '5115', // Impuestos
  ARRENDAMIENTOS: '5120', // Arrendamientos
  SEGUROS: '5130', // Seguros
  SERVICIOS: '5135', // Servicios
  MANTENIMIENTO: '5145', // Mantenimiento y reparaciones
  GASTOS_VIAJE: '5150', // Gastos de viaje
  DEPRECIACIONES: '5160', // Depreciaciones
  DIVERSOS_ADMIN: '5195', // Diversos
  
  // GASTOS DE VENTAS (Grupo 52)
  GASTOS_PERSONAL_VENTAS: '5205', // Gastos de personal de ventas
  COMISIONES: '5210', // Comisiones
  PUBLICIDAD: '5220', // Publicidad y propaganda
  TRANSPORTE: '5225', // Transporte, fletes y acarreos
  
  // GASTOS FINANCIEROS (Grupo 53)
  GASTOS_BANCARIOS: '5305', // Gastos bancarios
  INTERESES: '5315', // Intereses
  
  // OTROS GASTOS (Grupo 54)
  GASTOS_EXTRAORDINARIOS: '5495', // Gastos extraordinarios
  
  // COSTOS (Grupo 61)
  COSTO_VENTAS: '6135', // Comercio al por mayor y al por menor
  
  // EFECTIVO Y EQUIVALENTES (Grupo 11)
  CAJA: '1105', // Caja
  BANCOS: '1110', // Bancos
} as const

// ============================================================================
// FUNCIONES DE VALORACIÓN DE INVENTARIOS - MÉTODO PEPS
// ============================================================================

export class InventoryValuationPEPS {
  /**
   * Calcula el costo de salida usando método PEPS
   */
  static calculateOutgoingCost(
    layers: InventoryLayer[],
    quantityToExit: number
  ): { cost: number; updatedLayers: InventoryLayer[] } {
    const sortedLayers = [...layers]
      .filter(layer => layer.remainingQuantity > 0)
      .sort((a, b) => a.date.getTime() - b.date.getTime()) // Más antiguas primero
    
    let remainingQuantity = quantityToExit
    let totalCost = 0
    const updatedLayers = [...layers]
    
    for (const layer of sortedLayers) {
      if (remainingQuantity <= 0) break
      
      const quantityFromThisLayer = Math.min(remainingQuantity, layer.remainingQuantity)
      const costFromThisLayer = quantityFromThisLayer * layer.unitCost
      
      totalCost += costFromThisLayer
      remainingQuantity -= quantityFromThisLayer
      
      // Actualizar la capa
      const layerIndex = updatedLayers.findIndex(l => l.id === layer.id)
      if (layerIndex !== -1 && updatedLayers[layerIndex]) {
        const newRemainingQuantity = layer.remainingQuantity - quantityFromThisLayer
        updatedLayers[layerIndex].remainingQuantity = newRemainingQuantity
        updatedLayers[layerIndex].isExhausted = newRemainingQuantity === 0
      }
    }
    
    if (remainingQuantity > 0) {
      throw new Error(`Inventario insuficiente. Faltan ${remainingQuantity} unidades`)
    }
    
    return { cost: totalCost, updatedLayers }
  }
  
  /**
   * Agrega una nueva capa de inventario (entrada)
   */
  static addInventoryLayer(
    currentLayers: InventoryLayer[],
    quantity: number,
    unitCost: number,
    date: Date,
    supplierId?: string,
    documentNumber?: string
  ): InventoryLayer[] {
    const newLayer: InventoryLayer = {
      id: `layer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date,
      quantity,
      remainingQuantity: quantity,
      unitCost,
      totalCost: quantity * unitCost,
      ...(supplierId && { supplierId }),
      ...(documentNumber && { documentNumber }),
      isExhausted: false
    }
    
    return [...currentLayers, newLayer]
  }
  
  /**
   * Calcula el valor total del inventario
   */
  static calculateInventoryValue(layers: InventoryLayer[]): {
    totalQuantity: number
    totalValue: number
    averageCost: number
  } {
    const activeLayers = layers.filter(layer => layer.remainingQuantity > 0)
    
    const totalQuantity = activeLayers.reduce((sum, layer) => sum + layer.remainingQuantity, 0)
    const totalValue = activeLayers.reduce((sum, layer) => 
      sum + (layer.remainingQuantity * layer.unitCost), 0
    )
    const averageCost = totalQuantity > 0 ? totalValue / totalQuantity : 0
    
    return { totalQuantity, totalValue, averageCost }
  }
}

// ============================================================================
// GENERADOR DE ASIENTOS CONTABLES
// ============================================================================

export class AccountingEntryGenerator {
  /**
   * Genera un asiento contable para compra de materias primas
   */
  static generateRawMaterialPurchaseEntry(
    supplierId: string,
    supplierName: string,
    invoiceNumber: string,
    subtotal: number,
    ivaAmount: number,
    retentionAmount: number,
    createdBy: string,
    createdByName: string
  ): AccountingEntry {
    const entryNumber = `MP-${Date.now()}`
    const totalAmount = subtotal + ivaAmount - retentionAmount

    const details: AccountingEntryDetail[] = [
      // Débito: Inventario de Materias Primas
      {
        id: `detail_${Date.now()}_1`,
        entryId: '',
        accountId: '',
        accountCode: PUC_ACCOUNTS.INVENTARIO_MATERIAS_PRIMAS,
        accountName: 'Inventario de Materias Primas',
        debitAmount: subtotal,
        creditAmount: 0,
        description: `Compra materia prima - ${supplierName} - ${invoiceNumber}`,
        reference: invoiceNumber,
        thirdPartyId: supplierId,
        thirdPartyName: supplierName,
        createdAt: new Date()
      },
      // Débito: IVA Descontable (si aplica)
      ...(ivaAmount > 0 ? [{
        id: `detail_${Date.now()}_2`,
        entryId: '',
        accountId: '',
        accountCode: '1355',
        accountName: 'IVA Descontable',
        debitAmount: ivaAmount,
        creditAmount: 0,
        description: `IVA compra materia prima - ${supplierName}`,
        reference: invoiceNumber,
        thirdPartyId: supplierId,
        thirdPartyName: supplierName,
        createdAt: new Date()
      }] : []),
      // Crédito: Proveedores
      {
        id: `detail_${Date.now()}_3`,
        entryId: '',
        accountId: '',
        accountCode: PUC_ACCOUNTS.PROVEEDORES_NACIONALES,
        accountName: 'Proveedores Nacionales',
        debitAmount: 0,
        creditAmount: totalAmount,
        description: `Cuenta por pagar - ${supplierName} - ${invoiceNumber}`,
        reference: invoiceNumber,
        thirdPartyId: supplierId,
        thirdPartyName: supplierName,
        createdAt: new Date()
      },
      // Crédito: Retención en la Fuente (si aplica)
      ...(retentionAmount > 0 ? [{
        id: `detail_${Date.now()}_4`,
        entryId: '',
        accountId: '',
        accountCode: PUC_ACCOUNTS.RETENCION_FUENTE,
        accountName: 'Retención en la Fuente',
        debitAmount: 0,
        creditAmount: retentionAmount,
        description: `Retención aplicada - ${supplierName}`,
        reference: invoiceNumber,
        thirdPartyId: supplierId,
        thirdPartyName: supplierName,
        createdAt: new Date()
      }] : [])
    ]

    const totalDebit = details.reduce((sum, detail) => sum + detail.debitAmount, 0)
    const totalCredit = details.reduce((sum, detail) => sum + detail.creditAmount, 0)

    return {
      id: `entry_${Date.now()}`,
      entryNumber,
      date: new Date(),
      description: `Compra de materia prima - ${supplierName} - ${invoiceNumber}`,
      documentType: DocumentType.FACTURA_COMPRA,
      documentNumber: invoiceNumber,
      totalDebit,
      totalCredit,
      isBalanced: totalDebit === totalCredit,
      details,
      status: EntryStatus.PENDIENTE_APROBACION,
      userId: createdBy,
      userName: createdByName,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Genera un asiento contable para consumo de materias primas
   */
  static generateRawMaterialConsumptionEntry(
    productionOrderId: string,
    materialDescription: string,
    quantity: number,
    unitCost: number,
    createdBy: string,
    createdByName: string
  ): AccountingEntry {
    const entryNumber = `MC-${Date.now()}`
    const totalCost = quantity * unitCost

    const details: AccountingEntryDetail[] = [
      // Débito: Inventario de Productos en Proceso
      {
        id: `detail_${Date.now()}_1`,
        entryId: '',
        accountId: '',
        accountCode: PUC_ACCOUNTS.INVENTARIO_PRODUCTOS_PROCESO,
        accountName: 'Inventario de Productos en Proceso',
        debitAmount: totalCost,
        creditAmount: 0,
        description: `Consumo materia prima - ${materialDescription}`,
        reference: productionOrderId,
        createdAt: new Date()
      },
      // Crédito: Inventario de Materias Primas
      {
        id: `detail_${Date.now()}_2`,
        entryId: '',
        accountId: '',
        accountCode: PUC_ACCOUNTS.INVENTARIO_MATERIAS_PRIMAS,
        accountName: 'Inventario de Materias Primas',
        debitAmount: 0,
        creditAmount: totalCost,
        description: `Salida materia prima - ${materialDescription}`,
        reference: productionOrderId,
        createdAt: new Date()
      }
    ]

    return {
      id: `entry_${Date.now()}`,
      entryNumber,
      date: new Date(),
      description: `Consumo de materia prima en producción - ${materialDescription}`,
      documentType: DocumentType.NOTA_INTERNA,
      documentNumber: productionOrderId,
      totalDebit: totalCost,
      totalCredit: totalCost,
      isBalanced: true,
      details,
      status: EntryStatus.PENDIENTE_APROBACION,
      userId: createdBy,
      userName: createdByName,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  /**
   * Genera asiento contable para compra de inventario (mercancías)
   */
  static generatePurchaseEntry(
    supplierId: string,
    supplierName: string,
    invoiceNumber: string,
    subtotal: number,
    ivaAmount: number,
    retentionAmount: number,
    userId: string,
    userName: string
  ): Omit<AccountingEntry, 'id' | 'createdAt' | 'updatedAt'> {
    const totalAmount = subtotal + ivaAmount - retentionAmount
    
    const details: Omit<AccountingEntryDetail, 'id' | 'entryId' | 'createdAt'>[] = [
      // Débito: Inventario de mercancías
      {
        accountId: 'acc_inventario',
        accountCode: PUC_ACCOUNTS.INVENTARIO_MERCANCIAS,
        accountName: 'Inventario de Mercancías',
        debitAmount: subtotal,
        creditAmount: 0,
        description: `Compra de inventario según factura ${invoiceNumber}`,
        reference: invoiceNumber,
        thirdPartyId: supplierId,
        thirdPartyName: supplierName
      },
      // Débito: IVA descontable (si aplica)
      ...(ivaAmount > 0 ? [{
        accountId: 'acc_iva_descontable',
        accountCode: '1355', // IVA descontable
        accountName: 'IVA Descontable',
        debitAmount: ivaAmount,
        creditAmount: 0,
        description: `IVA descontable factura ${invoiceNumber}`,
        reference: invoiceNumber,
        thirdPartyId: supplierId,
        thirdPartyName: supplierName
      }] : []),
      // Crédito: Proveedores
      {
        accountId: 'acc_proveedores',
        accountCode: PUC_ACCOUNTS.PROVEEDORES_NACIONALES,
        accountName: 'Proveedores Nacionales',
        debitAmount: 0,
        creditAmount: totalAmount,
        description: `Compra a crédito según factura ${invoiceNumber}`,
        reference: invoiceNumber,
        thirdPartyId: supplierId,
        thirdPartyName: supplierName
      },
      // Crédito: Retención en la fuente (si aplica)
      ...(retentionAmount > 0 ? [{
        accountId: 'acc_retencion',
        accountCode: PUC_ACCOUNTS.RETENCION_FUENTE,
        accountName: 'Retención en la Fuente',
        debitAmount: 0,
        creditAmount: retentionAmount,
        description: `Retención en la fuente factura ${invoiceNumber}`,
        reference: invoiceNumber,
        thirdPartyId: supplierId,
        thirdPartyName: supplierName
      }] : [])
    ]
    
    const totalDebit = details.reduce((sum, detail) => sum + detail.debitAmount, 0)
    const totalCredit = details.reduce((sum, detail) => sum + detail.creditAmount, 0)
    
    return {
      entryNumber: `COMP-${new Date().getFullYear()}-${Date.now()}`,
      date: new Date(),
      description: `Compra de inventario a ${supplierName} - Factura ${invoiceNumber}`,
      reference: invoiceNumber,
      documentType: DocumentType.FACTURA_COMPRA,
      documentNumber: invoiceNumber,
      totalDebit,
      totalCredit,
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
      status: EntryStatus.APROBADO,
      userId,
      userName,
      details: details as AccountingEntryDetail[]
    }
  }
  
  /**
   * Genera asiento contable para venta de inventario
   */
  static generateSaleEntry(
    customerId: string,
    customerName: string,
    saleNumber: string,
    subtotal: number,
    costOfSales: number,
    userId: string,
    userName: string
  ): Omit<AccountingEntry, 'id' | 'createdAt' | 'updatedAt'> {
    const details: Omit<AccountingEntryDetail, 'id' | 'entryId' | 'createdAt'>[] = [
      // Débito: Caja o Cuentas por cobrar
      {
        accountId: 'acc_caja',
        accountCode: PUC_ACCOUNTS.CAJA,
        accountName: 'Caja',
        debitAmount: subtotal,
        creditAmount: 0,
        description: `Venta según ${saleNumber}`,
        reference: saleNumber,
        thirdPartyId: customerId,
        thirdPartyName: customerName
      },
      // Crédito: Ingresos por ventas
      {
        accountId: 'acc_ingresos_ventas',
        accountCode: '4135', // Comercio al por mayor y al por menor
        accountName: 'Ingresos por Ventas',
        debitAmount: 0,
        creditAmount: subtotal,
        description: `Venta según ${saleNumber}`,
        reference: saleNumber,
        thirdPartyId: customerId,
        thirdPartyName: customerName
      },
      // Débito: Costo de ventas
      {
        accountId: 'acc_costo_ventas',
        accountCode: PUC_ACCOUNTS.COSTO_VENTAS,
        accountName: 'Costo de Ventas',
        debitAmount: costOfSales,
        creditAmount: 0,
        description: `Costo de venta según ${saleNumber}`,
        reference: saleNumber
      },
      // Crédito: Inventario de mercancías
      {
        accountId: 'acc_inventario',
        accountCode: PUC_ACCOUNTS.INVENTARIO_MERCANCIAS,
        accountName: 'Inventario de Mercancías',
        debitAmount: 0,
        creditAmount: costOfSales,
        description: `Salida de inventario según ${saleNumber}`,
        reference: saleNumber
      }
    ]
    
    const totalDebit = details.reduce((sum, detail) => sum + detail.debitAmount, 0)
    const totalCredit = details.reduce((sum, detail) => sum + detail.creditAmount, 0)
    
    return {
      entryNumber: `VTA-${new Date().getFullYear()}-${Date.now()}`,
      date: new Date(),
      description: `Venta a ${customerName} - ${saleNumber}`,
      reference: saleNumber,
      documentType: DocumentType.FACTURA_VENTA,
      documentNumber: saleNumber,
      totalDebit,
      totalCredit,
      isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
      status: EntryStatus.APROBADO,
      userId,
      userName,
      details: details as AccountingEntryDetail[]
    }
  }
  
  /**
   * Genera asiento contable para ajuste de inventario
   */
  static generateInventoryAdjustmentEntry(
    productId: string,
    productName: string,
    adjustmentType: 'positivo' | 'negativo',
    quantity: number,
    unitCost: number,
    reason: string,
    userId: string,
    userName: string
  ): Omit<AccountingEntry, 'id' | 'createdAt' | 'updatedAt'> {
    const totalAmount = quantity * unitCost
    const isPositive = adjustmentType === 'positivo'
    
    const details: Omit<AccountingEntryDetail, 'id' | 'entryId' | 'createdAt'>[] = [
      // Ajuste positivo: Débito inventario, Crédito otros ingresos
      // Ajuste negativo: Débito otros gastos, Crédito inventario
      {
        accountId: isPositive ? 'acc_inventario' : 'acc_gastos_extraordinarios',
        accountCode: isPositive ? PUC_ACCOUNTS.INVENTARIO_MERCANCIAS : PUC_ACCOUNTS.GASTOS_EXTRAORDINARIOS,
        accountName: isPositive ? 'Inventario de Mercancías' : 'Gastos Extraordinarios',
        debitAmount: totalAmount,
        creditAmount: 0,
        description: `Ajuste ${adjustmentType} de inventario - ${productName}: ${reason}`,
        reference: `ADJ-${Date.now()}`
      },
      {
        accountId: isPositive ? 'acc_otros_ingresos' : 'acc_inventario',
        accountCode: isPositive ? '4295' : PUC_ACCOUNTS.INVENTARIO_MERCANCIAS, // Otros ingresos
        accountName: isPositive ? 'Otros Ingresos' : 'Inventario de Mercancías',
        debitAmount: 0,
        creditAmount: totalAmount,
        description: `Ajuste ${adjustmentType} de inventario - ${productName}: ${reason}`,
        reference: `ADJ-${Date.now()}`
      }
    ]
    
    return {
      entryNumber: `ADJ-${new Date().getFullYear()}-${Date.now()}`,
      date: new Date(),
      description: `Ajuste ${adjustmentType} de inventario - ${productName}`,
      reference: `ADJ-${Date.now()}`,
      documentType: DocumentType.AJUSTE_INVENTARIO,
      totalDebit: totalAmount,
      totalCredit: totalAmount,
      isBalanced: true,
      status: EntryStatus.APROBADO,
      userId,
      userName,
      details: details as AccountingEntryDetail[]
    }
  }
}

// ============================================================================
// CLASIFICADOR DE TRANSACCIONES SEGÚN PUC 2025
// ============================================================================

export class TransactionClassifier {
  /**
   * Determina si una transacción debe clasificarse como activo o gasto
   */
  static classifyTransaction(
    categoryName: string,
    description: string,
    amount: number
  ): {
    isAsset: boolean
    accountCode: string
    accountName: string
    classification: string
    explanation: string
  } {
    const lowerCategory = categoryName.toLowerCase()
    const lowerDescription = description.toLowerCase()

    // MATERIAS PRIMAS - ACTIVO (Cuenta 1405)
    if (lowerCategory.includes('materia') && lowerCategory.includes('prima') ||
        lowerDescription.includes('café verde') || lowerDescription.includes('materia prima') ||
        lowerDescription.includes('insumos para tostado') || lowerDescription.includes('café sin tostar')) {
      return {
        isAsset: true,
        accountCode: PUC_ACCOUNTS.INVENTARIO_MATERIAS_PRIMAS,
        accountName: 'Inventario de Materias Primas',
        classification: 'INVENTARIO_MATERIAS_PRIMAS',
        explanation: 'Las materias primas son activos que se convertirán en productos terminados. Se registran como inventario hasta su consumo en el proceso productivo.'
      }
    }

    // MATERIALES DE EMPAQUE - ACTIVO (Cuenta 1405)
    if (lowerCategory.includes('empaque') || lowerCategory.includes('embalaje') ||
        lowerDescription.includes('bolsa') || lowerDescription.includes('bolsas') ||
        lowerDescription.includes('etiqueta') || lowerDescription.includes('etiquetas') ||
        lowerDescription.includes('caja') || lowerDescription.includes('cajas') ||
        lowerDescription.includes('envase') || lowerDescription.includes('envases') ||
        lowerDescription.includes('empaque') || lowerDescription.includes('embalaje') ||
        lowerDescription.includes('1 libra') || lowerDescription.includes('250g') ||
        lowerDescription.includes('500g') || lowerDescription.includes('kraft') ||
        lowerDescription.includes('válvula') || lowerDescription.includes('valvula') ||
        lowerDescription.includes('sellado') || lowerDescription.includes('termo')) {
      return {
        isAsset: true,
        accountCode: PUC_ACCOUNTS.INVENTARIO_MATERIAS_PRIMAS,
        accountName: 'Inventario de Materias Primas',
        classification: 'INVENTARIO_MATERIAS_PRIMAS',
        explanation: 'Los materiales de empaque son insumos necesarios para completar el producto final. Se consumen en el proceso productivo y forman parte del costo del producto terminado según PUC 2025.'
      }
    }

    // PRODUCTOS EN PROCESO - ACTIVO (Cuenta 1410)
    if (lowerDescription.includes('proceso') || lowerDescription.includes('tostado en curso') ||
        lowerDescription.includes('producción') || lowerDescription.includes('elaboración')) {
      return {
        isAsset: true,
        accountCode: PUC_ACCOUNTS.INVENTARIO_PRODUCTOS_PROCESO,
        accountName: 'Inventario de Productos en Proceso',
        classification: 'INVENTARIO_PRODUCTOS_PROCESO',
        explanation: 'Productos que están en proceso de transformación. Son activos hasta completar su elaboración.'
      }
    }

    // PRODUCTOS TERMINADOS - ACTIVO (Cuenta 1430)
    if (lowerDescription.includes('café tostado') || lowerDescription.includes('producto terminado') ||
        lowerDescription.includes('café molido') || lowerDescription.includes('empacado')) {
      return {
        isAsset: true,
        accountCode: PUC_ACCOUNTS.INVENTARIO_PRODUCTOS_TERMINADOS,
        accountName: 'Inventario de Productos Terminados',
        classification: 'INVENTARIO_PRODUCTOS_TERMINADOS',
        explanation: 'Productos listos para la venta. Son activos hasta su venta al cliente.'
      }
    }

    // SUMINISTROS ADMINISTRATIVOS - GASTO (Grupo 51)
    if (lowerCategory.includes('suministro') && lowerCategory.includes('administrativo') ||
        lowerDescription.includes('papelería') || lowerDescription.includes('oficina') ||
        lowerDescription.includes('útiles') || lowerDescription.includes('carpeta') ||
        lowerDescription.includes('bolígrafo') || lowerDescription.includes('papel') ||
        lowerDescription.includes('tinta') || lowerDescription.includes('impresora') ||
        lowerDescription.includes('administración') || lowerDescription.includes('escritorio')) {
      return {
        isAsset: false,
        accountCode: PUC_ACCOUNTS.DIVERSOS_ADMIN,
        accountName: 'Gastos Diversos',
        classification: 'GASTOS_DIVERSOS',
        explanation: 'Suministros administrativos se registran directamente como gasto operacional según PUC 2025.'
      }
    }

    // Por defecto, clasificar como gasto
    return {
      isAsset: false,
      accountCode: PUC_ACCOUNTS.DIVERSOS_ADMIN,
      accountName: 'Gastos Diversos',
      classification: 'GASTOS_DIVERSOS',
      explanation: 'Transacción clasificada como gasto operacional.'
    }
  }
}

// ============================================================================
// CLASIFICADOR DE GASTOS SEGÚN PUC 2025
// ============================================================================

export class ExpenseClassifier {
  /**
   * Clasifica un gasto según el PUC 2025
   * IMPORTANTE: Esta función solo debe usarse para gastos reales, no para materias primas
   */
  static classifyExpense(
    categoryName: string,
    description: string,
    amount: number
  ): {
    accountCode: string
    accountName: string
    classification: ExpenseClassificationType
    isOperational: boolean
    taxDeductible: boolean
    warning?: string
  } {
    const lowerCategory = categoryName.toLowerCase()
    const lowerDescription = description.toLowerCase()

    // VALIDACIÓN: Detectar si se está intentando clasificar una materia prima como gasto
    const transactionClassification = TransactionClassifier.classifyTransaction(categoryName, description, amount)
    if (transactionClassification.isAsset) {
      return {
        accountCode: transactionClassification.accountCode,
        accountName: transactionClassification.accountName,
        classification: ExpenseClassificationType.DIVERSOS,
        isOperational: false,
        taxDeductible: false,
        warning: `⚠️ ADVERTENCIA: "${categoryName}" debería clasificarse como ACTIVO (${transactionClassification.accountName}) no como gasto. ${transactionClassification.explanation}`
      }
    }
    
    // Gastos de personal
    if (lowerCategory.includes('personal') || lowerCategory.includes('nómina') || 
        lowerDescription.includes('salario') || lowerDescription.includes('sueldo')) {
      return {
        accountCode: PUC_ACCOUNTS.GASTOS_PERSONAL,
        accountName: 'Gastos de Personal',
        classification: ExpenseClassificationType.GASTOS_PERSONAL_ADMIN,
        isOperational: true,
        taxDeductible: true
      }
    }
    
    // Servicios públicos
    if (lowerCategory.includes('servicios') || lowerCategory.includes('públicos') ||
        lowerDescription.includes('electricidad') || lowerDescription.includes('agua') ||
        lowerDescription.includes('gas') || lowerDescription.includes('internet')) {
      return {
        accountCode: PUC_ACCOUNTS.SERVICIOS,
        accountName: 'Servicios',
        classification: ExpenseClassificationType.SERVICIOS,
        isOperational: true,
        taxDeductible: true
      }
    }
    
    // Marketing y publicidad
    if (lowerCategory.includes('marketing') || lowerCategory.includes('publicidad') ||
        lowerDescription.includes('facebook') || lowerDescription.includes('google') ||
        lowerDescription.includes('redes sociales')) {
      return {
        accountCode: PUC_ACCOUNTS.PUBLICIDAD,
        accountName: 'Publicidad y Propaganda',
        classification: ExpenseClassificationType.PUBLICIDAD,
        isOperational: true,
        taxDeductible: true
      }
    }
    
    // Transporte y logística
    if (lowerCategory.includes('transporte') || lowerCategory.includes('logística') ||
        lowerDescription.includes('combustible') || lowerDescription.includes('gasolina') ||
        lowerDescription.includes('reparto')) {
      return {
        accountCode: PUC_ACCOUNTS.TRANSPORTE,
        accountName: 'Transporte, Fletes y Acarreos',
        classification: ExpenseClassificationType.TRANSPORTE_FLETES,
        isOperational: true,
        taxDeductible: true
      }
    }
    
    // Mantenimiento y reparaciones
    if (lowerCategory.includes('mantenimiento') || lowerCategory.includes('equipos') ||
        lowerDescription.includes('reparación') || lowerDescription.includes('tostadora') ||
        lowerDescription.includes('molino')) {
      return {
        accountCode: PUC_ACCOUNTS.MANTENIMIENTO,
        accountName: 'Mantenimiento y Reparaciones',
        classification: ExpenseClassificationType.MANTENIMIENTO_REPARACIONES,
        isOperational: true,
        taxDeductible: true
      }
    }
    
    // Gastos administrativos
    if (lowerCategory.includes('administrativo') || lowerCategory.includes('oficina') ||
        lowerDescription.includes('software') || lowerDescription.includes('licencia') ||
        lowerDescription.includes('papelería')) {
      return {
        accountCode: PUC_ACCOUNTS.DIVERSOS_ADMIN,
        accountName: 'Diversos',
        classification: ExpenseClassificationType.DIVERSOS,
        isOperational: true,
        taxDeductible: true
      }
    }
    
    // Gastos bancarios
    if (lowerDescription.includes('banco') || lowerDescription.includes('comisión') ||
        lowerDescription.includes('transferencia')) {
      return {
        accountCode: PUC_ACCOUNTS.GASTOS_BANCARIOS,
        accountName: 'Gastos Bancarios',
        classification: ExpenseClassificationType.GASTOS_BANCARIOS,
        isOperational: false,
        taxDeductible: true
      }
    }
    
    // Por defecto: Gastos diversos
    return {
      accountCode: PUC_ACCOUNTS.DIVERSOS_ADMIN,
      accountName: 'Diversos',
      classification: ExpenseClassificationType.DIVERSOS,
      isOperational: true,
      taxDeductible: true
    }
  }
}

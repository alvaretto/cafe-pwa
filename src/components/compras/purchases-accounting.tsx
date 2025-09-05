'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Receipt,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  BookOpen,
  PieChart,
  CreditCard,
  Building,
  Percent
} from 'lucide-react'
import { 
  MOCK_ACCOUNTING_ENTRIES,
  MOCK_EXPENSE_CLASSIFICATIONS,
  getAccountingEntriesByType,
  getAccountingStats
} from '@/lib/mock-data'
import { 
  DocumentType,
  EntryStatus,
  ExpenseClassificationType
} from '@/types/accounting'
import { PUC_ACCOUNTS, AccountingEntryGenerator, TransactionClassifier } from '@/lib/accounting-utils'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PurchasesAccountingProps {
  supplierId?: string
}

export function PurchasesAccounting({ supplierId }: PurchasesAccountingProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [newPurchase, setNewPurchase] = useState({
    supplierId: '',
    supplierName: '',
    invoiceNumber: '',
    description: '',
    subtotal: 0,
    ivaAmount: 0,
    retentionAmount: 0
  })

  const purchaseEntries = getAccountingEntriesByType(DocumentType.FACTURA_COMPRA)
  const accountingStats = getAccountingStats()

  const handleGenerateEntry = () => {
    // Clasificar la transacción para determinar si es activo o gasto
    const classification = TransactionClassifier.classifyTransaction(
      'Compra',
      newPurchase.description,
      newPurchase.subtotal
    )

    let entry
    if (classification.isAsset && classification.classification === 'INVENTARIO_MATERIAS_PRIMAS') {
      // Generar asiento para materia prima
      entry = AccountingEntryGenerator.generateRawMaterialPurchaseEntry(
        newPurchase.supplierId,
        newPurchase.supplierName,
        newPurchase.invoiceNumber,
        newPurchase.subtotal,
        newPurchase.ivaAmount,
        newPurchase.retentionAmount,
        'user-1',
        'Usuario Actual'
      )
    } else {
      // Generar asiento para mercancía
      entry = AccountingEntryGenerator.generatePurchaseEntry(
        newPurchase.supplierId,
        newPurchase.supplierName,
        newPurchase.invoiceNumber,
        newPurchase.subtotal,
        newPurchase.ivaAmount,
        newPurchase.retentionAmount,
        'user-1',
        'Usuario Actual'
      )
    }

    console.log('Asiento contable generado:', entry)
    console.log('Clasificación:', classification)
    // Aquí se enviaría al backend
  }

  return (
    <div className="space-y-6">
      {/* Header Contable */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Contabilidad de Compras
          </h2>
          <p className="text-amber-700 mt-1">
            Registro contable según PUC 2025 - Cuentas por pagar y control de IVA
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          PUC 2025 Compliant
        </Badge>
      </div>

      {/* Estadísticas de Compras */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Facturas de Compra
            </CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {purchaseEntries.length}
            </div>
            <p className="text-xs text-blue-700">
              Registradas este mes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total Compras
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(750000)}
            </div>
            <p className="text-xs text-green-700">
              Cuenta 1435 - Inventarios
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Cuentas por Pagar
            </CardTitle>
            <Building className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(750000)}
            </div>
            <p className="text-xs text-purple-700">
              Cuenta 2205 - Proveedores
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              IVA Descontable
            </CardTitle>
            <Percent className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {formatCurrency(0)}
            </div>
            <p className="text-xs text-amber-700">
              Cuenta 1355 - IVA
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Información Contable */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Cuentas PUC
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Asientos
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Generar
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Reportes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Cuentas de Compras - PUC 2025
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">1435 - Inventario de Mercancías</p>
                    <p className="text-sm text-blue-700">Registro de compras de inventario</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Débito
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-900">2205 - Proveedores Nacionales</p>
                    <p className="text-sm text-purple-700">Cuentas por pagar a proveedores</p>
                  </div>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800">
                    Crédito
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900">1355 - IVA Descontable</p>
                    <p className="text-sm text-green-700">IVA pagado en compras</p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Débito
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-900">2365 - Retención en la Fuente</p>
                    <p className="text-sm text-red-700">Retenciones aplicadas</p>
                  </div>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    Crédito
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Flujo Contable de Compras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Recepción de Factura</p>
                      <p className="text-sm text-gray-600">Validación de datos del proveedor</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Registro Contable</p>
                      <p className="text-sm text-gray-600">Asiento automático según PUC 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Control de Pagos</p>
                      <p className="text-sm text-gray-600">Seguimiento de vencimientos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Actualización Inventario</p>
                      <p className="text-sm text-gray-600">Método PEPS aplicado</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Asientos Contables de Compras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {purchaseEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{entry.entryNumber}</Badge>
                        <Badge variant={entry.status === EntryStatus.APROBADO ? 'default' : 'secondary'}>
                          {entry.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">{formatDate(entry.date)}</span>
                    </div>
                    <p className="font-medium mb-3">{entry.description}</p>
                    
                    {/* Detalles del asiento */}
                    <div className="space-y-2">
                      {entry.details.map((detail) => (
                        <div key={detail.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-white px-2 py-1 rounded">
                              {detail.accountCode}
                            </span>
                            <span>{detail.accountName}</span>
                          </div>
                          <div className="flex gap-4">
                            {detail.debitAmount > 0 && (
                              <span className="text-green-600 font-medium">
                                Débito: {formatCurrency(detail.debitAmount)}
                              </span>
                            )}
                            {detail.creditAmount > 0 && (
                              <span className="text-red-600 font-medium">
                                Crédito: {formatCurrency(detail.creditAmount)}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mt-3 pt-3 border-t">
                      <div>
                        <span className="text-gray-600">Total Débitos:</span>
                        <span className="font-medium ml-2">{formatCurrency(entry.totalDebit)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Créditos:</span>
                        <span className="font-medium ml-2">{formatCurrency(entry.totalCredit)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Generador de Asientos Contables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Proveedor</Label>
                  <Input
                    id="supplierName"
                    value={newPurchase.supplierName}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, supplierName: e.target.value }))}
                    placeholder="Nombre del proveedor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Número de Factura</Label>
                  <Input
                    id="invoiceNumber"
                    value={newPurchase.invoiceNumber}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    placeholder="FAC-2024-001"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descripción de la Compra</Label>
                  <Input
                    id="description"
                    value={newPurchase.description}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ej: Café verde Huila, Bolsas kraft 1 libra, Etiquetas adhesivas..."
                  />
                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="font-medium">💡 Clasificación automática según descripción:</p>
                    <p><strong>Materias Primas (1405):</strong> Café verde, bolsas de empaque, etiquetas, cajas</p>
                    <p><strong>Mercancías (1435):</strong> Productos para reventa</p>
                    <p><strong>Gastos (51xx):</strong> Suministros administrativos, papelería</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtotal">Subtotal</Label>
                  <Input
                    id="subtotal"
                    type="number"
                    value={newPurchase.subtotal}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, subtotal: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ivaAmount">IVA</Label>
                  <Input
                    id="ivaAmount"
                    type="number"
                    value={newPurchase.ivaAmount}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, ivaAmount: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retentionAmount">Retención en la Fuente</Label>
                  <Input
                    id="retentionAmount"
                    type="number"
                    value={newPurchase.retentionAmount}
                    onChange={(e) => setNewPurchase(prev => ({ ...prev, retentionAmount: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total a Pagar</Label>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(newPurchase.subtotal + newPurchase.ivaAmount - newPurchase.retentionAmount)}
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleGenerateEntry}
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={!newPurchase.supplierName || !newPurchase.invoiceNumber || !newPurchase.description || newPurchase.subtotal <= 0}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Generar Asiento Contable
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Reportes Contables de Compras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Balance de Comprobación</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Resumen de cuentas relacionadas con compras
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Auxiliar de Proveedores</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Movimientos detallados por proveedor
                  </p>
                  <Button variant="outline" className="w-full">
                    <Building className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Control de IVA</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    IVA descontable por período
                  </p>
                  <Button variant="outline" className="w-full">
                    <Percent className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Retenciones</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Retenciones en la fuente aplicadas
                  </p>
                  <Button variant="outline" className="w-full">
                    <Receipt className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

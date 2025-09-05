'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Receipt,
  BookOpen,
  PieChart
} from 'lucide-react'
import {
  MOCK_ACCOUNTING_ENTRIES,
  MOCK_INVENTORY_ACCOUNTING_MOVEMENTS,
  MOCK_EXPENSE_CLASSIFICATIONS,
  MOCK_RAW_MATERIALS,
  MOCK_RAW_MATERIAL_MOVEMENTS,
  getAccountingStats,
  getInventoryMovementsByProduct,
  getExpenseClassificationsByType,
  getRawMaterials,
  getRawMaterialMovements,
  getLowStockRawMaterials,
  getTotalRawMaterialsValue
} from '@/lib/mock-data'
import { 
  DocumentType,
  EntryStatus,
  InventoryMovementType,
  ExpenseClassificationType
} from '@/types/accounting'
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils'

interface InventoryAccountingProps {
  productId?: string
}

export function InventoryAccounting({ productId }: InventoryAccountingProps) {
  const [activeTab, setActiveTab] = useState('overview')
  
  const accountingStats = getAccountingStats()
  const inventoryMovements = productId
    ? getInventoryMovementsByProduct(productId)
    : MOCK_INVENTORY_ACCOUNTING_MOVEMENTS
  const rawMaterials = getRawMaterials()
  const rawMaterialMovements = getRawMaterialMovements()
  const lowStockRawMaterials = getLowStockRawMaterials()
  const totalRawMaterialsValue = getTotalRawMaterialsValue()

  // Separar materiales de empaque
  const packagingMaterials = rawMaterials.filter(material => material.category === 'empaque')
  const coffeeMaterials = rawMaterials.filter(material => material.category === 'cafe-verde')
  const packagingValue = packagingMaterials.reduce((sum, material) => sum + material.totalValue, 0)

  return (
    <div className="space-y-6">
      {/* Header Contable */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Contabilidad de Inventarios
          </h2>
          <p className="text-amber-700 mt-1">
            Cumplimiento con PUC 2025 - Valoración PEPS y registros contables
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          PUC 2025 Compliant
        </Badge>
      </div>

      {/* Estadísticas Contables */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Asientos Contables
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {accountingStats.totalEntries}
            </div>
            <p className="text-xs text-blue-700">
              {accountingStats.balancePercentage.toFixed(1)}% balanceados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total Débitos
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(accountingStats.totalDebits)}
            </div>
            <p className="text-xs text-green-700">
              Cuenta 1435 - Inventarios
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Total Créditos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(accountingStats.totalCredits)}
            </div>
            <p className="text-xs text-purple-700">
              Cuentas por pagar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              Estado Balance
            </CardTitle>
            {accountingStats.isSystemBalanced ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              accountingStats.isSystemBalanced ? 'text-green-900' : 'text-red-900'
            }`}>
              {accountingStats.isSystemBalanced ? 'Balanceado' : 'Desbalanceado'}
            </div>
            <p className="text-xs text-amber-700">
              Diferencia: {formatCurrency(Math.abs(accountingStats.totalDebits - accountingStats.totalCredits))}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de Materias Primas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Materias Primas
            </CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {rawMaterials.length}
            </div>
            <p className="text-xs text-green-700">
              Cuenta 1405 - PUC 2025
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Valor Total MP
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(totalRawMaterialsValue)}
            </div>
            <p className="text-xs text-blue-700">
              Inventario valorizado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Stock Crítico
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {lowStockRawMaterials.length}
            </div>
            <p className="text-xs text-red-700">
              Materias primas
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Materiales Empaque
            </CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {packagingMaterials.length}
            </div>
            <p className="text-xs text-purple-700">
              Tipos disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Detalladas de Materiales de Empaque */}
      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
            <Package className="h-5 w-5" />
            📦 Materiales de Empaque - Cuenta 1405 (PUC 2025)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-white rounded-lg border border-orange-200">
              <h3 className="font-medium text-orange-900 mb-2">Valor Total Empaque</h3>
              <p className="text-2xl font-bold text-orange-800">{formatCurrency(packagingValue)}</p>
              <p className="text-sm text-orange-600">Inventario valorizado</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-orange-200">
              <h3 className="font-medium text-orange-900 mb-2">Café Verde</h3>
              <p className="text-2xl font-bold text-orange-800">{coffeeMaterials.length}</p>
              <p className="text-sm text-orange-600">Tipos de café</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-orange-200">
              <h3 className="font-medium text-orange-900 mb-2">Tratamiento Contable</h3>
              <p className="text-sm font-medium text-orange-800">✅ Materias Primas</p>
              <p className="text-xs text-orange-600">Cuenta 1405 - PUC 2025</p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-orange-900">Materiales de Empaque Disponibles:</h4>
            {packagingMaterials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-orange-900">{material.name}</p>
                  <p className="text-sm text-orange-700">{material.description}</p>
                  <p className="text-xs text-orange-600">Stock: {material.currentStock} {material.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-800">{formatCurrency(material.totalValue)}</p>
                  <p className="text-xs text-orange-600">Costo unitario: {formatCurrency(material.unitCost)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Tratamiento Contable Correcto:</strong> Los materiales de empaque (bolsas, etiquetas, cajas)
              se clasifican como Inventario de Materias Primas (cuenta 1405) porque son insumos necesarios
              para completar el producto final según PUC 2025.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Información Contable */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Movimientos
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Asientos
          </TabsTrigger>
          <TabsTrigger value="classification" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Clasificación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Método de Valoración
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900">PEPS (Primeras Entradas, Primeras Salidas)</p>
                    <p className="text-sm text-blue-700">Método oficial según PUC 2025</p>
                  </div>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    Activo
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Costo promedio actual:</span>
                    <span className="font-medium">{formatCurrency(15000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Última actualización:</span>
                    <span className="font-medium">{formatDate(new Date())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Cuentas PUC 2025
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">1435 - Inventario Mercancías</span>
                  <Badge variant="outline">Activo</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">2205 - Proveedores Nacionales</span>
                  <Badge variant="outline">Pasivo</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">6135 - Costo de Ventas</span>
                  <Badge variant="outline">Costo</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">4135 - Ingresos por Ventas</span>
                  <Badge variant="outline">Ingreso</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                Movimientos Contables de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inventoryMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        movement.movementType === InventoryMovementType.ENTRADA_COMPRA
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {movement.movementType === InventoryMovementType.ENTRADA_COMPRA ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <Package className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{movement.productName}</p>
                        <p className="text-sm text-gray-600">
                          {movement.reason} - {movement.documentNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(movement.totalCost)}</p>
                      <p className="text-sm text-gray-600">
                        {movement.quantity} unidades @ {formatCurrency(movement.unitCost)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Asientos Contables Relacionados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {MOCK_ACCOUNTING_ENTRIES.map((entry) => (
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
                    <p className="font-medium mb-2">{entry.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
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

        <TabsContent value="classification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Clasificación de Gastos según PUC 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.values(ExpenseClassificationType).slice(0, 6).map((type) => {
                  const classifications = getExpenseClassificationsByType(type)
                  const total = classifications.reduce((sum, c) => {
                    const expense = MOCK_EXPENSE_CLASSIFICATIONS.find(e => e.id === c.id)
                    return sum + (expense ? 100000 : 0) // Mock amount
                  }, 0)
                  
                  return (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{type.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-600">{classifications.length} gastos clasificados</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(total)}</p>
                        <Badge variant="outline" className="text-xs">
                          {classifications[0]?.isOperational ? 'Operacional' : 'No Operacional'}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

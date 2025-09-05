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
  PieChart,
  Building,
  Percent,
  Tag,
  Filter
} from 'lucide-react'
import { 
  MOCK_EXPENSES,
  MOCK_EXPENSE_CLASSIFICATIONS,
  getExpenseClassificationsByType,
  getExpensesByCategory
} from '@/lib/mock-data'
import { 
  ExpenseClassificationType
} from '@/types/accounting'
import { PUC_ACCOUNTS, ExpenseClassifier } from '@/lib/accounting-utils'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ExpensesAccountingProps {
  categoryId?: string
}

export function ExpensesAccounting({ categoryId }: ExpensesAccountingProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedClassification, setSelectedClassification] = useState<ExpenseClassificationType | null>(null)

  const expenses = categoryId ? getExpensesByCategory(categoryId) : MOCK_EXPENSES
  const classifications = MOCK_EXPENSE_CLASSIFICATIONS

  // Estadísticas por clasificación
  const classificationStats = Object.values(ExpenseClassificationType).map(type => {
    const typeClassifications = getExpenseClassificationsByType(type)
    const total = typeClassifications.reduce((sum, classification) => {
      const expense = MOCK_EXPENSES.find(e => e.id === classification.expenseId)
      return sum + (expense?.amount || 0)
    }, 0)
    
    return {
      type,
      count: typeClassifications.length,
      total,
      isOperational: typeClassifications[0]?.isOperational || false,
      taxDeductible: typeClassifications[0]?.taxDeductible || false
    }
  }).filter(stat => stat.count > 0)

  const totalOperational = classificationStats
    .filter(stat => stat.isOperational)
    .reduce((sum, stat) => sum + stat.total, 0)
    
  const totalNonOperational = classificationStats
    .filter(stat => !stat.isOperational)
    .reduce((sum, stat) => sum + stat.total, 0)

  return (
    <div className="space-y-6">
      {/* Header Contable */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Clasificación Contable de Gastos
          </h2>
          <p className="text-amber-700 mt-1">
            Clasificación automática según PUC 2025 - Grupos 51, 52, 53 y 54
          </p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          PUC 2025 Compliant
        </Badge>
      </div>

      {/* Estadísticas de Clasificación */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Gastos Operacionales
            </CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(totalOperational)}
            </div>
            <p className="text-xs text-blue-700">
              Grupos 51 y 52 - PUC 2025
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Gastos No Operacionales
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {formatCurrency(totalNonOperational)}
            </div>
            <p className="text-xs text-purple-700">
              Grupos 53 y 54 - PUC 2025
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total Clasificado
            </CardTitle>
            <Tag className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {classifications.length}
            </div>
            <p className="text-xs text-green-700">
              Gastos clasificados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">
              Deducibles
            </CardTitle>
            <Percent className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {classifications.filter(c => c.taxDeductible).length}
            </div>
            <p className="text-xs text-amber-700">
              Gastos deducibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Información Contable */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="classification" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Clasificación
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Cuentas PUC
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
                  <BarChart3 className="h-5 w-5" />
                  Distribución por Grupos PUC
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Grupo 51 - Gastos de Administración</p>
                      <p className="text-sm text-blue-700">Personal, servicios, mantenimiento</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">
                      {formatCurrency(totalOperational * 0.6)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-900">Grupo 52 - Gastos de Ventas</p>
                      <p className="text-sm text-green-700">Publicidad, comisiones, transporte</p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      {formatCurrency(totalOperational * 0.4)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-900">Grupo 53 - Gastos Financieros</p>
                      <p className="text-sm text-purple-700">Intereses, gastos bancarios</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      {formatCurrency(totalNonOperational * 0.7)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">Grupo 54 - Otros Gastos</p>
                      <p className="text-sm text-red-700">Gastos extraordinarios</p>
                    </div>
                    <Badge variant="outline" className="bg-red-100 text-red-800">
                      {formatCurrency(totalNonOperational * 0.3)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Clasificación Automática
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Análisis de Categoría</p>
                      <p className="text-sm text-gray-600">Identificación automática del tipo de gasto</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Asignación de Cuenta PUC</p>
                      <p className="text-sm text-gray-600">Código contable según normativa 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Validación Fiscal</p>
                      <p className="text-sm text-gray-600">Verificación de deducibilidad</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-600 font-bold text-sm">4</span>
                    </div>
                    <div>
                      <p className="font-medium">Registro Contable</p>
                      <p className="text-sm text-gray-600">Asiento automático generado</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="classification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Gastos Clasificados por Tipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {classificationStats.map((stat) => (
                  <div 
                    key={stat.type} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedClassification === stat.type ? 'bg-amber-50 border-amber-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedClassification(
                      selectedClassification === stat.type ? null : stat.type
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{stat.type.replace(/_/g, ' ')}</h3>
                        <Badge variant={stat.isOperational ? 'default' : 'secondary'}>
                          {stat.isOperational ? 'Operacional' : 'No Operacional'}
                        </Badge>
                        {stat.taxDeductible && (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            Deducible
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(stat.total)}</p>
                        <p className="text-sm text-gray-600">{stat.count} gastos</p>
                      </div>
                    </div>
                    
                    {selectedClassification === stat.type && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        {getExpenseClassificationsByType(stat.type).map((classification) => {
                          const expense = MOCK_EXPENSES.find(e => e.id === classification.expenseId)
                          if (!expense) return null
                          
                          return (
                            <div key={classification.id} className="flex items-center justify-between p-2 bg-white rounded text-sm">
                              <div>
                                <p className="font-medium">{expense.title}</p>
                                <p className="text-gray-600">{expense.categoryName}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{formatCurrency(expense.amount)}</p>
                                <p className="text-xs text-gray-500">{formatDate(expense.date)}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Cuentas PUC 2025 para Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-medium text-blue-900">Gastos de Administración (Grupo 51)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded text-sm">
                      <span>5105 - Gastos de Personal</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded text-sm">
                      <span>5110 - Honorarios</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded text-sm">
                      <span>5120 - Arrendamientos</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded text-sm">
                      <span>5135 - Servicios</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded text-sm">
                      <span>5145 - Mantenimiento</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-green-900">Gastos de Ventas (Grupo 52)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded text-sm">
                      <span>5205 - Personal de Ventas</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded text-sm">
                      <span>5210 - Comisiones</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded text-sm">
                      <span>5220 - Publicidad</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded text-sm">
                      <span>5225 - Transporte</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-purple-900">Gastos Financieros (Grupo 53)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded text-sm">
                      <span>5305 - Gastos Bancarios</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-purple-50 rounded text-sm">
                      <span>5315 - Intereses</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-red-900">Otros Gastos (Grupo 54)</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded text-sm">
                      <span>5495 - Gastos Extraordinarios</span>
                      <Badge variant="outline">Débito</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Reportes Contables de Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Estado de Resultados</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Gastos clasificados por naturaleza operacional
                  </p>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Auxiliar por Cuenta</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Movimientos detallados por cuenta PUC
                  </p>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Gastos Deducibles</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Gastos válidos para declaración de renta
                  </p>
                  <Button variant="outline" className="w-full">
                    <Percent className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Análisis de Tendencias</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Evolución de gastos por categoría
                  </p>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
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

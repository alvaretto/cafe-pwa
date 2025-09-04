'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DollarSign,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  FileText,
  Settings,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  CreditCard,
  Receipt,
  Target,
  Palette
} from 'lucide-react'
import { Expense, ExpenseCategory } from '@/lib/mock-data'

// Header de gastos
interface ExpensesHeaderProps {
  onCreateExpense: () => void
  stats: any
  alertsCount: number
}

export function ExpensesHeader({ onCreateExpense, stats, alertsCount }: ExpensesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Control de Gastos</h1>
        <p className="text-amber-700 mt-1">
          Gestión financiera empresarial con categorización, presupuestos y análisis comparativo
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {alertsCount > 0 && (
          <Badge variant="destructive" className="animate-pulse">
            {alertsCount} Alertas
          </Badge>
        )}
        {stats.pending.count > 0 && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {stats.pending.count} Pendientes
          </Badge>
        )}
        <Button 
          onClick={onCreateExpense}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Gasto
        </Button>
      </div>
    </div>
  )
}

// Estadísticas de gastos
interface ExpensesStatsProps {
  stats: any
  isLoading: boolean
}

export function ExpensesStats({ stats, isLoading }: ExpensesStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Gastos Este Mes',
      value: formatCurrency(stats.thisMonth.total),
      subtitle: `${stats.thisMonth.count} transacciones`,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      trend: stats.thisMonth.growth,
    },
    {
      title: 'Presupuesto Total',
      value: formatCurrency(stats.totalBudget),
      subtitle: `${((stats.thisMonth.total / stats.totalBudget) * 100).toFixed(1)}% utilizado`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pendientes Aprobación',
      value: stats.pending.count.toString(),
      subtitle: formatCurrency(stats.pending.total),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Mes Anterior',
      value: formatCurrency(stats.lastMonth.total),
      subtitle: `${stats.lastMonth.count} transacciones`,
      icon: Calendar,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        
        return (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gray-900">
                {card.value}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <span>{card.subtitle}</span>
                {card.trend !== undefined && (
                  <div className={`flex items-center ml-2 ${
                    card.trend >= 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {card.trend >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    <span>{Math.abs(card.trend).toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Tabs de navegación
interface ExpensesTabsProps {
  activeTab: string
  onTabChange: (tab: 'overview' | 'budget' | 'expenses' | 'reports' | 'categories') => void
  alertsCount: number
  pendingCount: number
}

export function ExpensesTabs({ activeTab, onTabChange, alertsCount, pendingCount }: ExpensesTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'budget', label: 'Presupuestos', icon: Target, badge: alertsCount },
    { id: 'expenses', label: 'Gastos', icon: Receipt, badge: pendingCount },
    { id: 'reports', label: 'Reportes', icon: FileText },
    { id: 'categories', label: 'Categorías', icon: Settings },
  ]

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => onTabChange(tab.id as any)}
                className={`flex-1 min-w-0 rounded-none border-b-2 transition-colors ${
                  isActive 
                    ? 'border-amber-600 bg-amber-50 text-amber-700' 
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="truncate">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <Badge 
                    variant={isActive ? "default" : "secondary"} 
                    className="ml-2 text-xs"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Resumen de gastos
interface ExpensesOverviewProps {
  expenses: Expense[]
  categories: ExpenseCategory[]
  stats: any
  isLoading: boolean
}

export function ExpensesOverview({ expenses, categories, stats, isLoading }: ExpensesOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Gastos por categoría */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <PieChart className="h-5 w-5 mr-2" />
            Gastos por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.categories.map((category: any) => (
              <div key={category.categoryId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-900">{category.categoryName}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(category.total)}</div>
                    <div className="text-xs text-gray-500">
                      {category.percentage.toFixed(1)}% del presupuesto
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      category.isOverBudget ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ 
                      width: `${Math.min(100, category.percentage)}%`,
                      backgroundColor: category.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gastos recientes */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Gastos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.slice(0, 5).map((expense) => (
              <div key={expense.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ 
                    backgroundColor: categories.find(c => c.id === expense.categoryId)?.color || '#6B7280' 
                  }}
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{expense.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{expense.categoryName}</span>
                    <span>•</span>
                    <span>{expense.date.toLocaleDateString('es-CO')}</span>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="font-semibold text-red-600">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="flex items-center space-x-1">
                    {expense.isApproved ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Aprobado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendiente
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Análisis de presupuesto (placeholder simple)
interface BudgetAnalysisProps {
  categories: ExpenseCategory[]
  stats: any
  alerts: any[]
  isLoading: boolean
}

export function BudgetAnalysis({ categories, stats, alerts, isLoading }: BudgetAnalysisProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Target className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis de Presupuesto</h3>
        <p className="text-gray-600 text-center">
          Funcionalidad de análisis de presupuesto próximamente disponible.
        </p>
      </CardContent>
    </Card>
  )
}

// Lista de gastos (placeholder simple)
interface ExpensesListProps {
  expenses: Expense[]
  categories: ExpenseCategory[]
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  dateRange: { start: Date; end: Date }
  onDateRangeChange: (range: { start: Date; end: Date }) => void
  isLoading: boolean
  onViewExpense: (expense: Expense) => void
  onEditExpense: (expense: Expense) => void
  onDeleteExpense: (expenseId: string) => void
  onApproveExpense: (expenseId: string) => void
  userRole: string
}

export function ExpensesList({
  expenses,
  categories,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  isLoading,
  onViewExpense,
  onEditExpense,
  onDeleteExpense,
  onApproveExpense,
  userRole
}: ExpensesListProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar gastos..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center justify-center p-2 bg-amber-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-amber-800">
                  {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
                </div>
                <div className="text-xs text-amber-600">{expenses.length} gastos</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de gastos */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Lista de Gastos
            <Badge variant="secondary" className="ml-2">
              {expenses.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron gastos</h3>
              <p className="text-gray-600">No hay gastos que coincidan con los filtros seleccionados.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: categories.find(c => c.id === expense.categoryId)?.color || '#6B7280'
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{expense.title}</h4>
                      <div className="text-lg font-bold text-red-600">
                        {formatCurrency(expense.amount)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{expense.categoryName}</span>
                      <span>•</span>
                      <span>{expense.date.toLocaleDateString('es-CO')}</span>
                      {expense.supplier && (
                        <>
                          <span>•</span>
                          <span>{expense.supplier}</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        {expense.isApproved ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Aprobado
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Pendiente
                          </Badge>
                        )}

                        {expense.isRecurring && (
                          <Badge variant="outline" className="text-xs">
                            Recurrente
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewExpense(expense)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditExpense(expense)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!expense.isApproved && userRole === 'ADMIN' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onApproveExpense(expense.id)}
                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteExpense(expense.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Reportes de gastos (placeholder)
interface ExpenseReportsProps {
  expenses: Expense[]
  categories: ExpenseCategory[]
  isLoading: boolean
}

export function ExpenseReports({ expenses, categories, isLoading }: ExpenseReportsProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes Avanzados</h3>
        <p className="text-gray-600 text-center">
          Funcionalidad de reportes próximamente disponible con gráficos interactivos y exportación.
        </p>
      </CardContent>
    </Card>
  )
}

// Gestión de categorías
interface ExpenseCategoriesProps {
  categories: ExpenseCategory[]
  stats: any
  isLoading: boolean
}

export function ExpenseCategories({ categories, stats, isLoading }: ExpenseCategoriesProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardContent className="p-4">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const categoryStats = stats.categories.find((c: any) => c.categoryId === category.id)

        return (
          <Card key={category.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>
                <Badge
                  variant={category.isActive ? "secondary" : "outline"}
                  className={category.isActive ? "bg-green-100 text-green-800" : ""}
                >
                  {category.isActive ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-800">
                      {formatCurrency(category.monthlyBudget || 0)}
                    </div>
                    <div className="text-blue-600 text-xs">Presupuesto</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="font-semibold text-red-800">
                      {formatCurrency(categoryStats?.total || 0)}
                    </div>
                    <div className="text-red-600 text-xs">Gastado</div>
                  </div>
                </div>

                {categoryStats && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilizado:</span>
                      <span className={`font-medium ${
                        categoryStats.isOverBudget ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {categoryStats.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, categoryStats.percentage)}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    Creada {category.createdAt.toLocaleDateString('es-CO')}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

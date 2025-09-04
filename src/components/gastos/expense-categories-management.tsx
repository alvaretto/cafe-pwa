'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Palette,
  Check,
  Target,
  DollarSign,
  AlertTriangle
} from 'lucide-react'
import { ExpenseCategory } from '@/types'
import { getCategoryStats, formatBudget, calculateBudgetUsage, getBudgetStatus } from '@/lib/expense-category-utils'

interface ExpenseCategoriesManagementProps {
  categories: ExpenseCategory[]
  onCreateCategory: () => void
  onEditCategory: (category: ExpenseCategory) => void
  onDeleteCategory: (categoryId: string) => void
  onViewCategory: (category: ExpenseCategory) => void
}

export function ExpenseCategoriesManagement({ 
  categories, 
  onCreateCategory, 
  onEditCategory, 
  onDeleteCategory,
  onViewCategory
}: ExpenseCategoriesManagementProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-amber-900">Gestión de Categorías</h2>
          <p className="text-amber-700">Administra las categorías para organizar tus gastos</p>
        </div>
        <Button 
          onClick={onCreateCategory}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Categorías</p>
                <p className="text-2xl font-bold text-amber-900">{categories.length}</p>
              </div>
              <Palette className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activas</p>
                <p className="text-2xl font-bold text-green-600">
                  {categories.filter(c => c.isActive).length}
                </p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Con Presupuesto</p>
                <p className="text-2xl font-bold text-blue-600">
                  {categories.filter(c => c.monthlyBudget).length}
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Presupuesto Total</p>
                <p className="text-lg font-bold text-purple-600">
                  {formatBudget(categories.reduce((sum, c) => sum + (c.monthlyBudget || 0), 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar categorías..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => {
          const stats = getCategoryStats(category.id)
          const budgetStatus = getBudgetStatus(stats.totalThisMonth, category.monthlyBudget)
          
          return (
            <Card key={category.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: category.color }}
                    />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <Badge 
                    variant={category.isActive ? "secondary" : "outline"}
                    className={category.isActive ? "bg-green-100 text-green-800" : ""}
                  >
                    {category.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                {category.description && (
                  <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Presupuesto y estado */}
                  {category.monthlyBudget && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Presupuesto mensual:</span>
                        <span className="font-medium">
                          {formatBudget(category.monthlyBudget)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Gastado este mes:</span>
                        <span className="font-medium">
                          {formatBudget(stats.totalThisMonth)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(calculateBudgetUsage(stats.totalThisMonth, category.monthlyBudget), 100)}%`,
                            backgroundColor: budgetStatus.color,
                          }}
                        />
                      </div>
                      <p className="text-xs" style={{ color: budgetStatus.color }}>
                        {budgetStatus.message}
                      </p>
                    </div>
                  )}
                  
                  {/* Estadísticas básicas */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-gray-900">{stats.totalExpenses}</div>
                      <div className="text-gray-600 text-xs">Total gastos</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-bold text-gray-900">{stats.expensesThisMonth}</div>
                      <div className="text-gray-600 text-xs">Este mes</div>
                    </div>
                  </div>
                  
                  {/* Alertas de presupuesto */}
                  {category.monthlyBudget && budgetStatus.status === 'over' && (
                    <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700">Presupuesto excedido</span>
                    </div>
                  )}
                  
                  {category.monthlyBudget && budgetStatus.status === 'danger' && (
                    <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="text-sm text-orange-700">Cerca del límite</span>
                    </div>
                  )}
                  
                  {/* Botones de acción */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewCategory(category)}
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditCategory(category)}
                        title="Editar categoría"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {category.createdAt.toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No se encontraron categorías' : 'No hay categorías'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? 'Intenta con otros términos de búsqueda'
              : 'Crea tu primera categoría para organizar los gastos'
            }
          </p>
          {!searchQuery && (
            <Button 
              onClick={onCreateCategory}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primera Categoría
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

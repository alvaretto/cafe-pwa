'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  X, 
  Palette,
  DollarSign,
  AlertTriangle,
  Trash2
} from 'lucide-react'
import { ExpenseCategory } from '@/types'
import { expenseCategorySchema } from '@/lib/validations'
import { 
  canDeleteCategory, 
  generateRandomColor, 
  isCategoryNameUnique,
  CATEGORY_COLORS,
  formatBudget,
  getCategoryStats
} from '@/lib/expense-category-utils'

interface ExpenseCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category: ExpenseCategory | null
  mode: 'view' | 'edit' | 'create'
  categories: ExpenseCategory[]
  onSave: (categoryData: Partial<ExpenseCategory>) => void
  onDelete: (categoryId: string) => void
}

export function ExpenseCategoryModal({
  isOpen,
  onClose,
  category,
  mode,
  categories,
  onSave,
  onDelete,
}: ExpenseCategoryModalProps) {
  const [formData, setFormData] = useState<Partial<ExpenseCategory>>({
    name: '',
    description: '',
    monthlyBudget: undefined,
    color: generateRandomColor(),
    isActive: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoryStats, setCategoryStats] = useState<any>(null)

  useEffect(() => {
    if (category && (mode === 'view' || mode === 'edit')) {
      setFormData({
        name: category.name,
        description: category.description,
        monthlyBudget: category.monthlyBudget,
        color: category.color,
        isActive: category.isActive,
      })
      
      // Cargar estadísticas de la categoría
      const stats = getCategoryStats(category.id)
      setCategoryStats(stats)
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        monthlyBudget: undefined,
        color: generateRandomColor(),
        isActive: true,
      })
      setCategoryStats(null)
    }
    setErrors({})
    setShowDeleteConfirm(false)
  }, [category, mode, isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    try {
      expenseCategorySchema.parse(formData)
    } catch (error: any) {
      error.errors?.forEach((err: any) => {
        newErrors[err.path[0]] = err.message
      })
    }

    // Validar nombre único
    if (formData.name && !isCategoryNameUnique(formData.name, category?.id, categories)) {
      newErrors.name = 'Ya existe una categoría con este nombre'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    onSave(formData)
    onClose()
  }

  const handleDelete = () => {
    if (!category) return

    const validation = canDeleteCategory(category.id)
    if (!validation.canDelete) {
      setErrors({ general: validation.reason || 'No se puede eliminar la categoría' })
      return
    }

    onDelete(category.id)
    onClose()
  }

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Crear Nueva Categoría'
      case 'edit': return `Editar Categoría: ${category?.name}`
      case 'view': return `Categoría: ${category?.name}`
      default: return 'Categoría'
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-amber-900">
              {getModalTitle()}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {mode === 'view' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="text-amber-700 border-amber-300 hover:bg-amber-50"
                >
                  Editar
                </Button>
              )}
              {mode === 'edit' && category && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Error general */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            </div>
          )}

          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Información Básica
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Categoría *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Materia Prima"
                  disabled={isReadOnly}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Color de Identificación *</Label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                    style={{ backgroundColor: formData.color }}
                    onClick={() => !isReadOnly && handleInputChange('color', generateRandomColor())}
                  />
                  <Input
                    id="color"
                    value={formData.color || ''}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="#10B981"
                    disabled={isReadOnly}
                    className="flex-1"
                  />
                </div>
                {errors.color && <p className="text-sm text-red-600">{errors.color}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción (Opcional)</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe el tipo de gastos que incluye esta categoría..."
                rows={3}
                disabled={isReadOnly}
              />
            </div>
          </div>

          {/* Presupuesto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Presupuesto Mensual
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="monthlyBudget">Presupuesto Mensual (Opcional)</Label>
                <Input
                  id="monthlyBudget"
                  type="number"
                  value={formData.monthlyBudget || ''}
                  onChange={(e) => handleInputChange('monthlyBudget', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                  disabled={isReadOnly}
                />
                {errors.monthlyBudget && <p className="text-sm text-red-600">{errors.monthlyBudget}</p>}
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    disabled={isReadOnly}
                  />
                  <Badge
                    variant={formData.isActive ? "secondary" : "outline"}
                    className={formData.isActive ? "bg-green-100 text-green-800" : ""}
                  >
                    {formData.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas (solo en modo view/edit) */}
          {categoryStats && category && mode !== 'create' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Estadísticas</h3>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800">
                    {categoryStats.totalExpenses}
                  </div>
                  <div className="text-blue-600 text-sm">Total Gastos</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-800">
                    {categoryStats.expensesThisMonth}
                  </div>
                  <div className="text-green-600 text-sm">Este Mes</div>
                </div>
                
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-lg font-bold text-amber-800">
                    {formatBudget(categoryStats.totalThisMonth)}
                  </div>
                  <div className="text-amber-600 text-sm">Gastado Este Mes</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-800">
                    {formatBudget(categoryStats.totalAllTime)}
                  </div>
                  <div className="text-purple-600 text-sm">Total Histórico</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {category && `Creada el ${category.createdAt.toLocaleDateString('es-CO')}`}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              {mode === 'view' ? 'Cerrar' : 'Cancelar'}
            </Button>
            
            {mode !== 'view' && (
              <Button 
                onClick={handleSave}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Crear Categoría' : 'Guardar Cambios'}
              </Button>
            )}
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
              <p className="text-gray-600 mb-6">
                ¿Estás seguro de que deseas eliminar la categoría "{category?.name}"? 
                Esta acción no se puede deshacer.
              </p>
              <div className="flex items-center justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

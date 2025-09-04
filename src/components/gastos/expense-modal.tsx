'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  DollarSign, 
  Save, 
  X, 
  Edit, 
  Trash2, 
  Receipt, 
  Calendar, 
  CreditCard,
  Check,
  Clock
} from 'lucide-react'
import { Expense, ExpenseCategory } from '@/lib/mock-data'

interface ExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  expense: Expense | null
  mode: 'view' | 'edit' | 'create'
  categories: ExpenseCategory[]
  onSave: (expenseData: Partial<Expense>) => void
  onDelete: (expenseId: string) => void
  userRole: string
}

export function ExpenseModal({
  isOpen,
  onClose,
  expense,
  mode,
  categories,
  onSave,
  onDelete,
  userRole,
}: ExpenseModalProps) {
  const [formData, setFormData] = useState<Partial<Expense>>({
    categoryId: '',
    title: '',
    description: '',
    amount: 0,
    date: new Date(),
    paymentMethod: 'efectivo',
    supplier: '',
    receiptNumber: '',
    isRecurring: false,
    recurringFrequency: undefined,
    tags: [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (expense && (mode === 'view' || mode === 'edit')) {
      setFormData({
        ...expense,
        date: new Date(expense.date),
      })
    } else if (mode === 'create') {
      setFormData({
        categoryId: '',
        title: '',
        description: '',
        amount: 0,
        date: new Date(),
        paymentMethod: 'efectivo',
        supplier: '',
        receiptNumber: '',
        isRecurring: false,
        recurringFrequency: undefined,
        tags: [],
      })
    }
    setErrors({})
    setTagInput('')
  }, [expense, mode, isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title?.trim()) {
      newErrors.title = 'El título es requerido'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es requerida'
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0'
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida'
    }

    if (formData.isRecurring && !formData.recurringFrequency) {
      newErrors.recurringFrequency = 'La frecuencia es requerida para gastos recurrentes'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    // Agregar nombre de categoría
    const category = categories.find(c => c.id === formData.categoryId)
    const dataToSave = {
      ...formData,
      categoryName: category?.name || '',
    }

    onSave(dataToSave)
  }

  const handleDelete = () => {
    if (expense && confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      onDelete(expense.id)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Registrar Nuevo Gasto'
      case 'edit': return 'Editar Gasto'
      case 'view': return 'Detalles del Gasto'
      default: return 'Gasto'
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-xl">
              <DollarSign className="h-6 w-6 mr-2 text-amber-600" />
              {getModalTitle()}
              {expense && (
                <div className="ml-3">
                  {expense.isApproved ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Aprobado
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pendiente
                    </Badge>
                  )}
                </div>
              )}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {mode === 'view' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {/* Switch to edit mode */}}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
              {(mode === 'edit' || mode === 'view') && expense && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Información del Gasto
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Gasto *</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ej: Compra café verde Huila"
                  disabled={isReadOnly}
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría *</Label>
                <Select
                  value={formData.categoryId || ''}
                  onValueChange={(value) => handleInputChange('categoryId', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada del gasto..."
                rows={3}
                disabled={isReadOnly}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="amount">Monto (COP) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  disabled={isReadOnly}
                />
                {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                {formData.amount && formData.amount > 0 && (
                  <p className="text-sm text-gray-600">{formatCurrency(formData.amount)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date ? formData.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('date', new Date(e.target.value))}
                  disabled={isReadOnly}
                />
                {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select
                  value={formData.paymentMethod || 'efectivo'}
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supplier">Proveedor</Label>
                <Input
                  id="supplier"
                  value={formData.supplier || ''}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  placeholder="Nombre del proveedor"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receiptNumber">Número de Comprobante</Label>
                <Input
                  id="receiptNumber"
                  value={formData.receiptNumber || ''}
                  onChange={(e) => handleInputChange('receiptNumber', e.target.value)}
                  placeholder="Ej: FAC-2024-001"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Configuración de recurrencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Configuración de Recurrencia
            </h3>

            <div className="flex items-center space-x-2">
              <Switch
                id="isRecurring"
                checked={formData.isRecurring || false}
                onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
                disabled={isReadOnly}
              />
              <Label htmlFor="isRecurring" className="text-sm">
                Este es un gasto recurrente
              </Label>
            </div>

            {formData.isRecurring && (
              <div className="space-y-2">
                <Label htmlFor="recurringFrequency">Frecuencia</Label>
                <Select
                  value={formData.recurringFrequency || ''}
                  onValueChange={(value) => handleInputChange('recurringFrequency', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="quincenal">Quincenal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
                {errors.recurringFrequency && <p className="text-sm text-red-600">{errors.recurringFrequency}</p>}
              </div>
            )}
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Etiquetas</h3>
            
            {!isReadOnly && (
              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Agregar etiqueta"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Agregar
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{tag}</span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            {mode === 'view' ? 'Cerrar' : 'Cancelar'}
          </Button>
          
          {mode !== 'view' && (
            <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
              <Save className="h-4 w-4 mr-2" />
              {mode === 'create' ? 'Registrar Gasto' : 'Guardar Cambios'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

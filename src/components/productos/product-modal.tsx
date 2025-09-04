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
  Coffee, 
  Save, 
  X, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  BarChart3, 
  QrCode,
  Calculator
} from 'lucide-react'
import { Product, Category } from '@/lib/mock-data'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  mode: 'view' | 'edit' | 'create'
  categories: Category[]
  onSave: (productData: Partial<Product>) => void
  onDelete: (productId: string) => void
  onModeChange?: (mode: 'view' | 'edit' | 'create') => void
}

export function ProductModal({
  isOpen,
  onClose,
  product,
  mode,
  categories,
  onSave,
  onDelete,
  onModeChange,
}: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: '',
    sku: '',
    barcode: '',
    qrCode: '',
    pricePerGram: 0,
    pricePerHalfPound: 0,
    pricePerPound: 0,
    pricePerKilo: 0,
    cost: 0,
    margin: 0,
    stock: 0,
    minStock: 0,
    isActive: true,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product && (mode === 'view' || mode === 'edit')) {
      setFormData(product)
    } else if (mode === 'create') {
      setFormData({
        name: '',
        description: '',
        category: '',
        sku: '',
        barcode: '',
        qrCode: '',
        pricePerGram: 0,
        pricePerHalfPound: 0,
        pricePerPound: 0,
        pricePerKilo: 0,
        cost: 0,
        margin: 0,
        stock: 0,
        minStock: 0,
        isActive: true,
      })
    }
    setErrors({})
  }, [product, mode, isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Calcular precios automáticamente cuando cambia el precio por gramo
    if (field === 'pricePerGram' && value > 0) {
      const pricePerGram = parseFloat(value)
      setFormData(prev => ({
        ...prev,
        pricePerGram,
        pricePerHalfPound: Math.round(pricePerGram * 227), // 227g = media libra
        pricePerPound: Math.round(pricePerGram * 454), // 454g = 1 libra
        pricePerKilo: Math.round(pricePerGram * 1000), // 1000g = 1 kilo
      }))
    }

    // Calcular margen cuando cambian precio o costo
    if ((field === 'pricePerPound' || field === 'cost') && formData.pricePerPound && formData.cost) {
      const price = field === 'pricePerPound' ? parseFloat(value) : formData.pricePerPound
      const cost = field === 'cost' ? parseFloat(value) : formData.cost
      
      if (price > 0 && cost > 0) {
        const margin = ((price - cost) / price) * 100
        setFormData(prev => ({ ...prev, margin: Math.round(margin * 100) / 100 }))
      }
    }

    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida'
    }

    if (!formData.sku?.trim()) {
      newErrors.sku = 'El SKU es requerido'
    }

    if (!formData.pricePerGram || formData.pricePerGram <= 0) {
      newErrors.pricePerGram = 'El precio por gramo debe ser mayor a 0'
    }

    if (!formData.cost || formData.cost <= 0) {
      newErrors.cost = 'El costo debe ser mayor a 0'
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo'
    }

    if (!formData.minStock || formData.minStock < 0) {
      newErrors.minStock = 'El stock mínimo no puede ser negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    onSave(formData)
  }

  const handleDelete = () => {
    if (product && confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      onDelete(product.id)
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
      case 'create': return 'Crear Nuevo Producto'
      case 'edit': return 'Editar Producto'
      case 'view': return 'Detalles del Producto'
      default: return 'Producto'
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-xl">
              <Coffee className="h-6 w-6 mr-2 text-amber-600" />
              {getModalTitle()}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              {mode === 'view' && onModeChange && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onModeChange('edit')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              )}
              {(mode === 'edit' || mode === 'view') && product && (
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
              <Package className="h-5 w-5 mr-2" />
              Información Básica
            </h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Café Arábica Premium"
                  disabled={isReadOnly}
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select
                  value={formData.category || ''}
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isReadOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada del producto..."
                rows={3}
                disabled={isReadOnly}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku || ''}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Ej: ARA001"
                  disabled={isReadOnly}
                />
                {errors.sku && <p className="text-sm text-red-600">{errors.sku}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Código de Barras</Label>
                <Input
                  id="barcode"
                  value={formData.barcode || ''}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  placeholder="Ej: 7701234567890"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qrCode">Código QR</Label>
                <Input
                  id="qrCode"
                  value={formData.qrCode || ''}
                  onChange={(e) => handleInputChange('qrCode', e.target.value)}
                  placeholder="Ej: QR-ARA001"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Precios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Precios y Costos
            </h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerGram">Precio por Gramo * (COP)</Label>
                <Input
                  id="pricePerGram"
                  type="number"
                  value={formData.pricePerGram || ''}
                  onChange={(e) => handleInputChange('pricePerGram', e.target.value)}
                  placeholder="55"
                  disabled={isReadOnly}
                />
                {errors.pricePerGram && <p className="text-sm text-red-600">{errors.pricePerGram}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerHalfPound">Media Libra (227g)</Label>
                <Input
                  id="pricePerHalfPound"
                  type="number"
                  value={formData.pricePerHalfPound || ''}
                  onChange={(e) => handleInputChange('pricePerHalfPound', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerPound">Libra (454g)</Label>
                <Input
                  id="pricePerPound"
                  type="number"
                  value={formData.pricePerPound || ''}
                  onChange={(e) => handleInputChange('pricePerPound', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerKilo">Kilo (1000g)</Label>
                <Input
                  id="pricePerKilo"
                  type="number"
                  value={formData.pricePerKilo || ''}
                  onChange={(e) => handleInputChange('pricePerKilo', e.target.value)}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cost">Costo por Libra * (COP)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={formData.cost || ''}
                  onChange={(e) => handleInputChange('cost', e.target.value)}
                  placeholder="15000"
                  disabled={isReadOnly}
                />
                {errors.cost && <p className="text-sm text-red-600">{errors.cost}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="margin">Margen (%)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="margin"
                    type="number"
                    value={formData.margin || ''}
                    disabled
                    className="bg-gray-50"
                  />
                  <Badge variant="secondary" className="text-green-600">
                    Auto-calculado
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Inventario */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Control de Inventario
            </h3>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Actual (gramos) *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock || ''}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="2500"
                  disabled={isReadOnly}
                />
                {errors.stock && <p className="text-sm text-red-600">{errors.stock}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo (gramos) *</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock || ''}
                  onChange={(e) => handleInputChange('minStock', e.target.value)}
                  placeholder="500"
                  disabled={isReadOnly}
                />
                {errors.minStock && <p className="text-sm text-red-600">{errors.minStock}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="isActive">Estado</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive || false}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                    disabled={isReadOnly}
                  />
                  <Label htmlFor="isActive" className="text-sm">
                    {formData.isActive ? 'Activo' : 'Inactivo'}
                  </Label>
                </div>
              </div>
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
              {mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

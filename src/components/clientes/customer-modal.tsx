'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  User,
  Save,
  X,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  ShoppingBag,
  DollarSign,
  Calendar,
  TrendingUp,
  Home,
  Building
} from 'lucide-react'
import { Customer, getCustomerPurchaseHistory } from '@/lib/mock-data'
import { validateCustomer, formatCelular, formatFullName } from '@/lib/customer-utils'

interface CustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  mode: 'view' | 'edit' | 'create'
  onSave: (customerData: Partial<Customer>) => void
  onDelete: (customerId: string) => void
  onModeChange?: (mode: 'view' | 'edit' | 'create') => void
}

export function CustomerModal({
  isOpen,
  onClose,
  customer,
  mode,
  onSave,
  onDelete,
  onModeChange,
}: CustomerModalProps) {
  const [formData, setFormData] = useState<Partial<Customer>>({
    nombres: '',
    apellidos: '',
    celular: '',
    direccionCasa: '',
    email: '',
    direccionTrabajo: '',
    birthMonth: undefined,
    birthDay: undefined,
    coffeePreferences: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([])

  useEffect(() => {
    if (customer && (mode === 'view' || mode === 'edit')) {
      setFormData({
        nombres: customer.nombres,
        apellidos: customer.apellidos,
        celular: customer.celular,
        direccionCasa: customer.direccionCasa,
        email: customer.email,
        direccionTrabajo: customer.direccionTrabajo,
        birthMonth: customer.birthMonth,
        birthDay: customer.birthDay,
        coffeePreferences: customer.coffeePreferences,
        notes: customer.notes,
      })
      // Cargar historial de compras
      const history = getCustomerPurchaseHistory(customer.id)
      setPurchaseHistory(history)
    } else if (mode === 'create') {
      setFormData({
        nombres: '',
        apellidos: '',
        celular: '',
        direccionCasa: '',
        email: '',
        direccionTrabajo: '',
        birthMonth: undefined,
        birthDay: undefined,
        coffeePreferences: '',
        notes: '',
      })
      setPurchaseHistory([])
    }
    setErrors({})
  }, [customer, mode, isOpen])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error del campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const validation = validateCustomer({
      nombres: formData.nombres || '',
      apellidos: formData.apellidos || '',
      celular: formData.celular || '',
      direccionCasa: formData.direccionCasa || '',
      email: formData.email || '',
      direccionTrabajo: formData.direccionTrabajo,
      birthMonth: formData.birthMonth,
      birthDay: formData.birthDay,
    })

    setErrors(validation.errors)
    return validation.isValid
  }

  const handleSave = () => {
    if (!validateForm()) return

    onSave(formData)
  }

  const handleDelete = () => {
    if (customer && confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      onDelete(customer.id)
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Registrar Nuevo Cliente'
      case 'edit': return `Editar Cliente: ${customer ? formatFullName(customer.nombres, customer.apellidos) : ''}`
      case 'view': return `Cliente: ${customer ? formatFullName(customer.nombres, customer.apellidos) : ''}`
      default: return 'Cliente'
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-xl">
              <User className="h-6 w-6 mr-2 text-amber-600" />
              {getModalTitle()}
              {customer?.isVip && (
                <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  VIP
                </Badge>
              )}
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
              {(mode === 'edit' || mode === 'view') && customer && (
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
              <User className="h-5 w-5 mr-2" />
              Información Personal
            </h3>
            
            {/* Campos requeridos */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  value={formData.nombres || ''}
                  onChange={(e) => handleInputChange('nombres', e.target.value)}
                  placeholder="Ej: María Elena"
                  disabled={isReadOnly}
                />
                {errors.nombres && <p className="text-sm text-red-600">{errors.nombres}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  value={formData.apellidos || ''}
                  onChange={(e) => handleInputChange('apellidos', e.target.value)}
                  placeholder="Ej: González Vargas"
                  disabled={isReadOnly}
                />
                {errors.apellidos && <p className="text-sm text-red-600">{errors.apellidos}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="celular">Número Celular *</Label>
                <Input
                  id="celular"
                  value={formData.celular || ''}
                  onChange={(e) => handleInputChange('celular', e.target.value)}
                  placeholder="+57 300 123 4567"
                  disabled={isReadOnly}
                />
                {errors.celular && <p className="text-sm text-red-600">{errors.celular}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="maria@email.com"
                  disabled={isReadOnly}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccionCasa">Dirección Casa *</Label>
              <Input
                id="direccionCasa"
                value={formData.direccionCasa || ''}
                onChange={(e) => handleInputChange('direccionCasa', e.target.value)}
                placeholder="Calle 123 #45-67, Bogotá"
                disabled={isReadOnly}
              />
              {errors.direccionCasa && <p className="text-sm text-red-600">{errors.direccionCasa}</p>}
            </div>

            {/* Campos opcionales */}
            <div className="space-y-2">
              <Label htmlFor="direccionTrabajo">Dirección Trabajo (Opcional)</Label>
              <Input
                id="direccionTrabajo"
                value={formData.direccionTrabajo || ''}
                onChange={(e) => handleInputChange('direccionTrabajo', e.target.value)}
                placeholder="Carrera 7 #32-16, Centro"
                disabled={isReadOnly}
              />
              {errors.direccionTrabajo && <p className="text-sm text-red-600">{errors.direccionTrabajo}</p>}
            </div>

            {/* Cumpleaños */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Cumpleaños (Opcional)
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="birthMonth">Mes</Label>
                  <Select
                    value={formData.birthMonth?.toString() || ''}
                    onValueChange={(value) => handleInputChange('birthMonth', value ? parseInt(value) : undefined)}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar mes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Enero</SelectItem>
                      <SelectItem value="2">Febrero</SelectItem>
                      <SelectItem value="3">Marzo</SelectItem>
                      <SelectItem value="4">Abril</SelectItem>
                      <SelectItem value="5">Mayo</SelectItem>
                      <SelectItem value="6">Junio</SelectItem>
                      <SelectItem value="7">Julio</SelectItem>
                      <SelectItem value="8">Agosto</SelectItem>
                      <SelectItem value="9">Septiembre</SelectItem>
                      <SelectItem value="10">Octubre</SelectItem>
                      <SelectItem value="11">Noviembre</SelectItem>
                      <SelectItem value="12">Diciembre</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.birthMonth && <p className="text-sm text-red-600">{errors.birthMonth}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDay">Día</Label>
                  <Select
                    value={formData.birthDay?.toString() || ''}
                    onValueChange={(value) => handleInputChange('birthDay', value ? parseInt(value) : undefined)}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.birthDay && <p className="text-sm text-red-600">{errors.birthDay}</p>}
                </div>
              </div>
            </div>

            {/* Preferencias y notas */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coffeePreferences">Preferencias de Café</Label>
                <Input
                  id="coffeePreferences"
                  value={formData.coffeePreferences || ''}
                  onChange={(e) => handleInputChange('coffeePreferences', e.target.value)}
                  placeholder="Ej: Café arábica, tostado medio"
                  disabled={isReadOnly}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Notas sobre el cliente..."
                  rows={3}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Estadísticas del cliente (solo en modo view/edit) */}
          {customer && mode !== 'create' && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Estadísticas del Cliente
                </h3>
                
                <div className="grid gap-4 md:grid-cols-4">
                  <Card className="border border-green-200 bg-green-50">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-800">
                        {formatCurrency(customer.totalSpent)}
                      </div>
                      <div className="text-sm text-green-600">Total Gastado</div>
                    </CardContent>
                  </Card>

                  <Card className="border border-blue-200 bg-blue-50">
                    <CardContent className="p-4 text-center">
                      <ShoppingBag className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-800">
                        {customer.totalPurchases}
                      </div>
                      <div className="text-sm text-blue-600">Compras Realizadas</div>
                    </CardContent>
                  </Card>

                  <Card className="border border-purple-200 bg-purple-50">
                    <CardContent className="p-4 text-center">
                      <Award className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-800">
                        {customer.loyaltyPoints}
                      </div>
                      <div className="text-sm text-purple-600">Puntos Fidelidad</div>
                    </CardContent>
                  </Card>

                  <Card className="border border-orange-200 bg-orange-50">
                    <CardContent className="p-4 text-center">
                      <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-sm font-bold text-orange-800">
                        {customer.lastPurchase ? formatDate(customer.lastPurchase).split(',')[0] : 'N/A'}
                      </div>
                      <div className="text-sm text-orange-600">Última Compra</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {/* Historial de compras (solo en modo view) */}
          {mode === 'view' && purchaseHistory.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Historial de Compras
                  <Badge variant="secondary" className="ml-2">
                    {purchaseHistory.length}
                  </Badge>
                </h3>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {purchaseHistory.map((sale) => (
                    <Card key={sale.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900">
                            {sale.saleNumber}
                          </div>
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(sale.total)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {formatDate(sale.createdAt)}
                        </div>
                        <div className="text-sm text-gray-700">
                          {sale.items.length} producto(s) • {sale.paymentMethod}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
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
              {mode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

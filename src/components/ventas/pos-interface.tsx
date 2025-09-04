'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  CreditCard, 
  Receipt, 
  Star,
  X,
  Check
} from 'lucide-react'
import { Product, SaleItem, Customer } from '@/lib/mock-data'
import { ProductSelector } from './sales-components'

interface POSInterfaceProps {
  products: Product[]
  customers: Customer[]
  cart: SaleItem[]
  selectedCustomer: Customer | null
  onSelectCustomer: (customer: Customer | null) => void
  onAddToCart: (product: Product, quantity: number, unitType: 'gramos' | 'media_libra' | 'libra' | 'kilo') => void
  onUpdateCartItem: (itemId: string, quantity: number) => void
  onRemoveFromCart: (itemId: string) => void
  onClearCart: () => void
  onCompleteSale: (paymentMethod: string, notes?: string, agreedPaymentDate?: Date) => Promise<boolean>
  calculateTotals: () => { subtotal: number; tax: number; discount: number; total: number }
  isLoading: boolean
}

export function POSInterface({
  products,
  customers,
  cart,
  selectedCustomer,
  onSelectCustomer,
  onAddToCart,
  onUpdateCartItem,
  onRemoveFromCart,
  onClearCart,
  onCompleteSale,
  calculateTotals,
  isLoading,
}: POSInterfaceProps) {
  const [paymentMethod, setPaymentMethod] = useState('efectivo')
  const [notes, setNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCustomerSelector, setShowCustomerSelector] = useState(false)
  const [agreedPaymentDate, setAgreedPaymentDate] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getUnitTypeLabel = (unitType: string) => {
    switch (unitType) {
      case 'gramos': return 'g'
      case 'media_libra': return 'media libra'
      case 'libra': return 'libra'
      case 'kilo': return 'kilo'
      default: return unitType
    }
  }

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('El carrito está vacío')
      return
    }

    // Validar fecha acordada para pagos a crédito
    if (paymentMethod === 'credito') {
      if (!agreedPaymentDate) {
        alert('Para pagos a crédito, debe especificar una fecha acordada de pago')
        return
      }

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const agreedDate = new Date(agreedPaymentDate)
      agreedDate.setHours(0, 0, 0, 0)

      if (agreedDate <= today) {
        alert('La fecha acordada debe ser posterior a hoy')
        return
      }
    }

    setIsProcessing(true)
    try {
      // Pasar la fecha acordada como parte de los datos de la venta
      const saleData = {
        paymentMethod,
        notes,
        agreedPaymentDate: paymentMethod === 'credito' ? new Date(agreedPaymentDate) : undefined
      }

      const success = await onCompleteSale(saleData.paymentMethod, saleData.notes, saleData.agreedPaymentDate)
      if (success) {
        setNotes('')
        setPaymentMethod('efectivo')
        setAgreedPaymentDate('')
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const totals = calculateTotals()

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Columna izquierda - Productos (2/3) */}
      <div className="lg:col-span-2">
        <ProductSelector
          products={products}
          onAddToCart={onAddToCart as any}
          isLoading={isLoading}
        />
      </div>

      {/* Columna derecha - Carrito y Checkout (1/3) */}
      <div className="space-y-6">
        {/* Selección de cliente */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedCustomer ? (
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-amber-900">
                      {selectedCustomer.nombres} {selectedCustomer.apellidos}
                    </span>
                    {selectedCustomer.isVip && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        VIP
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-amber-700">
                    {selectedCustomer.celular} • {selectedCustomer.loyaltyPoints} puntos
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectCustomer(null)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCustomerSelector(!showCustomerSelector)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Seleccionar Cliente
                </Button>
                
                {showCustomerSelector && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {customers.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <p className="text-sm">No hay clientes disponibles</p>
                        <p className="text-xs">Agrega clientes desde la sección Clientes</p>
                      </div>
                    ) : (
                      customers.map((customer) => (
                      <div
                        key={customer.id}
                        className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          onSelectCustomer(customer)
                          setShowCustomerSelector(false)
                        }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {customer.nombres} {customer.apellidos}
                            </span>
                            {customer.isVip && (
                              <Star className="h-3 w-3 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">{customer.celular}</div>
                        </div>
                      </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Carrito de compras */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Carrito
                <Badge variant="secondary" className="ml-2">
                  {cart.length}
                </Badge>
              </CardTitle>
              {cart.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>El carrito está vacío</p>
                <p className="text-sm">Selecciona productos para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.productName}</h4>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(item.unitPrice)} por {getUnitTypeLabel(item.unitType)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateCartItem(item.id, item.quantity - 1)}
                        className="h-6 w-6 p-0"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="text-sm font-medium w-8 text-center">
                        {item.unitType === 'gramos' ? item.quantity : 1}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateCartItem(item.id, item.quantity + 1)}
                        className="h-6 w-6 p-0"
                        disabled={item.unitType !== 'gramos'}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(item.totalPrice)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFromCart(item.id)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumen y checkout */}
        {cart.length > 0 && (
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Receipt className="h-5 w-5 mr-2" />
                Resumen de Venta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Totales */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento VIP (5%):</span>
                    <span>-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>

              {/* Método de pago */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select value={paymentMethod} onValueChange={(value) => {
                  setPaymentMethod(value)
                  // Limpiar fecha acordada si no es crédito
                  if (value !== 'credito') {
                    setAgreedPaymentDate('')
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="digital">Pago Digital</SelectItem>
                    <SelectItem value="credito">Pago a Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campo de fecha acordada - Solo para pagos a crédito */}
              {paymentMethod === 'credito' && (
                <div className="space-y-2">
                  <Label htmlFor="agreedPaymentDate">Fecha Acordada de Pago *</Label>
                  <input
                    type="date"
                    id="agreedPaymentDate"
                    value={agreedPaymentDate}
                    onChange={(e) => setAgreedPaymentDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Mínimo mañana
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    La fecha acordada debe ser posterior a hoy
                  </p>
                </div>
              )}

              {/* Notas */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notas adicionales sobre la venta..."
                  rows={2}
                />
              </div>

              {/* Botón de completar venta */}
              <Button
                onClick={handleCompleteSale}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Completar Venta - {formatCurrency(totals.total)}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

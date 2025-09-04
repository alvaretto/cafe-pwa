'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  Receipt,
  User,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react'
import { Sale } from '@/lib/mock-data'

interface DeleteSaleModalProps {
  isOpen: boolean
  onClose: () => void
  sale: Sale
  onConfirm: (saleId: string) => void
}

export function DeleteSaleModal({ isOpen, onClose, sale, onConfirm }: DeleteSaleModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = async () => {
    setIsDeleting(true)
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      onConfirm(sale.id)
    } catch (error) {
      console.error('Error deleting sale:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getPaymentStatusBadge = (status: Sale['paymentStatus']) => {
    const statusConfig = {
      pendiente: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
      completado: { label: 'Completado', className: 'bg-green-100 text-green-800' },
      cancelado: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
      devuelto: { label: 'Devuelto', className: 'bg-gray-100 text-gray-800' },
    }
    
    const config = statusConfig[status]
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getPaymentMethodLabel = (method: Sale['paymentMethod']) => {
    const labels = {
      efectivo: 'Efectivo',
      tarjeta_credito: 'Tarjeta de Crédito',
      tarjeta_debito: 'Tarjeta de Débito',
      transferencia: 'Transferencia',
      digital: 'Pago Digital',
      credito: 'Crédito',
    }
    return labels[method] || method
  }

  const getUnitTypeLabel = (unitType: string) => {
    const labels = {
      gramos: 'g',
      media_libra: '1/2 lb',
      libra: 'lb',
      kilo: 'kg'
    }
    return labels[unitType as keyof typeof labels] || unitType
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Confirmar Eliminación de Venta</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Advertencia */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800">¿Estás seguro de que deseas eliminar esta venta?</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Esta acción no se puede deshacer. La venta será eliminada permanentemente del historial 
                    y las estadísticas se actualizarán automáticamente.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de la venta */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Encabezado de la venta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-lg">{sale.saleNumber}</span>
                  </div>
                  {getPaymentStatusBadge(sale.paymentStatus)}
                </div>

                <Separator />

                {/* Detalles básicos */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Cliente</div>
                      <div className="font-medium">{sale.customerName || 'Cliente General'}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Fecha</div>
                      <div className="font-medium">{formatDate(sale.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Productos */}
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Package className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Productos ({sale.items.length})</span>
                  </div>
                  <div className="space-y-2">
                    {sale.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-sm">{item.productName}</div>
                          <div className="text-xs text-gray-500">
                            {item.quantity} {getUnitTypeLabel(item.unitType)} × {formatCurrency(item.unitPrice)}
                          </div>
                        </div>
                        <div className="font-medium">{formatCurrency(item.totalPrice)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Totales */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(sale.subtotal)}</span>
                  </div>
                  {sale.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span>-{formatCurrency(sale.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(sale.total)}</span>
                  </div>
                </div>

                {/* Información de pago */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Método de pago:</span>
                    <span className="font-medium">{getPaymentMethodLabel(sale.paymentMethod)}</span>
                  </div>
                </div>

                {/* Notas si existen */}
                {sale.notes && (
                  <div className="pt-2">
                    <div className="text-sm text-gray-500 mb-1">Notas:</div>
                    <div className="text-sm bg-gray-50 p-2 rounded">{sale.notes}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Eliminando...' : 'Eliminar Venta'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

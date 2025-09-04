'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Receipt, 
  User, 
  Calendar, 
  CreditCard, 
  Package, 
  DollarSign,
  FileText,
  Printer,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react'
import { Sale, getCustomerById } from '@/lib/mock-data'

interface SaleDetailModalProps {
  isOpen: boolean
  onClose: () => void
  sale: Sale
}

export function SaleDetailModal({ isOpen, onClose, sale }: SaleDetailModalProps) {
  const [isMarkingAsPaid, setIsMarkingAsPaid] = useState(false)

  const customer = sale.customerId ? getCustomerById(sale.customerId) : null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta_credito: 'Tarjeta de Crédito',
      tarjeta_debito: 'Tarjeta Débito',
      transferencia: 'Transferencia Bancaria',
      digital: 'Pago Digital',
      credito: 'Pago a Crédito'
    }
    return labels[method] || method
  }

  const getPaymentStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: any, label: string }> = {
      completado: { variant: 'default', icon: CheckCircle, label: 'Completado' },
      pendiente: { variant: 'secondary', icon: Clock, label: 'Pendiente' },
      cancelado: { variant: 'destructive', icon: X, label: 'Cancelado' },
      devuelto: { variant: 'outline', icon: AlertCircle, label: 'Devuelto' }
    }
    
    const { variant, icon: Icon, label } = config[status] || config.pendiente

    return (
      <Badge variant={variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </Badge>
    )
  }

  const getUnitTypeLabel = (unitType: string) => {
    const labels: Record<string, string> = {
      gramos: 'g',
      media_libra: 'media libra',
      libra: 'libra',
      kilo: 'kg'
    }
    return labels[unitType] || unitType
  }

  const handleMarkAsPaid = async () => {
    if (sale.paymentStatus !== 'pendiente') return

    setIsMarkingAsPaid(true)
    try {
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aquí se actualizaría el estado en la base de datos
      console.log(`Marcando venta ${sale.saleNumber} como pagada`)
      
      alert(`Venta ${sale.saleNumber} marcada como pagada exitosamente`)
      onClose()
    } catch (error) {
      console.error('Error marking sale as paid:', error)
      alert('Error al marcar la venta como pagada')
    } finally {
      setIsMarkingAsPaid(false)
    }
  }

  const handlePrintReceipt = () => {
    const printContent = generateReceiptHTML()
    const printWindow = window.open('', '_blank')

    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  const generateReceiptHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprobante de Venta - ${sale.saleNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .receipt-title { font-size: 18px; margin: 10px 0; }
            .info-section { margin: 15px 0; }
            .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .totals { margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
            .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #000; padding-top: 10px; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Tinto del Mirador</div>
            <div class="receipt-title">Comprobante de Venta</div>
            <div>${sale.saleNumber}</div>
          </div>

          <div class="info-section">
            <div class="info-row">
              <span><strong>Fecha:</strong></span>
              <span>${formatDate(sale.createdAt)}</span>
            </div>
            <div class="info-row">
              <span><strong>Cliente:</strong></span>
              <span>${sale.customerName || 'Cliente General'}</span>
            </div>
            <div class="info-row">
              <span><strong>Vendedor:</strong></span>
              <span>${sale.sellerName}</span>
            </div>
            <div class="info-row">
              <span><strong>Método de Pago:</strong></span>
              <span>${getPaymentMethodLabel(sale.paymentMethod)}</span>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${sale.items.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity} ${getUnitTypeLabel(item.unitType)}</td>
                  <td>${formatCurrency(item.unitPrice)}</td>
                  <td>${formatCurrency(item.totalPrice)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(sale.subtotal)}</span>
            </div>
            ${sale.discount > 0 ? `
              <div class="total-row">
                <span>Descuento:</span>
                <span>-${formatCurrency(sale.discount)}</span>
              </div>
            ` : ''}
            ${sale.tax > 0 ? `
              <div class="total-row">
                <span>Impuestos:</span>
                <span>${formatCurrency(sale.tax)}</span>
              </div>
            ` : ''}
            <div class="total-row total-final">
              <span>TOTAL:</span>
              <span>${formatCurrency(sale.total)}</span>
            </div>
          </div>

          ${sale.paymentMethod === 'credito' && sale.agreedPaymentDate ? `
            <div class="info-section" style="background-color: #fff3cd; padding: 10px; border: 1px solid #ffeaa7; border-radius: 5px;">
              <strong>PAGO A CRÉDITO</strong><br>
              Fecha acordada de pago: ${new Date(sale.agreedPaymentDate).toLocaleDateString('es-CO')}
            </div>
          ` : ''}

          ${sale.notes ? `
            <div class="info-section">
              <strong>Notas:</strong><br>
              ${sale.notes}
            </div>
          ` : ''}

          <div class="footer">
            <p>¡Gracias por su compra!</p>
            <p>Tinto del Mirador - Café de calidad premium</p>
          </div>
        </body>
      </html>
    `
  }

  const isOverdue = sale.paymentMethod === 'credito' && 
                   sale.paymentStatus === 'pendiente' && 
                   sale.agreedPaymentDate && 
                   new Date(sale.agreedPaymentDate) < new Date()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Detalles de Venta - {sale.saleNumber}</span>
            {getPaymentStatusBadge(sale.paymentStatus)}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información de la venta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Información de la Venta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Número de Venta</label>
                  <div className="font-semibold text-gray-900">{sale.saleNumber}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha y Hora</label>
                  <div className="text-gray-900">{formatDate(sale.createdAt)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Vendedor</label>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{sale.sellerName}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Método de Pago</label>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{getPaymentMethodLabel(sale.paymentMethod)}</span>
                  </div>
                </div>
              </div>

              {sale.paymentMethod === 'credito' && sale.agreedPaymentDate && (
                <div className={`p-3 rounded-lg ${isOverdue ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'}`}>
                  <div className="flex items-center space-x-2">
                    <Calendar className={`h-4 w-4 ${isOverdue ? 'text-red-600' : 'text-orange-600'}`} />
                    <span className="text-sm font-medium text-gray-700">
                      Fecha Acordada de Pago:
                    </span>
                  </div>
                  <div className={`font-semibold ${isOverdue ? 'text-red-700' : 'text-orange-700'}`}>
                    {new Date(sale.agreedPaymentDate).toLocaleDateString('es-CO')}
                    {isOverdue && <span className="ml-2 text-red-600">(VENCIDA)</span>}
                  </div>
                </div>
              )}

              {sale.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notas</label>
                  <div className="text-gray-900 bg-gray-50 p-2 rounded text-sm">
                    {sale.notes}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre Completo</label>
                    <div className="font-semibold text-gray-900">
                      {customer.nombres} {customer.apellidos}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Teléfono</label>
                      <div className="text-gray-900">{customer.celular}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Email</label>
                      <div className="text-gray-900">{customer.email || 'No registrado'}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Dirección</label>
                    <div className="text-gray-900">{customer.direccionCasa}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Segmento</label>
                      <Badge variant="outline">{customer.segment}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Puntos de Lealtad</label>
                      <div className="text-gray-900">{customer.loyaltyPoints} puntos</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <div className="font-medium">Cliente General</div>
                  <div className="text-sm">Venta sin cliente registrado</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Productos vendidos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Productos Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 font-medium text-gray-700">Producto</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700">Cantidad</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700">Precio Unit.</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-3">
                        <div className="font-medium text-gray-900">{item.productName}</div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="text-gray-900">
                          {item.quantity} {getUnitTypeLabel(item.unitType)}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="text-gray-900">{formatCurrency(item.unitPrice)}</div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de totales */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Resumen de Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium text-gray-900">{formatCurrency(sale.subtotal)}</span>
              </div>

              {sale.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Descuento:</span>
                  <span className="font-medium text-green-600">-{formatCurrency(sale.discount)}</span>
                </div>
              )}

              {sale.tax > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Impuestos:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(sale.tax)}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-gray-900">{formatCurrency(sale.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handlePrintReceipt}
            variant="outline"
            className="flex-1"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Comprobante
          </Button>

          {sale.paymentStatus === 'pendiente' && (
            <Button
              onClick={handleMarkAsPaid}
              disabled={isMarkingAsPaid}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {isMarkingAsPaid ? 'Procesando...' : 'Marcar como Pagado'}
            </Button>
          )}

          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

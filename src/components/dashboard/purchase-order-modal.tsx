'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ShoppingCart, Package, AlertTriangle, Calculator, FileText } from 'lucide-react'
import { MOCK_SUPPLIERS, Supplier } from '@/lib/mock-data'

interface InventoryAlert {
  id: string
  productName: string
  currentStock: number
  minimumStock: number
  status: 'critical' | 'out_of_stock' | 'low'
  category: string
  lastRestock: Date
}

interface PurchaseOrderItem {
  productId: string
  productName: string
  currentStock: number
  minimumStock: number
  suggestedQuantity: number
  selectedQuantity: number
  supplierId: string
  unitCost: number
  totalCost: number
  priority: 'high' | 'medium' | 'low'
}

interface PurchaseOrderModalProps {
  isOpen: boolean
  onClose: () => void
  alerts: InventoryAlert[]
  onGenerateOrder: (orderData: {
    items: PurchaseOrderItem[]
    totalAmount: number
    notes: string
    expectedDelivery: string
  }) => void
}

export function PurchaseOrderModal({ 
  isOpen, 
  onClose, 
  alerts, 
  onGenerateOrder 
}: PurchaseOrderModalProps) {
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([])
  const [notes, setNotes] = useState('')
  const [expectedDelivery, setExpectedDelivery] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Inicializar items cuando se abra el modal
  useEffect(() => {
    if (isOpen && alerts.length > 0) {
      const items: PurchaseOrderItem[] = alerts.map(alert => {
        const suggestedQuantity = calculateSuggestedQuantity(alert)
        const defaultSupplier = getDefaultSupplier(alert.category)
        const unitCost = getEstimatedUnitCost(alert.productName)

        return {
          productId: alert.id,
          productName: alert.productName,
          currentStock: alert.currentStock,
          minimumStock: alert.minimumStock,
          suggestedQuantity,
          selectedQuantity: suggestedQuantity,
          supplierId: defaultSupplier.id,
          unitCost,
          totalCost: suggestedQuantity * unitCost,
          priority: getPriority(alert.status)
        }
      })
      setOrderItems(items)
    }
  }, [isOpen, alerts])

  const calculateSuggestedQuantity = (alert: InventoryAlert): number => {
    // Calcular cantidad sugerida basada en stock mínimo + buffer de seguridad
    const deficit = alert.minimumStock - alert.currentStock
    const safetyBuffer = alert.minimumStock * 0.5 // 50% adicional como buffer
    return Math.max(deficit + safetyBuffer, alert.minimumStock)
  }

  const getDefaultSupplier = (category: string): Supplier => {
    // Asignar proveedor por defecto según categoría
    const categorySupplierMap: { [key: string]: string } = {
      'Café Arábica': '1', // Café del Valle S.A.S.
      'Café Robusta': '2', // Tostadores Unidos
      'Mezclas Especiales': '1',
      'Accesorios': '3' // Suministros Café Express
    }
    
    const supplierId = categorySupplierMap[category] || '1'
    return MOCK_SUPPLIERS.find(s => s.id === supplierId) || MOCK_SUPPLIERS[0]!
  }

  const getEstimatedUnitCost = (productName: string): number => {
    // Costos estimados por gramo según tipo de producto
    const costMap: { [key: string]: number } = {
      'Café Arábica Premium': 15, // $15 por gramo
      'Mezcla del Mirador': 12,
      'Café Robusta Intenso': 10,
    }
    
    return costMap[productName] || 12
  }

  const getPriority = (status: string): 'high' | 'medium' | 'low' => {
    const priorityMap = {
      'out_of_stock': 'high' as const,
      'critical': 'high' as const,
      'low': 'medium' as const
    }
    return priorityMap[status as keyof typeof priorityMap] || 'low'
  }

  const updateOrderItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const updatedItems = [...orderItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value } as PurchaseOrderItem
    
    // Recalcular costo total si cambia cantidad o costo unitario
    if (field === 'selectedQuantity' || field === 'unitCost') {
      updatedItems[index].totalCost = updatedItems[index].selectedQuantity * updatedItems[index].unitCost
    }
    
    setOrderItems(updatedItems)
  }

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const getTotalAmount = () => {
    return orderItems.reduce((total, item) => total + item.totalCost, 0)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)} kg`
    }
    return `${grams} g`
  }

  const handleGenerateOrder = async () => {
    if (orderItems.length === 0) {
      alert('Debe agregar al menos un producto a la orden')
      return
    }

    if (!expectedDelivery) {
      alert('Debe especificar la fecha esperada de entrega')
      return
    }

    setIsGenerating(true)

    try {
      await onGenerateOrder({
        items: orderItems,
        totalAmount: getTotalAmount(),
        notes,
        expectedDelivery
      })
      
      // Limpiar y cerrar modal
      setOrderItems([])
      setNotes('')
      setExpectedDelivery('')
      onClose()
    } catch (error) {
      console.error('Error al generar orden:', error)
      alert('Error al generar la orden de compra')
    } finally {
      setIsGenerating(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: { label: 'Alta', variant: 'destructive' as const },
      medium: { label: 'Media', variant: 'warning' as const },
      low: { label: 'Baja', variant: 'outline' as const }
    }
    return badges[priority as keyof typeof badges] || badges.low
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <ShoppingCart className="h-6 w-6 mr-2 text-amber-600" />
            Generar Orden de Compra Automática
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Orden basada en {alerts.length} alertas de inventario críticas
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen de la orden */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-amber-600">{orderItems.length}</div>
                  <div className="text-sm text-muted-foreground">Productos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(getTotalAmount())}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Estimado</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {orderItems.filter(item => item.priority === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Prioridad Alta</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de productos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Productos a Ordenar</h3>
              <Badge variant="outline">{orderItems.length} items</Badge>
            </div>

            {orderItems.map((item, index) => (
              <Card key={item.productId} className="border-l-4 border-l-amber-500">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Información del producto */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Stock: {formatWeight(item.currentStock)} / Mínimo: {formatWeight(item.minimumStock)}
                          </p>
                        </div>
                        <Badge variant={getPriorityBadge(item.priority).variant}>
                          {getPriorityBadge(item.priority).label}
                        </Badge>
                      </div>
                      
                      {/* Proveedor */}
                      <div className="space-y-2">
                        <Label className="text-xs">Proveedor</Label>
                        <Select
                          value={item.supplierId}
                          onValueChange={(value) => updateOrderItem(index, 'supplierId', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MOCK_SUPPLIERS.map(supplier => (
                              <SelectItem key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Cantidad y costos */}
                    <div className="space-y-2">
                      <Label className="text-xs">Cantidad (gramos)</Label>
                      <Input
                        type="number"
                        value={item.selectedQuantity}
                        onChange={(e) => updateOrderItem(index, 'selectedQuantity', parseInt(e.target.value) || 0)}
                        className="h-8"
                      />
                      <p className="text-xs text-muted-foreground">
                        Sugerido: {formatWeight(item.suggestedQuantity)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Costo Unitario</Label>
                      <Input
                        type="number"
                        value={item.unitCost}
                        onChange={(e) => updateOrderItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                        className="h-8"
                      />
                      <p className="text-xs font-medium text-green-600">
                        Total: {formatCurrency(item.totalCost)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOrderItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          {/* Configuración adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha Esperada de Entrega</Label>
              <Input
                type="date"
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Notas Adicionales</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instrucciones especiales, condiciones de entrega, etc."
                className="h-20"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Total de la orden: <span className="font-semibold text-green-600">{formatCurrency(getTotalAmount())}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleGenerateOrder}
              disabled={isGenerating || orderItems.length === 0}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isGenerating ? (
                <>
                  <Calculator className="h-4 w-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generar Orden
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

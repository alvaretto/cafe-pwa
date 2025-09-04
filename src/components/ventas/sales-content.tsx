'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { Product, SaleItem, Customer, MOCK_PRODUCTS, MOCK_CUSTOMERS, getSalesStats } from '@/lib/mock-data'
import { DashboardHeaderSimple } from '@/components/dashboard/dashboard-header-simple'
import { SalesHeader, SalesStats } from './sales-components'
import { POSInterface } from './pos-interface'
import { SalesHistory } from './sales-history'

interface SalesContentProps {
  user: User
}

export function SalesContent({ user }: SalesContentProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [cart, setCart] = useState<SaleItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentView, setCurrentView] = useState<'pos' | 'history'>('pos')

  useEffect(() => {
    loadSalesData()
  }, [])

  const loadSalesData = async () => {
    try {
      setIsLoading(true)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProducts(MOCK_PRODUCTS.filter(p => p.isActive))
      setCustomers(MOCK_CUSTOMERS)
    } catch (error) {
      console.error('Error loading sales data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadSalesData()
  }

  const addToCart = (product: Product, quantity: number, unitType: 'gramos' | 'media_libra' | 'libra' | 'kilo') => {
    const existingItem = cart.find(item => 
      item.productId === product.id && item.unitType === unitType
    )

    let unitPrice = 0
    switch (unitType) {
      case 'gramos':
        unitPrice = product.pricePerGram
        break
      case 'media_libra':
        unitPrice = product.pricePerHalfPound
        quantity = 1 // Para media libra, la cantidad siempre es 1
        break
      case 'libra':
        unitPrice = product.pricePerPound
        quantity = 1 // Para libra, la cantidad siempre es 1
        break
      case 'kilo':
        unitPrice = product.pricePerKilo
        quantity = 1 // Para kilo, la cantidad siempre es 1
        break
    }

    if (existingItem) {
      // Actualizar cantidad del item existente
      setCart(prev => prev.map(item =>
        item.id === existingItem.id
          ? {
              ...item,
              quantity: unitType === 'gramos' ? item.quantity + quantity : quantity,
              totalPrice: unitType === 'gramos' 
                ? (item.quantity + quantity) * unitPrice 
                : quantity * unitPrice
            }
          : item
      ))
    } else {
      // Agregar nuevo item al carrito
      const newItem: SaleItem = {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        productName: product.name,
        quantity,
        unitType,
        unitPrice,
        totalPrice: quantity * unitPrice,
      }
      setCart(prev => [...prev, newItem])
    }
  }

  const updateCartItem = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(prev => prev.map(item =>
      item.id === itemId
        ? {
            ...item,
            quantity,
            totalPrice: quantity * item.unitPrice
          }
        : item
    ))
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
    setSelectedCustomer(null)
  }

  const calculateCartTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0)
    const tax = 0 // Sin impuestos por ahora
    const discount = selectedCustomer?.isVip ? subtotal * 0.05 : 0 // 5% descuento VIP
    const total = subtotal + tax - discount

    return { subtotal, tax, discount, total }
  }

  const completeSale = async (paymentMethod: string, notes?: string, agreedPaymentDate?: Date) => {
    try {
      const totals = calculateCartTotals()
      const saleNumber = `VTA-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`

      // Simular procesamiento de venta
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Aquí se guardaría la venta en la base de datos
      console.log('Venta completada:', {
        saleNumber,
        customer: selectedCustomer,
        items: cart,
        totals,
        paymentMethod,
        agreedPaymentDate,
        notes,
        seller: user,
      })

      // Limpiar carrito después de la venta
      clearCart()

      // Mostrar confirmación con información específica para créditos
      let confirmationMessage = `¡Venta completada exitosamente!\nNúmero de venta: ${saleNumber}\nTotal: $${totals.total.toLocaleString()}`

      if (paymentMethod === 'credito' && agreedPaymentDate) {
        const formattedDate = agreedPaymentDate.toLocaleDateString('es-CO')
        confirmationMessage += `\n\n⚠️ PAGO A CRÉDITO\nFecha acordada: ${formattedDate}`
      }

      alert(confirmationMessage)

      return true
    } catch (error) {
      console.error('Error completing sale:', error)
      alert('Error al procesar la venta. Por favor intenta de nuevo.')
      return false
    }
  }

  const stats = getSalesStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header del Dashboard */}
      <DashboardHeaderSimple 
        user={user} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header de ventas */}
        <SalesHeader 
          currentView={currentView}
          onViewChange={setCurrentView}
          stats={stats}
        />

        {/* Estadísticas */}
        <SalesStats 
          stats={stats}
          isLoading={isLoading}
        />

        {/* Interfaz principal */}
        {currentView === 'pos' && (
          <POSInterface
            products={products}
            customers={customers}
            cart={cart}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            onAddToCart={addToCart}
            onUpdateCartItem={updateCartItem}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
            onCompleteSale={completeSale}
            calculateTotals={calculateCartTotals}
            isLoading={isLoading}
          />
        )}

        {currentView === 'history' && (
          <SalesHistory isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}

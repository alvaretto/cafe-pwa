'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DateRangeSelector } from './date-range-selector'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  FileText,
  Printer,
  BarChart,
  TrendingUp,
  Edit,
  Trash2
} from 'lucide-react'
import { Sale, MOCK_SALES, MOCK_CUSTOMERS } from '@/lib/mock-data'
import { SaleDetailModal } from './sale-detail-modal'
import { EditSaleModal } from './edit-sale-modal'
import { DeleteSaleModal } from './delete-sale-modal'

interface SalesHistoryProps {
  isLoading?: boolean
}

export function SalesHistory({ isLoading = false }: SalesHistoryProps) {
  const [sales, setSales] = useState<Sale[]>([])
  const [filteredSales, setFilteredSales] = useState<Sale[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Filtros
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('all')
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all')
  const [selectedSeller, setSelectedSeller] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    loadSalesData()
  }, [])

  useEffect(() => {
    filterAndSortSales()
  }, [sales, searchQuery, dateFrom, dateTo, selectedCustomer, selectedPaymentMethod, selectedPaymentStatus, selectedSeller, sortBy, sortOrder])

  const loadSalesData = async () => {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSales(MOCK_SALES)
    } catch (error) {
      console.error('Error loading sales data:', error)
    }
  }

  const filterAndSortSales = () => {
    let filtered = [...sales]

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(sale =>
        sale.saleNumber.toLowerCase().includes(query) ||
        sale.customerName?.toLowerCase().includes(query) ||
        sale.sellerName.toLowerCase().includes(query)
      )
    }

    // Filtrar por rango de fechas
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      fromDate.setHours(0, 0, 0, 0)
      filtered = filtered.filter(sale => sale.createdAt >= fromDate)
    }
    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter(sale => sale.createdAt <= toDate)
    }

    // Filtrar por cliente
    if (selectedCustomer !== 'all') {
      filtered = filtered.filter(sale => sale.customerId === selectedCustomer)
    }

    // Filtrar por método de pago
    if (selectedPaymentMethod !== 'all') {
      filtered = filtered.filter(sale => sale.paymentMethod === selectedPaymentMethod)
    }

    // Filtrar por estado de pago
    if (selectedPaymentStatus !== 'all') {
      filtered = filtered.filter(sale => sale.paymentStatus === selectedPaymentStatus)
    }

    // Filtrar por vendedor
    if (selectedSeller !== 'all') {
      filtered = filtered.filter(sale => sale.sellerId === selectedSeller)
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Sale]
      let bValue: any = b[sortBy as keyof Sale]

      if (sortBy === 'total' || sortBy === 'subtotal') {
        aValue = Number(aValue)
        bValue = Number(bValue)
      } else if (sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredSales(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Datos paginados
  const paginatedSales = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredSales.slice(startIndex, endIndex)
  }, [filteredSales, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)

  // Obtener listas únicas para filtros
  const uniqueCustomers = useMemo(() => {
    const customers = MOCK_CUSTOMERS.map(customer => ({
      id: customer.id,
      name: `${customer.nombres} ${customer.apellidos}`
    }))
    return customers
  }, [])

  const uniqueSellers = useMemo(() => {
    const sellers = [...new Set(sales.map(sale => ({ id: sale.sellerId, name: sale.sellerName })))]
    return sellers.filter((seller, index, self) => 
      index === self.findIndex(s => s.id === seller.id)
    )
  }, [sales])

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
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta_credito: 'Tarjeta Crédito',
      tarjeta_debito: 'Tarjeta Débito',
      transferencia: 'Transferencia',
      digital: 'Digital',
      credito: 'Crédito'
    }
    return labels[method] || method
  }

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completado: 'default',
      pendiente: 'secondary',
      cancelado: 'destructive',
      devuelto: 'outline'
    }
    
    const labels: Record<string, string> = {
      completado: 'Completado',
      pendiente: 'Pendiente',
      cancelado: 'Cancelado',
      devuelto: 'Devuelto'
    }

    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status}
      </Badge>
    )
  }

  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale)
    setShowDetailModal(true)
  }

  const handleEditSale = (sale: Sale) => {
    setSelectedSale(sale)
    setShowEditModal(true)
  }

  const handleDeleteSale = (sale: Sale) => {
    setSelectedSale(sale)
    setShowDeleteModal(true)
  }

  const handleSaveEdit = (updatedSale: Sale) => {
    // Actualizar la venta en el estado local
    const updatedSales = sales.map(sale =>
      sale.id === updatedSale.id ? updatedSale : sale
    )
    setSales(updatedSales)
    setShowEditModal(false)
    setSelectedSale(null)
  }

  const handleConfirmDelete = (saleId: string) => {
    // Eliminar la venta del estado local
    const updatedSales = sales.filter(sale => sale.id !== saleId)
    setSales(updatedSales)
    setShowDeleteModal(false)
    setSelectedSale(null)
  }

  const handleExportData = () => {
    const csvContent = generateCSVContent()
    downloadCSV(csvContent, `historial-ventas-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const generateCSVContent = () => {
    const headers = [
      'Número de Venta',
      'Cliente',
      'Fecha',
      'Total',
      'Método de Pago',
      'Estado',
      'Vendedor',
      'Notas'
    ]

    const rows = filteredSales.map(sale => [
      sale.saleNumber,
      sale.customerName || 'Cliente General',
      formatDate(sale.createdAt),
      sale.total.toString(),
      getPaymentMethodLabel(sale.paymentMethod),
      sale.paymentStatus,
      sale.sellerName,
      sale.notes || ''
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    return csvContent
  }

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handlePrintSale = (sale: Sale) => {
    // TODO: Implementar impresión
    alert(`Imprimiendo comprobante de venta ${sale.saleNumber}`)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setDateFrom('')
    setDateTo('')
    setSelectedCustomer('all')
    setSelectedPaymentMethod('all')
    setSelectedPaymentStatus('all')
    setSelectedSeller('all')
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  // Función para obtener el semestre actual
  const getCurrentSemester = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() // 0-11

    if (month < 6) { // Enero-Junio = Semestre 1
      return {
        start: new Date(year, 0, 1), // 1 de enero
        end: new Date(year, 5, 30), // 30 de junio
        number: 1
      }
    } else { // Julio-Diciembre = Semestre 2
      return {
        start: new Date(year, 6, 1), // 1 de julio
        end: new Date(year, 11, 31), // 31 de diciembre
        number: 2
      }
    }
  }

  // Estadísticas del período filtrado
  const periodStats = useMemo(() => {
    const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
    const avgTicket = filteredSales.length > 0 ? totalSales / filteredSales.length : 0
    const pendingSales = filteredSales.filter(sale => sale.paymentStatus === 'pendiente')
    const pendingAmount = pendingSales.reduce((sum, sale) => sum + sale.total, 0)

    // Calcular estadísticas del semestre actual
    const semester = getCurrentSemester()
    const semesterSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= semester.start && saleDate <= semester.end
    })
    const semesterTotal = semesterSales.reduce((sum, sale) => sum + sale.total, 0)

    return {
      totalSales,
      avgTicket,
      totalTransactions: filteredSales.length,
      pendingTransactions: pendingSales.length,
      pendingAmount,
      semesterTotal,
      semesterTransactions: semesterSales.length,
      semesterNumber: semester.number
    }
  }, [filteredSales, sales])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas del período */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Ventas
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(periodStats.totalSales)}
            </div>
            <p className="text-xs text-gray-600">
              {periodStats.totalTransactions} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ticket Promedio
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(periodStats.avgTicket)}
            </div>
            <p className="text-xs text-gray-600">
              por transacción
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ventas Pendientes
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {periodStats.pendingTransactions}
            </div>
            <p className="text-xs text-gray-600">
              {formatCurrency(periodStats.pendingAmount)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Filtros Activos
            </CardTitle>
            <Filter className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {filteredSales.length}
            </div>
            <p className="text-xs text-gray-600">
              de {sales.length} registros
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ventas Semestre {periodStats.semesterNumber}
            </CardTitle>
            <BarChart className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(periodStats.semesterTotal)}
            </div>
            <p className="text-xs text-gray-600">
              {periodStats.semesterTransactions} transacciones
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-lg font-semibold flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros y Búsqueda
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpiar Filtros
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {/* Búsqueda */}
            <div className="relative lg:col-span-2 xl:col-span-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por número de venta o cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selector de fechas */}
            <div className="lg:col-span-1">
              <DateRangeSelector
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
              />
            </div>
          </div>

          {/* Filtros adicionales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 mt-4">

            {/* Cliente */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cliente</label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {uniqueCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Método de pago */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Método de Pago</label>
              <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los métodos</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta_credito">Tarjeta Crédito</SelectItem>
                  <SelectItem value="tarjeta_debito">Tarjeta Débito</SelectItem>
                  <SelectItem value="transferencia">Transferencia</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                  <SelectItem value="credito">Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Estado de pago */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Estado</label>
              <Select value={selectedPaymentStatus} onValueChange={setSelectedPaymentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="devuelto">Devuelto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Vendedor */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Vendedor</label>
              <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los vendedores</SelectItem>
                  {uniqueSellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ordenar por */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Fecha</SelectItem>
                  <SelectItem value="total">Total</SelectItem>
                  <SelectItem value="customerName">Cliente</SelectItem>
                  <SelectItem value="saleNumber">Número de Venta</SelectItem>
                  <SelectItem value="sellerName">Vendedor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Orden */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Orden</label>
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descendente</SelectItem>
                  <SelectItem value="asc">Ascendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de ventas */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Historial de Ventas
            <Badge variant="secondary" className="ml-2">
              {filteredSales.length} registros
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Número</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Método</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Vendedor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale) => (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{sale.saleNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">
                        {sale.customerName || 'Cliente General'}
                      </div>
                      {sale.customerEmail && (
                        <div className="text-xs text-gray-500">{sale.customerEmail}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{formatDate(sale.createdAt)}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(sale.total)}
                      </div>
                      {sale.discount > 0 && (
                        <div className="text-xs text-green-600">
                          Desc: {formatCurrency(sale.discount)}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">
                        {getPaymentMethodLabel(sale.paymentMethod)}
                      </div>
                      {sale.paymentMethod === 'credito' && sale.agreedPaymentDate && (
                        <div className="text-xs text-orange-600">
                          Vence: {new Date(sale.agreedPaymentDate).toLocaleDateString('es-CO')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {getPaymentStatusBadge(sale.paymentStatus)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-gray-900">{sale.sellerName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSale(sale)}
                          className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSale(sale)}
                          className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          title="Editar venta"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSale(sale)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Eliminar venta"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrintSale(sale)}
                          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                          title="Imprimir"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredSales.length)} de {filteredSales.length} registros
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de detalles de venta */}
      {selectedSale && (
        <SaleDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          sale={selectedSale}
        />
      )}

      {/* Modal de edición de venta */}
      {selectedSale && (
        <EditSaleModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedSale(null)
          }}
          sale={selectedSale}
          onSave={handleSaveEdit}
        />
      )}

      {/* Modal de confirmación de eliminación */}
      {selectedSale && (
        <DeleteSaleModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedSale(null)
          }}
          sale={selectedSale}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

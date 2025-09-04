'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Award,
  TrendingUp
} from 'lucide-react'
import { Customer } from '@/lib/mock-data'

// Header de clientes
interface CustomersHeaderProps {
  onCreateCustomer: () => void
  stats: any
}

export function CustomersHeader({ onCreateCustomer, stats }: CustomersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Gestión de Clientes</h1>
        <p className="text-amber-700 mt-1">
          CRM completo con historial de compras, fidelización y segmentación automática
        </p>
      </div>
      <Button 
        onClick={onCreateCustomer}
        className="bg-amber-600 hover:bg-amber-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Cliente
      </Button>
    </div>
  )
}

// Estadísticas de clientes
interface CustomersStatsProps {
  stats: any
  isLoading: boolean
}

export function CustomersStats({ stats, isLoading }: CustomersStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Clientes',
      value: stats.total.toString(),
      subtitle: `${stats.vip} VIP, ${stats.enRiesgo || 0} en riesgo`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Ingresos Totales',
      value: formatCurrency(stats.totalSpent),
      subtitle: `promedio ${formatCurrency(stats.avgSpent)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Puntos Fidelidad',
      value: stats.totalLoyaltyPoints.toLocaleString(),
      subtitle: 'puntos acumulados',
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Compras Promedio',
      value: stats.avgPurchases.toFixed(1),
      subtitle: 'compras por cliente',
      icon: ShoppingBag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Clientes Potenciales',
      value: (stats.potencial || 0).toString(),
      subtitle: 'oportunidades de crecimiento',
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map((card, index) => {
        const Icon = card.icon
        
        return (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gray-900">
                {card.value}
              </div>
              <p className="text-xs text-gray-600">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Filtros de clientes
interface CustomersFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedSegment: string
  onSegmentChange: (segment: string) => void
  sortBy: string
  onSortByChange: (sortBy: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  totalCustomers: number
}

export function CustomersFilters({
  searchQuery,
  onSearchChange,
  selectedSegment,
  onSegmentChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  totalCustomers,
}: CustomersFiltersProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros y Búsqueda
          <Badge variant="secondary" className="ml-2">
            {totalCustomers} clientes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Segmento */}
          <Select value={selectedSegment} onValueChange={onSegmentChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los segmentos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los segmentos</SelectItem>
              <SelectItem value="vip">Clientes VIP</SelectItem>
              <SelectItem value="frecuente">Clientes Frecuentes</SelectItem>
              <SelectItem value="ocasional">Clientes Ocasionales</SelectItem>
              <SelectItem value="potencial">Clientes Potenciales</SelectItem>
              <SelectItem value="nuevo">Clientes Nuevos</SelectItem>
              <SelectItem value="en_riesgo">Clientes en Riesgo</SelectItem>
            </SelectContent>
          </Select>

          {/* Ordenar por */}
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nombres">Nombre</SelectItem>
              <SelectItem value="totalSpent">Total gastado</SelectItem>
              <SelectItem value="totalPurchases">Compras</SelectItem>
              <SelectItem value="loyaltyPoints">Puntos</SelectItem>
              <SelectItem value="lastPurchase">Última compra</SelectItem>
              <SelectItem value="createdAt">Fecha registro</SelectItem>
            </SelectContent>
          </Select>

          {/* Orden */}
          <Button
            variant="outline"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center"
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="h-4 w-4 mr-2" />
            ) : (
              <SortDesc className="h-4 w-4 mr-2" />
            )}
            {sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Grid de clientes
interface CustomersGridProps {
  customers: Customer[]
  isLoading: boolean
  onViewCustomer: (customer: Customer) => void
  onEditCustomer: (customer: Customer) => void
  onDeleteCustomer: (customerId: string) => void
}

export function CustomersGrid({ 
  customers, 
  isLoading, 
  onViewCustomer, 
  onEditCustomer, 
  onDeleteCustomer 
}: CustomersGridProps) {
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
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (customers.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron clientes</h3>
          <p className="text-gray-600 text-center">
            No hay clientes que coincidan con los filtros seleccionados.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <Card key={customer.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                  {customer.nombres} {customer.apellidos}
                  {customer.isVip && (
                    <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      VIP
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={`ml-2 text-xs ${
                      customer.segment === 'VIP' ? 'bg-purple-100 text-purple-800' :
                      customer.segment === 'FRECUENTE' ? 'bg-blue-100 text-blue-800' :
                      customer.segment === 'OCASIONAL' ? 'bg-green-100 text-green-800' :
                      customer.segment === 'POTENCIAL' ? 'bg-yellow-100 text-yellow-800' :
                      customer.segment === 'EN_RIESGO' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {customer.segment === 'EN_RIESGO' ? 'EN RIESGO' : customer.segment}
                  </Badge>
                </CardTitle>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-2" />
                    {customer.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2" />
                    {customer.celular}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-2" />
                    {customer.direccionCasa}
                  </div>
                  {customer.direccionTrabajo && (
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-2 text-blue-500" />
                      <span className="text-blue-600 text-xs">Trabajo: {customer.direccionTrabajo}</span>
                    </div>
                  )}
                  {customer.birthMonth && customer.birthDay && (
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-2 text-green-500" />
                      <span className="text-green-600 text-xs">
                        Cumpleaños: {customer.birthDay}/{customer.birthMonth}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewCustomer(customer)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditCustomer(customer)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteCustomer(customer.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Estadísticas del cliente */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="font-semibold text-green-800">
                    {formatCurrency(customer.totalSpent)}
                  </div>
                  <div className="text-green-600 text-xs">Total gastado</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-800">
                    {customer.totalPurchases}
                  </div>
                  <div className="text-blue-600 text-xs">Compras</div>
                </div>
              </div>

              {/* Puntos de fidelidad */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">
                    {customer.loyaltyPoints} puntos
                  </span>
                </div>
                {customer.lastPurchase && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">
                      {formatDate(customer.lastPurchase)}
                    </span>
                  </div>
                )}
              </div>

              {/* Dirección */}
              {customer.direccionCasa && (
                <div className="flex items-start space-x-2 text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{customer.direccionCasa}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

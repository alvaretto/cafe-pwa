'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Eye, 
  Edit, 
  Trash2, 
  Coffee, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  BarChart3,
  ShoppingCart
} from 'lucide-react'
import { Product, Category } from '@/lib/mock-data'

// Header de productos
interface ProductsHeaderProps {
  onCreateProduct: () => void
  stats: any
}

export function ProductsHeader({ onCreateProduct, stats }: ProductsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Gestión de Productos</h1>
        <p className="text-amber-700 mt-1">
          Administra tu catálogo de café con precios múltiples y control de inventario
        </p>
      </div>
      <Button 
        onClick={onCreateProduct}
        className="bg-amber-600 hover:bg-amber-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Nuevo Producto
      </Button>
    </div>
  )
}

// Estadísticas de productos
interface ProductsStatsProps {
  stats: any
  isLoading: boolean
}

export function ProductsStats({ stats, isLoading }: ProductsStatsProps) {
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
      title: 'Total Productos',
      value: stats.totalProducts.toString(),
      subtitle: `${stats.totalCategories} categorías`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Valor Inventario',
      value: formatCurrency(stats.totalValue),
      subtitle: 'valor total en stock',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Stock Bajo',
      value: stats.lowStockCount.toString(),
      subtitle: 'productos necesitan restock',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Margen Promedio',
      value: `${stats.avgMargin.toFixed(1)}%`,
      subtitle: 'rentabilidad promedio',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

// Filtros de productos
interface ProductsFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  categories: Category[]
  sortBy: string
  onSortByChange: (sortBy: string) => void
  sortOrder: 'asc' | 'desc'
  onSortOrderChange: (order: 'asc' | 'desc') => void
  totalProducts: number
}

export function ProductsFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  totalProducts,
}: ProductsFiltersProps) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filtros y Búsqueda
          <Badge variant="secondary" className="ml-2">
            {totalProducts} productos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categoría */}
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name} ({category.productCount})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Ordenar por */}
          <Select value={sortBy} onValueChange={onSortByChange}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nombre</SelectItem>
              <SelectItem value="pricePerGram">Precio por Gramo</SelectItem>
              <SelectItem value="pricePerPound">Precio por Libra</SelectItem>
              <SelectItem value="pricePerKilo">Precio por Kilo</SelectItem>
              <SelectItem value="stock">Stock</SelectItem>
              <SelectItem value="margin">Margen</SelectItem>
              <SelectItem value="createdAt">Fecha creación</SelectItem>
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

// Grid de productos
interface ProductsGridProps {
  products: Product[]
  isLoading: boolean
  onViewProduct: (product: Product) => void
  onEditProduct: (product: Product) => void
  onDeleteProduct: (productId: string) => void
}

export function ProductsGrid({ 
  products, 
  isLoading, 
  onViewProduct, 
  onEditProduct, 
  onDeleteProduct 
}: ProductsGridProps) {
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

  if (products.length === 0) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Coffee className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600 text-center">
            No hay productos que coincidan con los filtros seleccionados.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Card key={product.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                  {product.name}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewProduct(product)}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditProduct(product)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteProduct(product.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {product.description}
            </p>
            
            <div className="space-y-3">
              {/* Precios */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Por gramo:</span>
                  <div className="font-semibold">{formatCurrency(product.pricePerGram)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Por libra:</span>
                  <div className="font-semibold">{formatCurrency(product.pricePerPound)}</div>
                </div>
                <div>
                  <span className="text-gray-500">Por kilo:</span>
                  <div className="font-semibold">{formatCurrency(product.pricePerKilo)}</div>
                </div>
              </div>

              {/* Stock y margen */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className={`font-medium ${
                    product.stock <= product.minStock ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {product.stock}g
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-green-600">
                    {product.margin.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* SKU */}
              <div className="text-xs text-gray-500">
                SKU: {product.sku}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

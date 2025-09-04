'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { Product, Category, MOCK_PRODUCTS, MOCK_CATEGORIES, getProductStats } from '@/lib/mock-data'
import { DashboardHeaderSimple } from '@/components/dashboard/dashboard-header-simple'
import { ProductsHeader, ProductsStats, ProductsFilters, ProductsGrid } from './products-components'
import { ProductModal } from './product-modal'

interface ProductsContentProps {
  user: User
}

export function ProductsContent({ user }: ProductsContentProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')

  useEffect(() => {
    loadProductsData()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchQuery, selectedCategory, sortBy, sortOrder])

  const loadProductsData = async () => {
    try {
      setIsLoading(true)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setProducts(MOCK_PRODUCTS)
      setCategories(MOCK_CATEGORIES)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    let filtered = [...products]

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product]
      let bValue: any = b[sortBy as keyof Product]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredProducts(filtered)
  }

  const handleRefresh = () => {
    loadProductsData()
  }

  const handleCreateProduct = () => {
    setSelectedProduct(null)
    setModalMode('create')
    setShowModal(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
    setModalMode('view')
    setShowModal(true)
  }

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (modalMode === 'create') {
      // Crear nuevo producto
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        ...productData,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product

      setProducts(prev => [...prev, newProduct])
    } else if (modalMode === 'edit' && selectedProduct) {
      // Actualizar producto existente
      setProducts(prev =>
        prev.map(p =>
          p.id === selectedProduct.id
            ? { ...p, ...productData, updatedAt: new Date() }
            : p
        )
      )
    }

    setShowModal(false)
    setSelectedProduct(null)
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== productId))
      setShowModal(false)
      setSelectedProduct(null)
    }
  }

  const stats = getProductStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header del Dashboard */}
      <DashboardHeaderSimple 
        user={user} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header de productos */}
        <ProductsHeader 
          onCreateProduct={handleCreateProduct}
          stats={stats}
        />

        {/* Estadísticas */}
        <ProductsStats 
          stats={stats}
          isLoading={isLoading}
        />

        {/* Filtros */}
        <ProductsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          totalProducts={filteredProducts.length}
        />

        {/* Grid de productos */}
        <ProductsGrid
          products={filteredProducts}
          isLoading={isLoading}
          onViewProduct={handleViewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>

      {/* Modal de producto */}
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        product={selectedProduct}
        mode={modalMode}
        categories={categories}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  )
}

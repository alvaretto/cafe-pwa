'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { Customer, MOCK_CUSTOMERS, getCustomersStats, searchCustomers } from '@/lib/mock-data'
import { DashboardHeaderSimple } from '@/components/dashboard/dashboard-header-simple'
import { CustomersHeader, CustomersStats, CustomersFilters, CustomersGrid } from './customers-components'
import { CustomerModal } from './customer-modal'

interface CustomersContentProps {
  user: User
}

export function CustomersContent({ user }: CustomersContentProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSegment, setSelectedSegment] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('nombres')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showModal, setShowModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')

  useEffect(() => {
    loadCustomersData()
  }, [])

  useEffect(() => {
    filterAndSortCustomers()
  }, [customers, searchQuery, selectedSegment, sortBy, sortOrder])

  const loadCustomersData = async () => {
    try {
      setIsLoading(true)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCustomers(MOCK_CUSTOMERS)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortCustomers = () => {
    let filtered = [...customers]

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = searchCustomers(searchQuery)
    }

    // Filtrar por segmento
    if (selectedSegment !== 'all') {
      switch (selectedSegment) {
        case 'vip':
          filtered = filtered.filter(customer => customer.segment === 'VIP')
          break
        case 'frecuente':
          filtered = filtered.filter(customer => customer.segment === 'FRECUENTE')
          break
        case 'ocasional':
          filtered = filtered.filter(customer => customer.segment === 'OCASIONAL')
          break
        case 'potencial':
          filtered = filtered.filter(customer => customer.segment === 'POTENCIAL')
          break
        case 'nuevo':
          filtered = filtered.filter(customer => customer.segment === 'NUEVO')
          break
        case 'en_riesgo':
          filtered = filtered.filter(customer => customer.segment === 'EN_RIESGO')
          break
        // Mantener compatibilidad con filtros antiguos
        case 'regular':
          filtered = filtered.filter(customer =>
            customer.segment === 'FRECUENTE' || customer.segment === 'OCASIONAL'
          )
          break
        case 'new':
          filtered = filtered.filter(customer =>
            customer.segment === 'NUEVO' || customer.segment === 'POTENCIAL'
          )
          break
      }
    }

    // Ordenar
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Customer]
      let bValue: any = b[sortBy as keyof Customer]

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

    setFilteredCustomers(filtered)
  }

  const handleRefresh = () => {
    loadCustomersData()
  }

  const handleCreateCustomer = () => {
    setSelectedCustomer(null)
    setModalMode('create')
    setShowModal(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setModalMode('view')
    setShowModal(true)
  }

  const handleSaveCustomer = (customerData: Partial<Customer>) => {
    if (modalMode === 'create') {
      // Crear nuevo cliente
      const newCustomer: Customer = {
        id: Math.random().toString(36).substr(2, 9),
        ...customerData,
        totalPurchases: 0,
        totalSpent: 0,
        loyaltyPoints: 0,
        isVip: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Customer

      setCustomers(prev => [...prev, newCustomer])
    } else if (modalMode === 'edit' && selectedCustomer) {
      // Actualizar cliente existente
      setCustomers(prev =>
        prev.map(c =>
          c.id === selectedCustomer.id
            ? { ...c, ...customerData, updatedAt: new Date() }
            : c
        )
      )
    }

    setShowModal(false)
    setSelectedCustomer(null)
  }

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setCustomers(prev => prev.filter(c => c.id !== customerId))
      setShowModal(false)
      setSelectedCustomer(null)
    }
  }

  const handleModeChange = (newMode: 'view' | 'edit' | 'create') => {
    setModalMode(newMode)
  }

  const stats = getCustomersStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header del Dashboard */}
      <DashboardHeaderSimple 
        user={user} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header de clientes */}
        <CustomersHeader 
          onCreateCustomer={handleCreateCustomer}
          stats={stats}
        />

        {/* Estadísticas */}
        <CustomersStats 
          stats={stats}
          isLoading={isLoading}
        />

        {/* Filtros */}
        <CustomersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSegment={selectedSegment}
          onSegmentChange={setSelectedSegment}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          totalCustomers={filteredCustomers.length}
        />

        {/* Grid de clientes */}
        <CustomersGrid
          customers={filteredCustomers}
          isLoading={isLoading}
          onViewCustomer={handleViewCustomer}
          onEditCustomer={handleEditCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />
      </div>

      {/* Modal de cliente */}
      <CustomerModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        customer={selectedCustomer}
        mode={modalMode}
        onSave={handleSaveCustomer}
        onDelete={handleDeleteCustomer}
        onModeChange={handleModeChange}
      />
    </div>
  )
}

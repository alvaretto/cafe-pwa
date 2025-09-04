'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import {
  Expense,
  ExpenseCategory,
  MOCK_EXPENSES,
  MOCK_EXPENSE_CATEGORIES,
  getExpensesStats,
  getBudgetAlerts,
  searchExpenses,
  createExpenseCategory,
  updateExpenseCategory,
  deleteExpenseCategory
} from '@/lib/mock-data'
import { DashboardHeaderSimple } from '@/components/dashboard/dashboard-header-simple'
import {
  ExpensesHeader,
  ExpensesStats,
  ExpensesTabs,
  ExpensesOverview,
  BudgetAnalysis,
  ExpensesList,
  ExpenseReports,
  ExpenseCategories
} from './expenses-components'
import { ExpenseModal } from './expense-modal'
import { ExpenseCategoriesManagement } from './expense-categories-management'
import { ExpenseCategoryModal } from './expense-category-modal'

interface ExpensesContentProps {
  user: User
}

export function ExpensesContent({ user }: ExpensesContentProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [budgetAlerts, setBudgetAlerts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'expenses' | 'reports' | 'categories'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  })
  const [showModal, setShowModal] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'create'>('view')

  // Estados para modal de categorías
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | null>(null)
  const [categoryModalMode, setCategoryModalMode] = useState<'view' | 'edit' | 'create'>('view')

  useEffect(() => {
    loadExpensesData()
  }, [])

  useEffect(() => {
    filterExpenses()
  }, [expenses, searchQuery, selectedCategoryFilter, dateRange])

  const loadExpensesData = async () => {
    try {
      setIsLoading(true)

      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500))

      setExpenses(MOCK_EXPENSES)
      setCategories(MOCK_EXPENSE_CATEGORIES)
      setBudgetAlerts(getBudgetAlerts())
    } catch (error) {
      console.error('Error loading expenses data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterExpenses = () => {
    let filtered = [...expenses]

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = searchExpenses(searchQuery)
    }

    // Filtrar por categoría
    if (selectedCategoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.categoryId === selectedCategoryFilter)
    }

    // Filtrar por rango de fechas
    filtered = filtered.filter(expense =>
      expense.date >= dateRange.start && expense.date <= dateRange.end
    )

    setFilteredExpenses(filtered)
  }

  const handleRefresh = () => {
    loadExpensesData()
  }

  const handleCreateExpense = () => {
    setSelectedExpense(null)
    setModalMode('create')
    setShowModal(true)
  }

  const handleEditExpense = (expense: Expense) => {
    setSelectedExpense(expense)
    setModalMode('edit')
    setShowModal(true)
  }

  const handleViewExpense = (expense: Expense) => {
    setSelectedExpense(expense)
    setModalMode('view')
    setShowModal(true)
  }

  const handleSaveExpense = (expenseData: Partial<Expense>) => {
    if (modalMode === 'create') {
      // Crear nuevo gasto
      const newExpense: Expense = {
        id: Math.random().toString(36).substr(2, 9),
        ...expenseData,
        userId: user.id,
        userName: user.name || 'Usuario',
        isApproved: user.role === 'ADMIN',
        approvedBy: user.role === 'ADMIN' ? user.name : undefined,
        approvedAt: user.role === 'ADMIN' ? new Date() : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Expense

      setExpenses(prev => [newExpense, ...prev])
    } else if (modalMode === 'edit' && selectedExpense) {
      // Actualizar gasto existente
      setExpenses(prev =>
        prev.map(e =>
          e.id === selectedExpense.id
            ? { ...e, ...expenseData, updatedAt: new Date() }
            : e
        )
      )
    }

    setShowModal(false)
    setSelectedExpense(null)
    
    // Actualizar alertas de presupuesto
    setBudgetAlerts(getBudgetAlerts())
  }

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
      setExpenses(prev => prev.filter(e => e.id !== expenseId))
      setShowModal(false)
      setSelectedExpense(null)
      setBudgetAlerts(getBudgetAlerts())
    }
  }

  const handleApproveExpense = (expenseId: string) => {
    setExpenses(prev =>
      prev.map(e =>
        e.id === expenseId
          ? {
              ...e,
              isApproved: true,
              approvedBy: user.name,
              approvedAt: new Date(),
              updatedAt: new Date()
            }
          : e
      )
    )
  }

  // Funciones para manejar categorías
  const handleCreateCategory = () => {
    setSelectedCategory(null)
    setCategoryModalMode('create')
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category: ExpenseCategory) => {
    setSelectedCategory(category)
    setCategoryModalMode('edit')
    setShowCategoryModal(true)
  }

  const handleViewCategory = (category: ExpenseCategory) => {
    setSelectedCategory(category)
    setCategoryModalMode('view')
    setShowCategoryModal(true)
  }

  const handleSaveCategory = (categoryData: Partial<ExpenseCategory>) => {
    if (categoryModalMode === 'create') {
      const newCategory = createExpenseCategory(categoryData as Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>)
      setCategories(prev => [newCategory, ...prev])
    } else if (categoryModalMode === 'edit' && selectedCategory) {
      const updatedCategory = updateExpenseCategory(selectedCategory.id, categoryData)
      if (updatedCategory) {
        setCategories(prev =>
          prev.map(c => c.id === selectedCategory.id ? updatedCategory : c)
        )
      }
    }
    setShowCategoryModal(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    const success = deleteExpenseCategory(categoryId)
    if (success) {
      setCategories(prev => prev.filter(c => c.id !== categoryId))
    } else {
      // Mostrar error - la categoría tiene gastos asociados
      alert('No se puede eliminar la categoría porque tiene gastos asociados.')
    }
  }

  const stats = getExpensesStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header del Dashboard */}
      <DashboardHeaderSimple 
        user={user} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header de gastos */}
        <ExpensesHeader 
          onCreateExpense={handleCreateExpense}
          stats={stats}
          alertsCount={budgetAlerts.length}
        />

        {/* Estadísticas */}
        <ExpensesStats 
          stats={stats}
          isLoading={isLoading}
        />

        {/* Tabs de navegación */}
        <ExpensesTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          alertsCount={budgetAlerts.length}
          pendingCount={stats.pending.count}
        />

        {/* Contenido según tab activo */}
        {activeTab === 'overview' && (
          <ExpensesOverview
            expenses={filteredExpenses}
            categories={categories}
            stats={stats}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetAnalysis
            categories={categories}
            stats={stats}
            alerts={budgetAlerts}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesList
            expenses={filteredExpenses}
            categories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategoryFilter}
            onCategoryChange={setSelectedCategoryFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            isLoading={isLoading}
            onViewExpense={handleViewExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
            onApproveExpense={handleApproveExpense}
            userRole={user.role}
          />
        )}

        {activeTab === 'reports' && (
          <ExpenseReports
            expenses={expenses}
            categories={categories}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'categories' && (
          <ExpenseCategoriesManagement
            categories={categories}
            onCreateCategory={handleCreateCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onViewCategory={handleViewCategory}
          />
        )}
      </div>

      {/* Modal de gasto */}
      <ExpenseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        expense={selectedExpense}
        mode={modalMode}
        categories={categories}
        onSave={handleSaveExpense}
        onDelete={handleDeleteExpense}
        userRole={user.role}
      />

      {/* Modal de categoría */}
      <ExpenseCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        category={selectedCategory}
        mode={categoryModalMode}
        categories={categories}
        onSave={handleSaveCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  )
}

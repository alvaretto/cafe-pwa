// Utilidades para gestión de categorías de gastos

import { ExpenseCategory } from '@/types'
import { MOCK_EXPENSES } from './mock-data'

/**
 * Valida si una categoría puede ser eliminada
 */
export function canDeleteCategory(categoryId: string): { canDelete: boolean; reason?: string } {
  const expensesInCategory = MOCK_EXPENSES.filter(expense => expense.categoryId === categoryId)
  
  if (expensesInCategory.length > 0) {
    return {
      canDelete: false,
      reason: `No se puede eliminar la categoría porque tiene ${expensesInCategory.length} gasto${expensesInCategory.length > 1 ? 's' : ''} asociado${expensesInCategory.length > 1 ? 's' : ''}.`
    }
  }
  
  return { canDelete: true }
}

/**
 * Obtiene estadísticas de una categoría
 */
export function getCategoryStats(categoryId: string) {
  const categoryExpenses = MOCK_EXPENSES.filter(expense => expense.categoryId === categoryId)
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  const thisMonthExpenses = categoryExpenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
  })
  
  const totalThisMonth = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const totalAllTime = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  return {
    totalExpenses: categoryExpenses.length,
    totalThisMonth,
    totalAllTime,
    expensesThisMonth: thisMonthExpenses.length,
  }
}

/**
 * Genera un color aleatorio para nuevas categorías
 */
export function generateRandomColor(): string {
  const colors = [
    '#10B981', // green-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#F59E0B', // amber-500
    '#EF4444', // red-500
    '#06B6D4', // cyan-500
    '#84CC16', // lime-500
    '#F97316', // orange-500
    '#EC4899', // pink-500
    '#6366F1', // indigo-500
    '#14B8A6', // teal-500
    '#A855F7', // purple-500
  ]
  
  return colors[Math.floor(Math.random() * colors.length)] || '#6366f1'
}

/**
 * Valida si el nombre de categoría es único
 */
export function isCategoryNameUnique(name: string, excludeId?: string, categories: ExpenseCategory[] = []): boolean {
  return !categories.some(category => 
    category.name.toLowerCase() === name.toLowerCase() && category.id !== excludeId
  )
}

/**
 * Formatea el presupuesto para mostrar
 */
export function formatBudget(amount?: number): string {
  if (!amount) return 'Sin presupuesto'
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calcula el porcentaje de uso del presupuesto
 */
export function calculateBudgetUsage(spent: number, budget?: number): number {
  if (!budget || budget === 0) return 0
  return (spent / budget) * 100
}

/**
 * Determina el estado del presupuesto
 */
export function getBudgetStatus(spent: number, budget?: number): {
  status: 'safe' | 'warning' | 'danger' | 'over'
  color: string
  message: string
} {
  if (!budget) {
    return {
      status: 'safe',
      color: '#6B7280',
      message: 'Sin presupuesto definido'
    }
  }
  
  const percentage = calculateBudgetUsage(spent, budget)
  
  if (percentage > 100) {
    return {
      status: 'over',
      color: '#DC2626',
      message: `Excedido en ${(percentage - 100).toFixed(1)}%`
    }
  } else if (percentage > 90) {
    return {
      status: 'danger',
      color: '#EF4444',
      message: `${percentage.toFixed(1)}% utilizado - Crítico`
    }
  } else if (percentage > 75) {
    return {
      status: 'warning',
      color: '#F59E0B',
      message: `${percentage.toFixed(1)}% utilizado - Precaución`
    }
  } else {
    return {
      status: 'safe',
      color: '#10B981',
      message: `${percentage.toFixed(1)}% utilizado - Saludable`
    }
  }
}

/**
 * Colores predefinidos para categorías
 */
export const CATEGORY_COLORS = [
  { name: 'Verde', value: '#10B981' },
  { name: 'Azul', value: '#3B82F6' },
  { name: 'Violeta', value: '#8B5CF6' },
  { name: 'Ámbar', value: '#F59E0B' },
  { name: 'Rojo', value: '#EF4444' },
  { name: 'Cian', value: '#06B6D4' },
  { name: 'Lima', value: '#84CC16' },
  { name: 'Naranja', value: '#F97316' },
  { name: 'Rosa', value: '#EC4899' },
  { name: 'Índigo', value: '#6366F1' },
  { name: 'Verde azulado', value: '#14B8A6' },
  { name: 'Púrpura', value: '#A855F7' },
]

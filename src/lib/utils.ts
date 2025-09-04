import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind CSS de manera inteligente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formatea un número como moneda colombiana
 */
export function formatCurrency(amount: number, currency: string = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formatea un número con separadores de miles
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-CO').format(num)
}

/**
 * Formatea una fecha en formato colombiano
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Bogota',
  }
  
  return new Intl.DateTimeFormat('es-CO', { ...defaultOptions, ...options }).format(dateObj)
}

/**
 * Formatea una fecha y hora en formato colombiano
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Formatea solo la hora
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Bogota',
  }).format(dateObj)
}

/**
 * Calcula la diferencia de días entre dos fechas
 */
export function daysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000
  return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay))
}

/**
 * Verifica si una fecha es hoy
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

/**
 * Verifica si una fecha es esta semana
 */
export function isThisWeek(date: Date): boolean {
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
  const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))
  return date >= startOfWeek && date <= endOfWeek
}

/**
 * Convierte gramos a diferentes unidades de medida
 */
export function convertFromGrams(grams: number, unit: 'GRAMO' | 'MEDIA_LIBRA' | 'LIBRA' | 'KILOGRAMO'): number {
  switch (unit) {
    case 'GRAMO':
      return grams
    case 'MEDIA_LIBRA':
      return grams / 226.796 // 1 media libra = 226.796 gramos
    case 'LIBRA':
      return grams / 453.592 // 1 libra = 453.592 gramos
    case 'KILOGRAMO':
      return grams / 1000 // 1 kilogramo = 1000 gramos
    default:
      return grams
  }
}

/**
 * Convierte diferentes unidades de medida a gramos
 */
export function convertToGrams(amount: number, unit: 'GRAMO' | 'MEDIA_LIBRA' | 'LIBRA' | 'KILOGRAMO'): number {
  switch (unit) {
    case 'GRAMO':
      return amount
    case 'MEDIA_LIBRA':
      return amount * 226.796
    case 'LIBRA':
      return amount * 453.592
    case 'KILOGRAMO':
      return amount * 1000
    default:
      return amount
  }
}

/**
 * Obtiene el nombre de la unidad en español
 */
export function getUnitName(unit: 'GRAMO' | 'MEDIA_LIBRA' | 'LIBRA' | 'KILOGRAMO', plural: boolean = false): string {
  const units = {
    GRAMO: plural ? 'gramos' : 'gramo',
    MEDIA_LIBRA: plural ? 'medias libras' : 'media libra',
    LIBRA: plural ? 'libras' : 'libra',
    KILOGRAMO: plural ? 'kilogramos' : 'kilogramo',
  }
  return units[unit]
}

/**
 * Genera un número de venta único
 */
export function generateSaleNumber(): string {
  const now = new Date()
  const year = now.getFullYear().toString().slice(-2)
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  const time = now.getTime().toString().slice(-6)
  return `V${year}${month}${day}${time}`
}

/**
 * Genera un SKU único para productos
 */
export function generateSKU(productName: string, categoryName: string): string {
  const cleanName = productName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3)
  const cleanCategory = categoryName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 2)
  const timestamp = Date.now().toString().slice(-4)
  return `${cleanCategory}${cleanName}${timestamp}`
}

/**
 * Valida un email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida un número de teléfono colombiano
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+57|57)?[1-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Formatea un número de teléfono colombiano
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  return phone
}

/**
 * Calcula el porcentaje de cambio entre dos valores
 */
export function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0
  return ((newValue - oldValue) / oldValue) * 100
}

/**
 * Trunca un texto a una longitud específica
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Capitaliza la primera letra de cada palabra
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

/**
 * Genera un color aleatorio en formato hexadecimal
 */
export function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

/**
 * Debounce function para optimizar búsquedas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function para limitar ejecuciones
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Convierte un archivo a base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Descarga un archivo desde el navegador
 */
export function downloadFile(data: string, filename: string, type: string = 'text/plain') {
  const blob = new Blob([data], { type })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Copia texto al portapapeles
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}

/**
 * Obtiene la información del dispositivo
 */
export function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screenWidth: screen.width,
    screenHeight: screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  }
}

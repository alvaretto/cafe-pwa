// Utilidades para validación y formateo de clientes

/**
 * Valida todos los campos de un cliente
 */
export function validateCustomer(customer: {
  nombres: string
  apellidos: string
  celular: string
  direccionCasa: string
  email: string
  direccionTrabajo?: string
  birthMonth?: number
  birthDay?: number
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  
  // Validar nombres
  if (!customer.nombres.trim()) {
    errors.nombres = 'Los nombres son requeridos'
  } else if (customer.nombres.trim().length < 2) {
    errors.nombres = 'Los nombres deben tener al menos 2 caracteres'
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(customer.nombres.trim())) {
    errors.nombres = 'Los nombres solo pueden contener letras y espacios'
  }
  
  // Validar apellidos
  if (!customer.apellidos.trim()) {
    errors.apellidos = 'Los apellidos son requeridos'
  } else if (customer.apellidos.trim().length < 2) {
    errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres'
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(customer.apellidos.trim())) {
    errors.apellidos = 'Los apellidos solo pueden contener letras y espacios'
  }
  
  // Validar celular
  if (!customer.celular.trim()) {
    errors.celular = 'El número de celular es requerido'
  } else if (!/^\+57\s(3[0-2][0-9]|35[0-1])\s\d{3}\s\d{4}$/.test(customer.celular)) {
    errors.celular = 'Formato de celular inválido. Use: +57 3XX XXX XXXX'
  }
  
  // Validar dirección casa
  if (!customer.direccionCasa.trim()) {
    errors.direccionCasa = 'La dirección de casa es requerida'
  } else if (customer.direccionCasa.trim().length < 10) {
    errors.direccionCasa = 'La dirección debe tener al menos 10 caracteres'
  }
  
  // Validar email
  if (!customer.email.trim()) {
    errors.email = 'El correo electrónico es requerido'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    errors.email = 'Formato de correo electrónico inválido'
  }
  
  // Validar dirección trabajo (opcional)
  if (customer.direccionTrabajo && customer.direccionTrabajo.trim().length > 0) {
    if (customer.direccionTrabajo.trim().length < 10) {
      errors.direccionTrabajo = 'La dirección de trabajo debe tener al menos 10 caracteres'
    }
  }
  
  // Validar mes de cumpleaños
  if (customer.birthMonth !== undefined && customer.birthMonth !== null) {
    if (!Number.isInteger(customer.birthMonth) || customer.birthMonth < 1 || customer.birthMonth > 12) {
      errors.birthMonth = 'El mes debe estar entre 1 y 12'
    }
  }
  
  // Validar día de cumpleaños
  if (customer.birthDay !== undefined && customer.birthDay !== null) {
    if (!Number.isInteger(customer.birthDay) || customer.birthDay < 1 || customer.birthDay > 31) {
      errors.birthDay = 'El día debe estar entre 1 y 31'
    }
    
    // Validación específica por mes
    if (customer.birthMonth) {
      const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      if (customer.birthDay > daysInMonth[customer.birthMonth - 1]) {
        errors.birthDay = `El mes ${customer.birthMonth} no tiene ${customer.birthDay} días`
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Formatea un nombre completo
 */
export function formatFullName(nombres: string, apellidos: string): string {
  return `${nombres.trim()} ${apellidos.trim()}`
}

/**
 * Formatea un número de celular para mostrar
 */
export function formatCelular(celular: string): string {
  // Si ya está formateado, devolverlo tal como está
  if (celular.includes('+57')) {
    return celular
  }
  
  // Si es solo números, formatear
  const numbers = celular.replace(/\D/g, '')
  if (numbers.length === 10 && numbers.startsWith('3')) {
    return `+57 ${numbers.substring(0, 3)} ${numbers.substring(3, 6)} ${numbers.substring(6)}`
  }
  
  return celular
}

/**
 * Obtiene el nombre del mes en español
 */
export function getMonthName(month: number): string {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return months[month - 1] || ''
}

/**
 * Formatea la fecha de cumpleaños
 */
export function formatBirthday(birthMonth?: number, birthDay?: number): string {
  if (!birthMonth || !birthDay) return ''
  return `${birthDay} de ${getMonthName(birthMonth)}`
}

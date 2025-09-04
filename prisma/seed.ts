import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear usuario administrador
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@tintodel-mirador.com' },
    update: {},
    create: {
      email: 'admin@tintodel-mirador.com',
      name: 'Administrador',
      role: 'ADMIN',
      isActive: true,
      emailVerified: new Date(),
      twoFactorEnabled: false,
      biometricEnabled: false,
    },
  })

  // Crear usuarios vendedores
  const vendedor1 = await prisma.user.upsert({
    where: { email: 'vendedor1@tintodel-mirador.com' },
    update: {},
    create: {
      email: 'vendedor1@tintodel-mirador.com',
      name: 'María González',
      role: 'VENDEDOR',
      isActive: true,
      emailVerified: new Date(),
      twoFactorEnabled: false,
      biometricEnabled: false,
    },
  })

  const vendedor2 = await prisma.user.upsert({
    where: { email: 'vendedor2@tintodel-mirador.com' },
    update: {},
    create: {
      email: 'vendedor2@tintodel-mirador.com',
      name: 'Carlos Rodríguez',
      role: 'VENDEDOR',
      isActive: true,
      emailVerified: new Date(),
      twoFactorEnabled: false,
      biometricEnabled: false,
    },
  })

  const vendedor3 = await prisma.user.upsert({
    where: { email: 'vendedor3@tintodel-mirador.com' },
    update: {},
    create: {
      email: 'vendedor3@tintodel-mirador.com',
      name: 'Ana Martínez',
      role: 'VENDEDOR',
      isActive: true,
      emailVerified: new Date(),
      twoFactorEnabled: false,
      biometricEnabled: false,
    },
  })

  console.log('✅ Usuarios creados:', { adminUser, vendedor1, vendedor2, vendedor3 })

  // Crear categorías de productos
  const categoriaArabica = await prisma.productCategory.upsert({
    where: { name: 'Café Arábica' },
    update: {},
    create: {
      name: 'Café Arábica',
      description: 'Café de alta calidad con sabor suave y aromático',
      isActive: true,
    },
  })

  const categoriaRobusta = await prisma.productCategory.upsert({
    where: { name: 'Café Robusta' },
    update: {},
    create: {
      name: 'Café Robusta',
      description: 'Café con mayor contenido de cafeína y sabor más fuerte',
      isActive: true,
    },
  })

  const categoriaMezclas = await prisma.productCategory.upsert({
    where: { name: 'Mezclas Especiales' },
    update: {},
    create: {
      name: 'Mezclas Especiales',
      description: 'Mezclas únicas de diferentes tipos de café',
      isActive: true,
    },
  })

  console.log('✅ Categorías creadas:', { categoriaArabica, categoriaRobusta, categoriaMezclas })

  // Crear productos
  const productos = [
    {
      name: 'Café Arábica Premium',
      description: 'Café arábica de origen colombiano, tostado medio',
      categoryId: categoriaArabica.id,
      sku: 'ARA001',
      pricePerPound: 25000,
      pricePerHalfPound: 13000,
      pricePerKilo: 55000,
      pricePerGram: 55,
      cost: 15000,
      margin: 66.67,
    },
    {
      name: 'Café Robusta Intenso',
      description: 'Café robusta con sabor intenso y mayor cafeína',
      categoryId: categoriaRobusta.id,
      sku: 'ROB001',
      pricePerPound: 20000,
      pricePerHalfPound: 10500,
      pricePerKilo: 44000,
      pricePerGram: 44,
      cost: 12000,
      margin: 66.67,
    },
    {
      name: 'Mezcla del Mirador',
      description: 'Mezcla especial de la casa con notas frutales',
      categoryId: categoriaMezclas.id,
      sku: 'MIR001',
      pricePerPound: 30000,
      pricePerHalfPound: 15500,
      pricePerKilo: 66000,
      pricePerGram: 66,
      cost: 18000,
      margin: 66.67,
    },
    {
      name: 'Café Orgánico',
      description: 'Café orgánico certificado, cultivado sin químicos',
      categoryId: categoriaArabica.id,
      sku: 'ORG001',
      pricePerPound: 35000,
      pricePerHalfPound: 18000,
      pricePerKilo: 77000,
      pricePerGram: 77,
      cost: 22000,
      margin: 59.09,
    },
  ]

  for (const producto of productos) {
    await prisma.product.upsert({
      where: { sku: producto.sku },
      update: {},
      create: producto,
    })
  }

  console.log('✅ Productos creados')

  // Crear categorías de gastos
  const categoriasGastos = [
    { name: 'Operativos', description: 'Gastos operativos del negocio', budget: 500000 },
    { name: 'Marketing', description: 'Gastos de marketing y publicidad', budget: 200000 },
    { name: 'Inventario', description: 'Compra de productos y materias primas', budget: 1000000 },
    { name: 'Personal', description: 'Salarios y beneficios del personal', budget: 800000 },
    { name: 'Otros', description: 'Otros gastos diversos', budget: 100000 },
  ]

  for (const categoria of categoriasGastos) {
    await prisma.expenseCategory.upsert({
      where: { name: categoria.name },
      update: {},
      create: categoria,
    })
  }

  console.log('✅ Categorías de gastos creadas')

  // Crear algunos clientes de ejemplo
  const clientes = [
    {
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan.perez@email.com',
      phone: '3001234567',
      homeAddress: 'Calle 123 #45-67, Bogotá',
      birthMonth: 3,
      birthDay: 15,
      coffeePreferences: 'Café fuerte, sin azúcar',
      segment: 'FRECUENTE',
      loyaltyPoints: 150,
      totalSpent: 125000,
    },
    {
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@email.com',
      phone: '3009876543',
      homeAddress: 'Carrera 45 #12-34, Medellín',
      birthMonth: 7,
      birthDay: 22,
      coffeePreferences: 'Café suave con leche',
      segment: 'VIP',
      loyaltyPoints: 300,
      totalSpent: 250000,
    },
    {
      firstName: 'Carlos',
      lastName: 'López',
      email: 'carlos.lopez@email.com',
      phone: '3005555555',
      homeAddress: 'Avenida 80 #25-50, Cali',
      birthMonth: 12,
      birthDay: 5,
      coffeePreferences: 'Café orgánico',
      segment: 'OCASIONAL',
      loyaltyPoints: 50,
      totalSpent: 75000,
    },
  ]

  for (const cliente of clientes) {
    await prisma.customer.upsert({
      where: { email: cliente.email },
      update: {},
      create: cliente,
    })
  }

  console.log('✅ Clientes creados')

  // Crear configuraciones del sistema
  const configuraciones = [
    { key: 'app_name', value: 'Tinto del Mirador CRM', description: 'Nombre de la aplicación', category: 'general', isPublic: true },
    { key: 'app_version', value: '1.0.0', description: 'Versión de la aplicación', category: 'general', isPublic: true },
    { key: 'default_currency', value: 'COP', description: 'Moneda por defecto', category: 'general', isPublic: true },
    { key: 'default_locale', value: 'es-CO', description: 'Idioma por defecto', category: 'general', isPublic: true },
    { key: 'loyalty_points_rate', value: '1', description: 'Puntos por cada 1000 COP gastados', category: 'loyalty', isPublic: false },
    { key: 'low_stock_threshold', value: '100', description: 'Umbral de stock bajo (gramos)', category: 'inventory', isPublic: false },
    { key: 'backup_frequency', value: 'daily', description: 'Frecuencia de backup', category: 'system', isPublic: false },
    { key: 'notification_email', value: 'admin@tintodel-mirador.com', description: 'Email para notificaciones del sistema', category: 'notifications', isPublic: false },
  ]

  for (const config of configuraciones) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    })
  }

  console.log('✅ Configuraciones del sistema creadas')

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en el seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

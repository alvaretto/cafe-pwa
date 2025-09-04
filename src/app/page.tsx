import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Tinto del Mirador CRM',
  description: 'CRM integral para emprendimiento de venta de café por libras, medias libras y gramos',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">☕</span>
            </div>
            <span className="text-2xl font-bold text-amber-800">Tinto del Mirador</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/compras"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Ir a Compras
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-5xl font-bold text-amber-900 md:text-6xl">
            El CRM perfecto para tu
            <span className="text-blue-600"> negocio de café</span>
          </h1>
          <p className="mb-8 text-xl text-amber-700 md:text-2xl">
            Gestiona ventas, clientes, inventario y más con inteligencia artificial.
            Optimiza tu emprendimiento cafetero con herramientas profesionales.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/compras"
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Módulo de Compras
            </Link>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Ventas</h3>
            <p className="text-gray-600">
              Control completo de ventas por libras, medias libras y gramos con seguimiento en tiempo real.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Control de Inventario</h3>
            <p className="text-gray-600">
              Monitoreo inteligente de stock con alertas automáticas y predicción de demanda.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestión de Clientes</h3>
            <p className="text-gray-600">
              Base de datos completa de clientes con historial de compras y preferencias.
            </p>
          </div>
        </div>
      </section>

      {/* Status */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-green-800 font-semibold text-lg mb-2">✅ Sistema Funcionando</h3>
          <p className="text-green-700">
            La aplicación CRM Tinto del Mirador está funcionando correctamente en el puerto 3002.
          </p>
          <div className="mt-4">
            <Link
              href="/compras"
              className="text-green-800 hover:text-green-900 font-medium underline"
            >
              → Acceder al Módulo de Compras
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 Tinto del Mirador CRM. Desarrollado con Next.js y TypeScript.</p>
      </footer>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Coffee, BarChart3, Users, Package, Shield, Smartphone, Zap, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthModalSimple } from '@/components/auth/auth-modal-simple'

export function LandingPageSimple() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  const handleGetStarted = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const handleSignIn = () => {
    setAuthMode('signin')
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-amber-800">Tinto del Mirador</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleSignIn}>
              Iniciar Sesión
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700" onClick={handleGetStarted}>
              Comenzar Gratis
            </Button>
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
            Diseñado especialmente para emprendimientos cafeteros.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 px-8 py-3 text-lg" onClick={handleGetStarted}>
              Comenzar Gratis
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
              Ver Demo
            </Button>
          </div>
          <p className="mt-4 text-sm text-amber-600">
            ✨ Sin tarjeta de crédito • 🚀 Configuración en 5 minutos • 📱 PWA incluida
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-amber-900">
              Todo lo que necesitas para hacer crecer tu negocio
            </h2>
            <p className="text-xl text-amber-700">
              Funcionalidades diseñadas específicamente para la venta de café
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
              <BarChart3 className="mx-auto mb-4 h-12 w-12 text-amber-600" />
              <h3 className="mb-2 text-xl font-semibold text-amber-900">Dashboard Inteligente</h3>
              <p className="text-amber-700">
                Métricas en tiempo real, análisis predictivo con IA y reportes automáticos
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold text-amber-900">Gestión de Clientes</h3>
              <p className="text-amber-700">
                Base de datos completa, segmentación automática y programa de fidelización
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-amber-600" />
              <h3 className="mb-2 text-xl font-semibold text-amber-900">Control de Inventario</h3>
              <p className="text-amber-700">
                Alertas automáticas, predicción de demanda y gestión por gramos, libras y kilos
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
              <Smartphone className="mx-auto mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold text-amber-900">PWA Móvil</h3>
              <p className="text-amber-700">
                Funciona offline, notificaciones push y experiencia nativa en móviles
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
              <Zap className="mx-auto mb-4 h-12 w-12 text-amber-600" />
              <h3 className="mb-2 text-xl font-semibold text-amber-900">IA Integrada</h3>
              <p className="text-amber-700">
                Sugerencias inteligentes, optimización de precios y automatización de marketing
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
              <Shield className="mx-auto mb-4 h-12 w-12 text-blue-600" />
              <h3 className="mb-2 text-xl font-semibold text-amber-900">Seguridad Avanzada</h3>
              <p className="text-amber-700">
                Autenticación 2FA, cifrado end-to-end y backups automáticos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-amber-600 to-blue-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div>
              <div className="mb-2 text-4xl font-bold">500+</div>
              <div className="text-amber-100">Emprendimientos Activos</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold">98%</div>
              <div className="text-amber-100">Satisfacción del Cliente</div>
            </div>
            <div>
              <div className="mb-2 text-4xl font-bold">24/7</div>
              <div className="text-amber-100">Soporte Disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-amber-900">
                Diseñado para emprendedores cafeteros
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <TrendingUp className="mt-1 h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-amber-900">
                      Aumenta tus ventas hasta 40%
                    </h3>
                    <p className="text-amber-700">
                      Con análisis predictivo y sugerencias inteligentes de productos
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="mt-1 h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-amber-900">
                      Fideliza a tus clientes
                    </h3>
                    <p className="text-amber-700">
                      Sistema de puntos, recordatorios de cumpleaños y ofertas personalizadas
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Package className="mt-1 h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-amber-900">
                      Nunca te quedes sin stock
                    </h3>
                    <p className="text-amber-700">
                      Alertas automáticas y predicción de demanda basada en IA
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-lg bg-gradient-to-br from-amber-100 to-blue-100 p-8">
                <Coffee className="mx-auto h-32 w-32 text-amber-600" />
                <p className="mt-4 text-center text-amber-800">
                  "Desde que uso Tinto del Mirador, mis ventas han crecido un 35% y tengo mejor control de mi inventario"
                </p>
                <p className="mt-2 text-center text-sm text-amber-600">
                  - María González, Café del Valle
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-600 to-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            ¿Listo para hacer crecer tu negocio de café?
          </h2>
          <p className="mb-8 text-xl">
            Únete a cientos de emprendedores que ya confían en Tinto del Mirador
          </p>
          <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 text-lg" onClick={handleGetStarted}>
            Comenzar Gratis Ahora
          </Button>
          <p className="mt-4 text-amber-100">
            Prueba gratuita de 30 días • Sin compromiso • Soporte incluido
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <Coffee className="h-6 w-6" />
                <span className="text-lg font-semibold">Tinto del Mirador</span>
              </div>
              <p className="text-amber-300">
                El CRM integral para emprendimientos cafeteros
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Producto</h3>
              <ul className="space-y-2 text-amber-300">
                <li>Características</li>
                <li>Precios</li>
                <li>Demo</li>
                <li>Actualizaciones</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Soporte</h3>
              <ul className="space-y-2 text-amber-300">
                <li>Documentación</li>
                <li>Tutoriales</li>
                <li>Contacto</li>
                <li>Estado del Sistema</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Empresa</h3>
              <ul className="space-y-2 text-amber-300">
                <li>Acerca de</li>
                <li>Blog</li>
                <li>Privacidad</li>
                <li>Términos</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-amber-800 pt-8 text-center text-amber-300">
            <p>&copy; 2024 Tinto del Mirador. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModalSimple
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  )
}

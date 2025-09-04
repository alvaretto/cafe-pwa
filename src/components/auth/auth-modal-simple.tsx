'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Coffee, Eye, EyeOff, Loader2, Info } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'signin' | 'signup'
  onModeChange: (mode: 'signin' | 'signup') => void
}

export function AuthModalSimple({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })
  const router = useRouter()

  // Credenciales de demo
  const demoCredentials = {
    admin: { email: 'admin@tintodel-mirador.com', password: 'admin123' },
    vendedor: { email: 'vendedor@tintodel-mirador.com', password: 'vendedor123' }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (mode === 'signup') {
        setError('El registro no está disponible en la demo. Use las credenciales de prueba.')
        return
      } else {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Credenciales incorrectas. Use las credenciales de demo.')
          return
        }

        if (result?.ok) {
          onClose()
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('Ocurrió un error. Por favor intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const fillDemoCredentials = (type: 'admin' | 'vendedor') => {
    const credentials = demoCredentials[type]
    setFormData(prev => ({
      ...prev,
      email: credentials.email,
      password: credentials.password,
    }))
    setError('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Coffee className="h-8 w-8 text-amber-600 mr-2" />
            <span className="text-xl font-bold text-amber-800">Tinto del Mirador</span>
          </div>
          <DialogTitle className="text-center">
            {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </DialogTitle>
        </DialogHeader>

        {/* Credenciales de demo */}
        {mode === 'signin' && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center mb-2">
              <Info className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Credenciales de Demo</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Admin:</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-100"
                  onClick={() => fillDemoCredentials('admin')}
                >
                  Usar credenciales
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Vendedor:</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-100"
                  onClick={() => fillDemoCredentials('vendedor')}
                >
                  Usar credenciales
                </Button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Tu nombre completo"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirma tu contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Button>

          {mode === 'signin' && (
            <Button type="button" variant="ghost" className="w-full text-sm">
              ¿Olvidaste tu contraseña?
            </Button>
          )}

          <div className="text-center text-sm">
            {mode === 'signin' ? (
              <>
                ¿No tienes cuenta?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-semibold text-amber-600"
                  onClick={() => onModeChange('signup')}
                >
                  Regístrate aquí
                </Button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-semibold text-amber-600"
                  onClick={() => onModeChange('signin')}
                >
                  Inicia sesión
                </Button>
              </>
            )}
          </div>
        </form>

        {mode === 'signup' && (
          <div className="text-xs text-center text-muted-foreground">
            Al crear una cuenta, aceptas nuestros{' '}
            <a href="#" className="underline hover:text-primary">
              Términos de Servicio
            </a>{' '}
            y{' '}
            <a href="#" className="underline hover:text-primary">
              Política de Privacidad
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

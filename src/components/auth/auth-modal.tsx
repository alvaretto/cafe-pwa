'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Coffee, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'signin' | 'signup'
  onModeChange: (mode: 'signin' | 'signup') => void
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: 'Error',
            description: 'Las contraseñas no coinciden',
            variant: 'destructive',
          })
          return
        }
        
        // TODO: Implementar registro
        toast({
          title: 'Cuenta creada',
          description: 'Tu cuenta ha sido creada exitosamente. Revisa tu email para verificar tu cuenta.',
          variant: 'success',
        })
      } else {
        // TODO: Implementar inicio de sesión
        toast({
          title: 'Bienvenido',
          description: 'Has iniciado sesión exitosamente',
          variant: 'success',
        })
      }
      
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Ocurrió un error. Por favor intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Coffee className="h-8 w-8 text-coffee-600 mr-2" />
            <span className="text-xl font-bold text-coffee-800">Tinto del Mirador</span>
          </div>
          <DialogTitle className="text-center">
            {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </DialogTitle>
        </DialogHeader>

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

          <Button type="submit" className="w-full" variant="coffee" disabled={isLoading}>
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
                  className="p-0 h-auto font-semibold text-coffee-600"
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
                  className="p-0 h-auto font-semibold text-coffee-600"
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

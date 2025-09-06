'use client'

import { useState } from 'react'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import {
  RefreshCw,
  Settings,
  User as UserIcon,
  LogOut,
  Bell,
  Search,
  Coffee,
  Menu,
  Home,
  ShoppingCart,
  Users,
  Package,
  DollarSign,
  BarChart3,
  MessageCircle
} from 'lucide-react'
import { signOut } from '@/lib/auth-simple'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  user: User | null | undefined
  onRefresh: () => void
  isLoading: boolean
}

export function DashboardHeaderSimple({ user, onRefresh, isLoading }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push('/')
  }

  // Si no hay usuario, mostrar un header simplificado
  if (!user) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-amber-600" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-amber-800">Tinto del Mirador</h1>
                <p className="text-xs text-gray-600">Cargando...</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="animate-pulse h-10 w-10 rounded-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const getUserInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y navegación */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Coffee className="h-8 w-8 text-amber-600" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-amber-800">Tinto del Mirador</h1>
                <p className="text-xs text-gray-600">Dashboard</p>
              </div>
            </div>
            
            {/* Navegación */}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/productos')}
                className="flex items-center space-x-2"
              >
                <Coffee className="h-4 w-4" />
                <span>Productos</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/ventas')}
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Ventas</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/clientes')}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Clientes</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/inventario')}
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>Inventario</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/compras')}
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Compras</span>
              </Button>
              {user?.role === 'ADMIN' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/gastos')}
                  className="flex items-center space-x-2"
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Gastos</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/chat')}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat IA</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/reportes')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Reportes</span>
              </Button>
              {user?.role === 'ADMIN' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/configuracion')}
                  className="flex items-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Config</span>
                </Button>
              )}
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar clientes, productos, ventas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center space-x-2">
            {/* Botón de actualizar */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="relative"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            {/* Notificaciones */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Menú de usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                    <AvatarFallback className="bg-amber-100 text-amber-800">
                      {getUserInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getGreeting()}, {user?.name || 'Usuario'}
                    </p>
                    <p className="text-xs leading-none text-gray-600">
                      {user?.email || 'Sin email'}
                    </p>
                    <p className="text-xs leading-none text-gray-600">
                      Rol: {user?.role === 'ADMIN' ? 'Administrador' : 'Vendedor'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Información adicional */}
        <div className="hidden sm:flex items-center justify-between py-2 text-xs text-gray-600 border-t">
          <div className="flex items-center space-x-4">
            <span>Hoy: {formatDate(new Date())}</span>
            {user?.lastLogin && (
              <span>Último acceso: {user.lastLogin.toLocaleString('es-CO')}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Sistema operativo</span>
          </div>
        </div>
      </div>
    </header>
  )
}

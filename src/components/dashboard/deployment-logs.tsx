/**
 * Visualizador de logs para deployment con estilo terminal
 * CRM Tinto del Mirador
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Copy, 
  Download, 
  Search, 
  Filter, 
  Maximize2, 
  Minimize2,
  Terminal,
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface DeploymentLogsProps {
  logs: string[]
  maxHeight?: string
  showControls?: boolean
  autoScroll?: boolean
  className?: string
}

/**
 * Tipos de log basados en el contenido
 */
type LogLevel = 'info' | 'warning' | 'error' | 'success'

interface ParsedLog {
  timestamp: string
  level: LogLevel
  message: string
  raw: string
}

/**
 * Parsea un log para extraer información
 */
function parseLog(log: string): ParsedLog {
  // Extraer timestamp si existe
  const timestampMatch = log.match(/^\[([^\]]+)\]/)
  const timestamp = timestampMatch ? timestampMatch[1] : new Date().toISOString()
  
  // Determinar nivel basado en contenido
  let level: LogLevel = 'info'
  const upperLog = log.toUpperCase()
  
  if (upperLog.includes('ERROR') || upperLog.includes('FAILED') || upperLog.includes('✗')) {
    level = 'error'
  } else if (upperLog.includes('WARNING') || upperLog.includes('WARN') || upperLog.includes('⚠️')) {
    level = 'warning'
  } else if (upperLog.includes('SUCCESS') || upperLog.includes('COMPLETED') || upperLog.includes('✓') || upperLog.includes('✅')) {
    level = 'success'
  }
  
  // Extraer mensaje limpio
  const message = log.replace(/^\[[^\]]+\]\s*(INFO|WARNING|ERROR|SUCCESS):\s*/, '').trim()
  
  return {
    timestamp,
    level,
    message: message || log,
    raw: log
  }
}

/**
 * Obtiene el icono para un nivel de log
 */
function getLogIcon(level: LogLevel) {
  switch (level) {
    case 'error':
      return <AlertCircle className="h-3 w-3 text-red-500" />
    case 'warning':
      return <AlertCircle className="h-3 w-3 text-yellow-500" />
    case 'success':
      return <CheckCircle className="h-3 w-3 text-green-500" />
    default:
      return <Info className="h-3 w-3 text-blue-500" />
  }
}

/**
 * Obtiene los estilos para un nivel de log
 */
function getLogStyles(level: LogLevel) {
  switch (level) {
    case 'error':
      return 'text-red-400 bg-red-950/20 border-l-red-500'
    case 'warning':
      return 'text-yellow-400 bg-yellow-950/20 border-l-yellow-500'
    case 'success':
      return 'text-green-400 bg-green-950/20 border-l-green-500'
    default:
      return 'text-gray-300 bg-gray-950/20 border-l-gray-500'
  }
}

export function DeploymentLogs({ 
  logs, 
  maxHeight = '400px', 
  showControls = true,
  autoScroll = true,
  className 
}: DeploymentLogsProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<LogLevel | 'all'>('all')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(autoScroll)

  // Parsear logs
  const parsedLogs = logs.map(parseLog)

  // Filtrar logs
  const filteredLogs = parsedLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.timestamp.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterLevel === 'all' || log.level === filterLevel
    
    return matchesSearch && matchesFilter
  })

  // Auto-scroll cuando se agregan nuevos logs
  useEffect(() => {
    if (isAutoScrollEnabled && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [logs, isAutoScrollEnabled])

  /**
   * Copia todos los logs al portapapeles
   */
  const copyLogs = async () => {
    try {
      const logsText = filteredLogs.map(log => log.raw).join('\n')
      await navigator.clipboard.writeText(logsText)
    } catch (error) {
      console.error('Error copying logs:', error)
    }
  }

  /**
   * Descarga los logs como archivo
   */
  const downloadLogs = () => {
    const logsText = filteredLogs.map(log => log.raw).join('\n')
    const blob = new Blob([logsText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deployment-logs-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Obtiene estadísticas de logs
   */
  const getLogStats = () => {
    const stats = {
      total: parsedLogs.length,
      info: parsedLogs.filter(l => l.level === 'info').length,
      warning: parsedLogs.filter(l => l.level === 'warning').length,
      error: parsedLogs.filter(l => l.level === 'error').length,
      success: parsedLogs.filter(l => l.level === 'success').length
    }
    return stats
  }

  const stats = getLogStats()

  return (
    <div className={cn("border rounded-lg bg-gray-950", className)}>
      {/* Header con controles */}
      {showControls && (
        <div className="flex items-center justify-between p-3 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-gray-300">
              Deployment Logs
            </span>
            
            {/* Estadísticas */}
            <div className="flex items-center space-x-1 ml-4">
              {stats.error > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {stats.error} errores
                </Badge>
              )}
              {stats.warning > 0 && (
                <Badge variant="outline" className="text-xs text-yellow-500 border-yellow-500">
                  {stats.warning} advertencias
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {stats.total} líneas
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="h-3 w-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-7 w-32 text-xs bg-gray-900 border-gray-700"
              />
            </div>

            {/* Filtro por nivel */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as LogLevel | 'all')}
              className="h-7 text-xs bg-gray-900 border border-gray-700 rounded px-2 text-gray-300"
            >
              <option value="all">Todos</option>
              <option value="info">Info</option>
              <option value="success">Éxito</option>
              <option value="warning">Advertencias</option>
              <option value="error">Errores</option>
            </select>

            {/* Auto-scroll toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoScrollEnabled(!isAutoScrollEnabled)}
              className={cn(
                "h-7 px-2 text-xs",
                isAutoScrollEnabled ? "text-green-400" : "text-gray-500"
              )}
            >
              Auto-scroll
            </Button>

            {/* Copiar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={copyLogs}
              className="h-7 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>

            {/* Descargar */}
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadLogs}
              className="h-7 px-2"
            >
              <Download className="h-3 w-3" />
            </Button>

            {/* Expandir/Contraer */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 px-2"
            >
              {isExpanded ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Área de logs */}
      <ScrollArea 
        ref={scrollAreaRef}
        className="w-full"
        style={{ height: isExpanded ? '600px' : maxHeight }}
      >
        <div className="p-3 space-y-1 font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center space-y-2">
                  <Terminal className="h-8 w-8 text-gray-600" />
                  <p>No hay logs disponibles</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <Filter className="h-8 w-8 text-gray-600" />
                  <p>No se encontraron logs que coincidan con los filtros</p>
                </div>
              )}
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start space-x-2 p-2 rounded border-l-2 transition-colors hover:bg-gray-900/50",
                  getLogStyles(log.level)
                )}
              >
                {/* Icono de nivel */}
                <div className="flex-shrink-0 mt-0.5">
                  {getLogIcon(log.level)}
                </div>

                {/* Timestamp */}
                <div className="flex-shrink-0 text-gray-500 w-20">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>

                {/* Mensaje */}
                <div className="flex-1 break-all">
                  {log.message}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer con información adicional */}
      {showControls && filteredLogs.length > 0 && (
        <div className="flex items-center justify-between p-2 border-t border-gray-800 text-xs text-gray-500">
          <div>
            Mostrando {filteredLogs.length} de {parsedLogs.length} líneas
          </div>
          
          {searchTerm && (
            <div>
              Filtrado por: "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Versión simplificada para uso en espacios pequeños
 */
export function DeploymentLogsCompact({ logs, className }: { logs: string[], className?: string }) {
  const lastLogs = logs.slice(-5) // Mostrar solo los últimos 5 logs
  
  return (
    <div className={cn("bg-gray-950 rounded border p-2 font-mono text-xs", className)}>
      {lastLogs.length === 0 ? (
        <div className="text-gray-500 text-center py-2">
          No hay logs disponibles
        </div>
      ) : (
        <div className="space-y-1">
          {lastLogs.map((log, index) => {
            const parsed = parseLog(log)
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center space-x-2 text-xs",
                  parsed.level === 'error' ? 'text-red-400' :
                  parsed.level === 'warning' ? 'text-yellow-400' :
                  parsed.level === 'success' ? 'text-green-400' :
                  'text-gray-300'
                )}
              >
                <div className="flex-shrink-0">
                  {getLogIcon(parsed.level)}
                </div>
                <div className="truncate">
                  {parsed.message}
                </div>
              </div>
            )
          })}
          
          {logs.length > 5 && (
            <div className="text-gray-500 text-center pt-1 border-t border-gray-800">
              ... y {logs.length - 5} líneas más
            </div>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Settings, 
  Database,
  Download,
  Upload,
  Calendar,
  RefreshCw,
  Trash2,
  FileArchive,
  Cloud,
  CheckCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Package
} from 'lucide-react'

interface BackupSettingsProps {
  isLoading: boolean
}

export function BackupSettings({ isLoading }: BackupSettingsProps) {
  const [backupConfig, setBackupConfig] = useState({
    autoBackup: true,
    frequency: 'daily',
    retentionDays: 30,
    storageLocation: 'local',
    includeImages: true,
    includeReports: true,
    compression: true,
  })

  const [backupHistory, setBackupHistory] = useState([
    {
      id: '1',
      date: new Date('2024-01-25T02:00:00'),
      type: 'automatic',
      status: 'completed',
      size: '45.2 MB',
      duration: '2m 15s',
      location: 'local'
    },
    {
      id: '2',
      date: new Date('2024-01-24T02:00:00'),
      type: 'automatic',
      status: 'completed',
      size: '44.8 MB',
      duration: '2m 08s',
      location: 'local'
    },
    {
      id: '3',
      date: new Date('2024-01-23T14:30:00'),
      type: 'manual',
      status: 'completed',
      size: '44.5 MB',
      duration: '1m 52s',
      location: 'local'
    },
    {
      id: '4',
      date: new Date('2024-01-23T02:00:00'),
      type: 'automatic',
      status: 'failed',
      size: '0 MB',
      duration: '0s',
      location: 'local',
      error: 'Espacio insuficiente en disco'
    },
    {
      id: '5',
      date: new Date('2024-01-22T02:00:00'),
      type: 'automatic',
      status: 'completed',
      size: '43.9 MB',
      duration: '2m 22s',
      location: 'local'
    }
  ])

  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [isRestoringBackup, setIsRestoringBackup] = useState(false)

  const handleCreateManualBackup = async () => {
    setIsCreatingBackup(true)
    try {
      // Simular creación de backup
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newBackup = {
        id: Date.now().toString(),
        date: new Date(),
        type: 'manual' as const,
        status: 'completed' as const,
        size: '45.7 MB',
        duration: '2m 05s',
        location: 'local' as const
      }
      
      setBackupHistory(prev => [newBackup, ...prev])
    } catch (error) {
      console.error('Error creating backup:', error)
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleRestoreBackup = async (backupId: string) => {
    if (!confirm('¿Estás seguro de que quieres restaurar este backup? Se perderán todos los cambios actuales.')) {
      return
    }

    setIsRestoringBackup(true)
    try {
      // Simular restauración
      await new Promise(resolve => setTimeout(resolve, 5000))
      alert('Backup restaurado exitosamente. La aplicación se reiniciará.')
    } catch (error) {
      console.error('Error restoring backup:', error)
      alert('Error al restaurar el backup. Inténtalo de nuevo.')
    } finally {
      setIsRestoringBackup(false)
    }
  }

  const handleDeleteBackup = (backupId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este backup?')) {
      setBackupHistory(prev => prev.filter(backup => backup.id !== backupId))
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { label: 'Completado', className: 'bg-green-100 text-green-800' },
      failed: { label: 'Fallido', className: 'bg-red-100 text-red-800' },
      running: { label: 'En progreso', className: 'bg-blue-100 text-blue-800' },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.completed
    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      automatic: { label: 'Automático', className: 'bg-blue-100 text-blue-800' },
      manual: { label: 'Manual', className: 'bg-purple-100 text-purple-800' },
    }
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.manual
    return (
      <Badge variant="secondary" className={config.className}>
        {config.label}
      </Badge>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getNextBackupTime = () => {
    if (!backupConfig.autoBackup) return 'Deshabilitado'
    
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(2, 0, 0, 0)
    
    return formatDate(tomorrow)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Estado actual y acciones rápidas */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Estado de BackUps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium text-green-900">Último BackUp</h4>
                    <p className="text-sm text-green-700">
                      {backupHistory[0] ? formatDate(backupHistory[0].date) : 'Nunca'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {backupHistory[0]?.size || '0 MB'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">Próximo BackUp</h4>
                    <p className="text-sm text-blue-700">
                      {getNextBackupTime()}
                    </p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  {backupConfig.frequency === 'daily' ? 'Diario' : 
                   backupConfig.frequency === 'weekly' ? 'Semanal' : 'Mensual'}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleCreateManualBackup}
                disabled={isCreatingBackup}
                className="w-full bg-amber-600 hover:bg-amber-700"
                size="lg"
              >
                {isCreatingBackup ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Creando BackUp...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Crear BackUp Manual
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Cloud className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de BackUps Automáticos */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configuración de BackUps Automáticos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium">BackUps Automáticos</h4>
                <p className="text-sm text-gray-600">Crear backups automáticamente según la programación</p>
              </div>
            </div>
            <Switch
              checked={backupConfig.autoBackup}
              onCheckedChange={(checked) =>
                setBackupConfig(prev => ({ ...prev, autoBackup: checked }))
              }
            />
          </div>

          {backupConfig.autoBackup && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia</Label>
                <Select
                  value={backupConfig.frequency}
                  onValueChange={(value) =>
                    setBackupConfig(prev => ({ ...prev, frequency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diario (2:00 AM)</SelectItem>
                    <SelectItem value="weekly">Semanal (Domingo 2:00 AM)</SelectItem>
                    <SelectItem value="monthly">Mensual (Día 1, 2:00 AM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="retention">Retención (días)</Label>
                <Select
                  value={backupConfig.retentionDays.toString()}
                  onValueChange={(value) =>
                    setBackupConfig(prev => ({ ...prev, retentionDays: parseInt(value) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 días</SelectItem>
                    <SelectItem value="15">15 días</SelectItem>
                    <SelectItem value="30">30 días</SelectItem>
                    <SelectItem value="60">60 días</SelectItem>
                    <SelectItem value="90">90 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage">Ubicación de Almacenamiento</Label>
                <Select
                  value={backupConfig.storageLocation}
                  onValueChange={(value) =>
                    setBackupConfig(prev => ({ ...prev, storageLocation: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Almacenamiento Local</SelectItem>
                    <SelectItem value="cloud">Nube (Google Drive)</SelectItem>
                    <SelectItem value="ftp">Servidor FTP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Contenido del BackUp</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileArchive className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Incluir imágenes</span>
                    </div>
                    <Switch
                      checked={backupConfig.includeImages}
                      onCheckedChange={(checked) =>
                        setBackupConfig(prev => ({ ...prev, includeImages: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Incluir reportes</span>
                    </div>
                    <Switch
                      checked={backupConfig.includeReports}
                      onCheckedChange={(checked) =>
                        setBackupConfig(prev => ({ ...prev, includeReports: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Compresión</span>
                    </div>
                    <Switch
                      checked={backupConfig.compression}
                      onCheckedChange={(checked) =>
                        setBackupConfig(prev => ({ ...prev, compression: checked }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de BackUps */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Historial de BackUps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backupHistory.length > 0 ? (
              backupHistory.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Database className="h-4 w-4 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          BackUp {formatDate(backup.date)}
                        </h4>
                        {getTypeBadge(backup.type)}
                        {getStatusBadge(backup.status)}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Tamaño: {backup.size}</span>
                        <span>•</span>
                        <span>Duración: {backup.duration}</span>
                        <span>•</span>
                        <span>Ubicación: {backup.location === 'local' ? 'Local' : 'Nube'}</span>
                      </div>

                      {backup.error && (
                        <div className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {backup.error}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {backup.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreBackup(backup.id)}
                        disabled={isRestoringBackup}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Restaurar
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Database className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No hay backups disponibles</p>
                <p className="text-sm">Crea tu primer backup manual para comenzar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-900 mb-2">Información Importante sobre BackUps</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Los backups incluyen todos los datos del sistema: ventas, clientes, productos, inventario y configuración</li>
                <li>• Los backups automáticos se ejecutan durante las horas de menor actividad (2:00 AM)</li>
                <li>• Se recomienda mantener al menos 30 días de retención para recuperación de datos</li>
                <li>• Los backups con compresión ocupan aproximadamente 60% menos espacio</li>
                <li>• Antes de restaurar un backup, se creará automáticamente un backup del estado actual</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

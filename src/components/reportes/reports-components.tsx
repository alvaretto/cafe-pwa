'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  FileText, 
  Plus, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Download,
  Play,
  Pause,
  Eye,
  Trash2,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Target,
  Users,
  DollarSign,
  Package,
  Activity
} from 'lucide-react'
import { ReportTemplate, ReportData } from '@/lib/mock-data'

// Header de reportes
interface ReportsHeaderProps {
  stats: any
}

export function ReportsHeader({ stats }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-amber-900">Sistema de Reportes</h1>
        <p className="text-amber-700 mt-1">
          Inteligencia de negocio con análisis avanzado, gráficos interactivos y exportación múltiple
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {stats.active} Activos
        </Badge>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          {stats.scheduled} Programados
        </Badge>
      </div>
    </div>
  )
}

// Estadísticas de reportes
interface ReportsStatsProps {
  stats: any
  reportsCount: number
  isLoading: boolean
}

export function ReportsStats({ stats, reportsCount, isLoading }: ReportsStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Plantillas Totales',
      value: stats.total.toString(),
      subtitle: `${stats.active} activas`,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Reportes Generados',
      value: reportsCount.toString(),
      subtitle: 'este mes',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Programados',
      value: stats.scheduled.toString(),
      subtitle: 'ejecución automática',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Categorías',
      value: Object.keys(stats.byCategory).length.toString(),
      subtitle: 'tipos de análisis',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        
        return (
          <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1 text-gray-900">
                {card.value}
              </div>
              <p className="text-xs text-gray-600">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Tabs de navegación
interface ReportsTabsProps {
  activeTab: string
  onTabChange: (tab: 'overview' | 'templates' | 'generator' | 'history' | 'analytics') => void
  templatesCount: number
  reportsCount: number
}

export function ReportsTabs({ activeTab, onTabChange, templatesCount, reportsCount }: ReportsTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'templates', label: 'Plantillas', icon: FileText, badge: templatesCount },
    { id: 'generator', label: 'Generar', icon: Plus },
    { id: 'history', label: 'Historial', icon: Clock, badge: reportsCount },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  ]

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-wrap border-b">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => onTabChange(tab.id as any)}
                className={`flex-1 min-w-0 rounded-none border-b-2 transition-colors ${
                  isActive 
                    ? 'border-amber-600 bg-amber-50 text-amber-700' 
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="truncate">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <Badge 
                    variant={isActive ? "default" : "secondary"} 
                    className="ml-2 text-xs"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Resumen de reportes
interface ReportsOverviewProps {
  templates: ReportTemplate[]
  recentReports: ReportData[]
  stats: any
  isLoading: boolean
  onGenerateReport: (templateId: string, startDate: Date, endDate: Date) => Promise<ReportData>
}

export function ReportsOverview({ templates, recentReports, stats, isLoading, onGenerateReport }: ReportsOverviewProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleQuickGenerate = async (templateId: string) => {
    const today = new Date()
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    await onGenerateReport(templateId, startOfMonth, today)
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'diario': return 'bg-green-100 text-green-800'
      case 'semanal': return 'bg-blue-100 text-blue-800'
      case 'mensual': return 'bg-purple-100 text-purple-800'
      case 'trimestral': return 'bg-orange-100 text-orange-800'
      case 'anual': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ejecutivo': return Target
      case 'operacional': return Activity
      case 'financiero': return DollarSign
      case 'marketing': return Users
      default: return FileText
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Plantillas populares */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Plantillas Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.slice(0, 4).map((template) => {
              const CategoryIcon = getCategoryIcon(template.category)
              
              return (
                <div key={template.id} className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-amber-100 rounded-full">
                    <CategoryIcon className="h-4 w-4 text-amber-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{template.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{template.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className={getFrequencyColor(template.frequency)}>
                        {template.frequency}
                      </Badge>
                      {template.isScheduled && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Programado
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickGenerate(template.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Generar
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reportes recientes */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Reportes Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No hay reportes generados</p>
                <p className="text-sm">Genera tu primer reporte usando las plantillas</p>
              </div>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{report.templateName}</h4>
                    <p className="text-sm text-gray-600">{report.period.label}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {report.status === 'completed' ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                      ) : report.status === 'generating' ? (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Generando...
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {report.generatedAt.toLocaleDateString('es-CO')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Plantillas de reportes (placeholder)
interface ReportTemplatesProps {
  templates: ReportTemplate[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  isLoading: boolean
  onToggleTemplate: (templateId: string) => void
  onScheduleTemplate: (templateId: string, schedule: boolean) => void
  onGenerateReport: (templateId: string, startDate: Date, endDate: Date) => Promise<ReportData>
}

export function ReportTemplates({
  templates,
  selectedCategory,
  onCategoryChange,
  isLoading,
  onToggleTemplate,
  onScheduleTemplate,
  onGenerateReport
}: ReportTemplatesProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Settings className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Plantillas</h3>
        <p className="text-gray-600 text-center">
          Funcionalidad de gestión de plantillas próximamente disponible.
        </p>
      </CardContent>
    </Card>
  )
}

// Generador de reportes (placeholder)
interface ReportGeneratorProps {
  templates: ReportTemplate[]
  isLoading: boolean
  onGenerateReport: (templateId: string, startDate: Date, endDate: Date) => Promise<ReportData>
}

export function ReportGenerator({ templates, isLoading, onGenerateReport }: ReportGeneratorProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Plus className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Generador de Reportes</h3>
        <p className="text-gray-600 text-center">
          Funcionalidad de generación personalizada próximamente disponible.
        </p>
      </CardContent>
    </Card>
  )
}

// Historial de reportes
interface ReportHistoryProps {
  reports: ReportData[]
  isLoading: boolean
  onDeleteReport: (reportId: string) => void
  onExportReport: (reportId: string, format: string) => void
}

export function ReportHistory({ reports, isLoading, onDeleteReport, onExportReport }: ReportHistoryProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Historial de Reportes
          <Badge variant="secondary" className="ml-2">
            {reports.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reportes generados</h3>
            <p className="text-gray-600">Los reportes que generes aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900 truncate">{report.templateName}</h4>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(report.summary.totalValue)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{report.period.label}</span>
                    <span>•</span>
                    <span>{report.summary.totalRecords} registros</span>
                    <span>•</span>
                    <span>{report.generatedAt.toLocaleDateString('es-CO')}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      {report.status === 'completed' ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                      ) : report.status === 'generating' ? (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Generando...
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      )}

                      <span className="text-xs text-gray-500">
                        Por: {report.createdBy}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onExportReport(report.id, 'PDF')}
                        className="h-8 w-8 p-0"
                        disabled={report.status !== 'completed'}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteReport(report.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Analytics de reportes (placeholder)
interface ReportAnalyticsProps {
  templates: ReportTemplate[]
  reports: ReportData[]
  stats: any
  isLoading: boolean
}

export function ReportAnalytics({ templates, reports, stats, isLoading }: ReportAnalyticsProps) {
  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <TrendingUp className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Avanzado</h3>
        <p className="text-gray-600 text-center">
          Funcionalidad de analytics próximamente disponible con métricas de uso y rendimiento.
        </p>
      </CardContent>
    </Card>
  )
}

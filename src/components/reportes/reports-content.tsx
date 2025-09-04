'use client'

import { useState, useEffect } from 'react'
import { User } from '@/types'
import { 
  ReportTemplate,
  ReportData,
  MOCK_REPORT_TEMPLATES,
  getReportTemplates,
  getReportsAnalytics,
  generateExecutiveReport,
  generateSalesReport
} from '@/lib/mock-data'
import { DashboardHeaderSimple } from '@/components/dashboard/dashboard-header-simple'
import { 
  ReportsHeader, 
  ReportsStats, 
  ReportsTabs,
  ReportsOverview,
  ReportTemplates,
  ReportGenerator,
  ReportHistory,
  ReportAnalytics
} from './reports-components'

interface ReportsContentProps {
  user: User
}

export function ReportsContent({ user }: ReportsContentProps) {
  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [generatedReports, setGeneratedReports] = useState<ReportData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'generator' | 'history' | 'analytics'>('overview')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadReportsData()
  }, [])

  const loadReportsData = async () => {
    try {
      setIsLoading(true)
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setTemplates(MOCK_REPORT_TEMPLATES)
      
      // Generar algunos reportes de ejemplo
      const today = new Date()
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
      
      const executiveReport = generateExecutiveReport(startOfMonth, today)
      const salesReport = generateSalesReport(startOfWeek, today)
      
      setGeneratedReports([executiveReport, salesReport])
    } catch (error) {
      console.error('Error loading reports data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadReportsData()
  }

  const handleGenerateReport = async (templateId: string, startDate: Date, endDate: Date): Promise<ReportData> => {
    const template = templates.find(t => t.id === templateId)
    if (!template) {
      throw new Error('Template no encontrado')
    }

    // Simular generación de reporte
    const newReport: ReportData = {
      id: Math.random().toString(36).substr(2, 9),
      templateId: template.id,
      templateName: template.name,
      generatedAt: new Date(),
      period: {
        start: startDate,
        end: endDate,
        label: `${startDate.toLocaleDateString('es-CO')} - ${endDate.toLocaleDateString('es-CO')}`,
      },
      data: {},
      summary: {
        totalRecords: Math.floor(Math.random() * 1000) + 100,
        totalValue: Math.floor(Math.random() * 1000000) + 50000,
        keyMetrics: {
          metric1: Math.floor(Math.random() * 100),
          metric2: Math.floor(Math.random() * 1000),
          metric3: Math.floor(Math.random() * 10000),
        },
      },
      charts: [],
      status: 'generating',
      exportFormats: ['PDF', 'Excel', 'CSV'],
      createdBy: user.name || 'Usuario',
    }

    setGeneratedReports(prev => [newReport, ...prev])

    // Simular tiempo de generación
    setTimeout(() => {
      setGeneratedReports(prev => 
        prev.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'completed' as const }
            : report
        )
      )
    }, 3000)

    return newReport
  }

  const handleDeleteReport = (reportId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este reporte?')) {
      setGeneratedReports(prev => prev.filter(r => r.id !== reportId))
    }
  }

  const handleExportReport = (reportId: string, format: string) => {
    const report = generatedReports.find(r => r.id === reportId)
    if (!report) return

    // Simular exportación
    alert(`Exportando reporte "${report.templateName}" en formato ${format}...`)
  }

  const handleToggleTemplate = (templateId: string) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === templateId
          ? { ...template, isActive: !template.isActive, updatedAt: new Date() }
          : template
      )
    )
  }

  const handleScheduleTemplate = (templateId: string, schedule: boolean) => {
    setTemplates(prev =>
      prev.map(template =>
        template.id === templateId
          ? { 
              ...template, 
              isScheduled: schedule,
              nextRun: schedule ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : new Date(),
              updatedAt: new Date()
            }
          : template
      )
    )
  }

  const stats = getReportsAnalytics()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      {/* Header del Dashboard */}
      <DashboardHeaderSimple 
        user={user} 
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header de reportes */}
        <ReportsHeader 
          stats={stats}
        />

        {/* Estadísticas */}
        <ReportsStats 
          stats={stats}
          reportsCount={generatedReports.length}
          isLoading={isLoading}
        />

        {/* Tabs de navegación */}
        <ReportsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          templatesCount={templates.length}
          reportsCount={generatedReports.length}
        />

        {/* Contenido según tab activo */}
        {activeTab === 'overview' && (
          <ReportsOverview
            templates={templates}
            recentReports={generatedReports.slice(0, 5)}
            stats={stats}
            isLoading={isLoading}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {activeTab === 'templates' && (
          <ReportTemplates
            templates={templates}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isLoading={isLoading}
            onToggleTemplate={handleToggleTemplate}
            onScheduleTemplate={handleScheduleTemplate}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {activeTab === 'generator' && (
          <ReportGenerator
            templates={templates}
            isLoading={isLoading}
            onGenerateReport={handleGenerateReport}
          />
        )}

        {activeTab === 'history' && (
          <ReportHistory
            reports={generatedReports}
            isLoading={isLoading}
            onDeleteReport={handleDeleteReport}
            onExportReport={handleExportReport}
          />
        )}

        {activeTab === 'analytics' && (
          <ReportAnalytics
            templates={templates}
            reports={generatedReports}
            stats={stats}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

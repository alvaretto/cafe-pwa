'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, Users, Package, RefreshCw, Lightbulb } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AIInsightsProps {
  isLoading: boolean
}

export function AIInsights({ isLoading }: AIInsightsProps) {
  const [insights, setInsights] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  // Insights simulados generados por IA
  const mockInsights = [
    {
      id: '1',
      type: 'sales_trend',
      title: 'Tendencia de Ventas Positiva',
      description: 'Las ventas han aumentado un 15% en las últimas 2 semanas. El Café Arábica Premium es el producto estrella.',
      confidence: 92,
      priority: 'high',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      actionable: true,
      recommendation: 'Considera aumentar el stock de Café Arábica Premium para aprovechar la demanda.',
    },
    {
      id: '2',
      type: 'customer_behavior',
      title: 'Patrón de Compra Identificado',
      description: 'Los clientes VIP prefieren comprar los viernes por la tarde. 78% de las compras grandes ocurren en este horario.',
      confidence: 87,
      priority: 'medium',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      actionable: true,
      recommendation: 'Programa ofertas especiales para clientes VIP los viernes.',
    },
    {
      id: '3',
      type: 'inventory_optimization',
      title: 'Optimización de Inventario',
      description: 'El Café Robusta tiene una rotación lenta. Considera reducir el stock o crear promociones.',
      confidence: 84,
      priority: 'medium',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      actionable: true,
      recommendation: 'Crea una promoción 2x1 para el Café Robusta o reduce el próximo pedido.',
    },
  ]

  useEffect(() => {
    if (!isLoading) {
      setInsights(mockInsights)
    }
  }, [isLoading])

  const generateNewInsights = async () => {
    setIsGenerating(true)
    
    try {
      // Simular llamada a la API de Gemini
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // En producción, aquí se haría la llamada real a la API
      // const response = await generateExecutiveSummary(dashboardData)
      
      setInsights(mockInsights)
      
      toast({
        title: 'Insights actualizados',
        description: 'Se han generado nuevos insights con IA',
        variant: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron generar nuevos insights',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: { label: 'Alta', variant: 'destructive' as const },
      medium: { label: 'Media', variant: 'warning' as const },
      low: { label: 'Baja', variant: 'secondary' as const },
    }
    return badges[priority as keyof typeof badges] || badges.medium
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600'
    if (confidence >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          Insights de IA
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={generateNewInsights}
          disabled={isGenerating}
        >
          <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => {
            const Icon = insight.icon
            const badge = getPriorityBadge(insight.priority)
            const confidenceColor = getConfidenceColor(insight.confidence)
            
            return (
              <div
                key={insight.id}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${insight.bgColor}`}>
                    <Icon className={`h-4 w-4 ${insight.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">
                        {insight.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={badge.variant} className="text-xs">
                          {badge.label}
                        </Badge>
                        <span className={`text-xs font-medium ${confidenceColor}`}>
                          {insight.confidence}%
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {insight.description}
                    </p>
                    
                    {insight.actionable && insight.recommendation && (
                      <div className="flex items-start space-x-2 p-3 bg-muted/50 rounded-lg">
                        <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-foreground mb-1">
                            Recomendación:
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {insight.recommendation}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full">
            Ver Análisis Completo
          </Button>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by Google Gemini AI
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

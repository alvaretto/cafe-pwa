'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TrendingUp, BarChart3 } from 'lucide-react'

interface SalesChartProps {
  isLoading: boolean
}

export function SalesChart({ isLoading }: SalesChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  // Datos simulados para el gráfico
  const salesData = [
    { name: 'Ene', ventas: 2400000, meta: 2000000 },
    { name: 'Feb', ventas: 1398000, meta: 2000000 },
    { name: 'Mar', ventas: 9800000, meta: 2000000 },
    { name: 'Abr', ventas: 3908000, meta: 2000000 },
    { name: 'May', ventas: 4800000, meta: 2000000 },
    { name: 'Jun', ventas: 3800000, meta: 2000000 },
    { name: 'Jul', ventas: 4300000, meta: 2000000 },
    { name: 'Ago', ventas: 3200000, meta: 2000000 },
    { name: 'Sep', ventas: 4100000, meta: 2000000 },
    { name: 'Oct', ventas: 3900000, meta: 2000000 },
    { name: 'Nov', ventas: 4500000, meta: 2000000 },
    { name: 'Dic', ventas: 5200000, meta: 2000000 },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Ventas Mensuales</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Línea
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Barras
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs fill-muted-foreground"
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'ventas' ? 'Ventas' : 'Meta'
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            ) : (
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  className="text-xs fill-muted-foreground"
                />
                <YAxis 
                  className="text-xs fill-muted-foreground"
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'ventas' ? 'Ventas' : 'Meta'
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar 
                  dataKey="ventas" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="meta" 
                  fill="hsl(var(--muted-foreground))"
                  radius={[4, 4, 0, 0]}
                  opacity={0.5}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Resumen de métricas */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Año</p>
            <p className="text-lg font-semibold">
              {formatCurrency(salesData.reduce((sum, item) => sum + item.ventas, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Promedio Mensual</p>
            <p className="text-lg font-semibold">
              {formatCurrency(salesData.reduce((sum, item) => sum + item.ventas, 0) / salesData.length)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Mejor Mes</p>
            <p className="text-lg font-semibold">
              {formatCurrency(Math.max(...salesData.map(item => item.ventas)))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

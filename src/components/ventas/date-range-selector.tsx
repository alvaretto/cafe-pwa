'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, RotateCcw } from 'lucide-react'

interface DateRangeSelectorProps {
  dateFrom: string
  dateTo: string
  onDateFromChange: (date: string) => void
  onDateToChange: (date: string) => void
}

type DateRangePreset = {
  label: string
  value: string
  getRange: () => { from: string; to: string }
}

export function DateRangeSelector({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange
}: DateRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('custom')

  // Función para formatear fecha a string YYYY-MM-DD
  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0]!
  }

  // Función para obtener el inicio del día
  const getStartOfDay = (date: Date): Date => {
    const newDate = new Date(date)
    newDate.setHours(0, 0, 0, 0)
    return newDate
  }

  // Función para obtener el final del día
  const getEndOfDay = (date: Date): Date => {
    const newDate = new Date(date)
    newDate.setHours(23, 59, 59, 999)
    return newDate
  }

  // Función para obtener el semestre actual
  const getCurrentSemester = (): { start: Date; end: Date; number: number } => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() // 0-11
    
    if (month < 6) { // Enero-Junio = Semestre 1
      return {
        start: new Date(year, 0, 1), // 1 de enero
        end: new Date(year, 5, 30), // 30 de junio
        number: 1
      }
    } else { // Julio-Diciembre = Semestre 2
      return {
        start: new Date(year, 6, 1), // 1 de julio
        end: new Date(year, 11, 31), // 31 de diciembre
        number: 2
      }
    }
  }

  // Presets de rangos de fechas
  const dateRangePresets: DateRangePreset[] = [
    {
      label: 'Hoy',
      value: 'today',
      getRange: () => {
        const today = new Date()
        return {
          from: formatDateToString(today),
          to: formatDateToString(today)
        }
      }
    },
    {
      label: 'Esta semana',
      value: 'this_week',
      getRange: () => {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - dayOfWeek)
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6)
        
        return {
          from: formatDateToString(startOfWeek),
          to: formatDateToString(endOfWeek)
        }
      }
    },
    {
      label: 'Este mes',
      value: 'this_month',
      getRange: () => {
        const today = new Date()
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        
        return {
          from: formatDateToString(startOfMonth),
          to: formatDateToString(endOfMonth)
        }
      }
    },
    {
      label: 'Este trimestre',
      value: 'this_quarter',
      getRange: () => {
        const today = new Date()
        const quarter = Math.floor(today.getMonth() / 3)
        const startOfQuarter = new Date(today.getFullYear(), quarter * 3, 1)
        const endOfQuarter = new Date(today.getFullYear(), quarter * 3 + 3, 0)
        
        return {
          from: formatDateToString(startOfQuarter),
          to: formatDateToString(endOfQuarter)
        }
      }
    },
    {
      label: 'Este semestre',
      value: 'this_semester',
      getRange: () => {
        const semester = getCurrentSemester()
        return {
          from: formatDateToString(semester.start),
          to: formatDateToString(semester.end)
        }
      }
    },
    {
      label: 'Este año',
      value: 'this_year',
      getRange: () => {
        const today = new Date()
        const startOfYear = new Date(today.getFullYear(), 0, 1)
        const endOfYear = new Date(today.getFullYear(), 11, 31)
        
        return {
          from: formatDateToString(startOfYear),
          to: formatDateToString(endOfYear)
        }
      }
    },
    {
      label: 'Últimos 7 días',
      value: 'last_7_days',
      getRange: () => {
        const today = new Date()
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(today.getDate() - 6)
        
        return {
          from: formatDateToString(sevenDaysAgo),
          to: formatDateToString(today)
        }
      }
    },
    {
      label: 'Últimos 30 días',
      value: 'last_30_days',
      getRange: () => {
        const today = new Date()
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(today.getDate() - 29)
        
        return {
          from: formatDateToString(thirtyDaysAgo),
          to: formatDateToString(today)
        }
      }
    },
    {
      label: 'Últimos 90 días',
      value: 'last_90_days',
      getRange: () => {
        const today = new Date()
        const ninetyDaysAgo = new Date(today)
        ninetyDaysAgo.setDate(today.getDate() - 89)
        
        return {
          from: formatDateToString(ninetyDaysAgo),
          to: formatDateToString(today)
        }
      }
    }
  ]

  // Manejar cambio de preset
  const handlePresetChange = (presetValue: string) => {
    setSelectedPreset(presetValue)
    
    if (presetValue === 'custom') {
      return
    }

    const preset = dateRangePresets.find(p => p.value === presetValue)
    if (preset) {
      const range = preset.getRange()
      onDateFromChange(range.from)
      onDateToChange(range.to)
    }
  }

  // Detectar si las fechas actuales coinciden con algún preset
  useEffect(() => {
    if (!dateFrom || !dateTo) {
      setSelectedPreset('custom')
      return
    }

    const currentRange = { from: dateFrom, to: dateTo }
    
    for (const preset of dateRangePresets) {
      const presetRange = preset.getRange()
      if (presetRange.from === currentRange.from && presetRange.to === currentRange.to) {
        setSelectedPreset(preset.value)
        return
      }
    }
    
    setSelectedPreset('custom')
  }, [dateFrom, dateTo])

  // Limpiar fechas
  const handleClearDates = () => {
    onDateFromChange('')
    onDateToChange('')
    setSelectedPreset('custom')
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
          Período de Tiempo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selector de presets */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">Rangos Predefinidos</label>
          <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Personalizado</SelectItem>
              {dateRangePresets.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fechas personalizadas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Desde</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                onDateFromChange(e.target.value)
                setSelectedPreset('custom')
              }}
              className="h-9"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">Hasta</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                onDateToChange(e.target.value)
                setSelectedPreset('custom')
              }}
              className="h-9"
            />
          </div>
        </div>

        {/* Botón para limpiar */}
        {(dateFrom || dateTo) && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearDates}
            className="w-full h-8"
          >
            <RotateCcw className="h-3 w-3 mr-2" />
            Limpiar Fechas
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import React from 'react'
import { Slider } from '@/components/ui/slider'
import { Battery, BatteryLow, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnergyLevelSliderProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  className?: string
}

export default function EnergyLevelSlider({
  value,
  onChange,
  disabled = false,
  className
}: EnergyLevelSliderProps) {
  const getEnergyLabel = (energy: number) => {
    if (energy <= -30) return 'Drained'
    if (energy <= -10) return 'Low Energy'
    if (energy <= 10) return 'Neutral'
    if (energy <= 30) return 'Energized'
    return 'Highly Energized'
  }
  
  const getEnergyIcon = (energy: number) => {
    if (energy <= -10) return <BatteryLow className="w-4 h-4 text-red-500" />
    if (energy <= 10) return <Battery className="w-4 h-4 text-gray-500" />
    return <Zap className="w-4 h-4 text-yellow-500" />
  }
  
  const getEnergyColor = (energy: number) => {
    if (energy <= -10) return 'text-red-500'
    if (energy <= 10) return 'text-gray-500'
    return 'text-yellow-500'
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getEnergyIcon(value)}
          <label className="text-sm font-medium text-gray-700">
            Energy Level
          </label>
        </div>
        <span className={cn('text-sm font-semibold', getEnergyColor(value))}>
          {getEnergyLabel(value)}
        </span>
      </div>
      
      <div className="px-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={50}
          min={-50}
          step={5}
          disabled={disabled}
          className="w-full"
        />
      </div>
      
      {/* Energy markers */}
      <div className="flex justify-between text-xs text-gray-500 px-2">
        <span className="text-red-500">Drained</span>
        <span>Low</span>
        <span>Neutral</span>
        <span>High</span>
        <span className="text-yellow-500">Energized</span>
      </div>
      
      {/* Energy description */}
      <p className="text-xs text-gray-600 px-2">
        {value <= -30 && "Feeling depleted and need rest"}
        {value > -30 && value <= -10 && "Below average energy, somewhat tired"}
        {value > -10 && value <= 10 && "Balanced energy state"}
        {value > 10 && value <= 30 && "Good energy, feeling active"}
        {value > 30 && "High energy, feeling very active"}
      </p>
    </div>
  )
}
'use client'

import React from 'react'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

interface EmotionIntensitySliderProps {
  value: number
  onChange: (value: number) => void
  emotion?: string
  disabled?: boolean
  className?: string
}

export default function EmotionIntensitySlider({
  value,
  onChange,
  emotion,
  disabled = false,
  className
}: EmotionIntensitySliderProps) {
  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 20) return 'Very Low'
    if (intensity <= 40) return 'Low'
    if (intensity <= 60) return 'Moderate'
    if (intensity <= 80) return 'High'
    return 'Very High'
  }
  
  const getIntensityColor = (intensity: number) => {
    if (intensity <= 20) return 'text-gray-500'
    if (intensity <= 40) return 'text-blue-500'
    if (intensity <= 60) return 'text-green-500'
    if (intensity <= 80) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className={cn('space-y-3', className)}>
      {emotion && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 capitalize">
            {emotion} Intensity
          </label>
          <span className={cn('text-sm font-semibold', getIntensityColor(value))}>
            {getIntensityLabel(value)} ({value}%)
          </span>
        </div>
      )}
      
      <div className="px-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          max={100}
          min={0}
          step={5}
          disabled={disabled}
          className="w-full"
        />
      </div>
      
      {/* Intensity markers */}
      <div className="flex justify-between text-xs text-gray-500 px-2">
        <span>None</span>
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
        <span>Intense</span>
      </div>
    </div>
  )
}
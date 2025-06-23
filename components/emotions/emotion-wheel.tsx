'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

// Plutchik's 8 primary emotions
const PRIMARY_EMOTIONS = [
  { name: 'joy', color: 'bg-yellow-400', angle: 0 },
  { name: 'trust', color: 'bg-green-400', angle: 45 },
  { name: 'fear', color: 'bg-purple-400', angle: 90 },
  { name: 'surprise', color: 'bg-blue-400', angle: 135 },
  { name: 'sadness', color: 'bg-blue-600', angle: 180 },
  { name: 'disgust', color: 'bg-green-600', angle: 225 },
  { name: 'anger', color: 'bg-red-500', angle: 270 },
  { name: 'anticipation', color: 'bg-orange-400', angle: 315 }
]

interface EmotionWheelProps {
  selectedEmotion?: {
    emotion: string
    intensity: number
  }
  onEmotionSelect: (emotion: string, intensity: number) => void
  disabled?: boolean
}

export default function EmotionWheel({ 
  selectedEmotion, 
  onEmotionSelect, 
  disabled = false 
}: EmotionWheelProps) {
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null)
  
  const handleEmotionClick = (emotionName: string) => {
    if (disabled) return
    
    // If clicking the same emotion, cycle through intensities
    if (selectedEmotion?.emotion === emotionName) {
      const currentIntensity = selectedEmotion.intensity
      const newIntensity = currentIntensity >= 85 ? 30 : currentIntensity + 25
      onEmotionSelect(emotionName, newIntensity)
    } else {
      // Select new emotion with default intensity
      onEmotionSelect(emotionName, 60)
    }
  }
  
  const getEmotionOpacity = (emotionName: string) => {
    if (selectedEmotion?.emotion === emotionName) {
      return selectedEmotion.intensity / 100
    }
    return hoveredEmotion === emotionName ? 0.8 : 0.6
  }
  
  const getEmotionScale = (emotionName: string) => {
    if (selectedEmotion?.emotion === emotionName) {
      return 1 + (selectedEmotion.intensity / 200) // Scale from 1 to 1.5
    }
    return hoveredEmotion === emotionName ? 1.1 : 1
  }

  return (
    <div className="relative w-80 h-80 mx-auto">
      {/* Center circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
        <span className="text-xs text-gray-600 font-medium">
          {selectedEmotion ? `${selectedEmotion.intensity}%` : 'Select'}
        </span>
      </div>
      
      {/* Emotion segments */}
      {PRIMARY_EMOTIONS.map((emotion) => {
        const isSelected = selectedEmotion?.emotion === emotion.name
        const opacity = getEmotionOpacity(emotion.name)
        const scale = getEmotionScale(emotion.name)
        
        // Calculate position on circle
        const angleRad = (emotion.angle * Math.PI) / 180
        const radius = 120
        const x = Math.cos(angleRad) * radius
        const y = Math.sin(angleRad) * radius
        
        return (
          <button
            key={emotion.name}
            className={cn(
              'absolute w-16 h-16 rounded-full border-2 border-white shadow-lg transition-all duration-200 transform hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500',
              emotion.color,
              disabled && 'cursor-not-allowed opacity-50',
              isSelected && 'ring-2 ring-blue-600 ring-offset-2'
            )}
            style={{
              left: `calc(50% + ${x}px - 2rem)`,
              top: `calc(50% + ${y}px - 2rem)`,
              opacity,
              transform: `scale(${scale})`,
            }}
            onClick={() => handleEmotionClick(emotion.name)}
            onMouseEnter={() => !disabled && setHoveredEmotion(emotion.name)}
            onMouseLeave={() => setHoveredEmotion(null)}
            disabled={disabled}
            aria-label={`Select ${emotion.name} emotion`}
          >
            <span className="text-white text-xs font-semibold capitalize">
              {emotion.name}
            </span>
          </button>
        )
      })}
      
      {/* Selected emotion label */}
      {selectedEmotion && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-sm font-medium text-gray-900 capitalize">
            {selectedEmotion.emotion}
          </p>
          <p className="text-xs text-gray-600">
            Intensity: {selectedEmotion.intensity}%
          </p>
        </div>
      )}
    </div>
  )
}
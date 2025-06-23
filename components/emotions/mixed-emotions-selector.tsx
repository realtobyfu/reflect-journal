'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SECONDARY_EMOTIONS = [
  'excited', 'nervous', 'confident', 'overwhelmed', 'grateful', 
  'frustrated', 'curious', 'content', 'anxious', 'hopeful',
  'disappointed', 'proud', 'embarrassed', 'peaceful', 'restless'
]

interface MixedEmotionsSelectorProps {
  selectedEmotions: string[]
  onEmotionsChange: (emotions: string[]) => void
  maxSelections?: number
  disabled?: boolean
  className?: string
}

export default function MixedEmotionsSelector({
  selectedEmotions,
  onEmotionsChange,
  maxSelections = 3,
  disabled = false,
  className
}: MixedEmotionsSelectorProps) {
  const [showAll, setShowAll] = useState(false)
  
  const displayedEmotions = showAll ? SECONDARY_EMOTIONS : SECONDARY_EMOTIONS.slice(0, 8)
  
  const handleEmotionToggle = (emotion: string) => {
    if (disabled) return
    
    if (selectedEmotions.includes(emotion)) {
      // Remove emotion
      onEmotionsChange(selectedEmotions.filter(e => e !== emotion))
    } else if (selectedEmotions.length < maxSelections) {
      // Add emotion
      onEmotionsChange([...selectedEmotions, emotion])
    }
  }
  
  const removeEmotion = (emotion: string) => {
    if (disabled) return
    onEmotionsChange(selectedEmotions.filter(e => e !== emotion))
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Mixed Feelings? (Optional)
        </h3>
        <p className="text-xs text-gray-500">
          Select up to {maxSelections} additional emotions you're experiencing
        </p>
      </div>
      
      {/* Selected emotions */}
      {selectedEmotions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEmotions.map((emotion) => (
            <Badge
              key={emotion}
              variant="secondary"
              className="flex items-center gap-1 text-sm"
            >
              {emotion}
              {!disabled && (
                <button
                  onClick={() => removeEmotion(emotion)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                  aria-label={`Remove ${emotion}`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
      
      {/* Available emotions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {displayedEmotions.map((emotion) => {
          const isSelected = selectedEmotions.includes(emotion)
          const canSelect = !isSelected && selectedEmotions.length < maxSelections
          
          return (
            <Button
              key={emotion}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => handleEmotionToggle(emotion)}
              disabled={disabled || (!isSelected && !canSelect)}
              className={cn(
                'text-xs capitalize justify-start h-8',
                isSelected && 'bg-blue-100 text-blue-800 border-blue-300',
                !canSelect && !isSelected && 'opacity-50 cursor-not-allowed'
              )}
            >
              {emotion}
            </Button>
          )
        })}
      </div>
      
      {/* Show more/less toggle */}
      {SECONDARY_EMOTIONS.length > 8 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          disabled={disabled}
          className="text-xs text-gray-600 hover:text-gray-800"
        >
          {showAll ? 'Show Less' : `Show More (${SECONDARY_EMOTIONS.length - 8} more)`}
        </Button>
      )}
      
      {/* Selection limit warning */}
      {selectedEmotions.length >= maxSelections && (
        <p className="text-xs text-amber-600">
          Maximum of {maxSelections} emotions selected
        </p>
      )}
    </div>
  )
}
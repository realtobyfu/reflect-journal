'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface EmotionData {
  primary: {
    emotion: string
    intensity: number
  } | null
  secondary: string[]
  energy: number
  context?: {
    location?: string
    activity?: string
    social?: boolean
    trigger?: string
  }
}

interface EmotionContextType {
  emotionData: EmotionData
  updatePrimaryEmotion: (emotion: string, intensity: number) => void
  updateSecondaryEmotions: (emotions: string[]) => void
  updateEnergyLevel: (energy: number) => void
  updateContext: (context: Partial<EmotionData['context']>) => void
  resetEmotions: () => void
}

const EmotionContext = createContext<EmotionContextType | undefined>(undefined)

const initialEmotionData: EmotionData = {
  primary: null,
  secondary: [],
  energy: 0,
  context: {}
}

export function EmotionProvider({ children }: { children: ReactNode }) {
  const [emotionData, setEmotionData] = useState<EmotionData>(initialEmotionData)
  
  const updatePrimaryEmotion = (emotion: string, intensity: number) => {
    setEmotionData(prev => ({
      ...prev,
      primary: { emotion, intensity }
    }))
  }
  
  const updateSecondaryEmotions = (emotions: string[]) => {
    setEmotionData(prev => ({
      ...prev,
      secondary: emotions
    }))
  }
  
  const updateEnergyLevel = (energy: number) => {
    setEmotionData(prev => ({
      ...prev,
      energy
    }))
  }
  
  const updateContext = (context: Partial<EmotionData['context']>) => {
    setEmotionData(prev => ({
      ...prev,
      context: {
        ...prev.context,
        ...context
      }
    }))
  }
  
  const resetEmotions = () => {
    setEmotionData(initialEmotionData)
  }
  
  const value: EmotionContextType = {
    emotionData,
    updatePrimaryEmotion,
    updateSecondaryEmotions,
    updateEnergyLevel,
    updateContext,
    resetEmotions
  }
  
  return (
    <EmotionContext.Provider value={value}>
      {children}
    </EmotionContext.Provider>
  )
}

export function useEmotion() {
  const context = useContext(EmotionContext)
  if (context === undefined) {
    throw new Error('useEmotion must be used within an EmotionProvider')
  }
  return context
}

export default EmotionContext
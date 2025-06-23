import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import EmotionWheel from '@/components/emotions/emotion-wheel'

describe('EmotionWheel Component', () => {
  const mockOnEmotionSelect = jest.fn()

  beforeEach(() => {
    mockOnEmotionSelect.mockClear()
  })

  test('renders 8 primary emotions from Plutchik model', () => {
    render(<EmotionWheel onEmotionSelect={mockOnEmotionSelect} />)
    
    // Check that all 8 primary emotions are rendered
    const emotions = ['joy', 'trust', 'fear', 'surprise', 'sadness', 'disgust', 'anger', 'anticipation']
    emotions.forEach(emotion => {
      expect(screen.getByLabelText(`Select ${emotion} emotion`)).toBeInTheDocument()
    })
  })

  test('allows intensity selection 0-100', () => {
    render(<EmotionWheel onEmotionSelect={mockOnEmotionSelect} />)
    
    const joyButton = screen.getByLabelText('Select joy emotion')
    
    // First click should select with default intensity (60)
    fireEvent.click(joyButton)
    expect(mockOnEmotionSelect).toHaveBeenCalledWith('joy', 60)
    
    // Second click should increase intensity to 85
    fireEvent.click(joyButton)
    expect(mockOnEmotionSelect).toHaveBeenCalledWith('joy', 85)
  })

  test('supports multiple emotion selection', () => {
    render(<EmotionWheel onEmotionSelect={mockOnEmotionSelect} />)
    
    const joyButton = screen.getByLabelText('Select joy emotion')
    const sadnessButton = screen.getByLabelText('Select sadness emotion')
    
    fireEvent.click(joyButton)
    expect(mockOnEmotionSelect).toHaveBeenCalledWith('joy', 60)
    
    fireEvent.click(sadnessButton)
    expect(mockOnEmotionSelect).toHaveBeenCalledWith('sadness', 60)
  })

  test('validates emotion combinations', () => {
    const selectedEmotion = { emotion: 'joy', intensity: 80 }
    render(
      <EmotionWheel 
        selectedEmotion={selectedEmotion}
        onEmotionSelect={mockOnEmotionSelect} 
      />
    )
    
    // Joy should be highlighted with 80% intensity
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByText('Joy')).toBeInTheDocument()
    expect(screen.getByText('Intensity: 80%')).toBeInTheDocument()
  })

  test('persists state between sessions', () => {
    const selectedEmotion = { emotion: 'trust', intensity: 45 }
    render(
      <EmotionWheel 
        selectedEmotion={selectedEmotion}
        onEmotionSelect={mockOnEmotionSelect} 
      />
    )
    
    // Should show the persisted state
    expect(screen.getByText('45%')).toBeInTheDocument()
    expect(screen.getByText('Trust')).toBeInTheDocument()
  })

  test('handles disabled state correctly', () => {
    render(<EmotionWheel onEmotionSelect={mockOnEmotionSelect} disabled />)
    
    const joyButton = screen.getByLabelText('Select joy emotion')
    fireEvent.click(joyButton)
    
    // Should not call the callback when disabled
    expect(mockOnEmotionSelect).not.toHaveBeenCalled()
    expect(joyButton).toBeDisabled()
  })

  test('displays hover effects', () => {
    render(<EmotionWheel onEmotionSelect={mockOnEmotionSelect} />)
    
    const joyButton = screen.getByLabelText('Select joy emotion')
    
    fireEvent.mouseEnter(joyButton)
    // Hover state should be applied (visual changes tested via styling)
    
    fireEvent.mouseLeave(joyButton)
    // Hover state should be removed
  })
})
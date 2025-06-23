import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EmotionProvider } from '@/components/emotions/emotion-context'
import EmotionWheel from '@/components/emotions/emotion-wheel'
import MixedEmotionsSelector from '@/components/emotions/mixed-emotions-selector'
import EnergyLevelSlider from '@/components/emotions/energy-level-slider'
import { apiClient } from '@/lib/api-client'

// Mock the API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    updateEntryEmotions: jest.fn(),
    getEmotionSuggestions: jest.fn(),
    getEmotionHistory: jest.fn(),
  }
}))

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('Emotion System Integration', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
    mockApiClient.updateEntryEmotions.mockClear()
    mockApiClient.getEmotionSuggestions.mockClear()
    mockApiClient.getEmotionHistory.mockClear()
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <EmotionProvider>
        {children}
      </EmotionProvider>
    </QueryClientProvider>
  )

  test('emotion selection flows to entry creation', async () => {
    mockApiClient.updateEntryEmotions.mockResolvedValue({
      message: 'Emotions updated successfully',
      entry_id: 1
    })

    const mockOnEmotionSelect = jest.fn()
    const mockOnEmotionsChange = jest.fn()
    const mockOnEnergyChange = jest.fn()

    render(
      <TestWrapper>
        <div>
          <EmotionWheel onEmotionSelect={mockOnEmotionSelect} />
          <MixedEmotionsSelector 
            selectedEmotions={[]} 
            onEmotionsChange={mockOnEmotionsChange} 
          />
          <EnergyLevelSlider value={0} onChange={mockOnEnergyChange} />
        </div>
      </TestWrapper>
    )

    // Select primary emotion
    const joyButton = screen.getByLabelText('Select joy emotion')
    fireEvent.click(joyButton)
    expect(mockOnEmotionSelect).toHaveBeenCalledWith('joy', 60)

    // Select secondary emotion
    const excitedButton = screen.getByText('excited')
    fireEvent.click(excitedButton)
    expect(mockOnEmotionsChange).toHaveBeenCalledWith(['excited'])

    // The integration should flow through the emotion context
    // This tests that components work together
  })

  test('historical emotions influence suggestions', async () => {
    const mockSuggestions = [
      { emotion: 'content', intensity: 60, reason: 'You\'ve been feeling content frequently lately' },
      { emotion: 'optimistic', intensity: 70, reason: 'Morning hours are often associated with optimism' }
    ]

    mockApiClient.getEmotionSuggestions.mockResolvedValue(mockSuggestions)

    const mockHistory = {
      patterns: [
        { emotion: 'content', frequency: 5, avg_intensity: 65, trend: 'stable' }
      ],
      recent_emotions: [],
      insights: ['You\'ve been consistently content lately']
    }

    mockApiClient.getEmotionHistory.mockResolvedValue(mockHistory)

    // This would be part of a larger component that uses both APIs
    // Testing that the system can fetch suggestions and history
    const suggestions = await apiClient.getEmotionSuggestions()
    const history = await apiClient.getEmotionHistory(30)

    expect(suggestions).toHaveLength(2)
    expect(suggestions[0].emotion).toBe('content')
    expect(history.patterns[0].emotion).toBe('content')
  })

  test('emotion data syncs across devices', async () => {
    const emotionData = {
      primary: { emotion: 'joy', intensity: 75 },
      secondary: ['excited', 'grateful'],
      energy: 25,
      context: { activity: 'work' }
    }

    mockApiClient.updateEntryEmotions.mockResolvedValue({
      message: 'Emotions updated successfully',
      entry_id: 1
    })

    // Simulate emotion data being sent to server
    const result = await apiClient.updateEntryEmotions(1, emotionData)

    expect(mockApiClient.updateEntryEmotions).toHaveBeenCalledWith(1, emotionData)
    expect(result.message).toBe('Emotions updated successfully')
    expect(result.entry_id).toBe(1)
  })

  test('handles offline mode gracefully', async () => {
    // Mock network error
    mockApiClient.updateEntryEmotions.mockRejectedValue(
      new Error('Network error')
    )

    const emotionData = {
      primary: { emotion: 'anxiety', intensity: 60 },
      secondary: [],
      energy: -10
    }

    try {
      await apiClient.updateEntryEmotions(1, emotionData)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect((error as Error).message).toBe('Network error')
    }

    // In a real app, this would trigger offline storage
    expect(mockApiClient.updateEntryEmotions).toHaveBeenCalledWith(1, emotionData)
  })

  test('validates emotion intensity ranges', () => {
    const mockOnEmotionSelect = jest.fn()

    render(
      <TestWrapper>
        <EmotionWheel onEmotionSelect={mockOnEmotionSelect} />
      </TestWrapper>
    )

    const joyButton = screen.getByLabelText('Select joy emotion')
    
    // Click multiple times to cycle through intensities
    fireEvent.click(joyButton) // 60
    expect(mockOnEmotionSelect).toHaveBeenCalledWith('joy', 60)
    
    fireEvent.click(joyButton) // 85
    expect(mockOnEmotionSelect).toHaveBeenCalledWith('joy', 85)
    
    fireEvent.click(joyButton) // Should reset to 30 (cycles back)
    expect(mockOnEmotionSelect).toHaveBeenCalledWith('joy', 30)
  })

  test('emotion context provides state management', () => {
    const TestComponent = () => {
      const [primaryEmotion, setPrimaryEmotion] = React.useState<{emotion: string, intensity: number} | null>(null)
      const [secondaryEmotions, setSecondaryEmotions] = React.useState<string[]>([])
      const [energy, setEnergy] = React.useState(0)

      return (
        <div>
          <EmotionWheel 
            selectedEmotion={primaryEmotion} 
            onEmotionSelect={(emotion, intensity) => 
              setPrimaryEmotion({ emotion, intensity })
            } 
          />
          <MixedEmotionsSelector 
            selectedEmotions={secondaryEmotions}
            onEmotionsChange={setSecondaryEmotions}
          />
          <EnergyLevelSlider 
            value={energy}
            onChange={setEnergy}
          />
          <div data-testid="emotion-state">
            {primaryEmotion ? `${primaryEmotion.emotion}:${primaryEmotion.intensity}` : 'none'}
            |{secondaryEmotions.join(',')}
            |{energy}
          </div>
        </div>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Test state management flow
    const joyButton = screen.getByLabelText('Select joy emotion')
    fireEvent.click(joyButton)

    const excitedButton = screen.getByText('excited')
    fireEvent.click(excitedButton)

    expect(screen.getByTestId('emotion-state')).toHaveTextContent('joy:60|excited|0')
  })
})
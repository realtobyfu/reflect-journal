import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { EmotionProvider } from '@/components/emotions/emotion-context'
import EmotionWheel from '@/components/emotions/emotion-wheel'
import MixedEmotionsSelector from '@/components/emotions/mixed-emotions-selector'
import EnergyLevelSlider from '@/components/emotions/energy-level-slider'

// Mock the entire entry creation flow
describe('Emotion Tracking User Flow', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })
  })

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <EmotionProvider>
        {children}
      </EmotionProvider>
    </QueryClientProvider>
  )

  test('user can complete entry with new emotion system', async () => {
    const MockJournalEntryForm = () => {
      const [content, setContent] = React.useState('')
      const [primaryEmotion, setPrimaryEmotion] = React.useState<{emotion: string, intensity: number} | null>(null)
      const [secondaryEmotions, setSecondaryEmotions] = React.useState<string[]>([])
      const [energy, setEnergy] = React.useState(0)
      const [isSubmitted, setIsSubmitted] = React.useState(false)

      const handleSubmit = () => {
        if (content.trim()) {
          setIsSubmitted(true)
        }
      }

      if (isSubmitted) {
        return (
          <div data-testid="success-message">
            Entry created successfully!
            <div data-testid="emotion-summary">
              Primary: {primaryEmotion ? `${primaryEmotion.emotion} (${primaryEmotion.intensity}%)` : 'none'}
              Secondary: {secondaryEmotions.join(', ') || 'none'}
              Energy: {energy}
            </div>
          </div>
        )
      }

      return (
        <div>
          <textarea
            data-testid="journal-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="How was your day?"
          />
          
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
          
          <button 
            data-testid="submit-entry"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            Save Entry
          </button>
        </div>
      )
    }

    render(
      <TestWrapper>
        <MockJournalEntryForm />
      </TestWrapper>
    )

    // Step 1: Write journal content
    const contentTextarea = screen.getByTestId('journal-content')
    fireEvent.change(contentTextarea, { 
      target: { value: 'Had a great day at work today! Feeling accomplished.' } 
    })

    // Step 2: Select primary emotion
    const joyButton = screen.getByLabelText('Select joy emotion')
    fireEvent.click(joyButton)

    // Step 3: Add secondary emotions
    const accomplishedButton = screen.getByText('proud')
    fireEvent.click(accomplishedButton)

    // Step 4: Set energy level
    const energySlider = screen.getByRole('slider')
    fireEvent.change(energySlider, { target: { value: '30' } })

    // Step 5: Submit entry
    const submitButton = screen.getByTestId('submit-entry')
    expect(submitButton).not.toBeDisabled()
    
    fireEvent.click(submitButton)

    // Verify success
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
    })

    const emotionSummary = screen.getByTestId('emotion-summary')
    expect(emotionSummary).toHaveTextContent('Primary: joy (60%)')
    expect(emotionSummary).toHaveTextContent('Secondary: proud')
    expect(emotionSummary).toHaveTextContent('Energy: 30')
  })

  test('user can skip emotion selection', async () => {
    const MockMinimalEntryForm = () => {
      const [content, setContent] = React.useState('')
      const [isSubmitted, setIsSubmitted] = React.useState(false)
      const [showEmotions, setShowEmotions] = React.useState(false)

      const handleSubmit = () => {
        if (content.trim()) {
          setIsSubmitted(true)
        }
      }

      if (isSubmitted) {
        return <div data-testid="success-message">Entry saved without emotions!</div>
      }

      return (
        <div>
          <textarea
            data-testid="journal-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Quick thought..."
          />
          
          <button 
            data-testid="add-emotions"
            onClick={() => setShowEmotions(!showEmotions)}
          >
            {showEmotions ? 'Hide' : 'Add'} Emotions (Optional)
          </button>
          
          {showEmotions && (
            <div data-testid="emotion-panel">
              <EmotionWheel onEmotionSelect={() => {}} />
            </div>
          )}
          
          <button 
            data-testid="submit-entry"
            onClick={handleSubmit}
            disabled={!content.trim()}
          >
            Save Entry
          </button>
        </div>
      )
    }

    render(
      <TestWrapper>
        <MockMinimalEntryForm />
      </TestWrapper>
    )

    // Write minimal content
    const contentTextarea = screen.getByTestId('journal-content')
    fireEvent.change(contentTextarea, { 
      target: { value: 'Quick note: remember to call mom.' } 
    })

    // Skip emotions - directly submit
    const submitButton = screen.getByTestId('submit-entry')
    fireEvent.click(submitButton)

    // Verify success without emotions
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
    })
  })

  test('user can edit emotions after entry creation', async () => {
    const MockEditableEntry = () => {
      const [primaryEmotion, setPrimaryEmotion] = React.useState<{emotion: string, intensity: number} | null>({
        emotion: 'content',
        intensity: 60
      })
      const [isEditing, setIsEditing] = React.useState(false)
      const [hasChanges, setHasChanges] = React.useState(false)

      const handleEmotionChange = (emotion: string, intensity: number) => {
        setPrimaryEmotion({ emotion, intensity })
        setHasChanges(true)
      }

      const saveChanges = () => {
        setIsEditing(false)
        setHasChanges(false)
      }

      return (
        <div>
          <div data-testid="entry-content">
            Had a decent day at work.
          </div>
          
          <div data-testid="emotion-display">
            Current emotion: {primaryEmotion ? `${primaryEmotion.emotion} (${primaryEmotion.intensity}%)` : 'none'}
          </div>
          
          {!isEditing ? (
            <button 
              data-testid="edit-emotions"
              onClick={() => setIsEditing(true)}
            >
              Edit Emotions
            </button>
          ) : (
            <div>
              <EmotionWheel 
                selectedEmotion={primaryEmotion}
                onEmotionSelect={handleEmotionChange}
              />
              
              <button 
                data-testid="save-emotions"
                onClick={saveChanges}
                disabled={!hasChanges}
              >
                Save Changes
              </button>
              
              <button 
                data-testid="cancel-edit"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )
    }

    render(
      <TestWrapper>
        <MockEditableEntry />
      </TestWrapper>
    )

    // Verify initial state
    expect(screen.getByTestId('emotion-display')).toHaveTextContent('content (60%)')

    // Start editing
    fireEvent.click(screen.getByTestId('edit-emotions'))

    // Change emotion
    const joyButton = screen.getByLabelText('Select joy emotion')
    fireEvent.click(joyButton)

    // Verify emotion changed
    expect(screen.getByTestId('emotion-display')).toHaveTextContent('joy (60%)')

    // Save changes
    const saveButton = screen.getByTestId('save-emotions')
    expect(saveButton).not.toBeDisabled()
    fireEvent.click(saveButton)

    // Verify editing mode is closed
    expect(screen.getByTestId('edit-emotions')).toBeInTheDocument()
    expect(screen.queryByTestId('save-emotions')).not.toBeInTheDocument()
  })

  test('progressive disclosure shows appropriate UI for different user levels', () => {
    const MockProgressiveUI = ({ userLevel }: { userLevel: 'beginner' | 'intermediate' | 'advanced' }) => {
      return (
        <div>
          <div data-testid="user-level">{userLevel}</div>
          
          {userLevel === 'beginner' && (
            <div data-testid="beginner-ui">
              <textarea placeholder="How are you feeling today?" />
              <div>Simple mood: 😊 😐 😢</div>
            </div>
          )}
          
          {userLevel === 'intermediate' && (
            <div data-testid="intermediate-ui">
              <textarea placeholder="Tell me about your day..." />
              <EmotionWheel onEmotionSelect={() => {}} />
            </div>
          )}
          
          {userLevel === 'advanced' && (
            <div data-testid="advanced-ui">
              <textarea placeholder="Reflect on your experience..." />
              <EmotionWheel onEmotionSelect={() => {}} />
              <MixedEmotionsSelector selectedEmotions={[]} onEmotionsChange={() => {}} />
              <EnergyLevelSlider value={0} onChange={() => {}} />
            </div>
          )}
        </div>
      )
    }

    // Test beginner UI
    const { rerender } = render(
      <TestWrapper>
        <MockProgressiveUI userLevel="beginner" />
      </TestWrapper>
    )

    expect(screen.getByTestId('beginner-ui')).toBeInTheDocument()
    expect(screen.getByText('Simple mood: 😊 😐 😢')).toBeInTheDocument()

    // Test intermediate UI
    rerender(
      <TestWrapper>
        <MockProgressiveUI userLevel="intermediate" />
      </TestWrapper>
    )

    expect(screen.getByTestId('intermediate-ui')).toBeInTheDocument()
    expect(screen.getByLabelText('Select joy emotion')).toBeInTheDocument()

    // Test advanced UI
    rerender(
      <TestWrapper>
        <MockProgressiveUI userLevel="advanced" />
      </TestWrapper>
    )

    expect(screen.getByTestId('advanced-ui')).toBeInTheDocument()
    expect(screen.getByText('Mixed Feelings? (Optional)')).toBeInTheDocument()
    expect(screen.getByText('Energy Level')).toBeInTheDocument()
  })
})
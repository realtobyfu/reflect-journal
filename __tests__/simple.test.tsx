import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Simple test to verify Jest setup
describe('Test Setup', () => {
  test('Jest is working correctly', () => {
    const div = document.createElement('div')
    div.textContent = 'Test'
    document.body.appendChild(div)
    
    expect(div).toBeInTheDocument()
    expect(div.textContent).toBe('Test')
  })

  test('React Testing Library is working', () => {
    const TestComponent = () => <div>Hello Test</div>
    
    render(<TestComponent />)
    expect(screen.getByText('Hello Test')).toBeInTheDocument()
  })
})
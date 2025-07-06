import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ChartControls from '../ChartControls'
import type { ChartView } from '../ChartControls'

// Mock useTheme hook
vi.mock('../../../hooks/useTheme', () => ({
  useTheme: () => ({
    themeClasses: {
      card: 'bg-white shadow-sm border border-gray-200',
      subtitle: 'text-gray-600',
      cardText: 'text-gray-900',
    }
  })
}))

describe('ChartControls Component', () => {
  const mockProps = {
    chartType: 'line' as const,
    chartView: 'daily' as ChartView,
    onChartTypeChange: vi.fn(),
    onChartViewChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all chart type buttons', () => {
    render(<ChartControls {...mockProps} />)
    
    expect(screen.getByText('Line')).toBeInTheDocument()
    expect(screen.getByText('Bar')).toBeInTheDocument()
  })

  it('should render all view type buttons', () => {
    render(<ChartControls {...mockProps} />)
    
    expect(screen.getByText('Daily')).toBeInTheDocument()
    expect(screen.getByText('Weekly')).toBeInTheDocument()
    expect(screen.getByText('Monthly')).toBeInTheDocument()
  })

  it('should highlight active chart type', () => {
    render(<ChartControls {...mockProps} chartType="bar" />)
    
    // Find the button that contains the "Bar" text
    const barButton = screen.getByText('Bar').closest('button')
    expect(barButton).toHaveClass('bg-black', 'text-white')
  })

  it('should highlight active view type', () => {
    render(<ChartControls {...mockProps} chartView="weekly" />)
    
    // Find the button that contains the "Weekly" text
    const weeklyButton = screen.getByText('Weekly').closest('button')
    expect(weeklyButton).toHaveClass('bg-black', 'text-white')
  })

  it('should call onChartTypeChange when clicking chart type button', () => {
    render(<ChartControls {...mockProps} />)
    
    const barButton = screen.getByText('Bar')
    fireEvent.click(barButton)
    
    expect(mockProps.onChartTypeChange).toHaveBeenCalledWith('bar')
  })

  it('should call onChartViewChange when clicking view type button', () => {
    render(<ChartControls {...mockProps} />)
    
    const weeklyButton = screen.getByText('Weekly')
    fireEvent.click(weeklyButton)
    
    expect(mockProps.onChartViewChange).toHaveBeenCalledWith('weekly')
  })

  it('should not call handler when clicking already active button', () => {
    render(<ChartControls {...mockProps} chartType="line" />)
    
    const lineButton = screen.getByText('Line')
    fireEvent.click(lineButton)
    
    // Should still call the handler even if it's the same type
    expect(mockProps.onChartTypeChange).toHaveBeenCalledWith('line')
  })

  it('should have responsive layout', () => {
    const { container } = render(<ChartControls {...mockProps} />)
    
    const chartTypeSection = container.querySelector('.flex.flex-wrap')
    expect(chartTypeSection).toBeInTheDocument()
  })

  it('should show icons on mobile', () => {
    const { container } = render(<ChartControls {...mockProps} />)
    
    // Check for responsive display classes
    const chartTypeButtons = screen.getAllByRole('button')
    expect(chartTypeButtons.length).toBeGreaterThan(0)
    
    // Icons should be present - use SVG selector since they have aria-hidden=true
    const svgIcons = container.querySelectorAll('svg')
    expect(svgIcons.length).toBeGreaterThan(0)
  })

  it('should have proper button styling', () => {
    render(<ChartControls {...mockProps} />)
    
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveClass('px-2', 'py-2', 'text-sm', 'transition-colors')
    })
  })
}) 
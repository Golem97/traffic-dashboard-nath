import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatsCards from '../StatsCards'
import type { TrafficStats } from '../../../types/traffic'

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

describe('StatsCards Component', () => {
  const mockStats: TrafficStats = {
    total: 7798,
    average: 127.8,
    highest: 188,
    lowest: 87,
    count: 61,
    period: {
      start: '2025-03-01',
      end: '2025-04-30'
    }
  }

  it('should render all stat cards', () => {
    render(<StatsCards stats={mockStats} loading={false} />)
    
    expect(screen.getByText('Total Visits')).toBeInTheDocument()
    expect(screen.getByText('Average Visits')).toBeInTheDocument()
    expect(screen.getByText('Highest Day')).toBeInTheDocument()
    expect(screen.getByText('Total Days')).toBeInTheDocument()
  })

  it('should display formatted numbers', () => {
    render(<StatsCards stats={mockStats} loading={false} />)
    
    // Le formatage utilise des espaces au lieu de virgules
    expect(screen.getByText('7 798')).toBeInTheDocument()
    expect(screen.getByText('128')).toBeInTheDocument() // Rounded average
    expect(screen.getByText('188')).toBeInTheDocument()
    expect(screen.getByText('61')).toBeInTheDocument()
  })

  it('should show loading state', () => {
    render(<StatsCards stats={null} loading={true} />)
    
    // Should show loading placeholders
    const loadingElements = screen.getAllByText('---')
    expect(loadingElements).toHaveLength(4)
  })

  it('should handle null stats', () => {
    render(<StatsCards stats={null} loading={false} />)
    
    // Should show 0 for all values when stats is null - use getAllByText for multiple elements
    const zeroElements = screen.getAllByText('0')
    expect(zeroElements.length).toBeGreaterThan(0)
  })

  it('should have responsive grid layout', () => {
    const { container } = render(<StatsCards stats={mockStats} loading={false} />)
    
    const gridContainer = container.firstChild
    expect(gridContainer).toHaveClass('grid', 'grid-cols-2', 'md:grid-cols-2', 'lg:grid-cols-4')
  })

  it('should display correct icons for each stat', () => {
    const { container } = render(<StatsCards stats={mockStats} loading={false} />)
    
    // Check that SVG icons are rendered (use class selector since aria-hidden=true)
    const svgIcons = container.querySelectorAll('svg')
    expect(svgIcons).toHaveLength(4)
  })

  it('should apply hover effects', () => {
    const { container } = render(<StatsCards stats={mockStats} loading={false} />)
    
    const cards = container.querySelectorAll('[class*="hover:bg-white/10"]')
    expect(cards).toHaveLength(4)
  })
}) 
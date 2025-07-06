import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiService } from '../api'
import type { TrafficData } from '../../types/traffic'
import { mockAuth, mockUser } from '../../test/setup'

// Mock fetch
global.fetch = vi.fn()

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Ensure mockUser has the token method
    mockUser.getIdToken.mockResolvedValue('test-token')
    mockAuth.currentUser = mockUser
  })

  describe('getTrafficData', () => {
    it('should fetch traffic data successfully', async () => {
      const mockData: TrafficData[] = [
        { date: '2025-03-01', visits: 120 },
        { date: '2025-03-02', visits: 140 },
      ]

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData }),
      } as Response)

      const result = await ApiService.getTrafficData()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/getTrafficData'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        })
      )
      
      // Verify the headers contain the authorization token
      const call = vi.mocked(fetch).mock.calls[0]
      const headers = call[1]?.headers as Headers
      expect(headers.get('Content-Type')).toBe('application/json')
      expect(headers.get('Authorization')).toBe('Bearer test-token')
      
      expect(result).toEqual(mockData)
    })

    it('should handle fetch error', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

      await expect(ApiService.getTrafficData()).rejects.toThrow('Network error')
    })

    it('should handle HTTP error response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Unauthorized' }),
      } as Response)

      await expect(ApiService.getTrafficData()).rejects.toThrow('Unauthorized')
    })
  })

  describe('createTrafficData', () => {
    it('should add traffic data successfully', async () => {
      const newData = { date: '2025-03-03', visits: 150 }
      const mockResponse = { date: '2025-03-03', visits: 150 }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response)

      const result = await ApiService.createTrafficData(newData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('addtrafficdata'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.any(Headers),
          body: JSON.stringify(newData),
        })
      )
      
      // Verify the headers contain the authorization token
      const call = vi.mocked(fetch).mock.calls[0]
      const headers = call[1]?.headers as Headers
      expect(headers.get('Content-Type')).toBe('application/json')
      expect(headers.get('Authorization')).toBe('Bearer test-token')
      
      expect(result).toEqual(mockResponse)
    })

    it('should handle validation error', async () => {
      const invalidData = { date: 'invalid-date', visits: -1 }

      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: 'Invalid data' }),
      } as Response)

      await expect(ApiService.createTrafficData(invalidData)).rejects.toThrow('Invalid data')
    })
  })

  describe('updateTrafficData', () => {
    it('should update traffic data successfully', async () => {
      const updatedData = { date: '2025-03-01', visits: 200 }
      const mockResponse = { date: '2025-03-01', visits: 200 }

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response)

      const result = await ApiService.updateTrafficData('existing-id', updatedData)

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('existing-id'),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.any(Headers),
          body: JSON.stringify(updatedData),
        })
      )
      
      // Verify the headers contain the authorization token
      const call = vi.mocked(fetch).mock.calls[0]
      const headers = call[1]?.headers as Headers
      expect(headers.get('Content-Type')).toBe('application/json')
      expect(headers.get('Authorization')).toBe('Bearer test-token')
      
      expect(result).toEqual(mockResponse)
    })

    it('should handle not found error', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Not found' }),
      } as Response)

      await expect(
        ApiService.updateTrafficData('non-existent-id', { date: '2025-03-01', visits: 100 })
      ).rejects.toThrow('Not found')
    })
  })

  describe('deleteTrafficData', () => {
    it('should delete traffic data successfully', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ data: null }),
      } as Response)

      await expect(ApiService.deleteTrafficData('existing-id')).resolves.not.toThrow()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('existing-id'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.any(Headers),
        })
      )
      
      // Verify the headers contain the authorization token
      const call = vi.mocked(fetch).mock.calls[0]
      const headers = call[1]?.headers as Headers
      expect(headers.get('Content-Type')).toBe('application/json')
      expect(headers.get('Authorization')).toBe('Bearer test-token')
    })

    it('should handle delete error', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ error: 'Server error' }),
      } as Response)

      await expect(ApiService.deleteTrafficData('existing-id')).rejects.toThrow('Server error')
    })
  })

  describe('calculateStats', () => {
    it('should calculate stats correctly', () => {
      const mockData: TrafficData[] = [
        { date: '2025-03-01', visits: 100 },
        { date: '2025-03-02', visits: 200 },
        { date: '2025-03-03', visits: 150 },
      ]

      const result = ApiService.calculateStats(mockData)

      expect(result).toEqual({
        total: 450,
        average: 150,
        highest: 200,
        lowest: 100,
        count: 3,
        period: {
          start: '2025-03-01',
          end: '2025-03-03',
        },
      })
    })

    it('should handle empty data', () => {
      const result = ApiService.calculateStats([])

      expect(result).toEqual({
        total: 0,
        average: 0,
        highest: 0,
        lowest: 0,
        count: 0,
        period: {
          start: '',
          end: '',
        },
      })
    })
  })

  describe('getTrafficStats', () => {
    it('should get traffic stats', async () => {
      const mockData: TrafficData[] = [
        { date: '2025-03-01', visits: 100 },
        { date: '2025-03-02', visits: 200 },
      ]

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ data: mockData }),
      } as Response)

      const result = await ApiService.getTrafficStats()

      expect(result).toEqual({
        total: 300,
        average: 150,
        highest: 200,
        lowest: 100,
        count: 2,
        period: {
          start: '2025-03-01',
          end: '2025-03-02',
        },
      })
    })
  })
}) 
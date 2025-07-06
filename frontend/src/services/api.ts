import { auth } from './firebase';
import type { TrafficData, TrafficStats } from '../types/traffic';
import type { ApiResponse } from '../types/api';

// 🎯 ARCHITECTURE COMPLIANT: HTTP REST API as specified in project requirements
// "Create HTTP-triggered Firebase Cloud Functions to handle all operations"

// API Configuration
const API_BASE_URL = import.meta.env.VITE_FORCE_PRODUCTION === 'true'
  ? 'https://gettrafficdata-rclpdk4xwa-uc.a.run.app'
  : 'http://localhost:5101/traffic-dashboard-nath/us-central1';

// Debug logs
console.log('🔧 API Configuration:');
console.log('  VITE_FORCE_PRODUCTION:', import.meta.env.VITE_FORCE_PRODUCTION);
console.log('  API_BASE_URL:', API_BASE_URL);
console.log('  Mode:', import.meta.env.DEV ? 'Development' : 'Production');

const API_ENDPOINTS = {
  TRAFFIC: '/getTrafficData',
  ADD_TRAFFIC: import.meta.env.VITE_FORCE_PRODUCTION === 'true' 
    ? 'https://addtrafficdata-rclpdk4xwa-uc.a.run.app'
    : '/addTrafficData',
  UPDATE_TRAFFIC: import.meta.env.VITE_FORCE_PRODUCTION === 'true'
    ? 'https://updatetrafficdata-rclpdk4xwa-uc.a.run.app'
    : '/updateTrafficData',
  DELETE_TRAFFIC: import.meta.env.VITE_FORCE_PRODUCTION === 'true'
    ? 'https://deletetrafficdata-rclpdk4xwa-uc.a.run.app'
    : '/deleteTrafficData',
} as const;

// Helper function to get auth token
const getAuthToken = async (): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function to make HTTP requests
const makeRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getAuthToken();
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  });

  // Use full URL if endpoint starts with https, otherwise combine with base URL
  const url = endpoint.startsWith('https') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};

// API Service Class - Matching project specifications exactly
export class ApiService {
  private static handleError(error: unknown): never {
    console.error('API Error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred');
  }

  // GET /api/traffic - Fetch all traffic entries
  static async getTrafficData(): Promise<TrafficData[]> {
    try {
      const result = await makeRequest<ApiResponse<TrafficData[]>>(
        API_ENDPOINTS.TRAFFIC,
        { method: 'GET' }
      );
      return result.data || [];
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST /api/traffic - Add new traffic entry
  static async createTrafficData(data: { date: string; visits: number }): Promise<TrafficData> {
    try {
      const result = await makeRequest<ApiResponse<TrafficData>>(
        API_ENDPOINTS.ADD_TRAFFIC,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      return result.data as TrafficData;
    } catch (error) {
      this.handleError(error);
    }
  }

  // PUT /api/traffic/:id - Update existing traffic entry
  static async updateTrafficData(id: string, data: Partial<{ date: string; visits: number }>): Promise<TrafficData> {
    try {
      const result = await makeRequest<ApiResponse<TrafficData>>(
        `${API_ENDPOINTS.UPDATE_TRAFFIC}?id=${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      return result.data as TrafficData;
    } catch (error) {
      this.handleError(error);
    }
  }

  // DELETE /api/traffic/:id - Remove traffic entry
  static async deleteTrafficData(id: string): Promise<void> {
    try {
      await makeRequest<ApiResponse<void>>(
        `${API_ENDPOINTS.DELETE_TRAFFIC}?id=${id}`,
        { method: 'DELETE' }
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  // Helper method to calculate stats from traffic data
  static calculateStats(data: TrafficData[]): TrafficStats {
    if (!data || data.length === 0) {
      return {
        total: 0,
        average: 0,
        highest: 0,
        lowest: 0,
        count: 0,
        period: {
          start: '',
          end: '',
        },
      };
    }

    const visits = data.map(d => d.visits);
    const total = visits.reduce((sum, visits) => sum + visits, 0);
    const average = Math.round(total / visits.length);
    const highest = Math.max(...visits);
    const lowest = Math.min(...visits);

    // Sort dates to get period
    const sortedDates = data.map(d => d.date).sort();
    const start = sortedDates[0];
    const end = sortedDates[sortedDates.length - 1];

    return {
      total,
      average,
      highest,
      lowest,
      count: data.length,
      period: { start, end },
    };
  }

  // GET traffic stats (computed from data)
  static async getTrafficStats(): Promise<TrafficStats> {
    try {
      const data = await this.getTrafficData();
      return this.calculateStats(data);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default ApiService; 
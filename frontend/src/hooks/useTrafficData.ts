import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../services/api';
import type { TrafficData, TrafficStats } from '../types/traffic';

interface UseTrafficDataReturn {
  data: TrafficData[];
  stats: TrafficStats | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  addEntry: (entry: { date: string; visits: number }) => Promise<void>;
  updateEntry: (id: string, entry: { date: string; visits: number }) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
}

export const useTrafficData = (): UseTrafficDataReturn => {
  const [data, setData] = useState<TrafficData[]>([]);
  const [stats, setStats] = useState<TrafficStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = useCallback((trafficData: TrafficData[]): TrafficStats => {
    if (trafficData.length === 0) {
      return {
        total: 0,
        average: 0,
        highest: 0,
        lowest: 0,
        count: 0,
        period: {
          start: '',
          end: ''
        }
      };
    }

    const visits = trafficData.map(item => item.visits);
    const total = visits.reduce((sum, visits) => sum + visits, 0);
    const sortedDates = trafficData
      .map(item => item.date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return {
      total,
      average: total / trafficData.length,
      highest: Math.max(...visits),
      lowest: Math.min(...visits),
      count: trafficData.length,
      period: {
        start: sortedDates[0] || '',
        end: sortedDates[sortedDates.length - 1] || ''
      }
    };
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const trafficData = await ApiService.getTrafficData();
      setData(trafficData);
      setStats(calculateStats(trafficData));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch traffic data');
      console.error('Error fetching traffic data:', err);
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  const addEntry = useCallback(async (entry: { date: string; visits: number }) => {
    try {
      setError(null);
      await ApiService.createTrafficData(entry);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add traffic entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshData]);

  const updateEntry = useCallback(async (id: string, entry: { date: string; visits: number }) => {
    try {
      setError(null);
      await ApiService.updateTrafficData(id, entry);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update traffic entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshData]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      setError(null);
      await ApiService.deleteTrafficData(id);
      await refreshData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete traffic entry';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [refreshData]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    data,
    stats,
    loading,
    error,
    refreshData,
    addEntry,
    updateEntry,
    deleteEntry
  };
}; 
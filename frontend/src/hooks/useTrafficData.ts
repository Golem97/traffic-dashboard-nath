import { useState, useEffect, useCallback, useMemo } from 'react';
import { ApiService } from '../services/api';
import type { TrafficData, TrafficStats } from '../types/traffic';

interface UseTrafficDataReturn {
  data: TrafficData[];
  filteredData: TrafficData[];
  stats: TrafficStats | null;
  filteredStats: TrafficStats | null;
  loading: boolean;
  error: string | null;
  dateFrom: string;
  dateTo: string;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  clearDateFilter: () => void;
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
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

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

  // Filter data by date range
  const filteredData = useMemo(() => {
    if (!dateFrom && !dateTo) return data;
    
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;
      
      if (fromDate && toDate) {
        return itemDate >= fromDate && itemDate <= toDate;
      } else if (fromDate) {
        return itemDate >= fromDate;
      } else if (toDate) {
        return itemDate <= toDate;
      }
      
      return true;
    });
  }, [data, dateFrom, dateTo]);

  // Calculate stats for filtered data
  const filteredStats = useMemo(() => {
    return calculateStats(filteredData);
  }, [filteredData, calculateStats]);

  const clearDateFilter = useCallback(() => {
    setDateFrom('');
    setDateTo('');
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
    filteredData,
    stats,
    filteredStats,
    loading,
    error,
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    clearDateFilter,
    refreshData,
    addEntry,
    updateEntry,
    deleteEntry
  };
}; 
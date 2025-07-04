export interface TrafficData {
  id?: string;
  date: string;
  visits: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface TrafficDataCreate {
  date: string;
  visits: number;
}

export interface TrafficDataUpdate {
  visits: number;
}

export interface TrafficStats {
  total: number;
  average: number;
  highest: number;
  lowest: number;
  count: number;
  period: {
    start: string;
    end: string;
  };
}

export type ViewMode = 'daily' | 'weekly' | 'monthly';

export interface DateRange {
  start: string;
  end: string;
}

export interface TrafficFilters {
  dateRange?: DateRange;
  minVisits?: number;
  maxVisits?: number;
}

export interface TrafficQuery {
  filters?: TrafficFilters;
  sortBy?: 'date' | 'visits';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
} 
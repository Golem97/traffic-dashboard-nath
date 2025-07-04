export interface TrafficData {
  date: string;
  visits: number;
}

export interface TrafficStats {
  total: number;
  average: number;
  highest: number;
  lowest: number;
}

export type ViewMode = 'daily' | 'weekly' | 'monthly';

export interface DateRange {
  start: string;
  end: string;
} 
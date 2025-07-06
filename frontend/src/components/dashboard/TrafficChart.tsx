import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import type { TrafficData } from '../../types/traffic';
import { format, parseISO, startOfWeek, startOfMonth, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

interface TrafficChartProps {
  data: TrafficData[];
  loading: boolean;
  chartType: 'line' | 'bar';
  chartView: 'daily' | 'weekly' | 'monthly';
}

type AggregatedData = {
  date: string;
  visits: number;
  period: string;
};

const TrafficChart: React.FC<TrafficChartProps> = ({ data, loading, chartType, chartView }) => {
  const { themeClasses } = useTheme();

  const aggregatedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    switch (chartView) {
      case 'weekly': {
        const weeklyData = new Map<string, { visits: number; count: number }>();
        
        sortedData.forEach(item => {
          const weekStart = startOfWeek(parseISO(item.date));
          const weekKey = format(weekStart, 'yyyy-MM-dd');
          
          if (!weeklyData.has(weekKey)) {
            weeklyData.set(weekKey, { visits: 0, count: 0 });
          }
          
          const existing = weeklyData.get(weekKey)!;
          existing.visits += item.visits;
          existing.count += 1;
        });

        return Array.from(weeklyData.entries()).map(([weekStart, { visits }]) => ({
          date: weekStart,
          visits,
          period: `Week of ${format(parseISO(weekStart), 'MMM dd')}`
        }));
      }

      case 'monthly': {
        const monthlyData = new Map<string, { visits: number; count: number }>();
        
        sortedData.forEach(item => {
          const monthStart = startOfMonth(parseISO(item.date));
          const monthKey = format(monthStart, 'yyyy-MM-dd');
          
          if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, { visits: 0, count: 0 });
          }
          
          const existing = monthlyData.get(monthKey)!;
          existing.visits += item.visits;
          existing.count += 1;
        });

        return Array.from(monthlyData.entries()).map(([monthStart, { visits }]) => ({
          date: monthStart,
          visits,
          period: format(parseISO(monthStart), 'MMM yyyy')
        }));
      }

      default: // daily
        return sortedData.map(item => ({
          date: item.date,
          visits: item.visits,
          period: format(parseISO(item.date), 'MMM dd')
        }));
    }
  }, [data, chartView]);

  const formatXAxisLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    switch (chartView) {
      case 'weekly':
        return format(date, 'MMM dd');
      case 'monthly':
        return format(date, 'MMM yyyy');
      default:
        return format(date, 'MMM dd');
    }
  };

  const formatTooltipLabel = (dateStr: string) => {
    const item = aggregatedData.find(d => d.date === dateStr);
    return item?.period || dateStr;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${themeClasses.card} p-3 border border-gray-200 shadow-lg`}>
          <p className={`font-medium ${themeClasses.title}`}>
            {formatTooltipLabel(label)}
          </p>
          <p className={`${themeClasses.subtitle}`}>
            <span className="font-medium text-blue-500">Visits:</span>{' '}
            <span className="font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`h-96 flex flex-col items-center justify-center ${themeClasses.chartPlaceholder} rounded-lg`}>
        <div className={`text-4xl mb-4 ${themeClasses.subtitle}`}>📊</div>
        <h3 className={`text-lg font-medium ${themeClasses.title} mb-2`}>No Data Available</h3>
        <p className={`${themeClasses.subtitle} text-center max-w-md`}>
          Start by adding some traffic data to see your analytics visualization here.
        </p>
      </div>
    );
  }

  const chartProps = {
    data: aggregatedData,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <LineChart {...chartProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb"
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="#6b7280"
            />
            <YAxis 
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="visits" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        ) : (
          <BarChart {...chartProps}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb"
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              stroke="#6b7280"
            />
            <YAxis 
              stroke="#6b7280"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="visits" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart; 

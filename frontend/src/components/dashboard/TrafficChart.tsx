import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import type { TrafficData } from '../../types/traffic';
import type { ChartView } from './ChartControls';

interface TrafficChartProps {
  data: TrafficData[];
  loading: boolean;
  chartType?: 'line' | 'bar';
  chartView?: ChartView;
}

const TrafficChart: React.FC<TrafficChartProps> = ({ 
  data, 
  loading, 
  chartType = 'line', 
  chartView = 'daily' 
}) => {
  const { isDarkMode, themeClasses } = useTheme();

  const aggregatedData = useMemo(() => {
    if (!data.length) return [];

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    switch (chartView) {
      case 'daily':
        return sortedData.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          visits: item.visits,
          fullDate: item.date,
          period: item.date,
        }));

      case 'weekly': {
        const weeklyData = new Map<string, { visits: number; dates: string[]; startDate: Date }>();
        
        sortedData.forEach(item => {
          const date = new Date(item.date);
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
          const weekKey = weekStart.toISOString().split('T')[0];
          
          if (!weeklyData.has(weekKey)) {
            weeklyData.set(weekKey, { visits: 0, dates: [], startDate: weekStart });
          }
          
          const week = weeklyData.get(weekKey)!;
          week.visits += item.visits;
          week.dates.push(item.date);
        });

        return Array.from(weeklyData.entries()).map(([weekKey, week]) => {
          const weekEnd = new Date(week.startDate);
          weekEnd.setDate(week.startDate.getDate() + 6);
          
          return {
            date: `${week.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
            visits: week.visits,
            fullDate: weekKey,
            period: `Week of ${week.startDate.toLocaleDateString('en-US')}`,
          };
        });
      }

      case 'monthly': {
        const monthlyData = new Map<string, { visits: number; dates: string[] }>();
        
        sortedData.forEach(item => {
          const date = new Date(item.date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, { visits: 0, dates: [] });
          }
          
          const month = monthlyData.get(monthKey)!;
          month.visits += item.visits;
          month.dates.push(item.date);
        });

        return Array.from(monthlyData.entries()).map(([monthKey, month]) => {
          const [year, monthNum] = monthKey.split('-');
          const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
          
          return {
            date: date.toLocaleDateString('en-US', { 
              year: 'numeric',
              month: 'short'
            }),
            visits: month.visits,
            fullDate: monthKey,
            period: date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
          };
        });
      }

      default:
        return sortedData.map(item => ({
          date: new Date(item.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          visits: item.visits,
          fullDate: item.date,
          period: item.date,
        }));
    }
  }, [data, chartView]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`${themeClasses.card} p-3 shadow-lg border`}>
          <p className={`${themeClasses.title} font-medium`}>{data.period}</p>
          <p className={`${themeClasses.subtitle} text-sm`}>
            Visits: <span className="font-bold text-blue-500">{payload[0].value.toLocaleString()}</span>
          </p>
          {chartView !== 'daily' && (
            <p className={`${themeClasses.subtitle} text-xs mt-1`}>
              {chartView === 'weekly' ? 'Weekly total' : 'Monthly total'}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getChartTitle = () => {
    const viewLabels = {
      daily: 'Daily Traffic',
      weekly: 'Weekly Traffic',
      monthly: 'Monthly Traffic'
    };
    return viewLabels[chartView];
  };

  if (loading) {
    return (
      <div className={`${themeClasses.card} p-8`}>
        <div className="flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${themeClasses.card} p-8`}>
        <h3 className={`text-xl font-bold ${themeClasses.title} mb-6`}>{getChartTitle()}</h3>
        <div className={`h-80 ${themeClasses.chartPlaceholder} rounded-lg flex items-center justify-center`}>
          <div className="text-center">
            <p className={themeClasses.subtitle}>No traffic data available</p>
            <p className={`${themeClasses.subtitle} text-sm mt-2`}>
              Add some traffic entries to see the chart
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <LineChart data={aggregatedData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="date" 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
              angle={chartView === 'daily' ? 0 : -45}
              textAnchor={chartView === 'daily' ? 'middle' : 'end'}
              height={chartView === 'daily' ? 30 : 60}
            />
            <YAxis 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="visits" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        ) : (
          <BarChart data={aggregatedData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="date" 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
              angle={chartView === 'daily' ? 0 : -45}
              textAnchor={chartView === 'daily' ? 'middle' : 'end'}
              height={chartView === 'daily' ? 30 : 60}
            />
            <YAxis 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
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

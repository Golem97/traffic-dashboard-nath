import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import type { TrafficData } from '../../types/traffic';

interface TrafficChartProps {
  data: TrafficData[];
  loading: boolean;
  chartType?: 'line' | 'bar';
}

const TrafficChart: React.FC<TrafficChartProps> = ({ data, loading, chartType = 'line' }) => {
  const { isDarkMode, themeClasses } = useTheme();

  const chartData = data
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      visits: item.visits,
      fullDate: item.date,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${themeClasses.card} p-3 shadow-lg border`}>
          <p className={`${themeClasses.title} font-medium`}>{label}</p>
          <p className={`${themeClasses.subtitle} text-sm`}>
            Visits: <span className="font-bold text-blue-500">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
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
        <h3 className={`text-xl font-bold ${themeClasses.title} mb-6`}>Traffic Analytics</h3>
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
    <div className={`${themeClasses.card} p-8`}>
      <h3 className={`text-xl font-bold ${themeClasses.title} mb-6`}>Traffic Analytics</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
              />
              <XAxis 
                dataKey="date" 
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                fontSize={12}
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
            <BarChart data={chartData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
              />
              <XAxis 
                dataKey="date" 
                stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
                fontSize={12}
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
    </div>
  );
};

export default TrafficChart; 
import React from 'react';
import { BarChart3, TrendingUp, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export type ChartView = 'daily' | 'weekly' | 'monthly';

interface ChartControlsProps {
  chartType: 'line' | 'bar';
  chartView: ChartView;
  onChartTypeChange: (type: 'line' | 'bar') => void;
  onChartViewChange: (view: ChartView) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({ 
  chartType, 
  chartView, 
  onChartTypeChange, 
  onChartViewChange 
}) => {
  const { themeClasses } = useTheme();

  const typeControls = [
    {
      type: 'line' as const,
      icon: TrendingUp,
      label: 'Line Chart',
    },
    {
      type: 'bar' as const,
      icon: BarChart3,
      label: 'Bar Chart',
    },
  ];

  const viewControls = [
    {
      view: 'daily' as const,
      icon: Calendar,
      label: 'Daily',
    },
    {
      view: 'weekly' as const,
      icon: CalendarDays,
      label: 'Weekly',
    },
    {
      view: 'monthly' as const,
      icon: CalendarRange,
      label: 'Monthly',
    },
  ];

  return (
    <div className="flex items-center space-x-6 mb-4 flex-wrap gap-2">
      {/* Chart Type Controls */}
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium ${themeClasses.subtitle}`}>Chart Type:</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {typeControls.map((control) => {
            const Icon = control.icon;
            const isActive = chartType === control.type;
            
            return (
              <button
                key={control.type}
                onClick={() => onChartTypeChange(control.type)}
                className={`px-3 py-2 flex items-center space-x-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : `${themeClasses.button} hover:bg-gray-100 dark:hover:bg-gray-700`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{control.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart View Controls */}
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium ${themeClasses.subtitle}`}>View:</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          {viewControls.map((control) => {
            const Icon = control.icon;
            const isActive = chartView === control.view;
            
            return (
              <button
                key={control.view}
                onClick={() => onChartViewChange(control.view)}
                className={`px-3 py-2 flex items-center space-x-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-500 text-white'
                    : `${themeClasses.button} hover:bg-gray-100 dark:hover:bg-gray-700`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{control.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartControls; 

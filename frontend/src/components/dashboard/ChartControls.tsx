import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ChartControlsProps {
  chartType: 'line' | 'bar';
  onChartTypeChange: (type: 'line' | 'bar') => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({ chartType, onChartTypeChange }) => {
  const { themeClasses } = useTheme();

  const controls = [
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

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span className={`text-sm font-medium ${themeClasses.subtitle}`}>Chart Type:</span>
      <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {controls.map((control) => {
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
  );
};

export default ChartControls; 
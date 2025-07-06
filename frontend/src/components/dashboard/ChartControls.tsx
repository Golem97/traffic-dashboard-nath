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
      shortLabel: 'Line',
    },
    {
      type: 'bar' as const,
      icon: BarChart3,
      label: 'Bar Chart',
      shortLabel: 'Bar',
    },
  ];

  const viewControls = [
    {
      view: 'daily' as const,
      icon: Calendar,
      label: 'Daily',
      shortLabel: 'D',
    },
    {
      view: 'weekly' as const,
      icon: CalendarDays,
      label: 'Weekly',
      shortLabel: 'W',
    },
    {
      view: 'monthly' as const,
      icon: CalendarRange,
      label: 'Monthly',
      shortLabel: 'M',
    },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Chart Type Controls */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${themeClasses.subtitle} hidden sm:block`}>Type:</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          {typeControls.map((control) => {
            const Icon = control.icon;
            const isActive = chartType === control.type;
            
            return (
              <button
                key={control.type}
                onClick={() => onChartTypeChange(control.type)}
                className={`px-2 sm:px-3 py-2 flex items-center justify-center gap-1 sm:gap-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
                title={control.label}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{control.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart View Controls */}
      <div className="flex items-center gap-2">
        <span className={`text-sm font-medium ${themeClasses.subtitle} hidden sm:block`}>View:</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200">
          {viewControls.map((control) => {
            const Icon = control.icon;
            const isActive = chartView === control.view;
            
            return (
              <button
                key={control.view}
                onClick={() => onChartViewChange(control.view)}
                className={`px-2 sm:px-3 py-2 flex items-center justify-center gap-1 sm:gap-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
                title={control.label}
              >
                <Icon className="w-4 h-4" />
                <span className="block lg:hidden">{control.shortLabel}</span>
                <span className="hidden lg:block">{control.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartControls; 

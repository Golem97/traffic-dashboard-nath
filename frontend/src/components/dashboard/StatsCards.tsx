import React from 'react';
import { TrendingUp, Users, Activity, BarChart3 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import type { TrafficStats } from '../../types/traffic';

interface StatsCardsProps {
  stats: TrafficStats | null;
  loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading }) => {
  const { themeClasses } = useTheme();

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const cards = [
    {
      title: 'Total Visits',
      value: stats?.total || 0,
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Average Visits',
      value: Math.round(stats?.average || 0),
      icon: Activity,
      color: 'text-green-500',
    },
    {
      title: 'Highest Day',
      value: stats?.highest || 0,
      icon: TrendingUp,
      color: 'text-purple-500',
    },
    {
      title: 'Total Days',
      value: stats?.count || 0,
      icon: BarChart3,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`${themeClasses.card} p-6 transition-all duration-200 hover:bg-white/10`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.subtitle} text-sm`}>{card.title}</p>
                <p className={`text-2xl font-bold ${themeClasses.cardText}`}>
                  {loading ? (
                    <span className="animate-pulse">---</span>
                  ) : (
                    formatNumber(card.value)
                  )}
                </p>
              </div>
              <Icon className={`w-10 h-10 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards; 
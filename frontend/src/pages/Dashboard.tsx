import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { LogOut, BarChart3, TrendingUp, Users, Activity, Sun, Moon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={themeClasses.background}>
      {/* Header */}
      <header className={themeClasses.header}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className={`w-8 h-8 ${themeClasses.title} mr-3`} />
              <h1 className={`text-xl font-bold ${themeClasses.title}`}>Traffic Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${themeClasses.toggleButton} transition-all duration-200`}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              
              <div className="text-right">
                <p className={`text-sm ${themeClasses.subtitle}`}>Welcome,</p>
                <p className={`${themeClasses.title} font-medium`}>{user?.displayName || user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className={`${themeClasses.button} px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200`}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className={`${themeClasses.card} p-8 mb-8`}>
          <h2 className={`text-2xl font-bold ${themeClasses.title} mb-4`}>
            Traffic Dashboard
          </h2>
          <p className={themeClasses.subtitle}>
            Welcome to your dashboard. Here you can visualize and manage your traffic data with elegance.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`${themeClasses.card} p-6 transition-all duration-200 hover:bg-white/10`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.subtitle} text-sm`}>Total Visitors</p>
                <p className={`text-2xl font-bold ${themeClasses.cardText}`}>12,345</p>
              </div>
              <Users className={`w-10 h-10 ${themeClasses.icon}`} />
            </div>
          </div>

          <div className={`${themeClasses.card} p-6 transition-all duration-200 hover:bg-white/10`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.subtitle} text-sm`}>Page Views</p>
                <p className={`text-2xl font-bold ${themeClasses.cardText}`}>45,678</p>
              </div>
              <Activity className={`w-10 h-10 ${themeClasses.icon}`} />
            </div>
          </div>

          <div className={`${themeClasses.card} p-6 transition-all duration-200 hover:bg-white/10`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.subtitle} text-sm`}>Conversion Rate</p>
                <p className={`text-2xl font-bold ${themeClasses.cardText}`}>3.2%</p>
              </div>
              <TrendingUp className={`w-10 h-10 ${themeClasses.icon}`} />
            </div>
          </div>

          <div className={`${themeClasses.card} p-6 transition-all duration-200 hover:bg-white/10`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${themeClasses.subtitle} text-sm`}>Revenue</p>
                <p className={`text-2xl font-bold ${themeClasses.cardText}`}>$2,345</p>
              </div>
              <BarChart3 className={`w-10 h-10 ${themeClasses.icon}`} />
            </div>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className={`${themeClasses.card} p-8`}>
          <h3 className={`text-xl font-bold ${themeClasses.title} mb-6`}>Traffic Analytics</h3>
          <div className={`h-64 ${themeClasses.chartPlaceholder} rounded-lg flex items-center justify-center`}>
            <div className="text-center">
              <BarChart3 className={`w-16 h-16 ${themeClasses.icon} mx-auto mb-4`} />
              <p className={themeClasses.subtitle}>Charts will be available soon</p>
              <p className={`${themeClasses.subtitle} text-sm mt-2`}>
                Interface in {isDarkMode ? 'dark' : 'light'} theme
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 
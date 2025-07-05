import React from 'react';
import { LogOut, BarChart3, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const DashboardHeader: React.FC = () => {
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
    <header className={themeClasses.header}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <BarChart3 className={`w-8 h-8 ${themeClasses.title} mr-3`} />
            <h1 className={`text-xl font-bold ${themeClasses.title}`}>Traffic Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
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
  );
};

export default DashboardHeader; 
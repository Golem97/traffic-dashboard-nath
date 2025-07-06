import React, { useState } from 'react';
import { LogOut, BarChart3, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { resetData } from '../../services/dataReset';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  const [isResetting, setIsResetting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleResetData = async () => {
    if (!confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      return;
    }

    setIsResetting(true);
    try {
      await resetData();
      alert('Data has been successfully reset!');
      // Reload the page to refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Error resetting data:', error);
      alert('Failed to reset data. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const isProduction = import.meta.env.VITE_FORCE_PRODUCTION === 'true';

  return (
    <div className={`${themeClasses.card} shadow-sm border-b border-gray-200 px-6 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <BarChart3 className={`w-8 h-8 ${themeClasses.title} mr-3`} />
            <h1 className={`text-xl font-bold ${themeClasses.title}`}>Traffic Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isProduction 
                ? 'bg-red-100 text-red-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md ${themeClasses.button} hover:bg-gray-100 transition-colors`}
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          
          <button
            onClick={handleResetData}
            disabled={isResetting}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isResetting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isResetting ? 'Resetting...' : 'Reset Data'}
          </button>
          
          <div className="text-right">
            <div className={`text-sm font-medium ${themeClasses.title}`}>
              {user?.email}
            </div>
            <button
              onClick={handleLogout}
              className={`inline-flex items-center text-sm ${themeClasses.subtitle} hover:${themeClasses.title} transition-colors`}
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader; 
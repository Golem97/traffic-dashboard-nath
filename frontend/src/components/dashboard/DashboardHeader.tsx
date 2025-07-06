import React, { useState } from 'react';
import { LogOut, BarChart3, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { resetData } from '../../services/dataReset';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { themeClasses } = useTheme();
  const [isResetting, setIsResetting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-black p-1.5 rounded-md">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:flex items-center space-x-3">
                <h1 className="text-lg font-semibold text-gray-900">Traffic Dashboard</h1>
                <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wide ${
                  isProduction 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {isProduction ? 'Prod' : 'Dev'}
                </span>
              </div>
              {/* Mobile title */}
              <h1 className="sm:hidden text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            {/* Desktop - Right side */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleResetData}
                disabled={isResetting}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  isResetting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isResetting ? 'Resetting...' : 'Reset Data'}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-gray-900">
                  {user?.email}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-2 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Mobile - Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Topsheet */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/20" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="bg-black p-1.5 rounded-md">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Environment Badge */}
              <div className="mb-4">
                <span className={`inline-flex px-3 py-1 rounded-md text-sm font-medium uppercase tracking-wide ${
                  isProduction 
                    ? 'bg-red-50 text-red-700 border border-red-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {isProduction ? 'Production' : 'Development'}
                </span>
              </div>

              {/* User Info */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="text-sm text-gray-600 mb-1">Signed in as</div>
                <div className="text-sm font-medium text-gray-900">{user?.email}</div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleResetData();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isResetting}
                  className={`w-full px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                    isResetting
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isResetting ? 'Resetting Data...' : 'Reset Data'}
                </button>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader; 
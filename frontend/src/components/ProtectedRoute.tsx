import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loader while authentication state is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to authentication if user is not logged in
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Show protected content if user is logged in
  return <>{children}</>;
};

export default ProtectedRoute; 
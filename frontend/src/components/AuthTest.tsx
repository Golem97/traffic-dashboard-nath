import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials, RegisterCredentials } from '../types/auth';

/**
 * Authentication test component
 * Interactive component for testing login, register, and logout functionality
 */
export const AuthTest: React.FC = () => {
  const {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: 'test@example.com',
    password: 'password123',
    displayName: 'Test User',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'login') {
        const credentials: LoginCredentials = {
          email: formData.email,
          password: formData.password,
        };
        await login(credentials);
      } else {
        const credentials: RegisterCredentials = {
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
        };
        await register(credentials);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(formData.email);
      alert('Reset email sent!');
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Authentication Test
      </h2>

      {/* Auth state */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold mb-2">State:</h3>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        {user && (
          <div className="mt-2 text-sm">
            <p>UID: {user.uid}</p>
            <p>Email: {user.email}</p>
            <p>Name: {user.displayName || 'Not set'}</p>
            <p>Email verified: {user.emailVerified ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>

      {/* Errors */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-sm underline"
          >
            Clear
          </button>
        </div>
      )}

      {isAuthenticated ? (
        /* Logged in user */
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Welcome, {user?.displayName || user?.email}!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You are successfully logged in.
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
          >
            Logout
          </button>
        </div>
      ) : (
        /* Login/register form */
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mode selector */}
          <div className="flex space-x-2 mb-4">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded ${
                mode === 'login'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded ${
                mode === 'register'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Register')}
          </button>

          {mode === 'login' && (
            <button
              type="button"
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full text-sm text-blue-500 hover:text-blue-600 underline"
            >
              Forgot password?
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default AuthTest; 
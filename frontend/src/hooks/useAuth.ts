import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { AuthService } from '../services/auth.service';
import type { AuthState, AuthUser, LoginCredentials, RegisterCredentials } from '../types/auth';

/**
 * Custom hook for authentication state management
 * Provides auth state and methods for login, logout, register, etc.
 */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  });

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User logged in - get complete data
          const user = await AuthService.getCurrentUser();
          setState({
            user,
            loading: false,
            error: null,
            isAuthenticated: true,
          });
        } else {
          // User logged out
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Error getting user:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * User login
   */
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const user = await AuthService.login(credentials);
      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Login error',
      }));
      throw error;
    }
  };

  /**
   * User login with Google
   */
  const loginWithGoogle = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const user = await AuthService.loginWithGoogle();
      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Google login error',
      }));
      throw error;
    }
  };

  /**
   * User registration
   */
  const register = async (credentials: RegisterCredentials): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const user = await AuthService.register(credentials);
      setState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Registration error',
      }));
      throw error;
    }
  };

  /**
   * User logout
   */
  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await AuthService.logout();
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Logout error',
      }));
      throw error;
    }
  };

  /**
   * Password reset
   */
  const resetPassword = async (email: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await AuthService.resetPassword(email);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Reset error',
      }));
      throw error;
    }
  };

  /**
   * Update profile
   */
  const updateProfile = async (updates: { displayName?: string }): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await AuthService.updateUserProfile(updates);
      
      // Update local state
      if (state.user) {
        const updatedUser: AuthUser = {
          ...state.user,
          displayName: updates.displayName || state.user.displayName,
        };
        setState(prev => ({
          ...prev,
          user: updatedUser,
          loading: false,
        }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Update error',
      }));
      throw error;
    }
  };

  /**
   * Clear errors
   */
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  /**
   * Get auth token
   */
  const getToken = async (): Promise<string | null> => {
    return await AuthService.getCurrentToken();
  };

  return {
    // State
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    
    // Actions
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    updateProfile,
    clearError,
    getToken,
  };
};

export default useAuth; 
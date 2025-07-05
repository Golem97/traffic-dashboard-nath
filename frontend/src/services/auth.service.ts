import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  type User
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import type { LoginCredentials, RegisterCredentials, AuthUser } from '../types/auth';

/**
 * Firebase Authentication Service
 * Handles login, logout, register, password reset, and profile updates
 */
export class AuthService {
  
  /**
   * User login with email/password
   */
  static async login(credentials: LoginCredentials): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        credentials.email, 
        credentials.password
      );
      
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      return this.mapFirebaseUser(user, token);
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  /**
   * User login with Google
   */
  static async loginWithGoogle(): Promise<AuthUser> {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      const token = await user.getIdToken();
      
      return this.mapFirebaseUser(user, token);
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  /**
   * User registration
   */
  static async register(credentials: RegisterCredentials): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const user = userCredential.user;

      // Update profile with display name
      if (credentials.displayName) {
        await updateProfile(user, {
          displayName: credentials.displayName
        });
      }

      const token = await user.getIdToken();
      return this.mapFirebaseUser(user, token);
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  /**
   * User logout
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  /**
   * Send password reset email
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(updates: { displayName?: string }): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      await updateProfile(currentUser, updates);
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  /**
   * Get current auth token
   */
  static async getCurrentToken(): Promise<string | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
      
      return await currentUser.getIdToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  /**
   * Get current user with token
   */
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return null;
      
      const token = await currentUser.getIdToken();
      return this.mapFirebaseUser(currentUser, token);
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Map Firebase user to AuthUser type
   */
  private static mapFirebaseUser(user: User, token: string): AuthUser {
    return {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      token,
      metadata: {
        creationTime: user.metadata.creationTime || null,
        lastSignInTime: user.metadata.lastSignInTime || null,
      }
    };
  }

  /**
   * Handle Firebase auth errors
   */
  private static handleAuthError(error: unknown): never {
    console.error('Auth error:', error);
    
    if (error && typeof error === 'object' && 'code' in error) {
      const firebaseError = error as { code: string; message: string };
      
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          throw new Error('No user found with this email');
        case 'auth/wrong-password':
          throw new Error('Incorrect password');
        case 'auth/email-already-in-use':
          throw new Error('Email already in use');
        case 'auth/weak-password':
          throw new Error('Password must be at least 6 characters');
        case 'auth/invalid-email':
          throw new Error('Invalid email address');
        case 'auth/too-many-requests':
          throw new Error('Too many attempts. Please try again later');
        case 'auth/network-request-failed':
          throw new Error('Network error. Check your connection');
        case 'auth/popup-closed-by-user':
          throw new Error('Sign-in popup was closed before completion');
        case 'auth/popup-blocked':
          throw new Error('Sign-in popup was blocked by browser');
        case 'auth/cancelled-popup-request':
          throw new Error('Sign-in popup request was cancelled');
        case 'auth/account-exists-with-different-credential':
          throw new Error('Account already exists with different sign-in method');
        default:
          throw new Error(firebaseError.message || 'Authentication error');
      }
    }
    
    throw new Error('Unknown authentication error');
  }
}

export default AuthService; 
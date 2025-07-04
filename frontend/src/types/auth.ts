export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName?: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  token: string;
  metadata: {
    creationTime: string | null;
    lastSignInTime: string | null;
  };
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
} 
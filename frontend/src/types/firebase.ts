import { FirebaseError } from 'firebase/app';
import type { User as FirebaseUser } from 'firebase/auth';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseAuthError {
  code: string;
  message: string;
  customData?: Record<string, unknown>;
}

export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

export interface FirestoreDocument {
  id: string;
  data: Record<string, unknown>;
  createdAt?: FirebaseTimestamp;
  updatedAt?: FirebaseTimestamp;
}

export { FirebaseError };
export type { FirebaseUser }; 
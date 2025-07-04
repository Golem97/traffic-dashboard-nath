import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate configuration
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Emulator connection state
let emulatorConnectionState = {
  auth: false,
  firestore: false,
  functions: false,
};

// Connect to emulators in development with error handling
if (import.meta.env.DEV) {
  try {
    if (!emulatorConnectionState.auth) {
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      emulatorConnectionState.auth = true;
      console.log('🔐 Auth Emulator connected');
    }
  } catch (error) {
    console.warn('⚠️ Auth Emulator connection failed:', error);
  }

  try {
    if (!emulatorConnectionState.firestore) {
      connectFirestoreEmulator(db, 'localhost', 8080);
      emulatorConnectionState.firestore = true;
      console.log('📊 Firestore Emulator connected');
    }
  } catch (error) {
    console.warn('⚠️ Firestore Emulator connection failed:', error);
  }

  try {
    if (!emulatorConnectionState.functions) {
      connectFunctionsEmulator(functions, 'localhost', 5001);
      emulatorConnectionState.functions = true;
      console.log('⚡ Functions Emulator connected');
    }
  } catch (error) {
    console.warn('⚠️ Functions Emulator connection failed:', error);
  }
}

// Export connection state for debugging
export const getEmulatorConnectionState = () => emulatorConnectionState;

// Export app configuration for debugging
export const getFirebaseConfig = () => ({
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  isDev: import.meta.env.DEV,
  emulators: emulatorConnectionState,
});

export default app; 
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth';
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

// Frontend only has access to Auth and Functions (NO DIRECT FIRESTORE ACCESS)
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Emulator connection state (removed Firestore)
let emulatorConnectionState = {
  auth: false,
  functions: false,
};

// Connect to emulators in development with error handling
if (import.meta.env.DEV && import.meta.env.VITE_FORCE_PRODUCTION !== 'true') {
  try {
    if (!emulatorConnectionState.auth) {
      connectAuthEmulator(auth, 'http://localhost:9199', { disableWarnings: true });
      emulatorConnectionState.auth = true;
      console.log('🔐 Auth Emulator connected on port 9199');
    }
  } catch (error) {
    console.warn('⚠️ Auth Emulator connection failed:', error);
  }

  try {
    if (!emulatorConnectionState.functions) {
      connectFunctionsEmulator(functions, 'localhost', 5101);
      emulatorConnectionState.functions = true;
      console.log('⚡ Functions Emulator connected on port 5101');
    }
  } catch (error) {
    console.warn('⚠️ Functions Emulator connection failed:', error);
  }
} else if (import.meta.env.VITE_FORCE_PRODUCTION === 'true') {
  console.log('🚀 Production mode: Emulators disabled');
  console.log('🔐 Auth: Using production Firebase Auth');
  console.log('⚡ Functions: Using production Cloud Functions');
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
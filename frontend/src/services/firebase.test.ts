import { auth, functions, getEmulatorConnectionState, getFirebaseConfig } from './firebase';

// Test Firebase configuration
export const testFirebaseConfig = () => {
  console.log('🔥 Firebase Configuration Test');
  
  // Test Firebase Auth
  console.log('✅ Auth instance:', auth.app.name);
  console.log('📧 Auth ready:', !!auth);
  
  // Test Functions
  console.log('✅ Functions instance:', functions.app.name);
  console.log('⚡ Functions ready:', !!functions);
  
  // Test Emulator connections
  const emulatorState = getEmulatorConnectionState();
  console.log('🔌 Emulator connections:', emulatorState);
  
  // Test Firebase config
  const config = getFirebaseConfig();
  console.log('🔧 Firebase config:', config);
  
  // Test Environment Variables
  const envCheck = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
  };
  
  console.log('🔧 Environment Variables:', envCheck);
  
  // Note: NO DIRECT FIRESTORE ACCESS (by design)
  console.log('🚨 Architecture Note: Direct Firestore access is disabled for security');
  console.log('📡 Data access: Frontend → HTTP REST API → Cloud Functions → Firestore');
  
  return {
    auth: !!auth,
    functions: !!functions,
    emulators: emulatorState,
    config: Object.values(envCheck).every(status => status === '✅ Set'),
    // Note: db is intentionally NOT available
    architecture: 'HTTP REST API (compliant with specifications)',
  };
};

// Call test in development
if (import.meta.env.DEV) {
  testFirebaseConfig();
} 
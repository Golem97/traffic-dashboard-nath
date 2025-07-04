import { auth, db, functions } from './firebase';

// Test Firebase configuration
export const testFirebaseConfig = () => {
  console.log('🔥 Firebase Configuration Test');
  
  // Test Firebase Auth
  console.log('✅ Auth instance:', auth.app.name);
  console.log('📧 Auth ready:', !!auth);
  
  // Test Firestore
  console.log('✅ Firestore instance:', db.app.name);
  console.log('📊 Firestore ready:', !!db);
  
  // Test Functions
  console.log('✅ Functions instance:', functions.app.name);
  console.log('⚡ Functions ready:', !!functions);
  
  // Test Environment Variables
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
  };
  
  console.log('🔧 Environment Variables:', config);
  
  return {
    auth: !!auth,
    db: !!db,
    functions: !!functions,
    config: Object.values(config).every(status => status === '✅ Set'),
  };
};

// Call test in development
if (import.meta.env.DEV) {
  testFirebaseConfig();
} 
import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock Firebase Auth avec token
const mockUser = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  photoURL: null,
  getIdToken: vi.fn().mockResolvedValue('test-token'),
  metadata: {
    creationTime: '2024-01-01',
    lastSignInTime: '2024-01-01',
  }
}

const mockAuth = {
  currentUser: mockUser,
  onAuthStateChanged: vi.fn((callback) => {
    // Call immediately instead of with setTimeout to avoid async issues
    callback(mockAuth.currentUser)
    return vi.fn() // unsubscribe function
  }),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  signInWithPopup: vi.fn(),
  app: {
    name: '[DEFAULT]',
    options: {}
  }
}

vi.mock('firebase/auth', () => ({
  getAuth: () => mockAuth,
  onAuthStateChanged: mockAuth.onAuthStateChanged,
  signInWithEmailAndPassword: mockAuth.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockAuth.createUserWithEmailAndPassword,
  signOut: mockAuth.signOut,
  signInWithPopup: mockAuth.signInWithPopup,
  GoogleAuthProvider: vi.fn().mockImplementation(() => ({
    addScope: vi.fn(),
  })),
  updateProfile: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}))

vi.mock('firebase/functions', () => ({
  getFunctions: vi.fn(),
  connectFunctionsEmulator: vi.fn(),
}))

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(),
}))

// Mock des services Firebase directement
vi.mock('../services/firebase', () => ({
  auth: mockAuth,
  googleProvider: {
    addScope: vi.fn(),
  }
}))

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_FIREBASE_API_KEY: 'test-api-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'test-project',
    VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
    VITE_FIREBASE_APP_ID: '1:123456789:web:test',
    VITE_FORCE_PRODUCTION: 'false',
  },
})

// Global fetch mock
global.fetch = vi.fn()

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Export mocks for use in tests
export { mockAuth, mockUser }

// Cleanup after each test case
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  // Reset mock user
  mockAuth.currentUser = mockUser
  mockUser.getIdToken.mockResolvedValue('test-token')
  // Reset onAuthStateChanged with default behavior
  mockAuth.onAuthStateChanged.mockImplementation((callback) => {
    callback(mockAuth.currentUser)
    return vi.fn() // unsubscribe function
  })
}) 
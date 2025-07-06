import * as functionsTest from 'firebase-functions-test';

// Initialize Firebase Functions Test SDK
export const test = functionsTest.default({
  projectId: 'test-project',
});

// Mock Firestore methods
export const mockFirestore = {
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    })),
    add: jest.fn().mockResolvedValue({ id: 'new-doc-id' }),
    where: jest.fn(() => ({
      limit: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ empty: true }),
      })),
    })),
    orderBy: jest.fn(() => ({
      get: jest.fn().mockResolvedValue({ 
        forEach: jest.fn()
      }),
    })),
    get: jest.fn().mockResolvedValue({ forEach: jest.fn() }),
  })),
};

// Mock Auth methods
export const mockAuth = {
  verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-id' }),
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
};

// Mock Firebase Admin - THIS IS THE KEY PART
jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  apps: [], // Mock the apps array
  firestore: jest.fn(() => mockFirestore),
  auth: jest.fn(() => mockAuth),
}));

// Mock logger to avoid console spam
jest.mock('firebase-functions/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
  warn: jest.fn(),
}));

// Global test cleanup
afterEach(() => {
  jest.clearAllMocks();
}); 
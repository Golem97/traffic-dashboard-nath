// 🎯 ARCHITECTURE: Frontend -> HTTP REST API -> Cloud Functions -> Firestore
// "Create HTTP-triggered Firebase Cloud Functions to handle all operations"

// API Configuration for HTTP REST endpoints
export const API_CONFIG = {
  BASE_URL_DEV: 'http://localhost:5101/traffic-dashboard-nath/us-central1',
  BASE_URL_PROD: 'https://us-central1-traffic-dashboard-nath.cloudfunctions.net',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// HTTP REST API endpoints (as specified in project requirements)
export const API_ENDPOINTS = {
  GET_TRAFFIC: '/getTrafficData',        // GET /api/traffic
  ADD_TRAFFIC: '/addTrafficData',        // POST /api/traffic
  UPDATE_TRAFFIC: '/updateTrafficData',  // PUT /api/traffic/:id
  DELETE_TRAFFIC: '/deleteTrafficData',  // DELETE /api/traffic/:id
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
} as const;

// Authentication
export const AUTH_CONFIG = {
  PROVIDERS: ['google', 'email'] as const,
  REDIRECT_URL: '/',
  ERROR_REDIRECT: '/auth/error',
} as const;

// Route paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '/404',
} as const;

// UI Constants
export const UI_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  },
  TABLES: {
    DEFAULT_SORT: 'date',
    DEFAULT_ORDER: 'desc' as const,
  },
  CHARTS: {
    DEFAULT_PERIOD: '30d',
    ANIMATION_DURATION: 300,
    VIEW_MODES: ['daily', 'weekly', 'monthly'] as const,
  },
  NOTIFICATIONS: {
    DEFAULT_DURATION: 5000,
    MAX_NOTIFICATIONS: 5,
  },
  LOADING: {
    DEBOUNCE_DELAY: 300,
    SKELETON_LINES: 5,
  },
} as const;

// Date/Time formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  FULL: 'dd/MM/yyyy HH:mm:ss',
  TIME: 'HH:mm',
} as const;

// Validation rules
export const VALIDATION_RULES = {
  TRAFFIC_DATA: {
    VISITS: {
      MIN: 0,
      MAX: 1_000_000,
    },
    DATE: {
      MIN_YEAR: 2020,
      MAX_YEAR: 2030,
    },
  },
  USER: {
    PASSWORD: {
      MIN_LENGTH: 8,
      REQUIRE_UPPERCASE: true,
      REQUIRE_LOWERCASE: true,
      REQUIRE_NUMBER: true,
      REQUIRE_SPECIAL: true,
    },
  },
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network connection problem',
  UNAUTHORIZED: 'You must be logged in',
  FORBIDDEN: 'You do not have the necessary permissions',
  NOT_FOUND: 'Resource not found',
  VALIDATION: 'Invalid data',
  SERVER_ERROR: 'Server error, please try again',
  UNKNOWN: 'An unexpected error occurred',
  CONFLICT: 'An entry already exists for this date',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  TRAFFIC_DATA_CREATED: 'Traffic data created successfully',
  TRAFFIC_DATA_UPDATED: 'Traffic data updated successfully',
  TRAFFIC_DATA_DELETED: 'Traffic data deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
} as const;

// Environment
export const ENV = {
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_EXPORT: true,
  ENABLE_IMPORT: true,
  ENABLE_DARK_MODE: true,
  ENABLE_NOTIFICATIONS: true,
} as const; 
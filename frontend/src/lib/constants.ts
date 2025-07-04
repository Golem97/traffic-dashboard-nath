// Firebase Collections
export const COLLECTIONS = {
  TRAFFIC_STATS: 'trafficStats',
  USERS: 'users',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  TRAFFIC: {
    GET_ALL: '/api/traffic',
    GET_STATS: '/api/traffic/stats',
    CREATE: '/api/traffic',
    UPDATE: '/api/traffic',
    DELETE: '/api/traffic',
  },
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
  },
} as const;

// UI Constants
export const UI = {
  ITEMS_PER_PAGE: 20,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 4000,
  CHART_COLORS: [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#0088fe',
  ],
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  API: 'yyyy-MM-dd',
  TIMESTAMP: 'yyyy-MM-dd HH:mm:ss',
} as const;

// View Modes
export const VIEW_MODES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const;

// Route Paths
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'traffic-dashboard-theme',
  USER_PREFERENCES: 'traffic-dashboard-preferences',
  LAST_VIEW_MODE: 'traffic-dashboard-view-mode',
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_VISITS: 0,
  MAX_VISITS: 999999,
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const; 
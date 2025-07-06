# Traffic Dashboard

A fullstack web application for managing and visualizing website traffic data, built with React, Firebase Cloud Functions, and Firestore.

## 🚀 Live Demo

**🌐 Application déployée : https://traffic-dashboard-nath.web.app**

### 🎯 For Evaluators - Quick Start

1. **Visit the live demo**: https://traffic-dashboard-nath.web.app
2. **Sign up** using email/password or Google Sign-In
3. **Explore features**: The app comes pre-loaded with 61 traffic entries for testing

### ✅ Key Features to Test
- 📈 **Interactive Charts**: Line/Bar charts with Daily/Weekly/Monthly views
- 📊 **Real-time Dashboard**: Traffic statistics with responsive cards layout
- 🔍 **Advanced Filtering**: Date range filters with pagination (5-100 entries per page)
- ✏️ **Full CRUD Operations**: Add/Edit/Delete traffic entries with form validation
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop
- 🔐 **Secure Authentication**: Email/password and Google OAuth integration
- 🔄 **Reset Data**: Restore original demo data (assessment feature)

### 🧪 Assessment Features

**🔄 Reset Data Functionality**
- **Purpose**: Allows evaluators to experiment with data modifications and restore the original dataset
- **Location**: Available in dashboard header (desktop) and mobile menu
- **Usage**: After testing CRUD operations, click "Reset Data" to restore the original 61 traffic entries
- **Note**: This feature is included specifically for assessment purposes to enable thorough testing

**How to test the complete workflow:**
1. **Explore** the default dashboard with 61 entries
2. **Add** new traffic entries using the "+ Add Entry" button
3. **Edit** existing entries by clicking the edit icon
4. **Delete** some entries to see real-time updates
5. **Filter** data by date ranges and test pagination
6. **Reset** back to original data with the "Reset Data" button
7. **Repeat** as needed for thorough evaluation

### 🛠️ Technical Implementation
- **Architecture**: HTTP REST API through Firebase Cloud Functions (no direct Firestore access)
- **Security**: JWT authentication + Firestore rules blocking direct frontend access
- **Data Format**: `{"date": "2025-03-01", "visits": 120}`

### 📊 Demo Data
The live application comes with **61 pre-loaded traffic entries** spanning multiple months, allowing immediate testing of all features including:
- Chart visualization with realistic data patterns
- Filtering and pagination with substantial data sets
- Statistical calculations (total visits: 7,798 | average: 128 | highest day: 188)

---

## Project Overview

This application allows users to track and analyze website traffic through an intuitive dashboard interface. Features include data visualization with charts, CRUD operations for traffic entries, and user authentication.

**Data Format**: `{"date": "2025-03-01", "visits": 120}`

## Architecture

### HTTP REST API Architecture (Specification Compliant)

```
Frontend (React) 
    ↓ HTTP REST API
Cloud Functions (HTTP-triggered)
    ↓ Admin SDK  
Firestore Database
```

**Key Principle**: No direct Firestore access from frontend - All operations go through HTTP-triggered Cloud Functions.

## Tech Stack

### Backend
- **Firebase Cloud Functions** - HTTP-triggered serverless functions
- **Firestore** - NoSQL database for data storage
- **Firebase Admin SDK** - Server-side Firebase operations
- **Firebase Authentication** - User management and JWT tokens

### Frontend
- **React 18** + **TypeScript** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality component library
- **Recharts** - Data visualization library
- **React Hook Form** + **Zod** - Form handling and validation

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase CLI installed globally

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd traffic-dashboard-nath
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd functions && npm install

   # Install frontend dependencies
   cd ../frontend && npm install
   ```

3. **Configure Firebase**
   ```bash
   # Login to Firebase (if not already done)
   firebase login

   # Set up environment variables (see Environment Configuration below)
   cd frontend
   # Create .env file with your Firebase credentials
   ```

## Environment Configuration

The application supports two environments: **Development** (local emulators) and **Production** (Firebase cloud services).

### Environment Variables

Create `frontend/.env` with your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Environment Control
VITE_FORCE_PRODUCTION=false
```

### Switching Between Environments

The application uses the `VITE_FORCE_PRODUCTION` flag to switch between environments:

| Environment | VITE_FORCE_PRODUCTION | Description |
|-------------|----------------------|-------------|
| **Development** | `false` | Uses Firebase emulators (local) |
| **Production** | `true` | Uses Firebase cloud services |

#### Development Mode (Local Emulators)
```bash
# Set in frontend/.env
VITE_FORCE_PRODUCTION=false

# Start Firebase emulators
firebase emulators:start --only auth,functions,firestore

# Start frontend (in new terminal)
cd frontend && npm run dev
```

#### Production Mode (Cloud Services)
```bash
# Set in frontend/.env
VITE_FORCE_PRODUCTION=true

# Start frontend
cd frontend && npm run dev
```

### Development Setup

1. **Start Firebase emulators**
   ```bash
   # From project root
   firebase emulators:start --only auth,functions,firestore
   ```

2. **Import sample data to local emulators**
   ```bash
   # Import 61 traffic entries to local Firestore
   cd scripts && node import-to-local.js
   ```

3. **Start frontend development server**
   ```bash
   # In a new terminal
   cd frontend && npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Firebase UI: http://localhost:4100
   - Functions: http://localhost:5101
   - Authentication: http://localhost:9199
   - Firestore: http://localhost:8180

### Quick Environment Switch

To quickly switch between environments:

```bash
# Switch to development (local emulators)
echo "VITE_FORCE_PRODUCTION=false" >> frontend/.env

# Switch to production (cloud services)
echo "VITE_FORCE_PRODUCTION=true" >> frontend/.env

# Restart the frontend server after changing the flag
cd frontend && npm run dev
```

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/getTrafficData` | Fetch all traffic entries |
| `POST` | `/addTrafficData` | Create new traffic entry |
| `PUT` | `/updateTrafficData?id=:id` | Update existing entry |
| `DELETE` | `/deleteTrafficData?id=:id` | Delete traffic entry |

### Environment-Specific URLs

The application automatically uses the correct API endpoints based on the environment:

**Development (VITE_FORCE_PRODUCTION=false)**
- Base URL: `http://localhost:5101/traffic-dashboard-nath/us-central1`
- Uses Firebase emulators

**Production (VITE_FORCE_PRODUCTION=true)**
- Base URL: `https://gettrafficdata-rclpdk4xwa-uc.a.run.app`
- Uses Firebase cloud services

## Project Structure

```
traffic-dashboard-nath/
├── functions/                 # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts          # HTTP-triggered endpoints
│   └── package.json          # Backend dependencies
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API and Firebase services
│   │   ├── types/           # TypeScript definitions
│   │   ├── constants/       # Application constants
│   │   └── hooks/           # Custom React hooks
│   └── package.json         # Frontend dependencies
├── scripts/                 # Development utilities
│   ├── data.json           # Sample traffic data
│   ├── import-to-local.js  # Import data to local emulators
│   └── import-to-production.js # Import data to production
├── firebase.json            # Firebase configuration
├── firestore.rules         # Database security rules
└── firestore.indexes.json  # Database indexes
```

## Core Features

### Project Requirements Status

| Requirement | Status | Implementation |
|-------------|---------|----------------|
| **Interactive Dashboard** | ✅ Complete | React dashboard with traffic visualization |
| **Firebase Integration** | ✅ Complete | Authentication, Cloud Functions, Firestore |
| **Working Link (Free Tier)** | ✅ Complete | **https://traffic-dashboard-nath.web.app** |
| **CRUD Operations** | ✅ Complete | Add/Edit/Delete traffic entries with validation |
| **Data Visualization** | ✅ Complete | Interactive charts (Line/Bar) with date aggregation |
| **User Authentication** | ✅ Complete | Email/password + Google OAuth |
| **Responsive Design** | ✅ Complete | Mobile-first design with Tailwind CSS |
| **Real-time Updates** | ✅ Complete | Live dashboard statistics |
| **Error Handling** | ✅ Complete | User-friendly error messages and loading states |
| **Type Safety** | ✅ Complete | Full TypeScript implementation |

### Bonus Features Implemented
- ✅ **Advanced Pagination** - Page numbers, items per page selector (5-100)
- ✅ **Date Range Filtering** - Custom date filters with clear indicators
- ✅ **Sorting** - Sortable columns (date/visits) with visual indicators
- ✅ **Multiple Chart Types** - Line and Bar charts with smooth transitions
- ✅ **Data Aggregation** - Daily/Weekly/Monthly view modes
- ✅ **Modern UI** - Glass morphism design with animations
- ✅ **Mobile Optimization** - Touch-friendly interface with responsive controls
- ✅ **Reset Data Feature** - Restore original demo data for assessment testing

### Implemented
- ✅ **HTTP REST API** - 4 endpoints with full CRUD operations

## Testing

The project includes comprehensive unit tests for both frontend and backend components with **100% test pass rate**.

### Test Coverage Overview

**📊 Total: 43 Tests (100% Pass Rate)**
- Backend: 14 tests
- Frontend: 29 tests

### Backend Tests (Jest)

**Location**: `functions/src/__tests__/`

```bash
# Run backend tests
cd functions && npm test
```

**Coverage Areas (14 tests):**

| Test Category | Tests | Coverage |
|---------------|-------|----------|
| **Authentication** | 4 tests | JWT token verification, unauthorized access protection |
| **CRUD Operations** | 6 tests | Create, read, update, delete with validation |
| **Error Handling** | 4 tests | HTTP status codes, CORS, method validation |

**Key Test Scenarios:**
- ✅ **Security**: Token verification, unauthorized access rejection
- ✅ **CRUD Operations**: All endpoints with proper validation
- ✅ **Data Validation**: Date format, visits range (0-1,000,000), duplicate prevention
- ✅ **HTTP Compliance**: Correct status codes (200, 201, 400, 401, 404, 409, 500)
- ✅ **CORS Support**: Preflight requests and cross-origin headers

### Frontend Tests (Vitest)

**Location**: `frontend/src/**/__tests__/`

```bash
# Run frontend tests
cd frontend && npm run test
```

**Coverage Areas (29 tests):**

| Test Category | Tests | Coverage |
|---------------|-------|----------|
| **API Service** | 12 tests | HTTP calls, authentication, error handling, calculations |
| **UI Components** | 17 tests | Rendering, interactions, responsive design, state management |

**Key Test Scenarios:**
- ✅ **API Integration**: All CRUD operations with authentication headers
- ✅ **Statistics Calculation**: Mathematical accuracy for totals, averages, min/max
- ✅ **UI Components**: StatsCards rendering, ChartControls interactions
- ✅ **Responsive Design**: Mobile/desktop layouts, button states
- ✅ **Error Handling**: Network failures, HTTP error responses
- ✅ **Form Validation**: Date formats, numeric inputs, edge cases

### Test Quality Standards

- All tests validate actual business logic
- Authentication flows with JWT tokens
- Data validation matching API constraints
- UI interactions with proper state management

### Running Tests

```bash
# Backend tests (Jest)
cd functions
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Frontend tests (Vitest)
cd frontend
npm run test            # Run all tests
npm run test:ui         # Visual test interface
npm run test:coverage   # Coverage report
```

## Security

- **No Direct Database Access**: Frontend cannot access Firestore directly
- **JWT Authentication**: All API calls require valid authentication tokens
- **Input Validation**: Server-side validation for all data operations
- **CORS Configuration**: Proper cross-origin request handling
- **Environment Isolation**: Separate development and production environments

## Development Commands

```bash
# Backend (Functions)
cd functions
npm run build          # Build TypeScript
npm run serve          # Start emulators
npm run deploy         # Deploy to production

# Frontend
cd frontend
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Run ESLint

# Project
firebase emulators:start              # Start all emulators
firebase emulators:start --only functions,firestore,auth  # Start specific emulators
firebase deploy                      # Deploy entire project
```

## Development Scripts

The `scripts/` directory contains helpful development utilities:

```bash
# Import sample data to local emulators (61 traffic entries)
cd scripts && node import-to-local.js

# Import sample data to production (requires service account key)
cd scripts && node import-to-production.js
```

## Troubleshooting

### Common Issues

1. **CORS Errors in Development**
   - Ensure Firebase emulators are running
   - Check that `VITE_FORCE_PRODUCTION=false` in `.env`
   - Restart the frontend server after changing environment flags

2. **Authentication Errors in Production**
   - Verify Firebase project configuration
   - Check that `VITE_FORCE_PRODUCTION=true` in `.env`
   - Ensure Cloud Functions have proper CORS permissions

3. **No Data Displayed**
   - For development: Run `cd scripts && node import-to-local.js`
   - For production: Ensure data exists in Firestore console
   - Check browser console for API errors

### Environment Debugging

The application logs environment information in the browser console:

```javascript
// Check these logs in browser console
🔧 API Configuration:
  VITE_FORCE_PRODUCTION: false
  API_BASE_URL: http://localhost:5101/traffic-dashboard-nath/us-central1
  Mode: Development
```

## Contributing

1. Follow the established architecture (HTTP REST only)
2. Maintain TypeScript type safety
3. Use Tailwind CSS for styling
4. Test both development and production environments
5. Update documentation for significant changes

## License

This project is developed as a technical assessment and is not intended for public distribution. 
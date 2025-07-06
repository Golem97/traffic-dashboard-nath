# Traffic Dashboard

A fullstack web application for managing and visualizing website traffic data, built with React, Firebase Cloud Functions, and Firestore.

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

### Implemented
- ✅ **HTTP REST API** - 4 endpoints with full CRUD operations
- ✅ **Authentication** - JWT-based user authentication
- ✅ **Environment Management** - Easy switch between dev/prod
- ✅ **Dashboard UI** - Complete traffic data visualization
- ✅ **Data Tables** - Sortable and filterable data views
- ✅ **Charts** - Interactive traffic charts with Recharts
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Development Setup** - Firebase emulators configured
- ✅ **Responsive Design** - Mobile-friendly interface

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
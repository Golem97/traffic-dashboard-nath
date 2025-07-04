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

   # Set up environment variables
   cd frontend
   cp .env.example .env
   # Fill in your Firebase project credentials
   ```

### Development

1. **Start Firebase emulators**
   ```bash
   # From project root
   firebase emulators:start --only auth,functions,firestore
   ```

2. **Start frontend development server**
   ```bash
   # In a new terminal
   cd frontend && npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5176
   - Firebase UI: http://localhost:4100
   - Functions: http://localhost:5101
   - Authentication: http://localhost:9199
   - Firestore: http://localhost:8180

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/getTrafficData` | Fetch all traffic entries for user |
| `POST` | `/addTrafficData` | Create new traffic entry |
| `PUT` | `/updateTrafficData?id=:id` | Update existing entry |
| `DELETE` | `/deleteTrafficData?id=:id` | Delete traffic entry |

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
├── docs/                    # Documentation
│   └── ARCHITECTURE.md      # Detailed architecture guide
├── firebase.json            # Firebase configuration
├── firestore.rules         # Database security rules
└── firestore.indexes.json  # Database indexes
```

## Core Features

### Implemented
- ✅ **HTTP REST API** - 4 endpoints with full CRUD operations
- ✅ **Authentication** - JWT-based user authentication
- ✅ **Security** - User isolation and data validation
- ✅ **Type Safety** - Full TypeScript coverage
- ✅ **Development Setup** - Firebase emulators configured
- ✅ **Architecture Documentation** - Comprehensive guides

### To Be Implemented
- 🔄 **Dashboard UI** - Traffic data visualization
- 🔄 **Data Tables** - Sortable and filterable data views
- 🔄 **Charts** - Daily/weekly/monthly traffic charts
- 🔄 **Authentication Pages** - Login and registration forms
- 🔄 **Responsive Design** - Mobile-friendly interface

## Security

- **No Direct Database Access**: Frontend cannot access Firestore directly
- **JWT Authentication**: All API calls require valid authentication tokens
- **User Isolation**: Each user can only access their own data
- **Input Validation**: Server-side validation for all data operations
- **CORS Configuration**: Proper cross-origin request handling

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
# Import sample data (61 traffic entries)
cd scripts && node import-data.js

# Test all HTTP endpoints  
cd scripts && node test-endpoints.js
```

See [scripts/README.md](scripts/README.md) for detailed documentation.

## Environment Variables

Create `frontend/.env` with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Contributing

1. Follow the established architecture (HTTP REST only)
2. Maintain TypeScript type safety
3. Use Tailwind CSS for styling
4. Write tests for new features
5. Update documentation for significant changes

## Documentation

- [Architecture Guide](docs/ARCHITECTURE.md) - Detailed technical architecture
- [Frontend README](frontend/README.md) - Frontend-specific documentation

## License

This project is developed as a technical assessment and is not intended for public distribution. 
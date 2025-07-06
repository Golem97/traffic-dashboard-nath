# Traffic Dashboard

A fullstack web application for managing and visualizing website traffic data, built with React, Firebase Cloud Functions, and Firestore.

## 🚀 Live Demo

**🌐 Live Application: https://traffic-dashboard-nath.web.app**

### Quick Start for Evaluators

1. Visit the live demo above
2. Sign up using email/password or Google Sign-In  
3. Explore pre-loaded traffic data (61 entries)

### Key Features
- 📈 **Interactive Charts**: Line/Bar with Daily/Weekly/Monthly views
- 📊 **Dashboard**: Real-time statistics with responsive design
- 🔍 **Advanced Table**: Filtering, sorting, pagination (5-100 entries per page)
- ✏️ **Full CRUD**: Add/Edit/Delete with validation
- 🔐 **Authentication**: Email/password + Google OAuth
- 🔄 **Reset Data**: Restore demo data for testing

## Architecture

```
Frontend (React) → HTTP REST API → Cloud Functions → Firestore
```

**Key Principle**: No direct Firestore access from frontend - All operations through HTTP-triggered Cloud Functions.

## Tech Stack

**Backend**: Firebase Cloud Functions, Firestore, Firebase Admin SDK, JWT Authentication
**Frontend**: React 18 + TypeScript, Vite, Tailwind CSS, Shadcn/UI, Recharts
**Data Format**: `{"date": "2025-03-01", "visits": 120}`

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase CLI

### Installation

```bash
# Clone and install
git clone <repository-url>
cd traffic-dashboard-nath

# Backend dependencies
cd functions && npm install

# Frontend dependencies  
cd ../frontend && npm install
```

### Environment Setup

Create `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FORCE_PRODUCTION=false
```

### Development

```bash
# Start Firebase emulators
firebase emulators:start --only auth,functions,firestore

# Import sample data (61 entries)
cd scripts && node import-to-local.js

# Start frontend (new terminal)
cd frontend && npm run dev
```

Access: http://localhost:5173

### Production
Set `VITE_FORCE_PRODUCTION=true` in `.env` and run `cd frontend && npm run dev`

## API Endpoints

All endpoints require JWT authentication: `Authorization: Bearer <token>`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/getTrafficData` | Fetch all entries |
| `POST` | `/addTrafficData` | Create entry |
| `PUT` | `/updateTrafficData?id=:id` | Update entry |
| `DELETE` | `/deleteTrafficData?id=:id` | Delete entry |

## Testing

**📊 43 Tests (100% Pass Rate)**
- Backend: 14 tests (Authentication, CRUD, Error handling)
- Frontend: 29 tests (API integration, UI components, calculations)

```bash
# Backend tests
cd functions && npm test

# Frontend tests  
cd frontend && npm run test
```

**Coverage**: JWT authentication, HTTP status codes, data validation, UI interactions, responsive design, error handling.

## Project Structure

```
traffic-dashboard-nath/
├── functions/           # Firebase Cloud Functions
├── frontend/           # React application  
├── scripts/            # Development utilities
├── firebase.json       # Firebase configuration
└── firestore.rules     # Database security rules
```

## Features Status

| Feature | Status | Implementation |
|---------|--------|----------------|
| Interactive Dashboard | ✅ | React + responsive design |
| Firebase Integration | ✅ | Auth, Functions, Firestore |
| CRUD Operations | ✅ | Full validation + error handling |
| Data Visualization | ✅ | Recharts with 3 view modes |
| Authentication | ✅ | Email/password + Google OAuth |
| Advanced Table | ✅ | Sorting, filtering, pagination |

## Commands

```bash
# Development
firebase emulators:start --only auth,functions,firestore
cd frontend && npm run dev

# Testing
cd functions && npm test
cd frontend && npm run test

# Production
firebase deploy
```

## Security

- No direct Firestore access from frontend
- JWT authentication on all endpoints
- Server-side validation and CORS
- Environment isolation (dev/prod)

## Troubleshooting

**CORS Errors**: Ensure emulators are running and `VITE_FORCE_PRODUCTION=false`
**No Data**: Run `cd scripts && node import-to-local.js` for development
**Auth Issues**: Verify Firebase config and environment flag

---

*This project demonstrates production-ready architecture with comprehensive testing, secure authentication, and modern UI/UX practices.* 
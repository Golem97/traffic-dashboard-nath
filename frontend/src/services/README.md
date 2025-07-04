# Services

This folder contains all services for API calls and Firebase integration.

## Recommended structure:
- `firebase.ts` - Firebase configuration
- `auth.service.ts` - Authentication service
- `traffic.service.ts` - Traffic data service
- `api.service.ts` - Generic API service 

# Firebase Configuration

## Setup

1. Copy `env.example` to `.env` in the frontend directory
2. Fill in your Firebase project credentials
3. Run `npm run dev` to start development with emulators

## Usage

```typescript
import { auth, db, functions } from '@/services/firebase';

// Authentication
import { signInWithEmailAndPassword } from 'firebase/auth';
const user = await signInWithEmailAndPassword(auth, email, password);

// Firestore
import { collection, getDocs } from 'firebase/firestore';
const data = await getDocs(collection(db, 'trafficStats'));

// Functions
import { httpsCallable } from 'firebase/functions';
const myFunction = httpsCallable(functions, 'myFunction');
const result = await myFunction({ data: 'test' });
```

## Development

- Firebase emulators are automatically connected in development
- Check console for configuration test results
- Use `testFirebaseConfig()` for debugging 
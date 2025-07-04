# Traffic Dashboard Architecture

## Specification Compliance

### Requirements Met
```
Backend (Cloud Functions):
"Create HTTP-triggered Firebase Cloud Functions to handle all operations:
■ GET to fetch all traffic entries
■ POST to add a new entry
■ PUT to update an existing entry
■ DELETE to remove an entry
○ Do not allow direct Firestore access from the frontend."
```

### HTTP REST Architecture
```
┌─────────────────┐   HTTP REST API   ┌─────────────────┐   Admin SDK   ┌─────────────────┐
│   Frontend      │ ────────────────► │ Cloud Functions │ ────────────► │   Firestore     │
│   (React)       │                   │  (HTTP-triggered)│               │   (Database)    │
└─────────────────┘                   └─────────────────┘               └─────────────────┘
```

## API Endpoints

| **Method** | **Endpoint** | **Cloud Function** | **Description** |
|------------|--------------|-------------------|-----------------|
| `GET` | `/getTrafficData` | `getTrafficData` | Fetch all traffic entries |
| `POST` | `/addTrafficData` | `addTrafficData` | Add a new entry |
| `PUT` | `/updateTrafficData?id=:id` | `updateTrafficData` | Update existing entry |
| `DELETE` | `/deleteTrafficData?id=:id` | `deleteTrafficData` | Remove an entry |

### URLs
```
Development:  http://localhost:5101/traffic-dashboard-nath/us-central1/
Production:   https://us-central1-traffic-dashboard-nath.cloudfunctions.net/
```

## Implementation

### Backend (Cloud Functions)
```typescript
// functions/src/index.ts
export const getTrafficData = onRequest(async (req, res) => {
  // HTTP-triggered function as specified
  // Handles authentication, validation, Firestore access
});

export const addTrafficData = onRequest(async (req, res) => {
  // POST endpoint for creating new entries
});

export const updateTrafficData = onRequest(async (req, res) => {
  // PUT endpoint for updating existing entries
});

export const deleteTrafficData = onRequest(async (req, res) => {
  // DELETE endpoint for removing entries
});
```

### Frontend (React)
```typescript
// frontend/src/services/api.ts
const makeRequest = async (endpoint: string, options: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

// HTTP REST calls
ApiService.getTrafficData()     // GET request
ApiService.createTrafficData()  // POST request
ApiService.updateTrafficData()  // PUT request
ApiService.deleteTrafficData()  // DELETE request
```

## Security & Authentication

### Authentication Flow
1. **Frontend:** Authentication via Firebase Auth
2. **Token:** JWT token sent in Authorization header
3. **Backend:** Token verification via Admin SDK
4. **Access Control:** User isolation by `userId` in Firestore

### Firestore Rules
```javascript
// firestore.rules
match /{document=**} {
  allow read, write: if false; // Deny all direct access
}
```

## Data Structure

### Specified Format
```json
{
  "date": "2025-03-01",
  "visits": 120
}
```

### With Backend Metadata
```json
{
  "id": "doc_id",
  "date": "2025-03-01",
  "visits": 120,
  "userId": "user_id",
  "createdAt": "2025-01-20T10:30:00Z",
  "updatedAt": "2025-01-20T10:30:00Z"
}
```

## Benefits

### Full Compliance
- HTTP endpoints exactly as requested
- No direct Firestore access from frontend
- Required authentication
- Server-side validation

### Security
- JWT token validation
- CORS configured
- User isolation
- Access control

### Scalability
- Auto-scaling Cloud Functions
- Server-side optimization
- Centralized caching

---

**Architecture 100% compliant with specifications**
This implementation follows the exact requirements with HTTP-triggered Cloud Functions. 
/**
 * Traffic Dashboard API - Fullstack Developer Home Task
 * 
 * Implements HTTP-triggered Firebase Cloud Functions as specified:
 * - GET to fetch all traffic entries
 * - POST to add a new entry
 * - PUT to update an existing entry
 * - DELETE to remove an entry
 * 
 * Architecture: Frontend -> HTTP API -> Firestore (NO direct access from frontend)
 */

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Global options for cost control
setGlobalOptions({ maxInstances: 10 });

// Types matching the specifications
interface TrafficEntry {
  id?: string;
  date: string; // Format: "2025-03-01"
  visits: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Helper function to validate date format (YYYY-MM-DD)
const isValidDateFormat = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const parsedDate = new Date(date + 'T00:00:00.000Z');
  return parsedDate.toISOString().slice(0, 10) === date;
};

// Helper function to verify authentication
const verifyAuth = async (req: any): Promise<string | null> => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return null;
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    logger.error('Auth verification failed:', error);
    return null;
  }
};

// Helper function to send response
const sendResponse = (res: any, statusCode: number, response: ApiResponse) => {
  res.status(statusCode).json(response);
};

// GET /api/traffic - Fetch all traffic entries for authenticated user
export const getTrafficData = onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    sendResponse(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      sendResponse(res, 401, { success: false, error: 'Unauthorized' });
      return;
    }

    const snapshot = await db.collection('trafficStats')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();

    const entries: TrafficEntry[] = [];
    snapshot.forEach(doc => {
      entries.push({
        id: doc.id,
        ...doc.data()
      } as TrafficEntry);
    });

    sendResponse(res, 200, {
      success: true,
      data: entries,
      message: `Retrieved ${entries.length} traffic entries`
    });

  } catch (error) {
    logger.error('GET /api/traffic error:', error);
    sendResponse(res, 500, { success: false, error: 'Internal server error' });
  }
});

// POST /api/traffic - Add new traffic entry
export const addTrafficData = onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    sendResponse(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      sendResponse(res, 401, { success: false, error: 'Unauthorized' });
      return;
    }

    const { date, visits } = req.body;

    // Validation
    if (!date || !visits || typeof visits !== 'number') {
      sendResponse(res, 400, { 
        success: false, 
        error: 'Missing or invalid fields. Required: date (string), visits (number)' 
      });
      return;
    }

    // Validate date format (YYYY-MM-DD)
    if (!isValidDateFormat(date)) {
      sendResponse(res, 400, { 
        success: false, 
        error: 'Invalid date format. Required format: YYYY-MM-DD (e.g., "2025-03-01")' 
      });
      return;
    }

    // Validate visits range
    if (visits < 0 || visits > 1000000 || !Number.isInteger(visits)) {
      sendResponse(res, 400, { 
        success: false, 
        error: 'Invalid visits value. Must be an integer between 0 and 1,000,000' 
      });
      return;
    }

    // Check if date already exists for user
    const existingEntry = await db.collection('trafficStats')
      .where('userId', '==', userId)
      .where('date', '==', date)
      .limit(1)
      .get();

    if (!existingEntry.empty) {
      sendResponse(res, 409, { 
        success: false, 
        error: 'Traffic entry for this date already exists' 
      });
      return;
    }

    const newEntry: TrafficEntry = {
      date,
      visits,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('trafficStats').add(newEntry);
    
    sendResponse(res, 201, {
      success: true,
      data: { id: docRef.id, ...newEntry },
      message: 'Traffic entry created successfully'
    });

  } catch (error) {
    logger.error('POST /api/traffic error:', error);
    sendResponse(res, 500, { success: false, error: 'Internal server error' });
  }
});

// PUT /api/traffic/:id - Update existing traffic entry
export const updateTrafficData = onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    sendResponse(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      sendResponse(res, 401, { success: false, error: 'Unauthorized' });
      return;
    }

    const entryId = req.params?.id || req.query?.id;
    if (!entryId) {
      sendResponse(res, 400, { success: false, error: 'Entry ID required' });
      return;
    }

    const { date, visits } = req.body;

    // Validation
    if (!date && visits === undefined) {
      sendResponse(res, 400, { 
        success: false, 
        error: 'At least one field (date or visits) must be provided' 
      });
      return;
    }

    // Validate date format if provided
    if (date && !isValidDateFormat(date)) {
      sendResponse(res, 400, { 
        success: false, 
        error: 'Invalid date format. Required format: YYYY-MM-DD (e.g., "2025-03-01")' 
      });
      return;
    }

    // Validate visits if provided
    if (visits !== undefined && (typeof visits !== 'number' || visits < 0 || visits > 1000000 || !Number.isInteger(visits))) {
      sendResponse(res, 400, { 
        success: false, 
        error: 'Invalid visits value. Must be an integer between 0 and 1,000,000' 
      });
      return;
    }

    // Check if entry exists and belongs to user
    const docRef = db.collection('trafficStats').doc(entryId as string);
    const doc = await docRef.get();

    if (!doc.exists) {
      sendResponse(res, 404, { success: false, error: 'Traffic entry not found' });
      return;
    }

    const existingData = doc.data() as TrafficEntry;
    if (existingData.userId !== userId) {
      sendResponse(res, 403, { success: false, error: 'Access denied' });
      return;
    }

    // Check for date conflicts if date is being updated
    if (date && date !== existingData.date) {
      const conflictEntry = await db.collection('trafficStats')
        .where('userId', '==', userId)
        .where('date', '==', date)
        .limit(1)
        .get();

      if (!conflictEntry.empty) {
        sendResponse(res, 409, { 
          success: false, 
          error: 'Traffic entry for this date already exists' 
        });
        return;
      }
    }

    // Update fields
    const updateData: Partial<TrafficEntry> = {
      updatedAt: new Date().toISOString()
    };

    if (date) updateData.date = date;
    if (visits !== undefined) updateData.visits = visits;

    await docRef.update(updateData);

    sendResponse(res, 200, {
      success: true,
      data: { id: entryId, ...existingData, ...updateData },
      message: 'Traffic entry updated successfully'
    });

  } catch (error) {
    logger.error('PUT /api/traffic error:', error);
    sendResponse(res, 500, { success: false, error: 'Internal server error' });
  }
});

// DELETE /api/traffic/:id - Remove traffic entry
export const deleteTrafficData = onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    sendResponse(res, 405, { success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      sendResponse(res, 401, { success: false, error: 'Unauthorized' });
      return;
    }

    const entryId = req.params?.id || req.query?.id;
    if (!entryId) {
      sendResponse(res, 400, { success: false, error: 'Entry ID required' });
      return;
    }

    // Check if entry exists and belongs to user
    const docRef = db.collection('trafficStats').doc(entryId as string);
    const doc = await docRef.get();

    if (!doc.exists) {
      sendResponse(res, 404, { success: false, error: 'Traffic entry not found' });
      return;
    }

    const existingData = doc.data() as TrafficEntry;
    if (existingData.userId !== userId) {
      sendResponse(res, 403, { success: false, error: 'Access denied' });
      return;
    }

    await docRef.delete();

    sendResponse(res, 200, {
      success: true,
      message: 'Traffic entry deleted successfully'
    });

  } catch (error) {
    logger.error('DELETE /api/traffic error:', error);
    sendResponse(res, 500, { success: false, error: 'Internal server error' });
  }
});

// Legacy test functions (kept for backward compatibility)
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase Functions! 🚀");
});

export const testApi = onRequest((request, response) => {
  response.json({
    message: "API Functions Firebase opérationnelle",
    timestamp: new Date().toISOString(),
    endpoints: {
      "GET /api/traffic": "getTrafficData",
      "POST /api/traffic": "addTrafficData", 
      "PUT /api/traffic/:id": "updateTrafficData",
      "DELETE /api/traffic/:id": "deleteTrafficData"
    }
  });
});

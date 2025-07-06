/**
 * Traffic Dashboard API - Fullstack Developer Home Task
 *
 * Implements HTTP-triggered Firebase Cloud Functions as specified:
 * - GET to fetch all traffic entries
 * - POST to add a new entry
 * - PUT to update an existing entry
 * - DELETE to remove an entry
 *
 * Architecture: Frontend -> HTTP API -> Firestore (NO direct access)
 */

// 🚀 Traffic Dashboard Cloud Functions - Updated for CORS support
// HTTP REST API as specified in project requirements
// "Create HTTP-triggered Firebase Cloud Functions to handle all operations"

import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Global options for cost control
setGlobalOptions({maxInstances: 10});

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

  const parsedDate = new Date(date + "T00:00:00.000Z");
  return parsedDate.toISOString().slice(0, 10) === date;
};

// Helper function to verify authentication
const verifyAuth = async (req: any): Promise<string | null> => {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return null;

    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    logger.error("Auth verification failed:", error);
    return null;
  }
};

// Helper function to send response
const sendResponse = (res: any, statusCode: number, response: ApiResponse) => {
  res.status(statusCode).json(response);
};

// GET /api/traffic - Fetch all shared traffic entries
export const getTrafficData = onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    sendResponse(res, 405, {success: false, error: "Method not allowed"});
    return;
  }

  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      sendResponse(res, 401, {success: false, error: "Unauthorized"});
      return;
    }

    // Retrieve ALL shared data (without userId filter)
    // This allows displaying imported data that doesn't have userId
    const snapshot = await db.collection("trafficStats")
      .orderBy("date", "desc")
      .get();

    const entries: TrafficEntry[] = [];
    snapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
      } as TrafficEntry);
    });

    sendResponse(res, 200, {
      success: true,
      data: entries,
      message: `Retrieved ${entries.length} shared traffic entries`,
    });
  } catch (error) {
    logger.error("GET /api/traffic error:", error);
    sendResponse(res, 500, {success: false, error: "Internal server error"});
  }
});

// POST /api/traffic - Add new shared traffic entry
export const addTrafficData = onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    sendResponse(res, 405, {success: false, error: "Method not allowed"});
    return;
  }

  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      sendResponse(res, 401, {success: false, error: "Unauthorized"});
      return;
    }

    const {date, visits} = req.body;

    // Validation
    if (!date || !visits || typeof visits !== "number") {
      sendResponse(res, 400, {
        success: false,
        error: "Missing or invalid fields. Required: date (string), " +
               "visits (number)",
      });
      return;
    }

    // Validate date format (YYYY-MM-DD)
    if (!isValidDateFormat(date)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid date format. Required format: YYYY-MM-DD " +
               "(e.g., \"2025-03-01\")",
      });
      return;
    }

    // Validate visits range
    if (visits < 0 || visits > 1000000 || !Number.isInteger(visits)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid visits value. Must be an integer between " +
               "0 and 1,000,000",
      });
      return;
    }

    // Check if date already exists globally (shared data)
    const existingEntry = await db.collection("trafficStats")
      .where("date", "==", date)
      .limit(1)
      .get();

    if (!existingEntry.empty) {
      sendResponse(res, 409, {
        success: false,
        error: "Traffic entry for this date already exists",
      });
      return;
    }

    // Create shared entry (no userId)
    const newEntry: TrafficEntry = {
      date,
      visits,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await db.collection("trafficStats").add(newEntry);

    sendResponse(res, 201, {
      success: true,
      data: {id: docRef.id, ...newEntry},
      message: "Shared traffic entry created successfully",
    });
  } catch (error) {
    logger.error("POST /api/traffic error:", error);
    sendResponse(res, 500, {success: false, error: "Internal server error"});
  }
});

// PUT /api/traffic/:id - Update existing shared traffic entry
export const updateTrafficData = onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "PUT") {
    sendResponse(res, 405, {success: false, error: "Method not allowed"});
    return;
  }

  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      sendResponse(res, 401, {success: false, error: "Unauthorized"});
      return;
    }

    const entryId = req.params?.id || req.query?.id;
    if (!entryId) {
      sendResponse(res, 400, {success: false, error: "Entry ID required"});
      return;
    }

    const {date, visits} = req.body;

    // Validation
    if (!date && visits === undefined) {
      sendResponse(res, 400, {
        success: false,
        error: "At least one field (date or visits) must be provided",
      });
      return;
    }

    // Validate date format if provided
    if (date && !isValidDateFormat(date)) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid date format. Required format: YYYY-MM-DD " +
               "(e.g., \"2025-03-01\")",
      });
      return;
    }

    // Validate visits if provided
    if (visits !== undefined && (typeof visits !== "number" ||
        visits < 0 || visits > 1000000 || !Number.isInteger(visits))) {
      sendResponse(res, 400, {
        success: false,
        error: "Invalid visits value. Must be an integer between " +
               "0 and 1,000,000",
      });
      return;
    }

    // Check if entry exists (shared data, no userId check)
    const docRef = db.collection("trafficStats").doc(entryId as string);
    const doc = await docRef.get();

    if (!doc.exists) {
      sendResponse(res, 404, {
        success: false,
        error: "Traffic entry not found",
      });
      return;
    }

    const existingData = doc.data() as TrafficEntry;

    // Check for date conflicts if date is being updated (global check)
    if (date && date !== existingData.date) {
      const conflictEntry = await db.collection("trafficStats")
        .where("date", "==", date)
        .limit(1)
        .get();

      if (!conflictEntry.empty) {
        sendResponse(res, 409, {
          success: false,
          error: "Traffic entry for this date already exists",
        });
        return;
      }
    }

    // Update fields
    const updateData: Partial<TrafficEntry> = {
      updatedAt: new Date().toISOString(),
    };

    if (date) updateData.date = date;
    if (visits !== undefined) updateData.visits = visits;

    await docRef.update(updateData);

    sendResponse(res, 200, {
      success: true,
      data: {id: entryId, ...existingData, ...updateData},
      message: "Shared traffic entry updated successfully",
    });
  } catch (error) {
    logger.error("PUT /api/traffic error:", error);
    sendResponse(res, 500, {success: false, error: "Internal server error"});
  }
});

// DELETE /api/traffic/:id - Remove shared traffic entry
export const deleteTrafficData = onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "DELETE") {
    sendResponse(res, 405, {success: false, error: "Method not allowed"});
    return;
  }

  try {
    const userId = await verifyAuth(req);
    if (!userId) {
      sendResponse(res, 401, {success: false, error: "Unauthorized"});
      return;
    }

    const entryId = req.params?.id || req.query?.id;
    if (!entryId) {
      sendResponse(res, 400, {success: false, error: "Entry ID required"});
      return;
    }

    // Check if entry exists (shared data, no userId check)
    const docRef = db.collection("trafficStats").doc(entryId as string);
    const doc = await docRef.get();

    if (!doc.exists) {
      sendResponse(res, 404, {
        success: false,
        error: "Traffic entry not found",
      });
      return;
    }

    await docRef.delete();

    sendResponse(res, 200, {
      success: true,
      message: "Shared traffic entry deleted successfully",
    });
  } catch (error) {
    logger.error("DELETE /api/traffic error:", error);
    sendResponse(res, 500, {success: false, error: "Internal server error"});
  }
});

// Legacy test functions (kept for backward compatibility)
export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase Functions! 🚀");
});

export const testApi = onRequest((request, response) => {
  response.json({
    message: "Firebase API Functions operational",
    timestamp: new Date().toISOString(),
    endpoints: {
      "GET /api/traffic": "getTrafficData",
      "POST /api/traffic": "addTrafficData",
      "PUT /api/traffic/:id": "updateTrafficData",
      "DELETE /api/traffic/:id": "deleteTrafficData",
    },
  });
});

export const resetData = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).send("");
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({error: "Method not allowed"});
    return;
  }

  try {
    const {environment} = req.body;

    // Clean existing data
    console.log("Starting data cleanup...");
    const snapshot = await db.collection("trafficStats").get();
    const batch = db.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${snapshot.size} existing documents`);

    // Import fresh data from data.json (embedded in function)
    // This data matches the scripts/data.json file
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dataJson = require("../data.json");

    console.log("Starting data import...");
    const importBatch = db.batch();
    let importedCount = 0;

    for (const entry of dataJson) {
      const docRef = db.collection("trafficStats").doc();
      importBatch.set(docRef, {
        date: entry.date,
        visits: entry.visits,
        createdAt: new Date(),
      });
      importedCount++;
    }

    await importBatch.commit();

    const totalVisits = dataJson.reduce(
      (sum: number, entry: any) => sum + entry.visits,
      0
    );
    const avgVisits = Math.round(totalVisits / dataJson.length);

    console.log(`Successfully imported ${importedCount} entries`);

    res.status(200).json({
      success: true,
      message: "Data reset completed successfully",
      environment,
      stats: {
        deleted: snapshot.size,
        imported: importedCount,
        totalVisits,
        avgVisits,
      },
    });
  } catch (error) {
    console.error("Error resetting data:", error);
    res.status(500).json({
      error: "Failed to reset data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

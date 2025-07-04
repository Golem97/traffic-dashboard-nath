# Development Scripts

This directory contains development and testing utilities for the Traffic Dashboard project.

## Scripts Overview

### 📊 `data.json`
Sample traffic data in the specified format:
```json
[
  { "date": "2025-03-01", "visits": 120 },
  { "date": "2025-03-02", "visits": 140 },
  ...
]
```
- **61 entries** covering March-April 2025
- Ready-to-use test data for development

### 🔄 `import-data.js`
Data import utility that:
- Creates a test user (`test@example.com` / `password123`)
- Imports all data from `data.json` into Firestore
- Verifies the import was successful

### 🧪 `test-endpoints.js`
Comprehensive endpoint testing script that:
- Tests all 4 HTTP endpoints (GET, POST, PUT, DELETE)
- Validates authentication and CRUD operations
- Provides detailed success/error reporting

## Prerequisites

Make sure you have:
1. **Firebase emulators running**:
   ```bash
   firebase emulators:start --only auth,functions,firestore
   ```

2. **Dependencies installed** in scripts/:
   ```bash
   cd scripts && npm install
   ```

## Usage

### Import Sample Data
```bash
# From project root
cd scripts && node import-data.js

# Or using npm script
cd scripts && npm run import
```

**Output**: Creates test user and imports 61 traffic entries

### Test All Endpoints
```bash
# From project root  
cd scripts && node test-endpoints.js

# Or using npm script
cd scripts && npm run test
```

**Output**: Full CRUD test suite with detailed results

## Test User Credentials

After running `import-data.js`:
- **Email**: `test@example.com`
- **Password**: `password123`
- **Data**: 61 traffic entries ready for frontend testing

## File Locations

These scripts expect:
- **Firebase emulators** running on configured ports
- **Functions deployed** to emulator
- **Firestore** accessible via emulator

All paths and configurations are automatically handled by the scripts. 
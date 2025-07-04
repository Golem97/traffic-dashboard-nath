const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK for emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8180';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9199';

admin.initializeApp({
  projectId: 'traffic-dashboard-nath'
});

const auth = admin.auth();
const firestore = admin.firestore();

async function importData() {
  try {
    console.log('🚀 Starting data import...');
    
    // 1. Create test user
    console.log('👤 Creating test user...');
    let testUser;
    try {
      testUser = await auth.createUser({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User'
      });
      console.log('✅ Test user created:', testUser.uid);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        testUser = await auth.getUserByEmail('test@example.com');
        console.log('✅ Test user already exists:', testUser.uid);
      } else {
        throw error;
      }
    }

    // 2. Read data from JSON file
    console.log('📂 Reading data from data.json...');
    const dataPath = path.join(__dirname, 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const trafficData = JSON.parse(rawData);
    console.log(`📊 Found ${trafficData.length} entries to import`);

    // 3. Create custom token for authentication
    console.log('🔑 Creating authentication token...');
    const customToken = await auth.createCustomToken(testUser.uid);
    
    // 4. Import each entry directly to Firestore (bypassing HTTP for speed)
    console.log('💾 Importing data directly to Firestore...');
    const batch = firestore.batch();
    const collection = firestore.collection('trafficStats');
    
    trafficData.forEach((entry, index) => {
      const docRef = collection.doc(); // Auto-generate document ID
      batch.set(docRef, {
        date: entry.date,
        visits: entry.visits,
        userId: testUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      if ((index + 1) % 10 === 0) {
        console.log(`📈 Prepared ${index + 1}/${trafficData.length} entries...`);
      }
    });

    await batch.commit();
    console.log('✅ All data imported successfully!');
    
    // 5. Verify import
    console.log('🔍 Verifying import...');
    const snapshot = await collection.where('userId', '==', testUser.uid).get();
    console.log(`✅ Verification: ${snapshot.size} documents found in database`);
    
    console.log('\n🎉 Import completed successfully!');
    console.log('📋 Summary:');
    console.log(`   - Test user: test@example.com (${testUser.uid})`);
    console.log(`   - Password: password123`);
    console.log(`   - Data entries: ${trafficData.length}`);
    console.log(`   - Collection: trafficStats`);
    console.log('\n🔧 You can now test the endpoints with this user!');
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
}

// Run the import
importData().then(() => {
  console.log('🏁 Import script finished');
  process.exit(0);
}); 
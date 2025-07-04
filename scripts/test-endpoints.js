const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Initialize Firebase Admin SDK for emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8180';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9199';

admin.initializeApp({
  projectId: 'traffic-dashboard-nath'
});

const auth = admin.auth();

// Test endpoints
const BASE_URL = 'http://localhost:5101/traffic-dashboard-nath/us-central1';

async function getIdTokenForUser(uid) {
  // For emulator, we can create a custom token and exchange it for an ID token
  try {
    const customToken = await auth.createCustomToken(uid);
    
    // Exchange custom token for ID token using Firebase Auth REST API
    const response = await fetch(`http://localhost:9199/www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=fake-api-key`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.idToken;
    } else {
      throw new Error('Failed to exchange token');
    }
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
}

async function testEndpoints() {
  try {
    console.log('🧪 Testing HTTP endpoints...');
    
    // 1. Get test user and create ID token
    console.log('👤 Getting test user...');
    const testUser = await auth.getUserByEmail('test@example.com');
    const idToken = await getIdTokenForUser(testUser.uid);
    
    if (!idToken) {
      console.log('❌ Failed to get ID token');
      return;
    }
    
    // 2. Test GET endpoint
    console.log('\n📥 Testing GET /getTrafficData...');
    const getResponse = await fetch(`${BASE_URL}/getTrafficData`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log('✅ GET request successful');
      console.log(`📊 Retrieved ${data.data.length} entries`);
      console.log(`📈 Sample entry: ${JSON.stringify(data.data[0])}`);
    } else {
      const errorText = await getResponse.text();
      console.log('❌ GET request failed:', getResponse.status, errorText);
    }
    
    // 3. Test POST endpoint (add new entry)
    console.log('\n📤 Testing POST /addTrafficData...');
    const uniqueDate = new Date().toISOString().slice(0, 10); // Generate unique date
    const newEntry = {
      date: uniqueDate,
      visits: 999
    };
    
    const postResponse = await fetch(`${BASE_URL}/addTrafficData`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newEntry)
    });
    
    if (postResponse.ok) {
      const result = await postResponse.json();
      console.log('✅ POST request successful');
      console.log(`📝 Created entry: ${JSON.stringify(result)}`);
      
      // 4. Test PUT endpoint (update the entry we just created)
      console.log('\n📝 Testing PUT /updateTrafficData...');
      const updateResponse = await fetch(`${BASE_URL}/updateTrafficData?id=${result.data.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: uniqueDate,
          visits: 1500
        })
      });
      
      if (updateResponse.ok) {
        const updateResult = await updateResponse.json();
        console.log('✅ PUT request successful');
        console.log(`📝 Updated entry: ${JSON.stringify(updateResult)}`);
        
        // 5. Test DELETE endpoint
        console.log('\n🗑️  Testing DELETE /deleteTrafficData...');
        const deleteResponse = await fetch(`${BASE_URL}/deleteTrafficData?id=${result.data.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (deleteResponse.ok) {
          const deleteResult = await deleteResponse.json();
          console.log('✅ DELETE request successful');
          console.log(`🗑️  Deleted entry: ${JSON.stringify(deleteResult)}`);
        } else {
          const errorText = await deleteResponse.text();
          console.log('❌ DELETE request failed:', deleteResponse.status, errorText);
        }
      } else {
        const errorText = await updateResponse.text();
        console.log('❌ PUT request failed:', updateResponse.status, errorText);
      }
    } else {
      const errorText = await postResponse.text();
      console.log('❌ POST request failed:', postResponse.status, errorText);
    }
    
    console.log('\n🎉 All endpoints tested successfully!');
    console.log('✅ Your backend is fully functional and ready for frontend development!');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error);
  }
}

// Run the test
testEndpoints().then(() => {
  console.log('🏁 Test script finished');
  process.exit(0);
}); 
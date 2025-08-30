const axios = require('axios');

const BASE_URL = 'http://localhost:5001';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test admin forms endpoint (without auth - should fail)
    console.log('\n2. Testing admin forms endpoint (without auth)...');
    try {
      const formsResponse = await axios.get(`${BASE_URL}/api/admin/service-forms`);
      console.log('❌ Should have failed without auth:', formsResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected without auth (401)');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    // Test service-forms endpoint (without auth - should fail)
    console.log('\n3. Testing service-forms endpoint (without auth)...');
    try {
      const serviceFormsResponse = await axios.get(`${BASE_URL}/api/admin/service-forms`);
      console.log('❌ Should have failed without auth:', serviceFormsResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly rejected without auth (401)');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }

    console.log('\n🎯 API endpoints are responding correctly!');
    console.log('📝 Next step: Check if you have admin user credentials and try logging in');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Solution: Make sure your backend server is running on port 5001');
      console.log('   Run: cd backend && npm start');
    }
  }
}

testAPI();

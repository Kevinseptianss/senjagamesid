// Test file to debug Zelenka API authentication
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzdWIiOjg0NDY3ODIsImlzcyI6Imx6dCIsImlhdCI6MTc1MjcyMTc0NSwianRpIjoiODE1MDkyIiwic2NvcGUiOiJiYXNpYyByZWFkIHBvc3QgY29udmVyc2F0ZSBwYXltZW50IGludm9pY2UgY2hhdGJveCBtYXJrZXQifQ.mvnLWAbjETZkVCb59nlzXFCtVLrr68bAZ8I_zHiTZaYQNaQdB-5B9NqhX_DjoKBLxIjy3_XFFm5FZ6s50VewJIFyzyYL5A3jlBFinGCyaDozod-1MXR9TgOXjpUcj4I26wI-9DLAUlqFaVb5oBvOfh5wuUc4NgoGflxGmTZ6KNg';

// Test different authentication methods
async function testAPI() {
  console.log('Testing Zelenka API...');
  
  // Test 1: Basic endpoint with token as query parameter
  try {
    const url1 = `https://prod-api.lzt.market/?oauth_token=${token}&limit=5`;
    console.log('Testing URL:', url1);
    
    const response1 = await fetch(url1, {
      method: 'GET',
      headers: {
        'User-Agent': 'SenjaGames.id/1.0',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response1.status);
    console.log('Response headers:', [...response1.headers.entries()]);
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('Success! Data:', data1);
    } else {
      const errorText = await response1.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
  
  // Test 2: With Bearer token in header
  try {
    const url2 = 'https://prod-api.lzt.market/?limit=5';
    const response2 = await fetch(url2, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'SenjaGames.id/1.0',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Bearer auth response status:', response2.status);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('Bearer success! Data:', data2);
    } else {
      const errorText2 = await response2.text();
      console.log('Bearer error response:', errorText2);
    }
  } catch (error) {
    console.error('Bearer fetch error:', error);
  }
}

// Run the test in browser console
if (typeof window !== 'undefined') {
  window.testZelenkaAPI = testAPI;
  console.log('Run testZelenkaAPI() in console to test the API');
}

export default testAPI;

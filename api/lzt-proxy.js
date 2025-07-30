// Vercel Serverless Function to proxy LZT Market API requests
export default async function handler(req, res) {
  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { path, ...params } = req.query;
    const endpoint = Array.isArray(path) ? path.join('/') : path || '';
    
    // Build LZT Market API URL
    const baseURL = 'https://prod-api.lzt.market';
    const apiURL = new URL(endpoint, baseURL);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) apiURL.searchParams.append(key, value);
    });

    // Forward the request to LZT Market API
    const response = await fetch(apiURL.toString(), {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${process.env.VITE_ZELENKA_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...(req.method !== 'GET' && { body: JSON.stringify(req.body) })
    });

    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('LZT API Proxy Error:', error);
    res.status(500).json({ 
      error: 'Proxy request failed', 
      details: error.message 
    });
  }
}

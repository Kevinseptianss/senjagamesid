// API service for Zelenka.guru Market API
class ZelenkaAPI {
  constructor() {
    // Use proxy in development, direct API in production
    const isDev = import.meta.env.MODE === 'development';
    this.baseURL = isDev ? '/api' : 'https://prod-api.lzt.market';
    this.authURL = 'https://prod-api.lolz.live/oauth/token';
    this.token = import.meta.env.VITE_ZELENKA_TOKEN;
    this.clientId = import.meta.env.VITE_ZELENKA_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_ZELENKA_CLIENT_SECRET;
    
    // Debug log to check if variables are loaded
    console.log('API Configuration:', {
      isDev,
      baseURL: this.baseURL,
      hasToken: !!this.token,
      hasClientId: !!this.clientId,
      hasClientSecret: !!this.clientSecret,
      mode: import.meta.env.MODE,
      origin: typeof window !== 'undefined' ? window.location.origin : 'N/A'
    });
  }

  // Get a fresh access token using Client Credentials flow
  async getClientCredentialsToken() {
    try {
      const response = await fetch(this.authURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: 'basic read market'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Auth Response:', errorText);
        throw new Error(`Auth Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.token = data.access_token;
      return data;
    } catch (error) {
      console.error('Authentication Error:', error);
      throw error;
    }
  }

  // Helper method to make API requests with automatic token refresh
  async makeRequest(endpoint, options = {}, retryCount = 0) {
    // Validate baseURL
    if (!this.baseURL) {
      throw new Error('Base URL is not configured. Check environment variables.');
    }

    // Validate token
    if (!this.token) {
      throw new Error('API token is not configured. Check VITE_ZELENKA_TOKEN environment variable.');
    }

    try {
      // Handle relative URLs properly
      let fullURL;
      if (this.baseURL.startsWith('http')) {
        // Absolute URL
        fullURL = `${this.baseURL}${endpoint}`;
      } else {
        // Relative URL - construct with current origin
        fullURL = `${window.location.origin}${this.baseURL}${endpoint}`;
      }
      
      console.log('URL Construction Debug:', {
        baseURL: this.baseURL,
        endpoint,
        origin: window.location.origin,
        fullURL
      });
      
      const url = new URL(fullURL);
      
      // Add any query parameters from options
      if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'SenjaGames.id/1.0',
        ...options.headers
      };

      console.log('Making API request to:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        ...options,
        headers
      });

      // If unauthorized and we haven't retried yet, try to get a fresh token
      if (response.status === 401 && retryCount === 0) {
        console.log('Token expired, trying to get fresh token...');
        await this.getClientCredentialsToken();
        return this.makeRequest(endpoint, options, retryCount + 1);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Response:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Zelenka API Error:', error);
      throw error;
    }
  }

  // Get latest accounts
  async getLatestAccounts(params = {}) {
    const defaultParams = { limit: 20, ...params };
    return await this.makeRequest('/', { params: defaultParams });
  }

  // Get accounts by category with proper API structure
  async getAccountsByCategory(category, params = {}) {
    const defaultParams = { limit: 20, ...params };
    return await this.makeRequest('/', { params: defaultParams });
  }

  // Get Steam accounts with specific filtering (using dedicated /steam endpoint)
  async getSteamAccounts(params = {}) {
    const defaultParams = {
      limit: 20,
      page: 1,
      order_by: 'price',
      order_dir: 'asc',
      ...params
    };
    return await this.makeRequest('/steam', { params: defaultParams });
  }

  // Get Fortnite accounts (using dedicated /fortnite endpoint)
  async searchFortniteAccounts(params = {}) {
    const defaultParams = {
      limit: 20,
      page: 1,
      order_by: 'price',
      order_dir: 'asc',
      ...params
    };
    return await this.makeRequest('/fortnite', { params: defaultParams });
  }

  // Get Discord accounts (using dedicated /discord endpoint)
  async searchDiscordAccounts(params = {}) {
    const defaultParams = {
      limit: 20,
      page: 1,
      order_by: 'price',
      order_dir: 'asc',
      ...params
    };
    return await this.makeRequest('/discord', { params: defaultParams });
  }

  // Get Instagram accounts (using dedicated /instagram endpoint)
  async searchInstagramAccounts(params = {}) {
    const defaultParams = {
      limit: 20,
      page: 1,
      order_by: 'price',
      order_dir: 'asc',
      ...params
    };
    return await this.makeRequest('/instagram', { params: defaultParams });
  }

  // Get Telegram accounts (using dedicated /telegram endpoint)
  async searchTelegramAccounts(params = {}) {
    const defaultParams = {
      limit: 20,
      page: 1,
      order_by: 'price',
      order_dir: 'asc',
      ...params
    };
    return await this.makeRequest('/telegram', { params: defaultParams });
  }

  // Get account details by ID
  async getAccountDetails(itemId) {
    return await this.makeRequest(`/${itemId}`);
  }

  // Get user's own accounts
  async getUserAccounts() {
    return await this.makeRequest('/user/items');
  }

  // Get categories list (Market API)
  async getCategories() {
    return await this.makeRequest('/category');
  }

  // Get forum categories (Forum API)
  async getForumCategories() {
    try {
      const response = await fetch('https://api.lolz.live/categories', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'User-Agent': 'SenjaGames.id/1.0'
        }
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get forum categories:', error);
      throw error;
    }
  }

  // Test API connection and authentication
  async testConnection() {
    try {
      console.log('Testing API connection...');
      
      // First try with existing token
      const response = await this.makeRequest('/');
      console.log('API test successful:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('API test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Get API system information
  async getAPIInfo() {
    try {
      // Try to get basic API info without authentication
      const response = await fetch(`${this.baseURL.replace('/api', 'https://prod-api.lzt.market')}/`, {
        method: 'GET',
        headers: {
          'User-Agent': 'SenjaGames.id/1.0'
        }
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to get API info:', error);
      throw error;
    }
  }

  // Generic category search
  async searchCategory(categoryName, params = {}) {
    const categoryMethods = {
      'Steam': this.searchSteamAccounts.bind(this),
      'Fortnite': this.searchFortniteAccounts.bind(this),
      'Discord': this.searchDiscordAccounts.bind(this),
      'Instagram': this.searchInstagramAccounts.bind(this),
      'Telegram': this.searchTelegramAccounts.bind(this),
    };

    if (categoryMethods[categoryName]) {
      return await categoryMethods[categoryName](params);
    } else {
      // Fallback to general search
      return await this.getLatestAccounts(params);
    }
  }
}

export default ZelenkaAPI;
// API service for Zelenka.guru Market API
class ZelenkaAPI {
  constructor() {
    // Use proxy in development, direct API in production
    const isDev = import.meta.env.MODE === 'development';
    // Keep using Zelenka API but with fulla.cc parameter format
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

      console.log('📡 Response status:', response.status, response.statusText);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

      // If unauthorized and we haven't retried yet, try to get a fresh token
      if (response.status === 401 && retryCount === 0) {
        console.log('Token expired, trying to get fresh token...');
        await this.getClientCredentialsToken();
        return this.makeRequest(endpoint, options, retryCount + 1);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Response Error:', {
          status: response.status,
          statusText: response.statusText,
          errorText: errorText.substring(0, 500) // Limit error text length
        });
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Response Data preview:', {
        type: typeof data,
        isArray: Array.isArray(data),
        keys: typeof data === 'object' ? Object.keys(data) : 'N/A',
        length: Array.isArray(data) ? data.length : 'N/A'
      });
      
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

  // Get market accounts with category filtering (using the official market API)
  async getMarketAccounts(params = {}) {
    const defaultParams = {
      page: 1,
      order_by: 'pdate_to_down', // Newest first
      ...params
    };
    return await this.makeRequest('/market', { params: defaultParams });
  }

  // Get Steam accounts using official LZT Market Steam endpoint
  async getSteamAccounts(params = {}) {
    console.log('🔍 getSteamAccounts called with params:', params);
    
    try {
      // Use official LZT Market Steam endpoint: /steam
      const steamParams = this.prepareSteamParams(params);
      
      console.log('🔄 Using official LZT Market /steam endpoint:', steamParams);
      
      const response = await this.makeRequest('/steam', { params: steamParams });
      console.log('✅ Steam API Response:', response);
      
      // Check if response has the expected structure
      if (response && typeof response === 'object') {
        console.log('📊 Response structure:', {
          hasItems: !!response.items,
          itemsLength: response.items ? response.items.length : 0,
          hasData: !!response.data,
          dataLength: response.data ? response.data.length : 0,
          totalKeys: Object.keys(response)
        });
      }
      
      return response;
    } catch (error) {
      console.error('❌ Steam API Error:', error);
      throw error;
    }
  }

  // Prepare parameters for LZT Market Steam endpoint
  prepareSteamParams(params) {
    const steamParams = {
      page: 1,
      order_by: 'pdate_to_down',
      ...params
    };

    // Handle game filtering - convert to game[] format for LZT Market
    if (params.game && Array.isArray(params.game) && params.game.length > 0) {
      params.game.forEach((gameId, index) => {
        steamParams[`game[${index}]`] = gameId;
      });
      delete steamParams.game; // Remove the original array
    } else if (params['game[]'] && Array.isArray(params['game[]'])) {
      params['game[]'].forEach((gameId, index) => {
        steamParams[`game[${index}]`] = gameId;
      });
      delete steamParams['game[]']; // Remove the original array
    }

    // Handle origin filtering
    if (params.origin && Array.isArray(params.origin) && params.origin.length > 0) {
      params.origin.forEach((origin, index) => {
        steamParams[`origin[${index}]`] = origin;
      });
      delete steamParams.origin;
    } else if (params['origin[]'] && Array.isArray(params['origin[]'])) {
      params['origin[]'].forEach((origin, index) => {
        steamParams[`origin[${index}]`] = origin;
      });
      delete steamParams['origin[]'];
    }

    // Handle country filtering
    if (params.country && Array.isArray(params.country) && params.country.length > 0) {
      params.country.forEach((country, index) => {
        steamParams[`country[${index}]`] = country;
      });
      delete steamParams.country;
    } else if (params['country[]'] && Array.isArray(params['country[]'])) {
      params['country[]'].forEach((country, index) => {
        steamParams[`country[${index}]`] = country;
      });
      delete steamParams['country[]'];
    }

    console.log('🔧 Prepared Steam params:', steamParams);
    return steamParams;
  }

  // Convert parameters to fulla.cc format
  convertToFullaFormat(params) {
    const converted = {};
    
    // Handle game filtering - convert to game[] format
    if (params.game && Array.isArray(params.game) && params.game.length > 0) {
      params.game.forEach((gameId, index) => {
        converted[`game[${index}]`] = gameId;
      });
    } else if (params['game[]'] && Array.isArray(params['game[]'])) {
      params['game[]'].forEach((gameId, index) => {
        converted[`game[${index}]`] = gameId;
      });
    }
    
    // Handle origin filtering
    if (params.origin && Array.isArray(params.origin) && params.origin.length > 0) {
      params.origin.forEach((origin, index) => {
        converted[`origin[${index}]`] = origin;
      });
    } else if (params['origin[]'] && Array.isArray(params['origin[]'])) {
      params['origin[]'].forEach((origin, index) => {
        converted[`origin[${index}]`] = origin;
      });
    }
    
    // Handle country filtering
    if (params.country && Array.isArray(params.country) && params.country.length > 0) {
      params.country.forEach((country, index) => {
        converted[`country[${index}]`] = country;
      });
    } else if (params['country[]'] && Array.isArray(params['country[]'])) {
      params['country[]'].forEach((country, index) => {
        converted[`country[${index}]`] = country;
      });
    }
    
    // Handle other standard parameters
    const directParams = [
      'page', 'order_by', 'pmin', 'pmax', 'title', 'eg', 'daybreak', 'mafile', 
      'limit', 'sb', 'nsb', 'purchase_min', 'purchase_max', 'games_purchase_min',
      'games_purchase_max', 'ingame_purchase_min', 'ingame_purchase_max',
      'cards_min', 'cards_max', 'cards_games_min', 'cards_games_max'
    ];
    
    directParams.forEach(param => {
      if (params[param] !== undefined && params[param] !== '') {
        converted[param] = params[param];
      }
    });
    
    // Handle boolean parameters
    if (params.trans) converted.trans = '1';
    if (params.no_trans) converted.no_trans = '1';
    if (params.rust) converted.rust = '1';
    
    console.log('🔄 Parameter conversion:', { original: params, converted });
    return converted;
  }

  // Get Steam accounts with specific game filtering using LZT Market Steam endpoint
  async getSteamAccountsByGame(gameId, gameName = null, additionalParams = {}) {
    console.log(`🎮 Fetching Steam accounts with game: ${gameName || gameId} using LZT Market Steam endpoint`);
    
    // Use game[] array format for LZT Market Steam endpoint
    const gameParams = {
      'game[]': [gameId], // Array format for games
      page: 1,
      order_by: 'pdate_to_down',
      ...additionalParams
    };
    
    console.log('Game filter params (LZT Market Steam format):', gameParams);
    
    try {
      // Use the new Steam endpoint
      const response = await this.getSteamAccounts(gameParams);
      console.log(`✅ Found Steam accounts with game ${gameName || gameId}`);
      return response;
    } catch (error) {
      console.error(`❌ Error fetching accounts for game ${gameName || gameId}:`, error);
      throw error;
    }
  }

  // Get Steam category parameters (based on node-lzt getCategoryParams)
  async getSteamCategoryParams() {
    console.log('🔍 Getting Steam category parameters...');
    try {
      // This method should return available filter parameters for Steam category
      const response = await this.makeRequest('/market/steam/params');
      console.log('✅ Steam category params:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to get Steam category params:', error);
      // Try alternative endpoint
      try {
        const altResponse = await this.makeRequest('/category/steam/params');
        console.log('✅ Steam category params (alternative):', altResponse);
        return altResponse;
      } catch (altError) {
        console.error('❌ Alternative endpoint also failed:', altError);
        throw error;
      }
    }
  }

  // Get Steam games list (based on node-lzt getGames)
  async getSteamGamesList() {
    console.log('🔍 Getting Steam games list...');
    try {
      // This should return available games for Steam category
      const response = await this.makeRequest('/market/steam/games');
      console.log('✅ Steam games list:', response);
      return response;
    } catch (error) {
      console.error('❌ Failed to get Steam games list:', error);
      // Try alternative endpoint
      try {
        const altResponse = await this.makeRequest('/category/steam/games');
        console.log('✅ Steam games list (alternative):', altResponse);
        return altResponse;
      } catch (altError) {
        console.error('❌ Alternative endpoint also failed:', altError);
        throw error;
      }
    }
  }

  // Get Steam accounts with pagination - fetch multiple pages
  async getSteamAccountsMultiplePages(params = {}, maxPages = 5) {
    console.log('🔍 getSteamAccountsMultiplePages called with params:', params, 'maxPages:', maxPages);
    
    let allAccounts = [];
    let currentPage = params.page || 1;
    let hasMorePages = true;
    
    while (hasMorePages && currentPage <= maxPages) {
      console.log(`📄 Fetching page ${currentPage}...`);
      
      try {
        const pageParams = { ...params, page: currentPage };
        const response = await this.getSteamAccounts(pageParams);
        
        if (response && response.items && Array.isArray(response.items)) {
          console.log(`✅ Page ${currentPage} returned ${response.items.length} items`);
          allAccounts = allAccounts.concat(response.items);
          
          // Check if there are more pages
          if (response.items.length === 0 || response.items.length < 20) {
            hasMorePages = false;
            console.log(`🏁 No more pages after page ${currentPage}`);
          }
        } else if (response && response.data && Array.isArray(response.data)) {
          console.log(`✅ Page ${currentPage} returned ${response.data.length} items (data field)`);
          allAccounts = allAccounts.concat(response.data);
          
          // Check if there are more pages
          if (response.data.length === 0 || response.data.length < 20) {
            hasMorePages = false;
            console.log(`🏁 No more pages after page ${currentPage}`);
          }
        } else {
          console.log(`❌ Page ${currentPage} returned unexpected format:`, response);
          hasMorePages = false;
        }
        
        currentPage++;
        
        // Add a small delay between requests to be respectful to the API
        if (hasMorePages) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        console.error(`❌ Error fetching page ${currentPage}:`, error);
        hasMorePages = false;
      }
    }
    
    console.log(`📊 Total accounts fetched across ${currentPage - 1} pages: ${allAccounts.length}`);
    
    return {
      items: allAccounts,
      totalPages: currentPage - 1,
      totalItems: allAccounts.length
    };
  }

  // Get Steam category parameters (for understanding available filters)
  async getSteamParams() {
    return await this.makeRequest('/steam/params/');
  }

  // Get Steam games list (for filtering by games)
  async getSteamGames() {
    return await this.makeRequest('/steam/games/');
  }

  // General market search with category support
  async searchMarket(categoryName = null, params = {}) {
    const endpoint = categoryName ? `/${categoryName}` : '/';
    return await this.makeRequest(endpoint, { params });
  }

  // Get Fortnite accounts (using proper market search API)
  async searchFortniteAccounts(params = {}) {
    return await this.makeRequest('/fortnite', { params });
  }

  // Get Discord accounts (using proper market search API)
  async searchDiscordAccounts(params = {}) {
    return await this.makeRequest('/discord', { params });
  }

  // Get Instagram accounts (using proper market search API)
  async searchInstagramAccounts(params = {}) {
    return await this.makeRequest('/instagram', { params });
  }

  // Get Telegram accounts (using proper market search API)
  async searchTelegramAccounts(params = {}) {
    return await this.makeRequest('/telegram', { params });
  }

  // Get account details by ID
  async getAccountDetails(itemId) {
    return await this.makeRequest(`/${itemId}`);
  }

  // Get Steam account details by ID
  async getSteamAccountById(itemId) {
    return await this.makeRequest(`/steam/${itemId}`);
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

  // Test Steam endpoint using node-lzt approach
  async testSteamEndpoint() {
    try {
      console.log('🧪 Testing Steam endpoint with node-lzt approach...');
      
      // Test market search with categoryName like node-lzt
      const response = await this.makeRequest('/', { 
        params: { 
          categoryName: 'steam',
          pmin: 1,
          pmax: 100
        } 
      });
      console.log('✅ Steam market search test successful:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ Steam market search test failed:', error);
      
      // Try alternative endpoints
      const alternatives = [
        { endpoint: '/category/steam/', name: 'category/steam' },
        { endpoint: '/steam', name: 'steam direct' },
        { endpoint: '/market', name: 'market general' }
      ];
      
      for (const alt of alternatives) {
        try {
          console.log(`🧪 Testing alternative endpoint: ${alt.name}`);
          const altResponse = await this.makeRequest(alt.endpoint);
          console.log(`✅ Alternative endpoint ${alt.name} works:`, altResponse);
          return { success: true, data: altResponse, usedEndpoint: alt.endpoint };
        } catch (altError) {
          console.log(`❌ Alternative endpoint ${alt.name} failed:`, altError.message);
        }
      }
      
      return { success: false, error: error.message };
    }
  }

  // Test LZT Market Steam endpoint
  async testLZTMarketSteamEndpoint() {
    try {
      console.log('🧪 Testing LZT Market Steam endpoint...');
      
      // Test basic Steam endpoint
      const basicResponse = await this.makeRequest('/steam');
      console.log('✅ Basic LZT Market Steam endpoint works:', basicResponse);
      
      // Test with PUBG filtering
      const pubgParams = {
        'game[0]': '578080', // PUBG game ID
        order_by: 'pdate_to_down',
        page: 1
      };
      
      const pubgResponse = await this.makeRequest('/steam', { params: pubgParams });
      console.log('✅ PUBG filtering on Steam endpoint works:', pubgResponse);
      
      return { 
        success: true, 
        basicData: basicResponse, 
        pubgData: pubgResponse 
      };
    } catch (error) {
      console.error('❌ LZT Market Steam endpoint test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Test PUBG filtering with node-lzt approach
  async testPUBGFiltering() {
    try {
      console.log('🧪 Testing PUBG filtering with node-lzt approach...');
      
      // Test with PUBG game filter using node-lzt categoryParams approach
      const pubgParams = {
        categoryName: 'steam',
        'game[]': ['578080'], // PUBG game ID in array format
        pmin: 1,
        pmax: 50
      };
      
      const response = await this.makeRequest('/', { params: pubgParams });
      console.log('✅ PUBG filtering test successful:', response);
      
      if (response && response.items) {
        console.log(`📊 Found ${response.items.length} PUBG accounts`);
      }
      
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ PUBG filtering test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Test Steam category parameters
  async testSteamCategoryParams() {
    try {
      console.log('🧪 Testing Steam category parameters...');
      
      const paramsResponse = await this.getSteamCategoryParams();
      const gamesResponse = await this.getSteamGamesList();
      
      console.log('✅ Steam category params test successful');
      return { 
        success: true, 
        params: paramsResponse, 
        games: gamesResponse 
      };
    } catch (error) {
      console.error('❌ Steam category params test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Test Steam pagination with node-lzt format
  async testSteamPagination() {
    try {
      console.log('🧪 Testing Steam pagination with node-lzt format...');
      
      // Test first 3 pages using node-lzt approach
      for (let page = 1; page <= 3; page++) {
        console.log(`📄 Testing page ${page} with node-lzt format...`);
        const response = await this.makeRequest('/', { 
          params: { 
            categoryName: 'steam',
            page 
          } 
        });
        console.log(`✅ Page ${page} response:`, {
          hasItems: !!response.items,
          itemsLength: response.items ? response.items.length : 0,
          hasData: !!response.data,
          dataLength: response.data ? response.data.length : 0,
          totalKeys: Object.keys(response)
        });
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Steam pagination test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Test general API pagination (root endpoint)
  async testGeneralPagination() {
    try {
      console.log('🧪 Testing general API pagination...');
      
      // Test first 3 pages of general endpoint
      for (let page = 1; page <= 3; page++) {
        console.log(`📄 Testing general page ${page}...`);
        const response = await this.makeRequest('/', { params: { page } });
        console.log(`✅ General page ${page} response:`, {
          hasItems: !!response.items,
          itemsLength: response.items ? response.items.length : 0,
          hasData: !!response.data,
          dataLength: response.data ? response.data.length : 0,
          totalKeys: Object.keys(response)
        });
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ General pagination test failed:', error);
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
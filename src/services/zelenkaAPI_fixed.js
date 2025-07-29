// API service for LZT Market API
class ZelenkaAPI {
  constructor() {
    // Use proxy in development, direct API in production
    const isDev = import.meta.env.MODE === 'development';
    this.baseURL = isDev ? '/api' : 'https://prod-api.lzt.market';
    this.authURL = 'https://prod-api.lolz.live/oauth/token';
    this.token = import.meta.env.VITE_ZELENKA_TOKEN;
    this.clientId = import.meta.env.VITE_ZELENKA_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_ZELENKA_CLIENT_SECRET;
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
        throw new Error(`Auth Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.token = data.access_token;
      return data;
    } catch (error) {
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

      const response = await fetch(url.toString(), {
        method: 'GET',
        ...options,
        headers
      });

      // If unauthorized and we haven't retried yet, try to get a fresh token
      if (response.status === 401 && retryCount === 0) {
        await this.getClientCredentialsToken();
        return this.makeRequest(endpoint, options, retryCount + 1);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
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
    try {
      // Use official LZT Market Steam endpoint: /steam
      const steamParams = this.prepareSteamParams(params);
      const response = await this.makeRequest('/steam', { params: steamParams });
      return response;
    } catch (error) {
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

    return steamParams;
  }

  // Get Steam accounts with specific game filtering using LZT Market Steam endpoint
  async getSteamAccountsByGame(gameId, gameName = null, additionalParams = {}) {
    // Use game[] array format for LZT Market Steam endpoint
    const gameParams = {
      'game[]': [gameId], // Array format for games
      page: 1,
      order_by: 'pdate_to_down',
      ...additionalParams
    };
    
    try {
      // Use the new Steam endpoint
      const response = await this.getSteamAccounts(gameParams);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get Steam category parameters (based on node-lzt getCategoryParams)
  async getSteamCategoryParams() {
    try {
      // This method should return available filter parameters for Steam category
      const response = await this.makeRequest('/market/steam/params');
      return response;
    } catch (error) {
      // Try alternative endpoint
      try {
        const altResponse = await this.makeRequest('/category/steam/params');
        return altResponse;
      } catch (altError) {
        throw error;
      }
    }
  }

  // Get Steam games list (based on node-lzt getGames)
  async getSteamGamesList() {
    try {
      // This should return available games for Steam category
      const response = await this.makeRequest('/market/steam/games');
      return response;
    } catch (error) {
      // Try alternative endpoint
      try {
        const altResponse = await this.makeRequest('/category/steam/games');
        return altResponse;
      } catch (altError) {
        throw error;
      }
    }
  }

  // Get Steam accounts with pagination - fetch multiple pages
  async getSteamAccountsMultiplePages(params = {}, maxPages = 5) {
    let allAccounts = [];
    let currentPage = params.page || 1;
    let hasMorePages = true;
    
    while (hasMorePages && currentPage <= maxPages) {
      try {
        const pageParams = { ...params, page: currentPage };
        const response = await this.getSteamAccounts(pageParams);
        
        if (response && response.items && Array.isArray(response.items)) {
          allAccounts = allAccounts.concat(response.items);
          
          // Check if there are more pages
          if (response.items.length === 0 || response.items.length < 20) {
            hasMorePages = false;
          }
        } else if (response && response.data && Array.isArray(response.data)) {
          allAccounts = allAccounts.concat(response.data);
          
          // Check if there are more pages
          if (response.data.length === 0 || response.data.length < 20) {
            hasMorePages = false;
          }
        } else {
          hasMorePages = false;
        }
        
        currentPage++;
        
        // Add a small delay between requests to be respectful to the API
        if (hasMorePages) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        hasMorePages = false;
      }
    }
    
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
      throw error;
    }
  }

  // Test API connection and authentication
  async testConnection() {
    try {
      // First try with existing token
      const response = await this.makeRequest('/');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get popular Steam games for quick filtering
  getPopularSteamGames() {
    return [
      { id: 578080, name: 'PUBG: BATTLEGROUNDS', abbr: 'PUBG' },
      { id: 730, name: 'Counter-Strike 2', abbr: 'CS2' },
      { id: 570, name: 'Dota 2', abbr: 'Dota 2' },
      { id: 440, name: 'Team Fortress 2', abbr: 'TF2' },
      { id: 252490, name: 'Rust', abbr: 'Rust' },
      { id: 271590, name: 'Grand Theft Auto V', abbr: 'GTA V' },
      { id: 381210, name: 'Dead by Daylight', abbr: 'Dead by Daylight' },
      { id: 1172470, name: 'Apex Legends', abbr: 'Apex Legends' }
    ];
  }

  // Search game by name (mock function for popular games)
  searchGameByName(gameName) {
    const games = this.getPopularSteamGames();
    return games.filter(game => 
      game.name.toLowerCase().includes(gameName.toLowerCase()) ||
      game.abbr.toLowerCase().includes(gameName.toLowerCase())
    );
  }

  // Generic category search
  async searchCategory(categoryName, params = {}) {
    const categoryMethods = {
      'Steam': this.getSteamAccounts.bind(this),
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

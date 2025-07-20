import { useState, useEffect } from 'react';
import ZelenkaAPI from '../services/zelenkaAPI';

// Mock data as fallback
const mockAccounts = {
  Steam: [
    {
      item_id: 1,
      price: 51.38,
      title: 'Prime Account',
      last_seen: 'Jun 12, 2025',
      country: 'US',
      games: ['CS2 Prime', 'Dota 2', 'Garry\'s Mod', 'Unturned', '+36 games'],
      warranty_days: 1,
      level: 50
    },
    {
      item_id: 2,
      price: 25.99,
      title: 'Level 50 Account',
      last_seen: '2 hours ago',
      country: 'DE',
      games: ['PUBG', 'Apex Legends', 'Rocket League', '+12 games'],
      warranty_days: 7,
      level: 50
    }
  ],
  Fortnite: [
    {
      item_id: 3,
      price: 2.33,
      title: 'Battle Pass Account',
      last_seen: '9 minutes ago',
      country: 'CM',
      level: 75,
      skins_count: 19,
      vbucks: 2620,
      warranty_days: 7
    },
    {
      item_id: 4,
      price: 15.50,
      title: 'Rare Skins Account',
      last_seen: '1 hour ago',
      country: 'BR',
      level: 120,
      skins_count: 45,
      vbucks: 1200,
      warranty_days: 0
    }
  ],
  Discord: [
    {
      item_id: 23,
      price: 0.43,
      title: 'No Spam Block',
      last_seen: '8 minutes ago',
      country: 'US',
      chats_count: 0,
      channels_count: 9,
      conversations_count: 142,
      contacts_count: 285,
      warranty_days: 0
    }
  ],
  Instagram: [
    {
      item_id: 25,
      price: 3.28,
      title: 'No Spam Block Account',
      last_seen: '8 minutes ago',
      country: 'GT',
      followers_count: 1200,
      following_count: 450,
      posts_count: 94,
      warranty_days: 0
    }
  ],
  Telegram: [
    {
      item_id: 9,
      price: 0.15,
      title: 'No Spam Block',
      last_seen: '8 minutes ago',
      country: 'IN',
      chats_count: 0,
      channels_count: 8,
      conversations_count: 19,
      contacts_count: 142,
      warranty_days: 0
    }
  ]
};

export const useZelenkaAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Steam');
  const [connectionTested, setConnectionTested] = useState(false);

  const api = new ZelenkaAPI();

  // Test API connection on first load
  const testConnection = async () => {
    if (connectionTested) return;
    
    setConnectionTested(true);
    try {
      console.log('Testing API connection...');
      const result = await api.testConnection();
      if (result.success) {
        console.log('✅ API connection successful');
      } else {
        console.log('❌ API connection failed:', result.error);
      }
    } catch (error) {
      console.log('❌ API connection test error:', error);
    }
  };

  // Transform API data to match our current account structure
  const transformAccountData = (apiAccount) => {
    // Handle different API response structures
    const accountData = apiAccount.account || apiAccount;
    
    // Extract nested data safely
    const steamData = accountData.steam_data || accountData;
    const sellerData = accountData.seller || {};
    
    // Format last seen date
    const formatLastSeen = (timestamp) => {
      if (!timestamp) return 'Unknown';
      try {
        const date = new Date(timestamp * 1000); // Convert Unix timestamp
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      } catch {
        return 'Unknown';
      }
    };

    // Format account status
    const getAccountStatus = (status) => {
      if (!status) return 'Unknown';
      switch (status) {
        case 'online': return 'Online';
        case 'offline': return 'Offline';
        case 'away': return 'Away';
        case 'busy': return 'Busy';
        case 'snooze': return 'Snooze';
        case 'looking_to_trade': return 'Looking to Trade';
        case 'looking_to_play': return 'Looking to Play';
        default: return status.charAt(0).toUpperCase() + status.slice(1);
      }
    };

    // Extract country information
    const getCountryInfo = (data) => {
      return data.country || 
             data.location_country || 
             steamData.country || 
             steamData.location_country || 
             'Unknown';
    };

    return {
      id: accountData.item_id || accountData.id || Math.random().toString(36),
      price: `$${accountData.price || '0.00'}`,
      type: selectedCategory,
      status: accountData.title || getAccountStatus(steamData.status || steamData.account_status) || 'Account',
      lastSeen: formatLastSeen(steamData.last_seen || steamData.last_online || steamData.last_logoff) || accountData.last_seen || 'Unknown',
      country: getCountryInfo(accountData),
      description: accountData.description || '',
      hasWarranty: (accountData.warranty_days || 0) > 0,
      warranty: accountData.warranty_days ? `${accountData.warranty_days} days` : null,
      
      // Additional Steam-specific fields for consistency with SteamPage
      ...(selectedCategory === 'Steam' ? {
        steamId: steamData.steam_id || steamData.steamid,
        level: steamData.level || steamData.steam_level || 0,
        games: steamData.games || steamData.owned_games || [],
        gamesCount: steamData.games_count || steamData.owned_games_count || (steamData.games || []).length,
        inventoryValue: steamData.inventory_value || steamData.inventory_worth || 0,
        marketValue: steamData.market_value || steamData.market_worth || 0,
        hasEmail: accountData.with_email || accountData.email_access || false,
        hasEmailChanges: steamData.email_changes || false,
        vacBanned: steamData.vac_banned || false,
        communityBanned: steamData.community_banned || false,
        tradeBanned: steamData.trade_banned || false,
        accountAge: steamData.account_age || steamData.created,
        totalHours: steamData.total_hours || steamData.hours_played || 0,
        seller: sellerData.username || sellerData.name || accountData.seller || 'Unknown',
        sellerRating: sellerData.rating || sellerData.feedback_score,
        views: accountData.views || 0
      } : {}),
      
      // Add category-specific data transformation for other categories
      ...transformCategorySpecificData(apiAccount, selectedCategory)
    };
  };

  // Transform category-specific data
  const transformCategorySpecificData = (apiAccount, category) => {
    switch (category) {
      case 'Steam':
        return {
          games: apiAccount.games || [],
          level: apiAccount.level || 0
        };
      case 'Fortnite':
        return {
          level: apiAccount.level || 0,
          skins: apiAccount.skins_count || 0,
          vbucks: apiAccount.vbucks || 0
        };
      case 'Discord':
        return {
          chats: apiAccount.chats_count || 0,
          channels: apiAccount.channels_count || 0,
          conversations: apiAccount.conversations_count || 0,
          contacts: apiAccount.contacts_count || 0
        };
      case 'Instagram':
        return {
          followers: apiAccount.followers_count || 0,
          following: apiAccount.following_count || 0,
          posts: apiAccount.posts_count || 0
        };
      case 'Telegram':
        return {
          chats: apiAccount.chats_count || 0,
          channels: apiAccount.channels_count || 0,
          conversations: apiAccount.conversations_count || 0,
          contacts: apiAccount.contacts_count || 0
        };
      default:
        return {};
    }
  };

  // Fetch accounts for selected category
  const fetchAccounts = async (category) => {
    setLoading(true);
    setError(null);
    
    // Check if we should use mock data
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      console.log('Using mock data for category:', category);
      setTimeout(() => {
        if (mockAccounts[category]) {
          const transformedAccounts = mockAccounts[category].map(transformAccountData);
          setAccounts(transformedAccounts);
        } else {
          // Use Steam data as default fallback
          const transformedAccounts = mockAccounts.Steam.map(transformAccountData);
          setAccounts(transformedAccounts);
        }
        setLoading(false);
      }, 500); // Simulate API delay
      return;
    }
    
    try {
      let response;
      
      // Use appropriate API method based on category
      switch (category) {
        case 'Steam':
          response = await api.getSteamAccounts({ limit: 20 });
          break;
        case 'Fortnite':
          response = await api.searchFortniteAccounts({ limit: 20 });
          break;
        case 'Discord':
          response = await api.searchDiscordAccounts({ limit: 20 });
          break;
        case 'Instagram':
          response = await api.searchInstagramAccounts({ limit: 20 });
          break;
        case 'Telegram':
          response = await api.searchTelegramAccounts({ limit: 20 });
          break;
        default:
          // For other categories, try generic search or fallback to latest accounts
          response = await api.getLatestAccounts();
          break;
      }

      // Transform the API response to match our structure
      console.log('Raw API Response:', response);
      
      if (response && response.items) {
        console.log('Sample account data from API:', response.items[0]);
        const transformedAccounts = response.items.map(transformAccountData);
        console.log('Sample transformed account:', transformedAccounts[0]);
        setAccounts(transformedAccounts);
      } else if (response && Array.isArray(response)) {
        console.log('Array response - sample account:', response[0]);
        const transformedAccounts = response.map(transformAccountData);
        console.log('Sample transformed account:', transformedAccounts[0]);
        setAccounts(transformedAccounts);
      } else {
        console.log('No items found in response:', response);
        setAccounts([]);
      }
    } catch (err) {
      console.error('Error fetching accounts:', err);
      setError(err.message);
      
      // Fallback to mock data
      console.log('Using fallback mock data for category:', category);
      if (mockAccounts[category]) {
        const transformedAccounts = mockAccounts[category].map(transformAccountData);
        setAccounts(transformedAccounts);
        setError(null); // Clear error since we have fallback data
      } else {
        // Use Steam data as default fallback
        const transformedAccounts = mockAccounts.Steam.map(transformAccountData);
        setAccounts(transformedAccounts);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to test connection and fetch accounts when category changes
  useEffect(() => {
    const initializeAndFetch = async () => {
      await testConnection();
      if (selectedCategory) {
        fetchAccounts(selectedCategory);
      }
    };
    
    initializeAndFetch();
  }, [selectedCategory]);

  // Function to change category and fetch new data
  const changeCategory = (category) => {
    setSelectedCategory(category);
  };

  // Function to manually refresh accounts
  const refreshAccounts = () => {
    if (selectedCategory) {
      fetchAccounts(selectedCategory);
    }
  };

  return {
    accounts,
    loading,
    error,
    selectedCategory,
    changeCategory,
    refreshAccounts
  };
};

import { useState, useEffect } from 'react';
import ZelenkaAPI from '../services/zelenkaAPI';

// Mock data as fallback
const mockAccounts = {
  Steam: [
    // PUBG Account - Featured for initial load
    {
      item_id: 180232465,
      type: 'Steam',
      price: 4.99,
      priceWithSellerFeeLabel: '$4.99',
      title: 'PUBG Account with Premium Items',
      title_en: 'PUBG Account with Premium Items',
      item_state: 'active',
      account_last_activity: 1738195200, // Jan 30, 2025
      steam_country: 'United States',
      steam_level: 12,
      steam_game_count: 6,
      steam_friend_count: 28,
      steam_balance: '$1.25',
      steam_inv_value: 8.50,
      steam_mfa: true,
      steam_is_limited: false,
      steam_market: true,
      steam_community_ban: false,
      steam_bans: 'None',
      email_provider: 'gmail',
      item_domain: 'gmail.com',
      item_origin: 'personal',
      guarantee: { durationPhrase: '48 hours' },
      seller: {
        username: 'pubg_pro_seller',
        sold_items_count: 890,
        restore_percents: 98
      },
      steam_full_games: {
        list: {
          578080: { title: 'PUBG: BATTLEGROUNDS', abbr: 'PUBG', playtime_forever: 342.8 },
          730: { title: 'Counter-Strike 2', abbr: 'CS2', playtime_forever: 89.5 },
          570: { title: 'Dota 2', abbr: 'Dota 2', playtime_forever: 156.2 },
          440: { title: 'Team Fortress 2', abbr: 'TF2', playtime_forever: 45.7 },
          252490: { title: 'Rust', abbr: 'Rust', playtime_forever: 78.3 },
          381210: { title: 'Dead by Daylight', abbr: 'Dead by Daylight', playtime_forever: 95.1 }
        },
        total: 6
      }
    },
    {
      item_id: 180232466,
      type: 'Steam',
      price: 2.4,
      priceWithSellerFeeLabel: '$2.4',
      title: 'Steam Account with Multiple Games',
      title_en: 'Steam Account with Multiple Games',
      item_state: 'active',
      account_last_activity: 1718150400, // Jun 12, 2025
      steam_country: 'United States',
      steam_level: 5,
      steam_game_count: 9,
      steam_friend_count: 15,
      steam_balance: '$0.00',
      steam_inv_value: 0.27,
      steam_mfa: true,
      steam_is_limited: true,
      steam_market: false,
      steam_community_ban: false,
      steam_bans: 'VAC',
      email_provider: 'gmail',
      item_domain: 'gmail.com',
      item_origin: 'stealer',
      guarantee: { durationPhrase: '24 hours' },
      seller: {
        username: 'steam_seller',
        sold_items_count: 1250,
        restore_percents: 98
      },
      steam_full_games: {
        list: {
          570: { title: 'Dota 2', abbr: 'Dota 2', playtime_forever: 120.5 },
          440: { title: 'Team Fortress 2', abbr: 'TF2', playtime_forever: 45.2 },
          322170: { title: 'Geometry Dash', abbr: 'Geometry Dash', playtime_forever: 25.1 },
          238460: { title: 'Path of Exile', abbr: 'Path of Exile', playtime_forever: 89.3 },
          2016590: { title: 'Dark and Darker', abbr: 'Dark and Darker', playtime_forever: 15.7 }
        },
        total: 9
      }
    },
    {
      item_id: 180232467,
      type: 'Steam',
      price: 2.4,
      priceWithSellerFeeLabel: '$2.4',
      title: 'Gaming Account - Multiple Titles',
      title_en: 'Gaming Account - Multiple Titles',
      item_state: 'active',
      account_last_activity: 1661472000, // Aug 26, 2022
      steam_country: 'Germany',
      steam_level: 3,
      steam_game_count: 3,
      steam_friend_count: 8,
      steam_balance: '$0.00',
      steam_inv_value: 0.15,
      steam_mfa: true,
      steam_is_limited: true,
      steam_market: false,
      steam_community_ban: false,
      steam_bans: 'VAC',
      email_provider: 'outlook',
      item_domain: 'outlook.com',
      item_origin: 'stealer',
      guarantee: { durationPhrase: '24 hours' },
      seller: {
        username: 'game_trader',
        sold_items_count: 890,
        restore_percents: 95
      },
      steam_full_games: {
        list: {
          322170: { title: 'Geometry Dash', abbr: 'Geometry Dash', playtime_forever: 35.2 },
          386180: { title: 'Crossout', abbr: 'Crossout', playtime_forever: 12.8 },
          730: { title: 'Counter-Strike 2', abbr: 'Free CS2 (No Prime)', playtime_forever: 0 }
        },
        total: 3
      }
    },
    {
      item_id: 180232468,
      type: 'Steam',
      price: 2.4,
      priceWithSellerFeeLabel: '$2.4',
      title: 'Adventure Games Collection',
      title_en: 'Adventure Games Collection',
      item_state: 'active',
      account_last_activity: 1720051200, // Jul 3, 2025
      steam_country: 'United Kingdom',
      steam_level: 8,
      steam_game_count: 11,
      steam_friend_count: 22,
      steam_balance: '$0.00',
      steam_inv_value: 1.85,
      steam_mfa: true,
      steam_is_limited: false,
      steam_market: true,
      steam_community_ban: false,
      email_provider: 'yahoo',
      item_domain: 'yahoo.com',
      item_origin: 'personal',
      guarantee: { durationPhrase: '24 hours' },
      seller: {
        username: 'adventure_gamer',
        sold_items_count: 456,
        restore_percents: 97
      },
      steam_full_games: {
        list: {
          268910: { title: 'Cuphead', abbr: 'Cuphead', playtime_forever: 28.4 },
          550: { title: 'Left 4 Dead 2', abbr: 'Left 4 Dead 2', playtime_forever: 67.1 },
          391220: { title: 'Tomb Raider', abbr: 'Tomb Raider', playtime_forever: 45.3 },
          500: { title: 'Left 4 Dead', abbr: 'Left 4 Dead', playtime_forever: 23.7 }
        },
        total: 11
      }
    },
    {
      item_id: 180232469,
      type: 'Steam',
      price: 3.19,
      priceWithSellerFeeLabel: '$3.19',
      title: 'Survival Games Account',
      title_en: 'Survival Games Account',
      item_state: 'active',
      account_last_activity: 1735603200, // Dec 30, 2024
      steam_country: 'China',
      steam_level: 2,
      steam_game_count: 2,
      steam_friend_count: 5,
      steam_balance: '¥ 0.00',
      steam_inv_value: 0.05,
      steam_mfa: false,
      steam_is_limited: false,
      steam_market: false,
      steam_community_ban: false,
      chineseAccount: true,
      email_provider: 'qq',
      item_domain: 'qq.com',
      item_origin: 'stealer',
      guarantee: { durationPhrase: '24 hours' },
      seller: {
        username: 'cn_seller',
        sold_items_count: 2100,
        restore_percents: 92
      },
      steam_full_games: {
        list: {
          251570: { title: '7 Days to Die', abbr: '7 Days to Die', playtime_forever: 156.8 },
          815370: { title: 'Green Hell', abbr: 'Green Hell', playtime_forever: 89.2 }
        },
        total: 2
      }
    },
    {
      item_id: 180232470,
      type: 'Steam',
      price: 7.55,
      priceWithSellerFeeLabel: '$7.55',
      title: 'Premium Gaming Collection',
      title_en: 'Premium Gaming Collection',
      item_state: 'active',
      account_last_activity: 1720224000, // Jul 6, 2025
      steam_country: 'Canada',
      steam_level: 15,
      steam_game_count: 18,
      steam_friend_count: 45,
      steam_balance: '$2.50',
      steam_inv_value: 12.75,
      steam_mfa: true,
      steam_is_limited: false,
      steam_market: true,
      steam_community_ban: false,
      email_provider: 'gmail',
      item_domain: 'gmail.com',
      item_origin: 'personal',
      guarantee: { durationPhrase: '24 hours' },
      seller: {
        username: 'premium_trader',
        sold_items_count: 750,
        restore_percents: 99
      },
      steam_full_games: {
        list: {
          381210: { title: 'Dead by Daylight', abbr: 'Dead by Daylight', playtime_forever: 245.6 },
          2290300: { title: 'Riders Republic', abbr: 'Riders Republic', playtime_forever: 67.4 },
          2277770: { title: 'Trackmania', abbr: 'Trackmania', playtime_forever: 34.2 },
          601510: { title: 'Yu-Gi-Oh! Duel Links', abbr: 'Yu-Gi-Oh! Duel Links', playtime_forever: 89.1 }
        },
        total: 18
      }
    },
    {
      item_id: 180232471,
      type: 'Steam',
      price: 3.4,
      priceWithSellerFeeLabel: '$3.4',
      title: 'Strategy Games Account',
      title_en: 'Strategy Games Account',
      item_state: 'active',
      account_last_activity: 1616457600, // Mar 23, 2021
      steam_country: 'Australia',
      steam_level: 12,
      steam_game_count: 4,
      steam_friend_count: 18,
      steam_balance: '$0.00',
      steam_inv_value: 3.25,
      steam_mfa: true,
      steam_is_limited: false,
      steam_market: true,
      steam_community_ban: false,
      email_provider: 'hotmail',
      item_domain: 'hotmail.com',
      item_origin: 'personal',
      guarantee: { durationPhrase: '24 hours' },
      seller: {
        username: 'strategy_master',
        sold_items_count: 320,
        restore_percents: 96
      },
      steam_full_games: {
        list: {
          289070: { title: 'Sid Meier\'s Civilization VI', abbr: 'Civilization VI', playtime_forever: 189.5 },
          333420: { title: 'Cossacks 3', abbr: 'Cossacks 3', playtime_forever: 45.7 },
          255710: { title: 'Cities: Skylines', abbr: 'Cities: Skylines', playtime_forever: 123.8 },
          285190: { title: 'Warhammer 40,000: Dawn of War III', abbr: 'Dawn of War III', playtime_forever: 67.2 }
        },
        total: 4
      }
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
  const [steamFilters, setSteamFilters] = useState({}); // Add Steam filters state

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

    // Create base account object
    const baseAccount = {
      id: accountData.item_id || accountData.id || Math.random().toString(36),
      item_id: accountData.item_id || accountData.id,
      price: accountData.price || 0,
      priceWithSellerFeeLabel: accountData.priceWithSellerFeeLabel || `$${accountData.price || '0.00'}`,
      type: selectedCategory,
      title: accountData.title || accountData.title_en || getAccountStatus(steamData.status || steamData.account_status) || 'Account',
      title_en: accountData.title_en || accountData.title,
      item_state: accountData.item_state || 'active',
      lastSeen: formatLastSeen(steamData.last_seen || steamData.last_online || steamData.last_logoff) || accountData.last_seen || 'Unknown',
      country: getCountryInfo(accountData),
      description: accountData.description || '',
      hasWarranty: (accountData.warranty_days || 0) > 0,
      warranty: accountData.warranty_days ? `${accountData.warranty_days} days` : null,
      guarantee: accountData.guarantee || { durationPhrase: '24 hours' },
      seller: {
        username: sellerData.username || sellerData.name || accountData.seller || 'Unknown',
        sold_items_count: sellerData.sold_items_count || sellerData.sales_count || 0,
        restore_percents: sellerData.restore_percents || sellerData.rating || 95
      }
    };

    // Add Steam-specific fields if this is a Steam account
    if (selectedCategory === 'Steam') {
      return {
        ...baseAccount,
        // Steam-specific timestamps
        account_last_activity: accountData.account_last_activity || steamData.last_seen || steamData.last_online,
        steam_last_activity: accountData.account_last_activity || steamData.last_seen || steamData.last_online,
        
        // Steam account details
        steam_country: accountData.steam_country || steamData.country || accountData.country,
        steam_level: accountData.steam_level || steamData.level || 0,
        steam_game_count: accountData.steam_game_count || steamData.games_count || 0,
        steam_friend_count: accountData.steam_friend_count || steamData.friends_count || 0,
        steam_balance: accountData.steam_balance || steamData.balance || '$0.00',
        steam_inv_value: accountData.steam_inv_value || steamData.inventory_value || 0,
        steam_mfa: accountData.steam_mfa !== undefined ? accountData.steam_mfa : true,
        steam_is_limited: accountData.steam_is_limited !== undefined ? accountData.steam_is_limited : false,
        steam_market: accountData.steam_market !== undefined ? accountData.steam_market : true,
        steam_community_ban: accountData.steam_community_ban !== undefined ? accountData.steam_community_ban : false,
        steam_bans: accountData.steam_bans || steamData.bans || 'None',
        
        // Email and security info
        email_provider: accountData.email_provider || 'unknown',
        item_domain: accountData.item_domain || 'unknown.com',
        item_origin: accountData.item_origin || 'unknown',
        
        // Games data - this is crucial for displaying games
        steam_full_games: accountData.steam_full_games || {
          list: {},
          total: 0
        },
        
        // Additional Steam fields for compatibility
        steamId: steamData.steam_id || steamData.steamid,
        level: accountData.steam_level || steamData.level || 0,
        games: steamData.games || steamData.owned_games || [],
        gamesCount: accountData.steam_game_count || steamData.games_count || (steamData.games || []).length,
        inventoryValue: accountData.steam_inv_value || steamData.inventory_value || steamData.inventory_worth || 0,
        marketValue: steamData.market_value || steamData.market_worth || 0,
        hasEmail: accountData.with_email || accountData.email_access || false,
        hasEmailChanges: steamData.email_changes || false,
        vacBanned: steamData.vac_banned || accountData.steam_bans === 'VAC',
        communityBanned: steamData.community_banned || accountData.steam_community_ban,
        tradeBanned: steamData.trade_banned || false,
        accountAge: steamData.account_age || steamData.created,
        totalHours: steamData.total_hours || steamData.hours_played || 0,
        views: accountData.views || 0
      };
    }

    // For non-Steam accounts, add category-specific data
    return {
      ...baseAccount,
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
  const fetchAccounts = async (category, filters = {}) => {
    setLoading(true);
    setError(null);
    
    // Check if we should use mock data
    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
      console.log('🎭 Using mock data for category:', category);
      console.log('🔍 Filters for mock data:', filters, steamFilters);
      
      setTimeout(() => {
        if (mockAccounts[category]) {
          const transformedAccounts = mockAccounts[category].map(transformAccountData);
          console.log('🎭 Mock data transformed accounts:', transformedAccounts.length);
          console.log('🎮 Sample mock account games:', transformedAccounts[0]?.steam_full_games);
          
          // For Steam, only show accounts with games
          if (category === 'Steam') {
            const accountsWithGames = transformedAccounts.filter(account => {
              const hasGames = account.steam_full_games?.list && Object.keys(account.steam_full_games.list).length > 0;
              console.log(`🎮 Account ${account.item_id}: has games = ${hasGames}, games count = ${Object.keys(account.steam_full_games?.list || {}).length}`);
              return hasGames;
            });
            console.log(`🎯 Mock data: ${transformedAccounts.length} total, ${accountsWithGames.length} with games`);
            setAccounts(accountsWithGames);
          } else {
            setAccounts(transformedAccounts);
          }
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
          // Set default Steam filters for initial load to ensure we get accounts with games
          const defaultSteamFilters = {
            'game[]': [578080], // PUBG - popular game to ensure accounts have games
            order_by: 'price_to_up', // Show cheapest first
            page: 1
          };
          
          // Merge default parameters with filters for Steam
          // If no specific filters provided (initial load), use default PUBG filter
          const steamParams = Object.keys(filters).length === 0 && Object.keys(steamFilters).length === 0 ? 
            defaultSteamFilters : 
            { ...filters, ...steamFilters };
          
          console.log('🎮 Fetching Steam accounts with params:', steamParams);
          console.log('🔍 Filters provided:', filters);
          console.log('🔍 Steam filters state:', steamFilters);
          
          if (Object.keys(filters).length === 0 && Object.keys(steamFilters).length === 0) {
            console.log('� Using PUBG filter for initial load to ensure accounts have games');
          }
          
          // Try multi-page fetch for Steam to get more results
          try {
            console.log('🔄 Trying multi-page Steam fetch...');
            response = await api.getSteamAccountsMultiplePages(steamParams, 3); // Fetch up to 3 pages
            console.log('✅ Multi-page Steam fetch successful:', response);
          } catch (multiPageError) {
            console.log('❌ Multi-page fetch failed, falling back to single page:', multiPageError);
            response = await api.getSteamAccounts(steamParams);
          }
          break;
        case 'Fortnite':
          response = await api.searchFortniteAccounts(filters);
          break;
        case 'Discord':
          response = await api.searchDiscordAccounts(filters);
          break;
        case 'Instagram':
          response = await api.searchInstagramAccounts(filters);
          break;
        case 'Telegram':
          response = await api.searchTelegramAccounts(filters);
          break;
        default:
          // For other categories, try generic search or fallback to latest accounts
          response = await api.getLatestAccounts();
          break;
      }

      // Transform the API response to match our structure
      console.log('📡 Raw API Response:', response);
      
      if (response && response.items) {
        console.log('📊 Sample account data from API:', response.items[0]);
        console.log('🎮 Games data in sample account:', response.items[0]?.steam_full_games);
        
        const transformedAccounts = response.items.map(transformAccountData);
        console.log('🔄 Sample transformed account:', transformedAccounts[0]);
        console.log('🎮 Games data after transformation:', transformedAccounts[0]?.steam_full_games);
        
        // Filter accounts that have games for Steam category
        if (category === 'Steam') {
          const accountsWithGames = transformedAccounts.filter(account => {
            const hasGames = account.steam_full_games?.list && Object.keys(account.steam_full_games.list).length > 0;
            if (!hasGames) {
              console.log('⚠️ Account without games found:', account.item_id, account.title);
            }
            return hasGames;
          });
          
          console.log(`🎯 Found ${transformedAccounts.length} total accounts, ${accountsWithGames.length} with games`);
          setAccounts(accountsWithGames);
        } else {
          setAccounts(transformedAccounts);
        }
      } else if (response && Array.isArray(response)) {
        console.log('📊 Array response - sample account:', response[0]);
        const transformedAccounts = response.map(transformAccountData);
        console.log('🔄 Sample transformed account:', transformedAccounts[0]);
        setAccounts(transformedAccounts);
      } else {
        console.log('❌ No items found in response:', response);
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

  // Function to update Steam filters and re-fetch data
  const updateSteamFilters = (filters) => {
    console.log('Updating Steam filters:', filters);
    setSteamFilters(filters);
    if (selectedCategory === 'Steam') {
      fetchAccounts('Steam', filters);
    }
  };

  // Function to manually refresh accounts
  const refreshAccounts = () => {
    if (selectedCategory) {
      fetchAccounts(selectedCategory, selectedCategory === 'Steam' ? steamFilters : {});
    }
  };

  return {
    accounts,
    loading,
    error,
    selectedCategory,
    changeCategory,
    refreshAccounts,
    updateSteamFilters // Add the new function to the return
  };
};

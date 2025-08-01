import { useState, useEffect, useCallback, useRef } from 'react';
import ZelenkaAPI from '../services/zelenkaAPI';

export const useInfiniteSteamAccounts = (filters = {}) => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const api = new ZelenkaAPI();
  const abortControllerRef = useRef(null);

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

    return {
      id: apiAccount.item_id || apiAccount.id,
      item_id: apiAccount.item_id,
      title: apiAccount.title || `Steam Account #${apiAccount.item_id}`,
      price: apiAccount.price || 0,
      priceWithSellerFeeLabel: apiAccount.price_currency ? 
        `${(apiAccount.price_currency.toLowerCase() === 'usd') ? '$' : apiAccount.price_currency}${apiAccount.price}` : 
        `$${apiAccount.price}`,
      currency: (apiAccount.price_currency?.toLowerCase() === 'usd') ? '$' : (apiAccount.price_currency || '$'),
      
      // Account status and activity
      item_state: apiAccount.item_state || 'active',
      account_last_activity: steamData.account_last_activity || steamData.last_activity,
      lastSeen: formatLastSeen(steamData.account_last_activity || steamData.last_activity),
      
      // Steam-specific data
      steam_country: steamData.steam_country || steamData.country,
      steam_last_activity: steamData.account_last_activity,
      steam_creation_date: steamData.steam_creation_date,
      steam_id: steamData.steam_id,
      steam_level: steamData.steam_level || 0,
      steam_full_games: steamData.steam_full_games || { list: {} },
      steam_balance: steamData.steam_balance || 0,
      steam_game_count: steamData.steam_game_count || 
        (steamData.steam_full_games?.list ? Object.keys(steamData.steam_full_games.list).length : 0),
      
      // Additional fields
      item_origin: apiAccount.item_origin,
      warranty: apiAccount.warranty,
      hasWarranty: !!apiAccount.warranty,
      guarantee: apiAccount.guarantee,
      
      // Seller information
      seller: {
        username: sellerData.username || 'Unknown',
        rating: sellerData.rating || 0,
        sold_count: sellerData.sold_count || 0
      },
      
      // Extract games list for display
      games: steamData.steam_full_games?.list ? 
        Object.values(steamData.steam_full_games.list).map(game => ({
          appid: game.appid,
          name: game.name,
          playtime: game.playtime_forever || 0,
          last_played: game.rtime_last_played
        })) : [],
      
      // Helper properties
      gameCount: steamData.steam_game_count || 
        (steamData.steam_full_games?.list ? Object.keys(steamData.steam_full_games.list).length : 0),
      
      type: 'Steam Account'
    };
  };

  // Load initial page
  const loadInitialAccounts = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      setHasMore(true);
      
      // Set default Steam filters for initial load
      const defaultSteamFilters = {
        'game[]': [578080], // PUBG - popular game to ensure accounts have games
        order_by: 'price_to_up', // Show cheapest first
        page: 1,
        per_page: 20 // Limit to 20 items per page for better UX
      };
      
      // Merge filters with defaults
      const steamParams = Object.keys(filters).length === 0 ? 
        defaultSteamFilters : 
        { ...defaultSteamFilters, ...filters, page: 1 };
      
      const response = await api.getSteamAccounts(steamParams);
      
      if (response && response.items) {
        const transformedAccounts = response.items.map(transformAccountData);
        
        // Filter accounts that have games
        const accountsWithGames = transformedAccounts.filter(account => {
          const hasGames = (account.steam_full_games?.list && Object.keys(account.steam_full_games.list).length > 0) ||
                           (account.games && Array.isArray(account.games) && account.games.length > 0) ||
                           (account.steam_game_count && account.steam_game_count > 0) ||
                           (account.gameCount && account.gameCount > 0);
          return hasGames;
        });
        
        setAccounts(accountsWithGames);
        
        // Check if there are more pages
        const totalPages = Math.ceil((response.totalCount || response.total || 100) / (response.itemsPerPage || 25));
        setHasMore(1 < totalPages);
      } else {
        setAccounts([]);
        setHasMore(false);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error loading initial Steam accounts:', err);
        setError(err.message || 'Failed to load Steam accounts');
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load more accounts (for infinite scroll)
  const loadMoreAccounts = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    try {
      setLoadingMore(true);
      setError(null);
      
      const nextPage = currentPage + 1;
      
      // Set default Steam filters
      const defaultSteamFilters = {
        'game[]': [578080], // PUBG
        order_by: 'price_to_up',
        page: nextPage,
        per_page: 20 // Limit to 20 items per page
      };
      
      // Merge filters with defaults
      const steamParams = Object.keys(filters).length === 0 ? 
        defaultSteamFilters : 
        { ...defaultSteamFilters, ...filters, page: nextPage };
      
      const response = await api.getSteamAccounts(steamParams);
      
      if (response && response.items && response.items.length > 0) {
        const transformedAccounts = response.items.map(transformAccountData);
        
        // Filter accounts that have games
        const accountsWithGames = transformedAccounts.filter(account => {
          const hasGames = (account.steam_full_games?.list && Object.keys(account.steam_full_games.list).length > 0) ||
                           (account.games && Array.isArray(account.games) && account.games.length > 0) ||
                           (account.steam_game_count && account.steam_game_count > 0) ||
                           (account.gameCount && account.gameCount > 0);
          return hasGames;
        });
        
        // Append new accounts to existing ones
        setAccounts(prev => [...prev, ...accountsWithGames]);
        setCurrentPage(nextPage);
        
        // Check if there are more pages
        const totalPages = Math.ceil((response.totalCount || response.total || 100) / (response.itemsPerPage || 25));
        setHasMore(nextPage < totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more Steam accounts:', err);
      setError(err.message || 'Failed to load more accounts');
    } finally {
      setLoadingMore(false);
    }
  }, [filters, currentPage, loadingMore, hasMore]);

  // Reload accounts when filters change
  useEffect(() => {
    loadInitialAccounts();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadInitialAccounts]);

  return {
    accounts,
    loading,
    loadingMore,
    error,
    hasMore,
    currentPage,
    loadMoreAccounts,
    refresh: loadInitialAccounts
  };
};

import { useState, useEffect } from 'react'
import ZelenkaAPI from '../services/zelenkaAPI'

// Create an instance of the API
const zelenkaAPI = new ZelenkaAPI()

const DebugPage = () => {
  const [steamAccounts, setSteamAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('checking')
  const [rawResponse, setRawResponse] = useState(null)
  const [showRawData, setShowRawData] = useState(false)
  
  // Filter states for testing
  const [filters, setFilters] = useState({
    min_price: '',
    max_price: '',
    search_title: '',
    limit: '20',
    page: '1',
    order_by: 'price',
    order_dir: 'asc'
  })

  // Test API connection on component mount
  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setConnectionStatus('checking')
    try {
      const response = await zelenkaAPI.getSteamAccounts({ limit: 1 })
      setConnectionStatus('connected')
      setRawResponse(response)
    } catch (err) {
      setConnectionStatus('failed')
      setError(err.message)
    }
  }

  const fetchSteamAccounts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Build filter object, excluding empty values
      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value && value.trim() !== '') {
          acc[key] = value.trim()
        }
        return acc
      }, {})

      console.log('Fetching Steam accounts with filters:', activeFilters)
      
      const response = await zelenkaAPI.getSteamAccounts(activeFilters)
      setRawResponse(response)
      setSteamAccounts(response.accounts || [])
      
      console.log('Steam API Response:', response)
    } catch (err) {
      console.error('Steam API Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      min_price: '',
      max_price: '',
      search_title: '',
      limit: '20',
      page: '1',
      order_by: 'price',
      order_dir: 'asc'
    })
  }

  const transformAccountData = (account) => {
    return {
      // Basic Info
      id: account.item_id,
      title: account.title,
      titleEn: account.title_en,
      price: account.price,
      currency: account.price_currency,
      rubPrice: account.rub_price,
      priceWithFee: account.priceWithSellerFee,
      priceWithFeeLabel: account.priceWithSellerFeeLabel,
      
      // Seller Info
      seller: account.seller?.username,
      sellerSoldItems: account.seller?.sold_items_count,
      sellerActiveItems: account.seller?.active_items_count,
      sellerRestorePercent: account.seller?.restore_percents,
      
      // Steam Account Details
      steamCountry: account.steam_country,
      steamRegisterDate: account.steam_register_date,
      steamLastActivity: account.steam_last_activity,
      steamLevel: account.steam_level,
      steamFriends: account.steam_friend_count,
      steamGameCount: account.steam_game_count,
      steamRelevantGameCount: account.steam_relevant_game_count,
      steamBalance: account.steam_balance,
      steamConvertedBalance: account.steam_converted_balance,
      steamPoints: account.steam_points,
      
      // Inventory Values
      inventoryValue: account.steam_inv_value,
      steamInventoryValue: account.steam_steam_inv_value,
      cs2InventoryValue: account.steam_cs2_inv_value,
      dota2InventoryValue: account.steam_dota2_inv_value,
      tf2InventoryValue: account.steam_tf2_inv_value,
      rustInventoryValue: account.steam_rust_inv_value,
      pubgInventoryValue: account.steam_pubg_inv_value,
      
      // Game-specific data
      steamFullGames: account.steam_full_games,
      cs2Rank: account.steam_cs2_profile_rank,
      cs2RankId: account.steam_cs2_rank_id,
      cs2WingmanRankId: account.steam_cs2_wingman_rank_id,
      cs2WinCount: account.steam_cs2_win_count,
      cs2MedalCount: account.steam_cs2_medal_count,
      cs2LastActivity: account.steam_cs2_last_activity,
      cs2BanDate: account.steam_cs2_ban_date,
      cs2BanType: account.steam_cs2_ban_type,
      cs2PremierElo: account.steam_cs2_premier_elo,
      
      dota2SoloMmr: account.steam_dota2_solo_mmr,
      dota2GameCount: account.steam_dota2_game_count,
      dota2WinCount: account.steam_dota2_win_count,
      dota2LoseCount: account.steam_dota2_lose_count,
      dota2LastMatchDate: account.steam_dota2_last_match_date,
      dota2Behavior: account.steam_dota2_behavior,
      
      // Ban Status
      steamBans: account.steam_bans,
      steamCommunityBan: account.steam_community_ban,
      steamIsLimited: account.steam_is_limited,
      steamMarket: account.steam_market,
      steamMarketRestrictions: account.steam_market_restrictions,
      steamMarketBanEndDate: account.steam_market_ban_end_date,
      
      // Account Features
      steamMfa: account.steam_mfa,
      steamHasActivatedKeys: account.steam_has_activated_keys,
      steamHasFaceit: account.steam_has_faceit,
      steamFaceitCs2Level: account.steam_faceit_cs2_level,
      steamFaceitCsgoLevel: account.steam_faceit_csgo_level,
      
      // Email & Domain
      emailType: account.email_type,
      emailProvider: account.email_provider,
      itemDomain: account.item_domain,
      
      // Item Details
      itemState: account.item_state,
      itemOrigin: account.item_origin,
      publishedDate: account.published_date,
      viewCount: account.view_count,
      guarantee: account.guarantee,
      maxDiscountPercent: account.max_discount_percent,
      
      // Purchase Totals
      totalGamesRub: account.steam_total_games_rub,
      totalPurchasedRub: account.steam_total_purchased_rub,
      totalInGameRub: account.steam_total_ingame_rub,
      totalGiftsRub: account.steam_total_gifts_rub,
      totalRefundsRub: account.steam_total_refunds_rub,
      
      // Additional Data
      steamTransactions: account.steamTransactions,
      accountLinks: account.accountLinks,
      chineseAccount: account.chineseAccount,
      hasCs2: account.hasCs2,
      hasDota2: account.hasDota2,
      hasPubg: account.hasPubg,
      hasTf2: account.hasTf2,
      hasRust: account.hasRust
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Steam API Debug Page</h1>
          
          {/* Connection Status */}
          <div className="mb-6 p-4 rounded-lg bg-gray-800">
            <h2 className="text-xl font-semibold mb-2">Connection Status</h2>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500' : 
                connectionStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="capitalize">{connectionStatus}</span>
              <button
                onClick={testConnection}
                className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
              >
                Test Again
              </button>
            </div>
            {error && (
              <div className="mt-2 text-red-400 text-sm">
                Error: {error}
              </div>
            )}
          </div>

          {/* Steam Filter Testing */}
          <div className="mb-6 p-4 rounded-lg bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Steam Filter Testing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Min Price</label>
                <input
                  type="number"
                  value={filters.min_price}
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Max Price</label>
                <input
                  type="number"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
                  placeholder="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Search Title</label>
                <input
                  type="text"
                  value={filters.search_title}
                  onChange={(e) => handleFilterChange('search_title', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
                  placeholder="CS2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Limit</label>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Order By</label>
                <select
                  value={filters.order_by}
                  onChange={(e) => handleFilterChange('order_by', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
                >
                  <option value="price">Price</option>
                  <option value="date">Date</option>
                  <option value="title">Title</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Order Direction</label>
                <select
                  value={filters.order_dir}
                  onChange={(e) => handleFilterChange('order_dir', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Page</label>
                <input
                  type="number"
                  value={filters.page}
                  onChange={(e) => handleFilterChange('page', e.target.value)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:border-blue-500"
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={fetchSteamAccounts}
                disabled={loading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded font-medium"
              >
                {loading ? 'Fetching...' : 'Fetch Steam Accounts'}
              </button>
              
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded font-medium"
              >
                Clear Filters
              </button>
              
              <button
                onClick={() => setShowRawData(!showRawData)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
              >
                {showRawData ? 'Hide' : 'Show'} Raw Data
              </button>
            </div>
          </div>

          {/* Raw API Response */}
          {showRawData && rawResponse && (
            <div className="mb-6 p-4 rounded-lg bg-gray-800">
              <h2 className="text-xl font-semibold mb-2">Raw API Response</h2>
              <pre className="bg-gray-900 p-4 rounded text-xs overflow-auto max-h-96">
                {JSON.stringify(rawResponse, null, 2)}
              </pre>
            </div>
          )}

          {/* Steam Accounts Display */}
          {steamAccounts.length > 0 && (
            <div className="p-4 rounded-lg bg-gray-800">
              <h2 className="text-xl font-semibold mb-4">
                Steam Accounts ({steamAccounts.length})
              </h2>
              
              <div className="space-y-4">
                {steamAccounts.map((account, index) => {
                  const transformed = transformAccountData(account)
                  
                  return (
                    <div key={index} className="bg-gray-700 p-4 rounded-lg">
                      {/* Header with Title and Price */}
                      <div className="mb-4 pb-4 border-b border-gray-600">
                        <h3 className="font-semibold text-lg mb-2">{transformed.title}</h3>
                        {transformed.titleEn && (
                          <p className="text-gray-300 text-sm mb-2">{transformed.titleEn}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-green-400 font-bold text-xl">{transformed.priceWithFeeLabel}</p>
                            <p className="text-gray-300 text-sm">Base: ${transformed.price} {transformed.currency}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-300">Seller: <span className="text-white">{transformed.seller}</span></p>
                            <p className="text-gray-400 text-xs">{transformed.sellerSoldItems} sold | {transformed.sellerActiveItems} active</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Steam Account Info */}
                        <div>
                          <h4 className="font-medium mb-2 text-blue-400">📱 Account Info</h4>
                          <p className="text-sm">Country: <span className="text-white">{transformed.steamCountry}</span></p>
                          <p className="text-sm">Level: <span className="text-white">{transformed.steamLevel}</span></p>
                          <p className="text-sm">Friends: <span className="text-white">{transformed.steamFriends}</span></p>
                          <p className="text-sm">Games: <span className="text-white">{transformed.steamGameCount}</span></p>
                          <p className="text-sm">Balance: <span className="text-white">{transformed.steamBalance}</span></p>
                          <p className="text-sm">Points: <span className="text-white">{transformed.steamPoints}</span></p>
                        </div>

                        {/* Inventory Values */}
                        <div>
                          <h4 className="font-medium mb-2 text-green-400">💰 Inventory Values</h4>
                          <p className="text-sm">Total: <span className="text-white">${transformed.inventoryValue?.toFixed(2) || '0.00'}</span></p>
                          <p className="text-sm">Steam: <span className="text-white">${transformed.steamInventoryValue?.toFixed(2) || '0.00'}</span></p>
                          {transformed.cs2InventoryValue > 0 && (
                            <p className="text-sm">CS2: <span className="text-white">${transformed.cs2InventoryValue}</span></p>
                          )}
                          {transformed.dota2InventoryValue > 0 && (
                            <p className="text-sm">Dota2: <span className="text-white">${transformed.dota2InventoryValue}</span></p>
                          )}
                          {transformed.tf2InventoryValue > 0 && (
                            <p className="text-sm">TF2: <span className="text-white">${transformed.tf2InventoryValue}</span></p>
                          )}
                          {transformed.rustInventoryValue > 0 && (
                            <p className="text-sm">Rust: <span className="text-white">${transformed.rustInventoryValue}</span></p>
                          )}
                        </div>

                        {/* Account Security & Status */}
                        <div>
                          <h4 className="font-medium mb-2 text-red-400">� Security & Status</h4>
                          <p className="text-sm">2FA: <span className={transformed.steamMfa ? 'text-green-400' : 'text-red-400'}>{transformed.steamMfa ? 'Enabled' : 'Disabled'}</span></p>
                          <p className="text-sm">Limited: <span className={transformed.steamIsLimited ? 'text-red-400' : 'text-green-400'}>{transformed.steamIsLimited ? 'Yes' : 'No'}</span></p>
                          <p className="text-sm">Market: <span className={transformed.steamMarket ? 'text-green-400' : 'text-red-400'}>{transformed.steamMarket ? 'Enabled' : 'Disabled'}</span></p>
                          <p className="text-sm">Community Ban: <span className={transformed.steamCommunityBan ? 'text-red-400' : 'text-green-400'}>{transformed.steamCommunityBan ? 'Yes' : 'No'}</span></p>
                          {transformed.steamBans && (
                            <p className="text-sm text-red-400">Bans: {transformed.steamBans}</p>
                          )}
                          {transformed.steamMarketBanEndDate > 0 && (
                            <p className="text-sm text-red-400">Market Ban Until: {new Date(transformed.steamMarketBanEndDate * 1000).toLocaleDateString()}</p>
                          )}
                        </div>

                        {/* Game-specific Info */}
                        {(transformed.hasCs2 || transformed.cs2Rank > 0 || transformed.cs2WinCount > 0) && (
                          <div>
                            <h4 className="font-medium mb-2 text-orange-400">🎮 CS2 Stats</h4>
                            <p className="text-sm">Rank: <span className="text-white">{transformed.cs2Rank || 'Unranked'}</span></p>
                            <p className="text-sm">Wins: <span className="text-white">{transformed.cs2WinCount}</span></p>
                            <p className="text-sm">Medals: <span className="text-white">{transformed.cs2MedalCount}</span></p>
                            {transformed.cs2PremierElo > 0 && (
                              <p className="text-sm">Premier ELO: <span className="text-white">{transformed.cs2PremierElo}</span></p>
                            )}
                            {transformed.cs2BanDate > 0 && (
                              <p className="text-sm text-red-400">Ban Date: {new Date(transformed.cs2BanDate * 1000).toLocaleDateString()}</p>
                            )}
                          </div>
                        )}

                        {(transformed.hasDota2 || transformed.dota2SoloMmr > 0) && (
                          <div>
                            <h4 className="font-medium mb-2 text-purple-400">🎮 Dota2 Stats</h4>
                            <p className="text-sm">Solo MMR: <span className="text-white">{transformed.dota2SoloMmr}</span></p>
                            <p className="text-sm">Games: <span className="text-white">{transformed.dota2GameCount}</span></p>
                            <p className="text-sm">Wins: <span className="text-white">{transformed.dota2WinCount}</span></p>
                            <p className="text-sm">Losses: <span className="text-white">{transformed.dota2LoseCount}</span></p>
                            {transformed.dota2Behavior > 0 && (
                              <p className="text-sm">Behavior: <span className="text-white">{transformed.dota2Behavior}</span></p>
                            )}
                          </div>
                        )}

                        {/* Email & Domain Info */}
                        <div>
                          <h4 className="font-medium mb-2 text-cyan-400">📧 Email Info</h4>
                          <p className="text-sm">Provider: <span className="text-white">{transformed.emailProvider}</span></p>
                          <p className="text-sm">Domain: <span className="text-white">{transformed.itemDomain}</span></p>
                          <p className="text-sm">Type: <span className="text-white">{transformed.emailType || 'N/A'}</span></p>
                          <p className="text-sm">Origin: <span className="text-white">{transformed.itemOrigin}</span></p>
                        </div>
                      </div>

                      {/* Games List */}
                      {transformed.steamFullGames?.list && Object.keys(transformed.steamFullGames.list).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <h4 className="font-medium mb-2 text-yellow-400">🎮 Games ({transformed.steamFullGames.total})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {Object.values(transformed.steamFullGames.list).map((game, gameIndex) => (
                              <div key={gameIndex} className="bg-gray-800 p-2 rounded text-sm">
                                <p className="font-medium truncate">{game.title}</p>
                                <p className="text-gray-400">{game.playtime_forever}h played</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Steam Transactions */}
                      {transformed.steamTransactions && transformed.steamTransactions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <h4 className="font-medium mb-2 text-indigo-400">💳 Recent Transactions</h4>
                          <div className="space-y-2">
                            {transformed.steamTransactions.slice(0, 3).map((transaction, txIndex) => (
                              <div key={txIndex} className="bg-gray-800 p-2 rounded text-sm">
                                <div className="flex justify-between">
                                  <span className="text-white">{transaction.amount}</span>
                                  <span className="text-gray-400">{new Date(transaction.date * 1000).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-300 truncate">{transaction.product}</p>
                                <p className="text-gray-400">{transaction.type} via {transaction.source}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Links */}
                      {transformed.accountLinks && transformed.accountLinks.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <h4 className="font-medium mb-2 text-pink-400">🔗 Quick Links</h4>
                          <div className="flex flex-wrap gap-2">
                            {transformed.accountLinks.map((link, linkIndex) => (
                              <a
                                key={linkIndex}
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm text-white"
                              >
                                {link.text}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DebugPage
            
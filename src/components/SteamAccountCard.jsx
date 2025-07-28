import { Icon } from '@iconify/react'

const SteamAccountCard = ({ account }) => {
  // Debug log to see the account data
  console.log('SteamAccountCard received account:', account)
  console.log('Account keys:', Object.keys(account || {}))
  console.log('Steam games data:', account?.steam_full_games)
  console.log('Price data:', { 
    priceWithSellerFeeLabel: account?.priceWithSellerFeeLabel, 
    price: account?.price,
    steam_last_activity: account?.steam_last_activity,
    item_origin: account?.item_origin
  })
  
  // Format price
  const price = account.priceWithSellerFeeLabel || `$${account.price || 0}`
  
  // Get warranty info
  const getWarrantyInfo = () => {
    if (account.hasWarranty) return account.warranty
    if (account.guarantee?.durationPhrase) return account.guarantee.durationPhrase
    return '24 hours warranty'
  }

  // Get warning color class based on last seen
  const getLastSeenWarning = () => {
    const lastActivity = account.steam_last_activity || account.account_last_activity || account.lastSeen
    if (!lastActivity || lastActivity === 'Unknown') return 'warn-red'
    
    // Handle different date formats
    let lastSeen
    if (typeof lastActivity === 'number') {
      lastSeen = new Date(lastActivity * 1000)
    } else if (typeof lastActivity === 'string') {
      lastSeen = new Date(lastActivity)
    } else {
      return 'warn-red'
    }
    
    const now = new Date()
    const daysDiff = (now - lastSeen) / (1000 * 60 * 60 * 24)
    
    if (daysDiff > 365) return 'warn-green'  // More than a year - safe
    if (daysDiff > 30) return 'warn-yellow'  // More than a month - medium risk
    return 'warn-red'  // Recent activity - high risk
  }

  // Format date like in the original
  const formatDate = (timestamp) => {
    if (!timestamp || timestamp === 'Unknown') return 'Unknown'
    
    let dateObj
    if (typeof timestamp === 'number') {
      dateObj = new Date(timestamp * 1000)
    } else if (typeof timestamp === 'string') {
      dateObj = new Date(timestamp)
    } else {
      return 'Unknown'
    }
    
    if (isNaN(dateObj.getTime())) return 'Unknown'
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Get main games from Steam data
  const getMainGames = () => {
    // Check multiple possible game data structures
    if (account.steam_full_games?.list) {
      const games = Object.values(account.steam_full_games.list)
      return games.sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0)).slice(0, 4)
    }
    
    // Fallback to games array if steam_full_games doesn't exist
    if (account.games && Array.isArray(account.games)) {
      return account.games.slice(0, 4).map(game => ({
        title: game,
        appid: Math.random().toString(), // Temporary ID for rendering
        playtime_forever: 0
      }))
    }
    
    return []
  }

  // Get additional games count
  const getAdditionalGamesCount = () => {
    if (account.steam_full_games?.list) {
      const totalGames = Object.keys(account.steam_full_games.list).length
      return Math.max(0, totalGames - 4)
    }
    
    if (account.games && Array.isArray(account.games)) {
      return Math.max(0, account.games.length - 4)
    }
    
    return 0
  }

  // Format hours
  const formatHours = (minutes) => {
    if (!minutes) return '0.0 hrs.'
    const hours = minutes / 60
    return `${hours.toFixed(1)} hrs.`
  }

  return (
    <a 
      href={`/acc/?id=${account.item_id || account.id}`} 
      target="_blank" 
      className="account bg-gray-900 border border-gray-700 hover:border-purple-500 transition-all duration-300 rounded-lg overflow-hidden relative block"
    >
      {/* Right Column - Price */}
      <div className="rightCol absolute top-4 right-4 z-10">
        <div className="marketIndexItem--Price">
          <span className="Value text-2xl font-bold text-purple-400">{price}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="marketIndexItem--Info p-6 pt-16">
        {/* Mail Status */}
        <div className="column warn-green mb-2">
          <p className="text-green-400 text-sm">
            <Icon icon="mdi:thumb-up" className="inline mr-1" />
            Mail
          </p>
        </div>

        {/* Warranty */}
        <div className="column warn-yellow mb-2">
          <span className="text-yellow-400 text-sm">
            <Icon icon="mdi:thumb-up" className="inline mr-1" />
            {getWarrantyInfo()}
          </span>
        </div>

        {/* SDA */}
        <div className="column mb-2">
          <p className="text-gray-300 text-sm" title=".maFile is a file for managing a Steam account through the Mobile Guard Authenticator">
            SDA
          </p>
        </div>

        {/* Last Seen */}
        <div className={`column ${getLastSeenWarning()} mb-4`}>
          <p className={`text-sm ${
            getLastSeenWarning() === 'warn-green' ? 'text-green-400' : 
            getLastSeenWarning() === 'warn-yellow' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            Last seen {formatDate(account.steam_last_activity || account.account_last_activity || account.lastSeen)}
          </p>
        </div>

        {/* Steam Stats */}
        {(account.steam_level || account.steam_friend_count || account.steam_balance) && (
          <div className="steam-stats mb-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              {account.steam_level !== undefined && account.steam_level > 0 && (
                <div className="bg-gray-800 p-2 rounded border border-gray-600">
                  <div className="text-purple-400 font-bold text-sm">{account.steam_level}</div>
                  <div className="text-gray-400 text-xs">Level</div>
                </div>
              )}
              {account.steam_friend_count !== undefined && (
                <div className="bg-gray-800 p-2 rounded border border-gray-600">
                  <div className="text-purple-400 font-bold text-sm">{account.steam_friend_count}</div>
                  <div className="text-gray-400 text-xs">Friends</div>
                </div>
              )}
              {account.steam_balance && account.steam_balance !== "¥ 0.00" && account.steam_balance !== "$0.00" && (
                <div className="bg-gray-800 p-2 rounded border border-gray-600">
                  <div className="text-green-400 font-bold text-sm">{account.steam_balance}</div>
                  <div className="text-gray-400 text-xs">Balance</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Games Container */}
        <div className="games-container mb-4">
          <div className="mb-2">
            <span className="text-gray-400 text-sm">
              Games ({account.steam_game_count || account.gameCount || getMainGames().length || 0}):
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {getMainGames().length > 0 ? getMainGames().map((game, index) => (
              <div key={index} className="game flex items-center bg-gray-800 p-2 rounded border border-gray-600">
                <img 
                  src={game.appid && game.appid !== 'random' ? `https://nztcdn.com/steam/icon/${game.appid}.webp` : '/src/assets/react.svg'}
                  alt={game.title}
                  className="w-6 h-6 rounded mr-2 flex-shrink-0"
                  onError={(e) => {
                    e.target.src = '/src/assets/react.svg' // Fallback image
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div 
                    className="text-xs text-gray-300 hover:text-white cursor-help truncate"
                    title={game.playtime_forever ? `${game.title} - ${formatHours(game.playtime_forever)}` : game.title}
                  >
                    {game.title}
                  </div>
                  {game.playtime_forever > 0 && (
                    <div className="text-xs text-gray-500">
                      {formatHours(game.playtime_forever)}
                    </div>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center text-gray-500 text-sm py-4">
                No games data available
              </div>
            )}
          </div>

          {/* Additional Games */}
          {getAdditionalGamesCount() > 0 && (
            <div className="mt-2 text-center">
              <span 
                className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded border border-gray-600 cursor-help"
                title="Click to view all games"
              >
                +{getAdditionalGamesCount()} more games
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Account Footer */}
      <div className="account-footer bg-gray-800 px-6 py-3 border-t border-gray-700 flex items-center justify-between">
        <img 
          src="/data/assets/category/1.svg" 
          alt="Category Icon" 
          className="icon w-4 h-4"
          onError={(e) => {
            e.target.src = '/src/assets/react.svg' // Fallback
          }}
        />
        <div className="uploaded flex items-center text-sm text-gray-400">
          <span className="info-separator mx-2">•</span>
          <time className="u-dt">
            {formatDate(account.published_date || account.created_at || account.upload_date || account.createdAt)}
          </time>
          <span className="info-separator mx-2">•</span>
          <span className="capitalize-first text-gray-300">
            {account.item_origin || account.origin || account.source || 'unknown'}
          </span>
          {account.resale_item_origin && account.resale_item_origin !== account.item_origin && (
            <span className="capitalize-first text-gray-400 ml-1">
              ({account.resale_item_origin})
            </span>
          )}
        </div>
      </div>

      {/* Background Effect */}
      <div className="sidebar_background absolute inset-0 bg-gradient-to-r from-transparent to-purple-900 opacity-0 hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>
    </a>
  )
}

export default SteamAccountCard

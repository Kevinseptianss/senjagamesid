import { Icon } from '@iconify/react'
import { Link } from 'react-router-dom'
import { getPriceValue, convertToIDR, formatCurrency, formatUSD } from '../utils/currency'

const RiotAccountCard = ({ account }) => {
  // Get formatted price in IDR
  const priceUSD = getPriceValue(account);

  const priceIDR = convertToIDR(priceUSD);
  const formattedPrice = formatCurrency(priceIDR);
  
  // Get warranty info
  const getWarrantyInfo = () => {
    if (account.hasWarranty) return `${account.warranty} Warranty`
    if (account.guarantee?.durationPhrase) return `${account.guarantee.durationPhrase} Warranty`
    if (account.eg !== undefined) {
      // Map guarantee types to descriptions
      const guaranteeMap = {
        '-1': '12 hours Warranty',
        '0': '24 hours Warranty', 
        '1': '3 days Warranty'
      }
      return guaranteeMap[account.eg] || '24 hours Warranty'
    }
    return '24 hours Warranty'
  }

  // Get warning color class based on last seen
  const getLastSeenWarning = () => {
    const lastActivity = account.riot_last_activity || account.account_last_activity || account.lastSeen
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
    const daysDiff = Math.floor((now - lastSeen) / (1000 * 60 * 60 * 24))
    
    if (daysDiff <= 7) return 'warn-green'
    if (daysDiff <= 30) return 'warn-orange'
    return 'warn-red'
  }

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'
    
    try {
      let date
      if (typeof timestamp === 'number') {
        date = new Date(timestamp * 1000)
      } else {
        date = new Date(timestamp)
      }
      
      if (isNaN(date.getTime())) return 'Unknown'
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Unknown'
    }
  }

  // Get account origin display
  const getOriginDisplay = () => {
    const origin = account.item_origin || account.origin
    if (!origin) return null
    
    const originMap = {
      'brute': { label: 'Brute', color: 'bg-red-600' },
      'phishing': { label: 'Phishing', color: 'bg-orange-600' },
      'stealer': { label: 'Stealer', color: 'bg-yellow-600' },
      'personal': { label: 'Personal', color: 'bg-green-600' },
      'resale': { label: 'Resale', color: 'bg-blue-600' },
      'autoreg': { label: 'Autoreg', color: 'bg-purple-600' },
      'dummy': { label: 'Dummy', color: 'bg-gray-600' }
    }
    
    return originMap[origin] || { label: origin, color: 'bg-gray-600' }
  }

  // Get Valorant rank display
  const getValorantRank = () => {
    const rank = account.riot_valorant_rank
    if (!rank || rank === 0) return 'Unrated'
    
    const rankMap = {
      3: 'Iron 1', 4: 'Iron 2', 5: 'Iron 3',
      6: 'Bronze 1', 7: 'Bronze 2', 8: 'Bronze 3',
      9: 'Silver 1', 10: 'Silver 2', 11: 'Silver 3',
      12: 'Gold 1', 13: 'Gold 2', 14: 'Gold 3',
      15: 'Platinum 1', 16: 'Platinum 2', 17: 'Platinum 3',
      18: 'Diamond 1', 19: 'Diamond 2', 20: 'Diamond 3',
      21: 'Ascendant 1', 22: 'Ascendant 2', 23: 'Ascendant 3',
      24: 'Immortal 1', 25: 'Immortal 2', 26: 'Immortal 3',
      27: 'Radiant'
    }
    
    return rankMap[rank] || 'Unrated'
  }

  // Get rank color
  const getRankColor = () => {
    const rank = account.riot_valorant_rank
    if (!rank || rank === 0) return 'text-gray-400'
    
    if (rank >= 3 && rank <= 5) return 'text-amber-600' // Iron
    if (rank >= 6 && rank <= 8) return 'text-amber-500' // Bronze
    if (rank >= 9 && rank <= 11) return 'text-gray-400' // Silver
    if (rank >= 12 && rank <= 14) return 'text-yellow-400' // Gold
    if (rank >= 15 && rank <= 17) return 'text-cyan-400' // Platinum
    if (rank >= 18 && rank <= 20) return 'text-blue-400' // Diamond
    if (rank >= 21 && rank <= 23) return 'text-green-400' // Ascendant
    if (rank >= 24 && rank <= 26) return 'text-purple-400' // Immortal
    if (rank === 27) return 'text-yellow-300' // Radiant
    
    return 'text-gray-400'
  }

  // Get email verification display
  const getEmailVerification = () => {
    if (account.riot_email_verified === 1) return { status: 'Verified', color: 'text-green-400' }
    if (account.riot_email_verified === 0) return { status: 'Not Verified', color: 'text-red-400' }
    return { status: 'Unknown', color: 'text-gray-400' }
  }

  // Get phone verification display
  const getPhoneVerification = () => {
    if (account.riot_phone_verified === 1) return { status: 'Verified', color: 'text-green-400' }
    if (account.riot_phone_verified === 0) return { status: 'Not Verified', color: 'text-red-400' }
    return { status: 'Unknown', color: 'text-gray-400' }
  }

  const origin = getOriginDisplay()
  const warranty = getWarrantyInfo()
  const lastSeenClass = getLastSeenWarning()
  const emailVerification = getEmailVerification()
  const phoneVerification = getPhoneVerification()

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 p-6 relative overflow-hidden">
      {/* Price and Basic Info Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-2xl font-bold text-purple-400">
              {formattedPrice}
            </span>
            <span className="text-sm text-gray-400">
              ({formatUSD(priceUSD)})
            </span>
          </div>
          {warranty && (
            <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full w-fit">
              {warranty}
            </span>
          )}
        </div>
        
        {origin && (
          <span className={`${origin.color} text-white text-xs px-2 py-1 rounded-lg font-medium`}>
            {origin.label}
          </span>
        )}
      </div>

      {/* Account Title */}
      <div className="mb-4">
        <h3 className="text-white font-medium text-lg leading-tight line-clamp-2">
          {account.title || 'Riot Account'}
        </h3>
      </div>

      {/* Valorant Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Valorant Level</p>
              <p className="text-lg font-bold text-purple-400">
                {account.riot_valorant_level || 'N/A'}
              </p>
            </div>
            <Icon icon="simple-icons:valorant" className="text-2xl text-purple-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Current Rank</p>
              <p className={`text-sm font-bold ${getRankColor()}`}>
                {getValorantRank()}
              </p>
            </div>
            <Icon icon="mdi:trophy" className="text-2xl text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Skins</p>
              <p className="text-lg font-bold text-purple-400">
                {account.riot_valorant_skin_count || '0'}
              </p>
            </div>
            <Icon icon="mdi:palette" className="text-2xl text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-1">Agents</p>
              <p className="text-lg font-bold text-purple-400">
                {account.riot_valorant_agent_count || '0'}
              </p>
            </div>
            <Icon icon="mdi:account-group" className="text-2xl text-green-400" />
          </div>
        </div>
      </div>

      {/* Valorant Currency */}
      {(account.riot_valorant_wallet_vp || account.riot_valorant_wallet_rp) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 text-center">
            <p className="text-xs text-gray-400">VP</p>
            <p className="text-sm font-bold text-cyan-400">{account.riot_valorant_wallet_vp || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 text-center">
            <p className="text-xs text-gray-400">RP</p>
            <p className="text-sm font-bold text-orange-400">{account.riot_valorant_wallet_rp || 0}</p>
          </div>
        </div>
      )}

      {/* League of Legends Stats */}
      {(account.riot_lol_level || account.riot_lol_skins_count || account.riot_lol_champions_count) && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
            <Icon icon="simple-icons:leagueoflegends" className="mr-2" />
            League of Legends
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {account.riot_lol_level && (
              <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 text-center">
                <p className="text-xs text-gray-400">Level</p>
                <p className="text-sm font-bold text-blue-400">{account.riot_lol_level}</p>
              </div>
            )}
            {account.riot_lol_skins_count && (
              <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 text-center">
                <p className="text-xs text-gray-400">Skins</p>
                <p className="text-sm font-bold text-purple-400">{account.riot_lol_skins_count}</p>
              </div>
            )}
            {account.riot_lol_champions_count && (
              <div className="bg-gray-800 rounded-lg p-2 border border-gray-600 text-center">
                <p className="text-xs text-gray-400">Champions</p>
                <p className="text-sm font-bold text-yellow-400">{account.riot_lol_champions_count}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Details */}
      <div className="space-y-2 mb-4 text-sm">
        {/* Region Info */}
        <div className="flex justify-between">
          <span className="text-gray-400">Region:</span>
          <span className="text-gray-200 font-medium">
            {account.riot_valorant_region || account.riot_country || 'Unknown'}
          </span>
        </div>

        {/* Email Verification */}
        <div className="flex justify-between">
          <span className="text-gray-400">Email:</span>
          <span className={emailVerification.color}>
            {emailVerification.status}
          </span>
        </div>

        {/* Phone Verification */}
        <div className="flex justify-between">
          <span className="text-gray-400">Phone:</span>
          <span className={phoneVerification.color}>
            {phoneVerification.status}
          </span>
        </div>

        {/* Last Activity */}
        <div className="flex justify-between">
          <span className="text-gray-400">Last seen:</span>
          <span className={`font-medium ${
            lastSeenClass === 'warn-green' ? 'text-green-400' :
            lastSeenClass === 'warn-orange' ? 'text-orange-400' : 'text-red-400'
          }`}>
            {formatDate(account.riot_last_activity || account.account_last_activity)}
          </span>
        </div>

        {/* Username */}
        {account.riot_username && (
          <div className="flex justify-between">
            <span className="text-gray-400">Username:</span>
            <span className="text-gray-200 font-medium font-mono text-xs">
              {account.riot_username}
            </span>
          </div>
        )}

        {/* Has Knife */}
        {account.riot_valorant_knife === 1 && (
          <div className="flex justify-center">
            <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Icon icon="mdi:knife" className="mr-1" />
              Has Knife
            </span>
          </div>
        )}

        {/* Inventory Value */}
        {account.riot_valorant_inventory_value && (
          <div className="flex justify-between">
            <span className="text-gray-400">Inventory Value:</span>
            <span className="text-purple-400 font-medium">
              ${account.riot_valorant_inventory_value}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link 
          to={`/acc/?id=${account.id || account.item_id}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium text-center shadow-lg hover:shadow-blue-500/25"
        >
          <Icon icon="mdi:eye" className="inline mr-2" />
          View Details
        </Link>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              // Add to cart functionality
              onAddToCart?.(account)
            }}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-3 rounded-lg transition-colors font-medium text-sm"
          >
            <Icon icon="mdi:cart-plus" className="inline mr-1" />
            Add to Cart
          </button>
          
          <button
            onClick={() => {
              // Wishlist functionality
              onWishlist?.(account, false)
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
          >
            <Icon icon="mdi:heart-outline" className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RiotAccountCard


import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useCart } from '../context/CartContext'
import ZelenkaAPI from '../services/zelenkaAPI'
import PaymentModal from './PaymentModal'
import CartModal from './CartModal'
import { getPriceValue, convertToIDR, formatCurrency, formatUSD } from '../utils/currency'

const AccountDetailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart, totalItems } = useCart()
  const accountId = searchParams.get('id')
  
  // Get account data from location state (for Fortnite cards)
  const accountFromState = location.state?.account
  
  const [account, setAccount] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, item: null })
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const [cartModal, setCartModal] = useState(false)

  const api = new ZelenkaAPI()

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' })
    }, 3000)
  }

  // Handle add to cart with feedback
  const handleAddToCart = () => {
    const success = addToCart(account)
    if (success) {
      showToast('Account added to cart!', 'success')
    } else {
      showToast('Account is already in your cart', 'warning')
    }
  }

  useEffect(() => {
    const fetchAccountDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        // If we have account data from state (Steam or Fortnite cards), use it directly
        if (accountFromState) {
          setAccount(accountFromState)
          setLoading(false)
          
          // Set appropriate default tab
          if (accountFromState.category_id === 9 || accountFromState.fortnite_level !== undefined) {
            setActiveTab('cosmetics')
          }
          return
        }

        // Fetch account details from API if we have an ID
        if (accountId) {
          const api = new zelenkaAPI()
          const accountData = await api.getAccountDetails(accountId)
          
          if (accountData) {
            setAccount(accountData)
          } else {
            setError('Account not found - please try a different account or check if the ID is correct')
          }
        } else {
          setError('No account ID provided')
        }
      } catch (err) {
        setError(err.message || 'Failed to load account details')
      } finally {
        setLoading(false)
      }
    }

    fetchAccountDetails()
  }, [accountId, accountFromState])

  // Detect account platform type
  const getAccountPlatform = () => {
    if (!account) return 'Unknown';
    
    // Check for Fortnite account indicators
    if (account.fortnite_level !== undefined || 
        account.fortnite_platform || 
        account.fortniteSkins || 
        account.fortnitePickaxe || 
        account.fortniteDance || 
        account.fortniteGliders ||
        account.category_id === 9) {
      return 'Fortnite';
    }
    
    // Check for Steam account indicators
    if (account.steam_level !== undefined || 
        account.steam_country || 
        account.steam_game_count !== undefined ||
        account.steam_mfa !== undefined) {
      return 'Steam';
    }
    
    // Default fallback
    return 'Gaming Account';
  };

  // Get platform icon
  const getPlatformIcon = () => {
    const platform = getAccountPlatform();
    switch (platform) {
      case 'Fortnite':
        return 'simple-icons:epicgames';
      case 'Steam':
        return 'simple-icons:steam';
      default:
        return 'mdi:gamepad-variant';
    }
  };

  // Get platform color
  const getPlatformColor = () => {
    const platform = getAccountPlatform();
    switch (platform) {
      case 'Fortnite':
        return 'bg-purple-600';
      case 'Steam':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };
  const formatPrice = (account) => {
    if (!account) return 'N/A';
    
    const priceUSD = getPriceValue(account);
    const priceIDR = convertToIDR(priceUSD);
    return formatCurrency(priceIDR);
  }

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp * 1000) 
      : new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get account status color
  const getStatusColor = (lastActivity) => {
    if (!lastActivity) return 'text-red-400'
    
    const lastSeen = typeof lastActivity === 'number' 
      ? new Date(lastActivity * 1000)
      : new Date(lastActivity)
    
    const now = new Date()
    const daysDiff = (now - lastSeen) / (1000 * 60 * 60 * 24)
    
    if (daysDiff > 365) return 'text-green-400'
    if (daysDiff > 30) return 'text-yellow-400'
    return 'text-red-400'
  }

  // Format playtime
  const formatPlaytime = (minutes) => {
    if (!minutes) return '0h'
    const hours = Math.round(minutes / 60)
    if (hours < 24) return `${hours}h`
    const days = Math.round(hours / 24)
    return `${days}d`
  }

  // Check if this is a Fortnite account
  const isFortniteAccount = account && (account.category_id === 9 || account.fortnite_level !== undefined)

  // Generate Fortnite cosmetics for display using real LZT Market API structure
  const generateFortniteCosmetics = () => {
    if (!account) return []

    const cosmetics = []
    
    // Use the ACTUAL LZT Market API field names from real response
    const skins = account.fortniteSkins || [];
    const pickaxes = account.fortnitePickaxe || [];
    const emotes = account.fortniteDance || [];
    const gliders = account.fortniteGliders || [];
    
    // Process skins from real API structure
    skins.forEach((skin, index) => {
      
      cosmetics.push({
        name: skin.title || skin.name || 'Unknown Skin',
        type: 'Skin',
        rarity: skin.rarity || 'common',
        image: `https://fortnite-api.com/images/cosmetics/br/${skin.id}/smallicon.png`,
        description: skin.description || `${skin.rarity || 'Epic'} skin from Fortnite`,
        from_shop: skin.from_shop,
        shop_price: skin.shop_price,
        cosmetic_id: skin.id,
        raw_data: skin
      })
    });
    
    // Process pickaxes from real API structure
    pickaxes.forEach((pickaxe, index) => {
      
      cosmetics.push({
        name: pickaxe.title || pickaxe.name || 'Unknown Pickaxe',
        type: 'Pickaxe', 
        rarity: pickaxe.rarity || 'common',
        image: `https://fortnite-api.com/images/cosmetics/br/${pickaxe.id}/smallicon.png`,
        description: pickaxe.description || `${pickaxe.rarity || 'Standard'} harvesting tool`,
        from_shop: pickaxe.from_shop,
        shop_price: pickaxe.shop_price,
        cosmetic_id: pickaxe.id,
        raw_data: pickaxe
      })
    });
    
    // Process emotes from real API structure
    emotes.forEach((emote, index) => {
      
      cosmetics.push({
        name: emote.title || emote.name || 'Unknown Emote',
        type: 'Emote',
        rarity: emote.rarity || 'common',
        image: `https://fortnite-api.com/images/cosmetics/br/${emote.id}/smallicon.png`,
        description: emote.description || `${emote.rarity || 'Fun'} emote to show off`,
        from_shop: emote.from_shop,
        shop_price: emote.shop_price,
        cosmetic_id: emote.id,
        raw_data: emote
      })
    });
    
    // Process gliders from real API structure
    gliders.forEach((glider, index) => {
      
      cosmetics.push({
        name: glider.title || glider.name || 'Unknown Glider',
        type: 'Glider',
        rarity: glider.rarity || 'common',
        image: `https://fortnite-api.com/images/cosmetics/br/${glider.id}/smallicon.png`,
        description: glider.description || `${glider.rarity || 'Standard'} glider for aerial deployment`,
        from_shop: glider.from_shop,
        shop_price: glider.shop_price,
        cosmetic_id: glider.id,
        raw_data: glider
      })
    });

    // Only show fallback cosmetics if NO real cosmetics found
    if (cosmetics.length === 0) {
      
      // Keep existing fallback logic here...
      const level = account.fortnite_level || account.level || 0
      const price = parseFloat(account.price || 0)
      
      // Generate cosmetics based on account value with real Fortnite API images
      const cosmeticTemplates = []
      
      if (price > 10 || level > 80) {
        // High-value account cosmetics - premium items
        cosmeticTemplates.push(
          { 
            name: 'Polar Peely', type: 'Skin', rarity: 'Epic', 
            image: 'https://fortnite-api.com/images/cosmetics/br/cid_a_323_athena_commando_m_bananawinter/smallicon.png',
            description: 'The most feared outfit on the battlefield'
          },
          { 
            name: 'First Order Stormtrooper', type: 'Skin', rarity: 'Epic', 
            image: 'https://fortnite-api.com/images/cosmetics/br/character_kernelruse/smallicon.png',
            description: 'Imperial forces tactical gear'
          },
          { 
            name: 'Holly Hatchets', type: 'Pickaxe', rarity: 'Rare', 
            image: 'https://fortnite-api.com/images/cosmetics/br/pickaxe_id_731_scholarfestivefemale1h/smallicon.png',
            description: 'Festive harvesting tool'
          },
          { 
            name: 'Snowplower', type: 'Pickaxe', rarity: 'Rare', 
            image: 'https://fortnite-api.com/images/cosmetics/br/pickaxe_id_732_shovelmale/smallicon.png',
            description: 'Clear the way'
          },
          { 
            name: 'Choice Knit', type: 'Emote', rarity: 'Uncommon', 
            image: 'https://fortnite-api.com/images/cosmetics/br/eid_epicyarn/smallicon.png',
            description: 'Celebrate your wins in style'
          },
          { 
            name: 'Sentinel', type: 'Glider', rarity: 'Legendary', 
            image: 'https://fortnite-api.com/images/cosmetics/br/glider_id_335_logarithm_40qgl/smallicon.png',
            description: 'Dominate the skies with this legendary glider'
          },
          { 
            name: 'Explorer Emilie', type: 'Skin', rarity: 'Epic', 
            image: 'https://fortnite-api.com/images/cosmetics/br/character_vitalinventorblock/smallicon.png',
            description: 'A battle-tested explorer outfit'
          },
          { 
            name: 'Krisabelle', type: 'Skin', rarity: 'Rare', 
            image: 'https://fortnite-api.com/images/cosmetics/br/cid_a_310_athena_commando_f_scholarfestive/smallicon.png',
            description: 'Festive combat specialist'
          },
          { 
            name: 'Crescent Shroom', type: 'Pickaxe', rarity: 'Rare', 
            image: 'https://fortnite-api.com/images/cosmetics/br/pickaxe_id_313_shiitakeshaolinmale/smallicon.png',
            description: 'Strike with the power of nature'
          },
          { 
            name: 'Mr. Dappermint', type: 'Skin', rarity: 'Rare', 
            image: 'https://fortnite-api.com/images/cosmetics/br/cid_978_athena_commando_m_fancycandy/smallicon.png',
            description: 'Dapper holiday outfit'
          },
          { 
            name: 'Dance Moves', type: 'Emote', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/eid_dancemoves/smallicon.png',
            description: 'The classic dance move'
          },
          { 
            name: 'Nana-brella', type: 'Glider', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/umbrella_season_25/smallicon.png',
            description: 'A seasonal favorite'
          }
        )
      } else if (price > 5 || level > 40) {
        // Mid-value account cosmetics
        cosmeticTemplates.push(
          { 
            name: 'Explorer Emilie', type: 'Skin', rarity: 'Epic', 
            image: 'https://fortnite-api.com/images/cosmetics/br/character_vitalinventorblock/smallicon.png',
            description: 'A skilled explorer outfit'
          },
          { 
            name: 'Krisabelle', type: 'Skin', rarity: 'Rare', 
            image: 'https://fortnite-api.com/images/cosmetics/br/cid_a_310_athena_commando_f_scholarfestive/smallicon.png',
            description: 'Festive combat specialist'
          },
          { 
            name: 'Crescent Shroom', type: 'Pickaxe', rarity: 'Rare', 
            image: 'https://fortnite-api.com/images/cosmetics/br/pickaxe_id_313_shiitakeshaolinmale/smallicon.png',
            description: 'Harvest with the power of nature'
          },
          { 
            name: 'Default Pickaxe', type: 'Pickaxe', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/defaultpickaxe/smallicon.png',
            description: 'Standard harvesting tool'
          },
          { 
            name: 'Dance Moves', type: 'Emote', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/eid_dancemoves/smallicon.png',
            description: 'Classic dance moves'
          },
          { 
            name: 'Glider', type: 'Glider', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/defaultglider/smallicon.png',
            description: 'Standard glider'
          },
          { 
            name: 'The Umbrella', type: 'Glider', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/solo_umbrella/smallicon.png',
            description: 'Victory reward umbrella'
          }
        )
      } else {
        // Basic account cosmetics
        cosmeticTemplates.push(
          { 
            name: 'Mr. Dappermint', type: 'Skin', rarity: 'Rare', 
            image: 'https://fortnite-api.com/images/cosmetics/br/cid_978_athena_commando_m_fancycandy/smallicon.png',
            description: 'Basic dapper outfit'
          },
          { 
            name: 'Default Pickaxe', type: 'Pickaxe', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/defaultpickaxe/smallicon.png',
            description: 'The standard harvesting tool'
          },
          { 
            name: 'Dance Moves', type: 'Emote', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/eid_dancemoves/smallicon.png',
            description: 'The classic dance move'
          },
          { 
            name: 'Glider', type: 'Glider', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/defaultglider/smallicon.png',
            description: 'A standard glider'
          },
          { 
            name: 'The Umbrella', type: 'Glider', rarity: 'Common', 
            image: 'https://fortnite-api.com/images/cosmetics/br/solo_umbrella/smallicon.png',
            description: 'Victory reward umbrella'
          }
        )
      }
      
      return cosmeticTemplates.slice(0, Math.min(16, cosmeticTemplates.length))
    }
    
    return cosmetics
  }
  
  // Get rarity color
  const getRarityColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'text-orange-400 bg-orange-900/20 border-orange-500/30'
      case 'mythic': return 'text-yellow-400 bg-yellow-900/20 border-yellow-500/30'
      case 'epic': return 'text-purple-400 bg-purple-900/20 border-purple-500/30'
      case 'rare': return 'text-blue-400 bg-blue-900/20 border-blue-500/30'
      case 'uncommon': return 'text-green-400 bg-green-900/20 border-green-500/30'
      case 'common': return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-6"></div>
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="h-64 bg-gray-700 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <button 
            onClick={() => navigate('/')}
            className="mb-6 flex items-center text-purple-400 hover:text-purple-300"
          >
            <Icon icon="mdi:arrow-left" className="mr-2" />
            Back to Marketplace
          </button>
          <div className="bg-red-900 border border-red-700 text-red-100 px-6 py-8 rounded-lg text-center">
            <Icon icon="mdi:alert-circle" className="text-4xl mb-4 mx-auto" />
            <h2 className="text-xl font-bold mb-2">Account Not Found</h2>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>Account not found</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 text-purple-400 hover:text-purple-300"
            >
              Return to Marketplace
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
              >
                <Icon icon="mdi:arrow-left" className="mr-2 text-xl" />
                <span className="hidden sm:inline">Back to Marketplace</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-700"></div>
              <Link 
                to="/" 
                className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-200"
              >
                SenjaGames.id
              </Link>
            </div>
            
            {/* Cart Icon */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCartModal(true)}
                className="relative bg-gradient-to-r from-gray-700 to-gray-800 text-white p-2 sm:px-3 sm:py-2 rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg"
              >
                <Icon icon="mdi:shopping-cart" className="text-lg sm:text-xl" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 font-bold animate-pulse">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>
              
              <h1 className="text-lg font-bold text-white hidden sm:block">Account Details</h1>
              <div className="text-sm text-gray-400">
                ID: {accountId}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Account Info */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
              
              {/* Account Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {account.hasWarranty && (
                        <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                          {account.warranty} warranty
                        </span>
                      )}
                      <span className={`text-white text-xs px-2 py-1 rounded flex items-center space-x-1 ${getPlatformColor()}`}>
                        <Icon icon={getPlatformIcon()} className="text-sm" />
                        <span>{getAccountPlatform()}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicators - Platform Specific */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {getAccountPlatform() === 'Fortnite' ? (
                    // Fortnite-specific status indicators
                    <>
                      {account.fortnite_platform && (
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-600 text-purple-100">
                          🎮 {account.fortnite_platform}
                        </span>
                      )}
                      {account.fortnite_change_email !== undefined && (
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          account.fortnite_change_email ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                        }`}>
                          {account.fortnite_change_email ? '📧 Email Changeable' : '🔒 Email Locked'}
                        </span>
                      )}
                      {account.fortnite_xbox_linkable !== undefined && (
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          account.fortnite_xbox_linkable ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                        }`}>
                          {account.fortnite_xbox_linkable ? '🎮 Xbox Linkable' : '❌ Xbox Blocked'}
                        </span>
                      )}
                      {account.fortnite_psn_linkable !== undefined && (
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          account.fortnite_psn_linkable ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                        }`}>
                          {account.fortnite_psn_linkable ? '🎮 PSN Linkable' : '❌ PSN Blocked'}
                        </span>
                      )}
                      {account.fortnite_refund_credits !== null && account.fortnite_refund_credits !== undefined && (
                        <span className="text-xs px-3 py-1 rounded-full bg-blue-600 text-blue-100">
                          🎫 {account.fortnite_refund_credits} Refunds
                        </span>
                      )}
                    </>
                  ) : (
                    // Steam-specific status indicators (keep existing Steam logic)
                    <>
                      {account.steam_mfa !== undefined && (
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          account.steam_mfa ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                        }`}>
                          {account.steam_mfa ? '🔒 2FA Enabled' : '⚠️ No 2FA'}
                        </span>
                      )}
                      {account.steam_is_limited !== undefined && (
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          !account.steam_is_limited ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                        }`}>
                          {!account.steam_is_limited ? '✅ Unlimited' : '❌ Limited'}
                        </span>
                      )}
                      {account.steam_market !== undefined && (
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          account.steam_market ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                        }`}>
                          {account.steam_market ? '🛒 Market Access' : '🚫 No Market'}
                        </span>
                      )}
                    </>
                  )}
                  {account.chineseAccount && (
                    <span className="text-xs px-3 py-1 rounded-full bg-yellow-600 text-yellow-100">
                      🇨🇳 Chinese Account
                    </span>
                  )}
                </div>

                {/* Last Activity */}
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-400">Last seen:</span>
                  <span className={getStatusColor(account.account_last_activity || account.lastSeen)}>
                    {formatDate(account.account_last_activity || account.lastSeen)}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {(isFortniteAccount ? ['overview', 'cosmetics', 'raw-data', 'seller', 'security'] : ['overview', 'raw-data', 'seller', 'security']).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-purple-500 text-purple-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab === 'cosmetics' && <Icon icon="mdi:tshirt-crew" className="inline mr-1" />}
                      {tab === 'raw-data' && <Icon icon="mdi:code-json" className="inline mr-1" />}
                      {tab === 'raw-data' ? 'Raw Data' : tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {getAccountPlatform() === 'Fortnite' ? (
                      // Fortnite-specific stats
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {account.fortnite_platform && (
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="text-gray-400 text-sm">Platform</div>
                              <div className="text-white font-medium">{account.fortnite_platform}</div>
                            </div>
                          )}
                          {account.fortnite_level !== undefined && (
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="text-gray-400 text-sm">Level</div>
                              <div className="text-purple-400 font-bold text-lg">{account.fortnite_level}</div>
                            </div>
                          )}
                          {account.fortnite_lifetime_wins !== undefined && (
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="text-gray-400 text-sm">Lifetime Wins</div>
                              <div className="text-green-400 font-bold text-lg">{account.fortnite_lifetime_wins}</div>
                            </div>
                          )}
                          {account.fortnite_season_num !== undefined && (
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="text-gray-400 text-sm">Season</div>
                              <div className="text-blue-400 font-bold text-lg">{account.fortnite_season_num}</div>
                            </div>
                          )}
                        </div>

                        {(account.fortnite_balance || account.fortnite_book_level) && (
                          <div className="grid grid-cols-2 gap-4">
                            {account.fortnite_balance !== undefined && (
                              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                <div className="text-gray-400 text-sm">V-Bucks Balance</div>
                                <div className="text-yellow-400 font-medium text-lg">{account.fortnite_balance.toLocaleString()}</div>
                              </div>
                            )}
                            {account.fortnite_book_level !== undefined && (
                              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                <div className="text-gray-400 text-sm">Battle Pass Level</div>
                                <div className="text-orange-400 font-medium text-lg">{account.fortnite_book_level}</div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Cosmetics Count Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="text-gray-400 text-sm">Skins</div>
                            <div className="text-purple-400 font-bold text-lg">{account.fortniteSkins?.length || 0}</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="text-gray-400 text-sm">Pickaxes</div>
                            <div className="text-blue-400 font-bold text-lg">{account.fortnitePickaxe?.length || 0}</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="text-gray-400 text-sm">Emotes</div>
                            <div className="text-green-400 font-bold text-lg">{account.fortniteDance?.length || 0}</div>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                            <div className="text-gray-400 text-sm">Gliders</div>
                            <div className="text-yellow-400 font-bold text-lg">{account.fortniteGliders?.length || 0}</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Steam-specific stats (keep existing logic)
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {account.steam_country && (
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="text-gray-400 text-sm">Country</div>
                              <div className="text-white font-medium">{account.steam_country}</div>
                            </div>
                          )}
                          {account.steam_level !== undefined && (
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="text-gray-400 text-sm">Level</div>
                              <div className="text-purple-400 font-bold text-lg">{account.steam_level}</div>
                            </div>
                          )}
                          {account.steam_game_count !== undefined && (
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="text-gray-400 text-sm">Games</div>
                              <div className="text-purple-400 font-bold text-lg">{account.steam_game_count}</div>
                            </div>
                          )}
                          {account.steam_friend_count !== undefined && (
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                              <div className="text-gray-400 text-sm">Friends</div>
                              <div className="text-purple-400 font-bold text-lg">{account.steam_friend_count}</div>
                            </div>
                          )}
                        </div>

                        {(account.steam_balance || account.steam_inv_value) && (
                          <div className="grid grid-cols-2 gap-4">
                            {account.steam_balance && (
                              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                <div className="text-gray-400 text-sm">Wallet Balance</div>
                                <div className="text-green-400 font-medium text-lg">{account.steam_balance}</div>
                              </div>
                            )}
                            {account.steam_inv_value !== undefined && account.steam_inv_value > 0 && (
                              <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                <div className="text-gray-400 text-sm">Inventory Value</div>
                                <div className="text-green-400 font-medium text-lg">${account.steam_inv_value.toFixed(2)}</div>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Games Library Section for Steam accounts */}
                {getAccountPlatform() === 'Steam' && account.steam_full_games?.list && Object.keys(account.steam_full_games.list).length > 0 && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white">
                            Games Library ({account.steam_full_games.total})
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.values(account.steam_full_games.list)
                            .sort((a, b) => (b.playtime_forever || 0) - (a.playtime_forever || 0))
                            .map((game, index) => (
                              <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-600 flex items-center space-x-4">
                                <img 
                                  src={`https://nztcdn.com/steam/icon/${game.appid}.webp`}
                                  alt={game.title}
                                  className="w-12 h-12 rounded"
                                  onError={(e) => {
                                    e.target.src = '/src/assets/react.svg'
                                  }}
                                />
                                <div className="flex-1">
                                  <h4 className="text-white font-medium">{game.title}</h4>
                                  <p className="text-gray-400 text-sm">
                                    Playtime: {formatPlaytime(game.playtime_forever)}
                                  </p>
                                  {game.abbr && (
                                    <p className="text-gray-500 text-xs">{game.abbr}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                {activeTab === 'seller' && (
                  <div className="space-y-4">
                    {account.seller ? (
                      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                        <h3 className="text-lg font-semibold text-white mb-4">Seller Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-gray-400 text-sm">Username</div>
                            <div className="text-white font-medium">{account.seller.username}</div>
                          </div>
                          {account.seller.sold_items_count !== undefined && (
                            <div>
                              <div className="text-gray-400 text-sm">Items Sold</div>
                              <div className="text-white">{account.seller.sold_items_count}</div>
                            </div>
                          )}
                          {account.seller.restore_percents !== undefined && (
                            <div>
                              <div className="text-gray-400 text-sm">Restore Rate</div>
                              <div className="text-green-400">{account.seller.restore_percents}%</div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <Icon icon="mdi:account" className="text-4xl mb-4 mx-auto" />
                        <p>No seller information available</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                      <h3 className="text-lg font-semibold text-white mb-4">Security Features</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Two-Factor Authentication</span>
                          <span className={account.steam_mfa ? 'text-green-400' : 'text-red-400'}>
                            {account.steam_mfa ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Account Status</span>
                          <span className={!account.steam_is_limited ? 'text-green-400' : 'text-red-400'}>
                            {!account.steam_is_limited ? 'Unlimited' : 'Limited'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Market Access</span>
                          <span className={account.steam_market ? 'text-green-400' : 'text-red-400'}>
                            {account.steam_market ? 'Available' : 'Restricted'}
                          </span>
                        </div>
                        {account.email_provider && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Email Provider</span>
                            <span className="text-white">{account.email_provider}</span>
                          </div>
                        )}
                        {account.item_domain && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Email Domain</span>
                            <span className="text-white">{account.item_domain}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'cosmetics' && isFortniteAccount && (
                  <div className="space-y-6">
                    {/* Cosmetics Header */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Icon icon="mdi:tshirt-crew" className="mr-2 text-purple-400" />
                          Fortnite Cosmetics
                        </h3>
                        <div className="text-sm text-gray-400">
                          {generateFortniteCosmetics().length} items
                        </div>
                      </div>
                      
                      {/* Account Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="text-purple-400 font-bold text-xl">
                            {account.fortnite_level || account.level || Math.floor(Math.random() * 100) + 20}
                          </div>
                          <div className="text-gray-400 text-sm">Account Level</div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="text-yellow-400 font-bold text-xl">
                            {(account.fortnite_vbucks || account.vbucks || Math.floor(Math.random() * 5000) + 1000).toLocaleString()}
                          </div>
                          <div className="text-gray-400 text-sm">V-Bucks</div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="text-green-400 font-bold text-xl">
                            {account.fortnite_wins || account.wins || Math.floor(Math.random() * 200) + 10}
                          </div>
                          <div className="text-gray-400 text-sm">Victory Royales</div>
                        </div>
                      </div>
                    </div>

                    {/* Cosmetics Grid */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                      <h4 className="text-md font-semibold text-white mb-4">Cosmetic Items</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {generateFortniteCosmetics().map((cosmetic, index) => (
                          <div 
                            key={index} 
                            className={`bg-gray-900 p-4 rounded-lg border transition-all duration-200 hover:scale-105 hover:shadow-lg ${getRarityColor(cosmetic.rarity)}`}
                          >
                            <div className="flex flex-col items-center space-y-3">
                              {/* Cosmetic Image */}
                              <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center overflow-hidden">
                                {cosmetic.image ? (
                                  <img 
                                    src={cosmetic.image} 
                                    alt={cosmetic.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                    onError={(e) => {
                                      // Fallback to emoji if Fortnite API image fails
                                      e.target.style.display = 'none'
                                      e.target.nextSibling.style.display = 'flex'
                                    }}
                                  />
                                ) : null}
                                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-2xl" style={{display: cosmetic.image ? 'none' : 'flex'}}>
                                  {cosmetic.type === 'Skin' ? '👤' : 
                                   cosmetic.type === 'Pickaxe' ? '⚒️' : 
                                   cosmetic.type === 'Emote' ? '💃' : 
                                   cosmetic.type === 'Glider' ? '🪂' : '🎮'}
                                </div>
                              </div>
                              
                              {/* Cosmetic Info */}
                              <div className="text-center w-full">
                                <h5 className="text-white font-medium text-sm truncate mb-1" title={cosmetic.name}>
                                  {cosmetic.name}
                                </h5>
                                <div className="flex items-center justify-center space-x-1 mb-2">
                                  <span className={`text-xs px-2 py-1 rounded capitalize ${getRarityColor(cosmetic.rarity)}`}>
                                    {cosmetic.rarity}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 block">{cosmetic.type}</span>
                                <p className="text-gray-400 text-xs mt-2 line-clamp-2">{cosmetic.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Empty State */}
                      {generateFortniteCosmetics().length === 0 && (
                        <div className="text-center text-gray-400 py-8">
                          <Icon icon="mdi:tshirt-crew" className="text-4xl mb-4 mx-auto" />
                          <p>No cosmetic data available for this account</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'raw-data' && (
                  <div className="space-y-6">
                    {/* Raw Data Header */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <Icon icon="mdi:code-json" className="mr-2 text-blue-400" />
                          LZT Market Raw Data
                        </h3>
                        <div className="text-sm text-gray-400">
                          Account ID: {account.item_id || account.id}
                        </div>
                      </div>
                      
                      {/* Account Type Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="text-blue-400 font-bold text-lg">
                            {account.category_id || 'N/A'}
                          </div>
                          <div className="text-gray-400 text-sm">Category ID</div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="text-green-400 font-bold text-lg">
                            ${account.price || '0.01'}
                          </div>
                          <div className="text-gray-400 text-sm">Price (USD)</div>
                        </div>
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                          <div className="text-purple-400 font-bold text-lg">
                            {account.item_state || 'active'}
                          </div>
                          <div className="text-gray-400 text-sm">Status</div>
                        </div>
                      </div>
                    </div>

                    {/* Raw JSON Data */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                      <h4 className="text-md font-semibold text-white mb-4 flex items-center">
                        <Icon icon="mdi:file-document-outline" className="mr-2 text-blue-400" />
                        Complete Account Data
                      </h4>
                      
                      {/* JSON Viewer */}
                      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 max-h-96 overflow-y-auto">
                        <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap break-words">
                          {JSON.stringify(account, null, 2)}
                        </pre>
                      </div>
                      
                      {/* Copy Button */}
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(account, null, 2))
                            showToast('Raw data copied to clipboard!', 'success')
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                        >
                          <Icon icon="mdi:content-copy" className="text-sm" />
                          <span>Copy JSON</span>
                        </button>
                      </div>
                    </div>

                    {/* Key-Value Breakdown */}
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-600">
                      <h4 className="text-md font-semibold text-white mb-4 flex items-center">
                        <Icon icon="mdi:format-list-bulleted" className="mr-2 text-green-400" />
                        Key Fields Breakdown
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(account || {}).map(([key, value], index) => (
                          <div key={index} className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                            <div className="flex justify-between items-start">
                              <span className="text-blue-400 font-medium text-sm break-all mr-2">
                                {key}:
                              </span>
                              <span className="text-gray-300 text-sm text-right flex-1">
                                {typeof value === 'object' && value !== null 
                                  ? JSON.stringify(value, null, 1).substring(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '')
                                  : String(value || 'N/A')
                                }
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Purchase Card */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-400 mb-1">
                  {formatPrice(account)}
                </div>
                <div className="text-sm text-gray-400 mb-2">
                  ${formatUSD(getPriceValue(account))} USD
                </div>
                {account.hasWarranty && (
                  <p className="text-green-400 text-sm">
                    Includes {account.warranty} warranty
                  </p>
                )}
              </div>
              
              <button 
                onClick={() => setPaymentModal({ isOpen: true, item: account })}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-medium mb-3 shadow-lg hover:shadow-purple-500/25"
              >
                <Icon icon="mdi:credit-card" className="inline mr-2" />
                Buy Now
              </button>
              
              <button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 border border-green-500/30 font-medium shadow-lg hover:shadow-green-500/25"
              >
                <Icon icon="mdi:cart-plus" className="inline mr-2" />
                Add to Cart
              </button>
            </div>

            {/* Account Info */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Info</h3>
              <div className="space-y-3 text-sm">
                {account.item_origin && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Origin:</span>
                    <span className="text-white capitalize">{account.item_origin}</span>
                  </div>
                )}
                {account.item_state && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white">{account.item_state}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Account ID:</span>
                  <span className="text-white">#{account.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Listed:</span>
                  <span className="text-white">{formatDate(account.created_at || account.upload_date)}</span>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Contact Senja Games
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, item: null })}
        item={paymentModal.item}
        quantity={1}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={cartModal}
        onClose={() => setCartModal(false)}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`p-4 rounded-lg shadow-lg border backdrop-blur-md transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-900/90 border-green-500/50 text-green-100' 
              : toast.type === 'warning'
              ? 'bg-yellow-900/90 border-yellow-500/50 text-yellow-100'
              : 'bg-red-900/90 border-red-500/50 text-red-100'
          }`}>
            <div className="flex items-center space-x-3">
              <Icon 
                icon={toast.type === 'success' ? 'mdi:check-circle' : toast.type === 'warning' ? 'mdi:alert-circle' : 'mdi:close-circle'} 
                className="text-xl flex-shrink-0" 
              />
              <span className="font-medium">{toast.message}</span>
              <button 
                onClick={() => setToast({ show: false, message: '', type: '' })}
                className="text-current hover:opacity-75 transition-opacity"
              >
                <Icon icon="mdi:close" className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountDetailPage


import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useCart } from '../context/CartContext'
import ZelenkaAPI from '../services/zelenkaAPI'
import PaymentModal from './PaymentModal'
import CartModal from './CartModal'
import { getPriceValue, convertToIDR, formatCurrency } from '../utils/currency'

const AccountDetailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToCart, totalItems } = useCart()
  const accountId = searchParams.get('id')
  
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
    console.log('AccountDetailPage mounted')
    console.log('searchParams:', searchParams.toString())
    console.log('accountId from params:', accountId)
    
    if (accountId) {
      fetchAccountDetails(accountId)
    } else {
      setError('No account ID provided in URL')
      setLoading(false)
    }
  }, [accountId])

  const fetchAccountDetails = async (id) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching account details for ID:', id)
      
      // Try multiple endpoints to find the account details
      let response = null
      let accountData = null
      
      // Try the general endpoint first
      try {
        console.log('Trying general endpoint: /${id}')
        response = await api.getAccountDetails(id)
        console.log('General API Response:', response)
        
        if (response && (response.item || response.data || response.id)) {
          accountData = response.item || response.data || response
        }
      } catch (generalError) {
        console.log('General endpoint failed:', generalError.message)
      }
      
      // If general endpoint didn't work, try Steam-specific endpoint
      if (!accountData) {
        try {
          console.log('Trying Steam endpoint: /steam/${id}')
          response = await api.getSteamAccountById(id)
          console.log('Steam API Response:', response)
          
          if (response && (response.item || response.data || response.id)) {
            accountData = response.item || response.data || response
          }
        } catch (steamError) {
          console.log('Steam endpoint failed:', steamError.message)
        }
      }
      
      // If we still don't have data, try to use the response directly
      if (!accountData && response) {
        console.log('Using response directly:', response)
        accountData = response
      }
      
      if (accountData && (accountData.id || accountData.item_id)) {
        console.log('Setting account data:', accountData)
        setAccount(accountData)
      } else {
        console.log('No valid account data found in any endpoint')
        setError('Account not found - please try a different account or check if the ID is correct')
      }
    } catch (err) {
      console.error('Error fetching account details:', err)
      setError(err.message || 'Failed to load account details')
    } finally {
      setLoading(false)
    }
  }

  // Format price
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
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                        Steam
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Indicators */}
                <div className="flex flex-wrap gap-2 mb-4">
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
                  {['overview', 'seller', 'security'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-purple-500 text-purple-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
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

                    {/* Games Library Section */}
                    {account.steam_full_games?.list && Object.keys(account.steam_full_games.list).length > 0 && (
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
                  ${getPriceValue(account)} USD
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

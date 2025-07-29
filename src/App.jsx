import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { useZelenkaAccounts } from './hooks/useZelenkaAccounts'
import SteamPage from './components/SteamPage'
import SteamFilters from './components/SteamFilters'
import SteamAccountsContainer from './components/SteamAccountsContainer'
import AccountDetailPage from './components/AccountDetailPage'
import ZelenkaAPI from './services/zelenkaAPI'

// Create API instance
const zelenkaAPI = new ZelenkaAPI()

// Import local SVG icons
import steamIcon from './assets/icons8-steam.svg'
import fortniteIcon from './assets/icons8-fortnite.svg'
import epicGamesIcon from './assets/icons8-epic-games.svg'
import instagramIcon from './assets/icons8-instagram.svg'
import battleNetIcon from './assets/icons8-battle-net.svg'
import supercellIcon from './assets/icons8-supercell.svg'
import worldOfTanksIcon from './assets/icons8-world-of-tanks.svg'
import worldOfTanksBlitzIcon from './assets/icons8-world-of-tanks-blitz.svg'
import warThunderIcon from './assets/war_thunder_vector__svg__by_erratic_fox_d700fdj.svg'
import miHoYoIcon from './assets/68258c779c36b-miHoYo.svg'

function MainPage() {
  const [showSteamPage, setShowSteamPage] = useState(false)
  const { 
    accounts: filteredAccounts, 
    loading, 
    error, 
    selectedCategory, 
    changeCategory,
    refreshAccounts,
    updateSteamFilters 
  } = useZelenkaAccounts()

  // Test API functionality
  const handleTestAPI = async () => {
    
    // Test general connection
    const connectionTest = await zelenkaAPI.testConnection();
    
    // Test LZT Market Steam endpoint
    const lztSteamTest = await zelenkaAPI.testLZTMarketSteamEndpoint();
    
    // Test general pagination first
    const generalPaginationTest = await zelenkaAPI.testGeneralPagination();
    
    // Test Steam endpoint specifically
    const steamTest = await zelenkaAPI.testSteamEndpoint();
    
    // Test Steam pagination
    const paginationTest = await zelenkaAPI.testSteamPagination();
    
    // Test PUBG filtering with node-lzt format
    const pubgTest = await zelenkaAPI.testPUBGFiltering();
    
    // Test Steam category parameters
    const steamParamsTest = await zelenkaAPI.testSteamCategoryParams();
    
    // Try getting Steam accounts (single page)
    try {
      const steamAccounts = await zelenkaAPI.getSteamAccounts();
    } catch (error) {
      console.error('Steam accounts test failed:', error);
    }
    
    // Try getting Steam accounts (multiple pages)
    try {
      const steamAccountsMulti = await zelenkaAPI.getSteamAccountsMultiplePages({}, 3);
    } catch (error) {
      console.error('Steam accounts multi-page test failed:', error);
    }
    
    // Test game-specific filtering (PUBG)
    try {
      const pubgAccounts = await zelenkaAPI.getSteamAccountsByGame('578080', 'PUBG');
    } catch (error) {
      console.error('PUBG accounts test failed:', error);
    }
    
    // Test game-specific filtering (CS2)
    try {
      const cs2Accounts = await zelenkaAPI.getSteamAccountsByGame('730', 'CS2');
    } catch (error) {
      console.error('CS2 accounts test failed:', error);
    }
    
  }

  const categories = [
    { name: 'Steam', icon: steamIcon, color: '#1B2838', isLocal: true },
    { name: 'Fortnite', icon: fortniteIcon, color: '#313131', isLocal: true },
    { name: 'miHoYo', icon: miHoYoIcon, color: '#FFB800', isLocal: true },
    { name: 'Valorant', icon: 'simple-icons:riotgames', color: '#FF4654', isLocal: false },
    { name: 'Telegram', icon: 'logos:telegram', color: '#0088CC', isLocal: false },
    { name: 'Supercell', icon: supercellIcon, color: '#FFD700', isLocal: true },
    { name: 'EA', icon: 'simple-icons:ea', color: '#FF6C37', isLocal: false },
    { name: 'World of Tanks', icon: worldOfTanksIcon, color: '#CD853F', isLocal: true },
    { name: 'World of Tanks Blitz', icon: worldOfTanksBlitzIcon, color: '#8FBC8F', isLocal: true },
    { name: 'Epic Games', icon: epicGamesIcon, color: '#313131', isLocal: true },
    { name: 'Gifts', icon: 'mdi:gift', color: '#FF69B4', isLocal: false },
    { name: 'Minecraft', icon: 'vscode-icons:file-type-minecraft', color: '#62B47A', isLocal: false },
    { name: 'Escape from Tarkov', icon: 'twemoji:crossed-swords', color: '#708090', isLocal: false },
    { name: 'Social Club Rockstar', icon: 'simple-icons:rockstargames', color: '#F2B807', isLocal: false },
    { name: 'Uplay', icon: 'simple-icons:ubisoft', color: '#0082FB', isLocal: false },
    { name: 'War Thunder', icon: warThunderIcon, color: '#DC143C', isLocal: true },
    { name: 'Discord', icon: 'logos:discord-icon', color: '#5865F2', isLocal: false },
    { name: 'TikTok', icon: 'logos:tiktok-icon', color: '#FF0050', isLocal: false },
    { name: 'Instagram', icon: instagramIcon, color: '#E4405F', isLocal: true },
    { name: 'Battle.net', icon: battleNetIcon, color: '#00AEFF', isLocal: true },
    { name: 'ChatGPT', icon: 'simple-icons:openai', color: '#412991', isLocal: false },
    { name: 'VPN', icon: 'material-symbols:vpn-lock', color: '#00CED1', isLocal: false },
    { name: 'Roblox', icon: 'simple-icons:roblox', color: '#E13838', isLocal: false }
  ]

  // Show Steam page if enabled
  if (showSteamPage) {
    return <SteamPage onBack={() => setShowSteamPage(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black">
      {/* Header */}
      <header className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-purple-400">
                SenjaGames.id
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleTestAPI}
                className="bg-blue-700 hover:bg-blue-600 text-blue-100 hover:text-white px-3 py-2 rounded text-sm transition-colors flex items-center space-x-2"
                title="Test API Connection & Steam Endpoint"
              >
                <Icon icon="material-symbols:api" className="w-4 h-4" />
                <span>Test API</span>
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Login
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
            {categories.map((category) => {
              return (
                <button
                  key={category.name}
                  onClick={() => changeCategory(category.name)}
                  className={`relative group flex items-center justify-center p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.name
                      ? 'bg-gray-800 border border-purple-500'
                      : 'bg-gray-900 border border-gray-700 hover:border-purple-400'
                  }`}
                >
                  {category.isLocal ? (
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="w-8 h-8" 
                      style={{ filter: selectedCategory === category.name ? 'hue-rotate(270deg) saturate(1.5)' : 'none' }}
                    />
                  ) : (
                    <Icon 
                      icon={category.icon} 
                      className="text-3xl" 
                      style={{ color: selectedCategory === category.name ? '#a855f7' : category.color }}
                    />
                  )}
                  
                  {/* Styled Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-purple-300 text-xs font-medium rounded-lg border border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                    {category.name}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Accounts Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold text-purple-400">
            {selectedCategory} Accounts
          </h3>
          <div className="flex items-center space-x-4">
            <p className="text-gray-400">{filteredAccounts.length} accounts found</p>
            <button 
              onClick={refreshAccounts}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Steam Filters - Show only when Steam category is selected */}
        {selectedCategory === 'Steam' && (
          <SteamFilters 
            onFilterChange={(filters) => {
              // Apply the filters to the Steam API call
              updateSteamFilters(filters);
            }} 
            loading={loading} 
          />
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error loading accounts:</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={refreshAccounts}
              className="mt-2 bg-red-700 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-8 bg-gray-700 rounded w-20"></div>
                  <div className="h-6 bg-gray-700 rounded w-16"></div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="h-10 bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Accounts Display */}
        {!loading && !error && (
          selectedCategory === 'Steam' ? (
            <SteamAccountsContainer 
              accounts={filteredAccounts} 
              loading={loading} 
              error={error} 
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccounts.map((account) => (
                <div key={account.id} className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-3xl font-bold text-purple-400">
                        {account.priceWithSellerFeeLabel || `$${account.price}`}
                      </span>
                      {account.hasWarranty && (
                        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                          {account.warranty} warranty
                        </span>
                      )}
                      {account.guarantee?.durationPhrase && (
                        <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                          {account.guarantee.durationPhrase} guarantee
                        </span>
                      )}
                    </div>
                    <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-lg font-medium">
                      {account.type}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {(account.item_state || account.status) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-gray-200 font-medium">{account.item_state || account.status}</span>
                      </div>
                    )}
                    {(account.account_last_activity || account.lastSeen) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Last seen:</span>
                        <span className="text-gray-200 font-medium">
                          {account.account_last_activity 
                            ? new Date(account.account_last_activity * 1000).toLocaleDateString()
                            : account.lastSeen
                          }
                        </span>
                      </div>
                    )}
                    {(account.steam_country || account.country) && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Country:</span>
                        <span className="text-gray-200 font-medium">{account.steam_country || account.country}</span>
                      </div>
                    )}
                    {account.item_origin && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Origin:</span>
                        <span className="text-gray-200 font-medium capitalize">{account.item_origin}</span>
                      </div>
                    )}
                  </div>

                  {/* Telegram/Discord Stats */}
                  {(account.chats !== undefined) && (
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.chats}</div>
                        <div className="text-gray-400">Chats</div>
                      </div>
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.channels}</div>
                        <div className="text-gray-400">Channels</div>
                      </div>
                    </div>
                  )}

                  {/* Instagram/TikTok Stats */}
                  {(account.followers !== undefined) && (
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.followers}</div>
                        <div className="text-gray-400">Followers</div>
                      </div>
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.following}</div>
                        <div className="text-gray-400">Following</div>
                      </div>
                    </div>
                  )}

                  {/* Fortnite Stats */}
                  {(account.level !== undefined) && (
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.level}</div>
                        <div className="text-gray-400">Level</div>
                      </div>
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.skins}</div>
                        <div className="text-gray-400">Skins</div>
                      </div>
                    </div>
                  )}

                  {/* miHoYo Stats */}
                  {(account.characters !== undefined) && (
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.characters}</div>
                        <div className="text-gray-400">Characters</div>
                      </div>
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.primogems}</div>
                        <div className="text-gray-400">Primogems</div>
                      </div>
                    </div>
                  )}

                  {/* Valorant Stats */}
                  {(account.rank !== undefined) && (
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.rank}</div>
                        <div className="text-gray-400">Rank</div>
                      </div>
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.agents}</div>
                        <div className="text-gray-400">Agents</div>
                      </div>
                    </div>
                  )}

                  {/* Roblox Stats */}
                  {(account.robux !== undefined) && (
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.robux}</div>
                        <div className="text-gray-400">Robux</div>
                      </div>
                      <div className="text-center p-2 bg-gray-800 rounded-lg border border-gray-600">
                        <div className="font-bold text-purple-400 text-lg">{account.games}</div>
                        <div className="text-gray-400">Games</div>
                      </div>
                    </div>
                  )}

                  {/* Minecraft Stats */}
                  {(account.version !== undefined) && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">Version:</p>
                      <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600">
                        {account.version}
                      </span>
                    </div>
                  )}

                  <a 
                    href={`/acc/?id=${account.id}`}
                    className="block w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium text-center"
                  >
                    View Details
                  </a>
                </div>
              ))}
            </div>
          )
        )}

        {/* Empty State */}
        {!loading && !error && filteredAccounts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No accounts found for {selectedCategory}</p>
            <button 
              onClick={refreshAccounts}
              className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold text-purple-400 mb-4">
                SenjaGames.id
              </h4>
              <p className="text-gray-400">An account marketplace with low prices and secure transactions.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-400">Information</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Terms & Guarantee</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Advice & Guides</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-400">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Gaming</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Social Media</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Digital Services</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-400">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Live Chat</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SenjaGames.id. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/acc" element={<AccountDetailPage />} />
    </Routes>
  )
}

export default App
 

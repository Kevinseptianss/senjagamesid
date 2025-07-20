import { useState } from 'react'
import { Icon } from '@iconify/react'
import { useZelenkaAccounts } from './hooks/useZelenkaAccounts'
import DebugPage from './components/DebugPage'
import SteamPage from './components/SteamPage'
import SteamFilters from './components/SteamFilters'

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

function App() {
  const [showDebug, setShowDebug] = useState(false)
  const [showSteamPage, setShowSteamPage] = useState(false)
  const { 
    accounts: filteredAccounts, 
    loading, 
    error, 
    selectedCategory, 
    changeCategory,
    refreshAccounts 
  } = useZelenkaAccounts()

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

  // Show debug page if enabled
  if (showDebug) {
    return <DebugPage onBack={() => setShowDebug(false)} />
  }

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
            {/* <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Sell</a>
            </nav> */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowSteamPage(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
              >
                <Icon icon="mdi:steam" className="mr-2" />
                Steam Filters
              </button>
              <button 
                onClick={() => setShowDebug(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                Debug API
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
          {/* Mock Data Banner */}
          {import.meta.env.VITE_USE_MOCK_DATA === 'true' && (
            <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">⚠️ Demo Mode</p>
              <p className="text-sm mt-1">Currently using mock data for demonstration. API integration in progress.</p>
            </div>
          )}
          
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
              console.log('Steam filters applied:', filters);
              // Here you would integrate with your Steam API fetching logic
              // For now, just refresh the accounts
              refreshAccounts();
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

        {/* Accounts Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((account) => (
            <div key={account.id} className="bg-gray-900 rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-purple-400">
                    {account.price}
                  </span>
                  {account.hasWarranty && (
                    <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                      {account.warranty} warranty
                    </span>
                  )}
                </div>
                <span className="bg-purple-600 text-white text-sm px-3 py-1 rounded-lg font-medium">
                  {account.type}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-gray-200 font-medium">{account.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Last seen:</span>
                  <span className="text-gray-200 font-medium">{account.lastSeen}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Country:</span>
                  <span className="text-gray-200 font-medium">{account.country}</span>
                </div>
              </div>

              {account.type === 'Steam' && account.games && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Includes:</p>
                  <div className="flex flex-wrap gap-1">
                    {account.games.slice(0, 3).map((game, index) => (
                      <span key={index} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded border border-gray-600">
                        {game}
                      </span>
                    ))}
                  </div>
                </div>
              )}

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

              <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                View Details
              </button>
            </div>
          ))}
        </div>
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
                <li><a href="#" className="hover:text-purple-400 transition-colors">Streaming</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-400">Connect</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-purple-400 transition-colors">Telegram</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-purple-400 transition-colors">Discord</a></li>
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

export default App

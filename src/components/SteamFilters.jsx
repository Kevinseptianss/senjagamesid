import { useState } from 'react'
import { Icon } from '@iconify/react'

const SteamFilters = ({ onFilterChange, loading }) => {
  const [filters, setFilters] = useState({
    // Pagination
    page: 1,
    
    // Price filters
    pmin: '',
    pmax: '',
    
    // General filters
    title: '',
    order_by: 'pdate_to_up_upload',
    
    // Games selection
    game: [],
    
    // Account origin
    origin: [],
    not_origin: [],
    
    // Warranty
    eg: '',
    
    // Financial filters
    purchase_min: '',
    purchase_max: '',
    games_purchase_min: '',
    games_purchase_max: '',
    ingame_purchase_min: '',
    ingame_purchase_max: '',
    cards_min: '',
    cards_max: '',
    cards_games_min: '',
    cards_games_max: '',
    
    // Transaction filters
    trans: false,
    no_trans: false,
    
    // Location
    country: [],
    not_country: [],
    
    // Account stats
    daybreak: '',
    mafile: '',
    limit: '',
    trade_limit: '',
    recently_hours_min: '',
    recently_hours_max: '',
    
    // Inventory
    inv_game: '',
    inv_min: '',
    inv_max: '',
    
    // Registration age
    reg: '',
    reg_period: '',
    
    // Steam stats
    balance_min: '',
    balance_max: '',
    lmin: '',
    lmax: '',
    friends_min: '',
    friends_max: '',
    points_min: '',
    points_max: '',
    gmin: '',
    gmax: '',
    no_vac: false,
    email_type: [],
    
    // CS2 specific
    win_count_min: '',
    win_count_max: '',
    medalsmin: '',
    medalsmax: '',
    medal_id: [],
    rmin: '',
    rmax: '',
    elo_min: '',
    elo_max: '',
    has_faceit: '',
    faceit_lvl_min: '',
    faceit_lvl_max: '',
    
    // Dota 2 specific
    solommr_min: '',
    solommr_max: '',
    d2_game_count_min: '',
    d2_game_count_max: '',
    d2_win_count_min: '',
    d2_win_count_max: '',
    
    // Rust specific
    rust_deaths_min: '',
    rust_deaths_max: '',
    rust_kills_min: '',
    rust_kills_max: ''
  })

  const [expandedSections, setExpandedSections] = useState({
    cs2: false,
    dota2: false,
    rust: false
  })

  // Popular searches data
  const popularSearches = [
    'CS2 Prime', 'Dead by Daylight', 'InZOI', 'Gorilla Tag', 'Rust', 
    'Elden Ring', 'Schedule I', 'R.E.P.O.', 'BG3'
  ]

  // Quick game filters - one-click filters for popular games
  const quickGameFilters = [
    { value: '578080', label: 'PUBG', icon: '🔫' },
    { value: '730', label: 'CS2', icon: '🎯' },
    { value: '271590', label: 'GTA V', icon: '🚗' },
    { value: '570', label: 'Dota 2', icon: '⚔️' },
    { value: '252950', label: 'Rocket League', icon: '⚽' },
    { value: '252490', label: 'Rust', icon: '🏗️' },
    { value: '359550', label: 'R6 Siege', icon: '🏠' },
    { value: '346110', label: 'ARK', icon: '🦕' }
  ]

  // Games list for dropdown
  const gamesList = [
    { value: '578080', label: 'PUBG: BATTLEGROUNDS' },
    { value: '570', label: 'Dota 2' },
    { value: '730', label: 'CS2 Prime' },
    { value: '433850', label: 'Z1 Battle Royale' },
    { value: '440', label: 'Team Fortress 2' },
    { value: '271590', label: 'GTA V' },
    { value: '359550', label: "Tom Clancy's Rainbow Six Siege" },
    { value: '238960', label: 'Path of Exile' },
    { value: '230410', label: 'Warframe' },
    { value: '4000', label: "Garry's Mod" },
    { value: '346110', label: 'ARK: Survival Evolved' },
    { value: '252950', label: 'Rocket League' },
    { value: '444090', label: 'Paladins' },
    { value: '218620', label: 'PAYDAY 2' },
    { value: '304930', label: 'Unturned' },
    { value: '252490', label: 'Rust' },
    { value: '8930', label: "Sid Meier's Civilization V" },
    { value: '268500', label: 'XCOM 2' },
    { value: '377160', label: 'Fallout 4' },
    { value: '105600', label: 'Terraria' }
  ]

  // Account origins
  const accountOrigins = [
    { value: 'brute', label: 'Brute' },
    { value: 'phishing', label: 'Phishing' },
    { value: 'stealer', label: 'Stealer' },
    { value: 'personal', label: 'Personal' },
    { value: 'resale', label: 'Resale' },
    { value: 'autoreg', label: 'Autoreg' },
    { value: 'dummy', label: 'Dummy' }
  ]

  // Warranty options
  const warrantyOptions = [
    { value: '-1', label: '12 hours' },
    { value: '0', label: '24 hours' },
    { value: '1', label: '3 days' }
  ]

  // Countries list (abbreviated version)
  const countries = [
    { value: 'Afghanistan', label: 'Afghanistan' },
    { value: 'Albania', label: 'Albania' },
    { value: 'Algeria', label: 'Algeria' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Belgium', label: 'Belgium' },
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Bulgaria', label: 'Bulgaria' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Chile', label: 'Chile' },
    { value: 'China', label: 'China' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Croatia', label: 'Croatia' },
    { value: 'Czech Republic (Czechia)', label: 'Czech Republic (Czechia)' },
    { value: 'Denmark', label: 'Denmark' },
    { value: 'Finland', label: 'Finland' },
    { value: 'France', label: 'France' },
    { value: 'Germany', label: 'Germany' },
    { value: 'Greece', label: 'Greece' },
    { value: 'Hungary', label: 'Hungary' },
    { value: 'India', label: 'India' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Ireland', label: 'Ireland' },
    { value: 'Italy', label: 'Italy' },
    { value: 'Japan', label: 'Japan' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'Norway', label: 'Norway' },
    { value: 'Poland', label: 'Poland' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Romania', label: 'Romania' },
    { value: 'Russian Federation', label: 'Russian Federation' },
    { value: 'Spain', label: 'Spain' },
    { value: 'Sweden', label: 'Sweden' },
    { value: 'Switzerland', label: 'Switzerland' },
    { value: 'Turkey', label: 'Turkey' },
    { value: 'Ukraine', label: 'Ukraine' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'United States', label: 'United States' }
  ]

  // Inventory games for dropdown
  const inventoryGames = [
    { value: '730', label: 'CS2' },
    { value: '578080', label: 'PUBG' },
    { value: '570', label: 'Dota 2' },
    { value: '440', label: 'Team Fortress 2' },
    { value: '252490', label: 'Rust' },
    { value: '753', label: 'Steam' },
    { value: '304930', label: 'Unturned' },
    { value: '232090', label: 'Killing Floor 2' },
    { value: '322330', label: 'Dont Starve Together' }
  ]

  // Registration period options
  const registrationPeriods = [
    { value: 'year', label: 'years ago' },
    { value: 'month', label: 'months ago' },
    { value: 'day', label: 'days ago' }
  ]

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
  }

  const handleApplyFilters = () => {
    // Map the filter parameters to the proper Steam API parameter names
    const apiParams = {
      // Basic parameters - only include if they have actual values
      ...(filters.pmin && { pmin: filters.pmin }),
      ...(filters.pmax && { pmax: filters.pmax }),
      ...(filters.title && { title: filters.title }),
      
      // Steam-specific parameters (these need to match the actual API parameter names)
      // Convert game array to indexed format for API
      ...(filters.game && filters.game.length > 0 && { game: filters.game }),
      ...(filters.origin && filters.origin.length > 0 && { origin: filters.origin }),
      ...(filters.not_origin && filters.not_origin.length > 0 && { not_origin: filters.not_origin }),
      ...(filters.country && filters.country.length > 0 && { country: filters.country }),
      ...(filters.not_country && filters.not_country.length > 0 && { not_country: filters.not_country }),
      
      // Other Steam filters - only include if they have actual values
      ...(filters.eg && { eg: filters.eg }),
      ...(filters.daybreak && { daybreak: filters.daybreak }),
      ...(filters.mafile && { mafile: filters.mafile }),
      ...(filters.limit && { limit: filters.limit }),
      ...(filters.sb !== undefined && { sb: filters.sb }),
      ...(filters.nsb !== undefined && { nsb: filters.nsb }),
      
      // Order
      ...(filters.order_by && { order_by: filters.order_by }),
      
      // Page
      page: filters.page || 1
    };
    
    onFilterChange(apiParams);
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleSortChange = (sortValue) => {
    handleFilterChange('order_by', sortValue)
    const sortInput = document.getElementById('sortInput')
    if (sortInput) {
      sortInput.value = sortValue
    }
    
    // Update active sort button
    document.querySelectorAll('.button-sort').forEach(btn => btn.classList.remove('selected'))
    const selectedButton = document.querySelector(`[data-value="${sortValue}"]`)
    if (selectedButton) {
      selectedButton.classList.add('selected')
    }
  }

  const handlePopularSearchClick = (searchTerm) => {
    handleFilterChange('title', searchTerm)
    // Auto-apply the filter when a popular search is clicked
    setTimeout(() => handleApplyFilters(), 100)
  }

  const handleQuickGameFilter = (gameId, gameName) => {
    // Toggle the game filter - if already selected, remove it; if not, add it
    const currentGames = filters.game || [];
    const newGames = currentGames.includes(gameId) 
      ? currentGames.filter(g => g !== gameId)  // Remove if already selected
      : [...currentGames, gameId];              // Add if not selected
    
    // Set the game filter
    handleFilterChange('game', newGames)
    
    // Auto-apply the filter
    setTimeout(() => handleApplyFilters(), 100)
  }

  const clearAllFilters = () => {
    setFilters({
      page: 1,
      pmin: '',
      pmax: '',
      title: '',
      order_by: 'pdate_to_up_upload',
      game: [],
      origin: [],
      not_origin: [],
      eg: '',
      purchase_min: '',
      purchase_max: '',
      games_purchase_min: '',
      games_purchase_max: '',
      ingame_purchase_min: '',
      ingame_purchase_max: '',
      cards_min: '',
      cards_max: '',
      cards_games_min: '',
      cards_games_max: '',
      trans: false,
      no_trans: false,
      country: [],
      not_country: [],
      daybreak: '',
      mafile: '',
      limit: '',
      sb: undefined,
      nsb: undefined,
      rust: false
    })
    
    // Auto-apply to show all accounts
    setTimeout(() => handleApplyFilters(), 100)
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      {/* Popular Searches */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Popular Searches</h3>
        <div className="flex flex-wrap gap-2">
          {popularSearches.map((term, index) => (
            <button
              key={index}
              onClick={() => handlePopularSearchClick(term)}
              className="bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white px-3 py-1 rounded-lg text-sm transition-colors border border-gray-600 hover:border-purple-500"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Game Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-green-400">🎮 Quick Game Filters</h3>
          <button
            onClick={clearAllFilters}
            className="bg-red-700 hover:bg-red-600 text-red-100 hover:text-white px-3 py-1 rounded-lg text-sm transition-colors border border-red-600 hover:border-red-500"
          >
            Clear All Filters
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {quickGameFilters.map((game) => (
            <button
              key={game.value}
              onClick={() => handleQuickGameFilter(game.value, game.label)}
              className={`flex items-center justify-center space-x-2 p-3 rounded-lg text-sm transition-all duration-200 border ${
                filters.game && filters.game.includes(game.value)
                  ? 'bg-green-600 hover:bg-green-500 text-white border-green-500'
                  : 'bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white border-gray-600 hover:border-green-500'
              }`}
              title={`Filter accounts with ${game.label}`}
            >
              <img 
                src={`https://nztcdn.com/steam/icon/${game.value}.webp`}
                alt={game.label}
                className="w-5 h-5 rounded flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJNMTIgN0M5Ljc5IDcgOCA4Ljc5IDggMTFTOS43OSAxNSAxMiAxNSAxNiAxMy4yMSAxNiAxMSAxNC4yMSA3IDEyIDdaTTEyIDEzQzEwLjkgMTMgMTAgMTIuMSAxMCAxMUMxMCAxMC45IDEwIDEwIDEwIDEwSDE0QzE0IDEwIDEzIDEwIDEzIDEwQzEzIDEyLjEgMTIuMSAxMyAxMiAxM1oiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2Zz4K'
                }}
              />
              <span className="font-medium text-xs">{game.label}</span>
            </button>
          ))}
        </div>
        {filters.game && filters.game.length > 0 && (
          <div className="mt-3 p-3 bg-green-900 border border-green-600 rounded-lg">
            <p className="text-green-200 text-sm">
              <Icon icon="material-symbols:filter-alt" className="inline w-4 h-4 mr-1" />
              Filtering accounts with: <strong>{quickGameFilters.find(g => g.value === filters.game[0])?.label || 'Selected Game'}</strong>
            </p>
          </div>
        )}
      </div>

      {/* Search Form */}
      <form className="searchBarContainer">
        <div className="filterContainer">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* First Column */}
            <div className="filterColumn space-y-4">
              {/* Games Selection */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Select Games (without VAC) - Multiple Selection</label>
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 max-h-32 overflow-y-auto">
                  {gamesList.slice(0, 10).map(game => (
                    <label key={game.value} className="flex items-center space-x-2 py-1 hover:bg-gray-700 px-2 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.game.includes(game.value)}
                        onChange={(e) => {
                          const newGames = e.target.checked 
                            ? [...filters.game, game.value]
                            : filters.game.filter(g => g !== game.value);
                          handleFilterChange('game', newGames);
                        }}
                        className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-300 text-sm">{game.label}</span>
                    </label>
                  ))}
                </div>
                {filters.game.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.game.map(gameId => {
                      const game = gamesList.find(g => g.value === gameId);
                      return (
                        <span key={gameId} className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                          <span>{game?.label || gameId}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newGames = filters.game.filter(g => g !== gameId);
                              handleFilterChange('game', newGames);
                            }}
                            className="text-white hover:text-gray-300"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Account Origin */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Account Origin</label>
                <select
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filters.origin[0] || ''}
                  onChange={(e) => handleFilterChange('origin', e.target.value ? [e.target.value] : [])}
                >
                  <option value="">Select origin</option>
                  {accountOrigins.map(origin => (
                    <option key={origin.value} value={origin.value} className="py-1">
                      {origin.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Exclude Account Origin */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Exclude Account Origin</label>
                <select
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filters.not_origin[0] || ''}
                  onChange={(e) => handleFilterChange('not_origin', e.target.value ? [e.target.value] : [])}
                >
                  <option value="">Select origin to exclude</option>
                  {accountOrigins.map(origin => (
                    <option key={origin.value} value={origin.value} className="py-1">
                      {origin.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Warranty Duration */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Warranty Duration</label>
                <select
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filters.eg}
                  onChange={(e) => handleFilterChange('eg', e.target.value)}
                >
                  <option value="">Select warranty</option>
                  {warrantyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Financial Filters */}
              <div className="space-y-3">
                <div className="splitFilter">
                  <label className="text-gray-300 text-sm font-medium">Total $ spent</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="From"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.purchase_min}
                      onChange={(e) => handleFilterChange('purchase_min', e.target.value)}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="up to"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.purchase_max}
                      onChange={(e) => handleFilterChange('purchase_max', e.target.value)}
                    />
                  </div>
                </div>

                <div className="splitFilter">
                  <label className="text-gray-300 text-sm font-medium">Total $ spent on games</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="From"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.games_purchase_min}
                      onChange={(e) => handleFilterChange('games_purchase_min', e.target.value)}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="up to"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.games_purchase_max}
                      onChange={(e) => handleFilterChange('games_purchase_max', e.target.value)}
                    />
                  </div>
                </div>

                <div className="splitFilter">
                  <label className="text-gray-300 text-sm font-medium">Total $ in-game purchases</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="From"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.ingame_purchase_min}
                      onChange={(e) => handleFilterChange('ingame_purchase_min', e.target.value)}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="up to"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.ingame_purchase_max}
                      onChange={(e) => handleFilterChange('ingame_purchase_max', e.target.value)}
                    />
                  </div>
                </div>

                <div className="splitFilter">
                  <label className="text-gray-300 text-xs font-medium">Available to obtain cards</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="From"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.cards_min}
                      onChange={(e) => handleFilterChange('cards_min', e.target.value)}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="up to"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.cards_max}
                      onChange={(e) => handleFilterChange('cards_max', e.target.value)}
                    />
                  </div>
                </div>

                <div className="splitFilter">
                  <label className="text-gray-300 text-xs font-medium">Games with available cards</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min="1"
                      placeholder="From"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.cards_games_min}
                      onChange={(e) => handleFilterChange('cards_games_min', e.target.value)}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="up to"
                      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      value={filters.cards_games_max}
                      onChange={(e) => handleFilterChange('cards_games_max', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Transaction Checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    checked={filters.trans}
                    onChange={(e) => handleFilterChange('trans', e.target.checked)}
                  />
                  <span>With Transactions</span>
                </label>
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    checked={filters.no_trans}
                    onChange={(e) => handleFilterChange('no_trans', e.target.checked)}
                  />
                  <span>No Transactions</span>
                </label>
              </div>

              {/* DLC Guide Button */}
              <button
                type="button"
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                How to find a DLC ?
              </button>
            </div>

            {/* Second Column */}
            <div className="filterColumn space-y-4">
              {/* Country Selection */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Country</label>
                <select
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filters.country[0] || ''}
                  onChange={(e) => handleFilterChange('country', e.target.value ? [e.target.value] : [])}
                >
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country.value} value={country.value} className="py-1">
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Days Inactive */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Days Inactive</label>
                <input
                  type="number"
                  placeholder="Days Inactive"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={filters.daybreak}
                  onChange={(e) => handleFilterChange('daybreak', e.target.value)}
                />
              </div>

              {/* SDA (.maFile) */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">SDA (.maFile)</label>
                <div className="grid grid-cols-3 gap-1">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="mafile"
                      value=""
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.mafile === ''}
                      onChange={(e) => handleFilterChange('mafile', e.target.value)}
                    />
                    <span className="text-xs text-gray-300">Any</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="mafile"
                      value="yes"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.mafile === 'yes'}
                      onChange={(e) => handleFilterChange('mafile', e.target.value)}
                    />
                    <span className="text-xs text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="mafile"
                      value="no"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.mafile === 'no'}
                      onChange={(e) => handleFilterChange('mafile', e.target.value)}
                    />
                    <span className="text-xs text-gray-300">No</span>
                  </label>
                </div>
              </div>

              {/* Steam $5 Limit */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Steam $5 Limit</label>
                <div className="grid grid-cols-3 gap-1">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="limit"
                      value=""
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.limit === ''}
                      onChange={(e) => handleFilterChange('limit', e.target.value)}
                    />
                    <span className="text-xs text-gray-300">Any</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="limit"
                      value="yes"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.limit === 'yes'}
                      onChange={(e) => handleFilterChange('limit', e.target.value)}
                    />
                    <span className="text-xs text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="limit"
                      value="no"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.limit === 'no'}
                      onChange={(e) => handleFilterChange('limit', e.target.value)}
                    />
                    <span className="text-xs text-gray-300">No</span>
                  </label>
                </div>
              </div>

              {/* Trade Limit (Temporary) */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Trade Limit (Temporary)</label>
                <div className="grid grid-cols-3 gap-1">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="trade_limit"
                      value=""
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.trade_limit === ''}
                      onChange={(e) => handleFilterChange('trade_limit', e.target.value)}
                    />
                    <span className="text-xs text-gray-300">Any</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="trade_limit"
                      value="yes"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.trade_limit === 'yes'}
                      onChange={(e) => handleFilterChange('trade_limit', e.target.value)}
                    />
                    <span className="text-xs text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="trade_limit"
                      value="no"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.trade_limit === 'no'}
                      onChange={(e) => handleFilterChange('trade_limit', e.target.value)}
                    />
                    <span className="text-xs text-gray-300">No</span>
                  </label>
                </div>
              </div>

              {/* Hours played in last 2 weeks */}
              <div className="space-y-2">
                <label className="text-gray-300 text-xs font-medium">Hours played in last 2 weeks</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="From"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.recently_hours_min}
                    onChange={(e) => handleFilterChange('recently_hours_min', e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="up to"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.recently_hours_max}
                    onChange={(e) => handleFilterChange('recently_hours_max', e.target.value)}
                  />
                </div>
              </div>

              {/* Inventory Section */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Inventory</label>
                  <select
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.inv_game}
                    onChange={(e) => handleFilterChange('inv_game', e.target.value)}
                  >
                    <option value="">Select a game</option>
                    {inventoryGames.map(game => (
                      <option key={game.value} value={game.value}>
                        {game.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="From $"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.inv_min}
                    onChange={(e) => handleFilterChange('inv_min', e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="up to"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.inv_max}
                    onChange={(e) => handleFilterChange('inv_max', e.target.value)}
                  />
                </div>
              </div>

              {/* Registered ago */}
              <div className="space-y-3">
                <label className="text-gray-300 text-sm font-medium">Registered ago</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="X..."
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.reg}
                    onChange={(e) => handleFilterChange('reg', e.target.value)}
                  />
                  <select
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.reg_period}
                    onChange={(e) => handleFilterChange('reg_period', e.target.value)}
                  >
                    <option value="">Select period</option>
                    {registrationPeriods.map(period => (
                      <option key={period.value} value={period.value}>
                        {period.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Third Column */}
            <div className="filterColumn space-y-4">
              {/* Balance */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Balance</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Balance from $"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.balance_min}
                    onChange={(e) => handleFilterChange('balance_min', e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="up to"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.balance_max}
                    onChange={(e) => handleFilterChange('balance_max', e.target.value)}
                  />
                </div>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Level</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Level from"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.lmin}
                    onChange={(e) => handleFilterChange('lmin', e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="up to"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.lmax}
                    onChange={(e) => handleFilterChange('lmax', e.target.value)}
                  />
                </div>
              </div>

              {/* Friends */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Friends</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Friends from"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.friends_min}
                    onChange={(e) => handleFilterChange('friends_min', e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="up to"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.friends_max}
                    onChange={(e) => handleFilterChange('friends_max', e.target.value)}
                  />
                </div>
              </div>

              {/* Points */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Points</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Points from"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.points_min}
                    onChange={(e) => handleFilterChange('points_min', e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="up to"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.points_max}
                    onChange={(e) => handleFilterChange('points_max', e.target.value)}
                  />
                </div>
              </div>

              {/* Games */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Games</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="1"
                    placeholder="Games from"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.gmin}
                    onChange={(e) => handleFilterChange('gmin', e.target.value)}
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="up to"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={filters.gmax}
                    onChange={(e) => handleFilterChange('gmax', e.target.value)}
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    checked={filters.no_vac}
                    onChange={(e) => handleFilterChange('no_vac', e.target.checked)}
                  />
                  <span>No VAC All games</span>
                </label>
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    checked={filters.email_type.includes('native')}
                    onChange={(e) => {
                      const newEmailTypes = e.target.checked 
                        ? [...filters.email_type, 'native']
                        : filters.email_type.filter(type => type !== 'native')
                      handleFilterChange('email_type', newEmailTypes)
                    }}
                  />
                  <span>Native mail</span>
                </label>
              </div>

              {/* CS2 Section */}
              <div className="border border-gray-600 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('cs2')}
                  className="w-full flex items-center justify-between p-3 text-gray-300 hover:bg-gray-800"
                >
                  <span className="font-medium">CS2</span>
                  <Icon
                    icon="mdi:chevron-down"
                    className={`transition-transform ${expandedSections.cs2 ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.cs2 && (
                  <div className="p-3 space-y-3 border-t border-gray-600">
                    {/* CS2 Wins */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">Wins</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Wins from"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.win_count_min}
                          onChange={(e) => handleFilterChange('win_count_min', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.win_count_max}
                          onChange={(e) => handleFilterChange('win_count_max', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* CS2 Medals */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">Medals</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Medals from"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.medalsmin}
                          onChange={(e) => handleFilterChange('medalsmin', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.medalsmax}
                          onChange={(e) => handleFilterChange('medalsmax', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* CS2 Rank */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">Rank</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Rank from 1"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.rmin}
                          onChange={(e) => handleFilterChange('rmin', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to 40"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.rmax}
                          onChange={(e) => handleFilterChange('rmax', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Premier ELO */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">Premier ELO</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="From"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.elo_min}
                          onChange={(e) => handleFilterChange('elo_min', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to 50000"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.elo_max}
                          onChange={(e) => handleFilterChange('elo_max', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* FACEIT linked */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">FACEIT linked</label>
                      <div className="grid grid-cols-3 gap-1">
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name="has_faceit"
                            value=""
                            className="text-purple-600 focus:ring-purple-500"
                            checked={filters.has_faceit === ''}
                            onChange={(e) => handleFilterChange('has_faceit', e.target.value)}
                          />
                          <span className="text-xs text-gray-300">Any</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name="has_faceit"
                            value="yes"
                            className="text-purple-600 focus:ring-purple-500"
                            checked={filters.has_faceit === 'yes'}
                            onChange={(e) => handleFilterChange('has_faceit', e.target.value)}
                          />
                          <span className="text-xs text-gray-300">Yes</span>
                        </label>
                        <label className="flex items-center space-x-1">
                          <input
                            type="radio"
                            name="has_faceit"
                            value="no"
                            className="text-purple-600 focus:ring-purple-500"
                            checked={filters.has_faceit === 'no'}
                            onChange={(e) => handleFilterChange('has_faceit', e.target.value)}
                          />
                          <span className="text-xs text-gray-300">No</span>
                        </label>
                      </div>
                    </div>

                    {/* FACEIT Level */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">FACEIT Level</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="From"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.faceit_lvl_min}
                          onChange={(e) => handleFilterChange('faceit_lvl_min', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to 10"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.faceit_lvl_max}
                          onChange={(e) => handleFilterChange('faceit_lvl_max', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dota 2 Section */}
              <div className="border border-gray-600 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('dota2')}
                  className="w-full flex items-center justify-between p-3 text-gray-300 hover:bg-gray-800"
                >
                  <span className="font-medium">Dota 2</span>
                  <Icon
                    icon="mdi:chevron-down"
                    className={`transition-transform ${expandedSections.dota2 ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.dota2 && (
                  <div className="p-3 space-y-3 border-t border-gray-600">
                    {/* Solo MMR */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">MMR</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="MMR from"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.solommr_min}
                          onChange={(e) => handleFilterChange('solommr_min', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.solommr_max}
                          onChange={(e) => handleFilterChange('solommr_max', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Matches */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">Matches</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Matches from"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.d2_game_count_min}
                          onChange={(e) => handleFilterChange('d2_game_count_min', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.d2_game_count_max}
                          onChange={(e) => handleFilterChange('d2_game_count_max', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Wins */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">Wins</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Wins from"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.d2_win_count_min}
                          onChange={(e) => handleFilterChange('d2_win_count_min', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.d2_win_count_max}
                          onChange={(e) => handleFilterChange('d2_win_count_max', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rust Section */}
              <div className="border border-gray-600 rounded-lg">
                <button
                  type="button"
                  onClick={() => toggleSection('rust')}
                  className="w-full flex items-center justify-between p-3 text-gray-300 hover:bg-gray-800"
                >
                  <span className="font-medium">Rust</span>
                  <Icon
                    icon="mdi:chevron-down"
                    className={`transition-transform ${expandedSections.rust ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSections.rust && (
                  <div className="p-3 space-y-3 border-t border-gray-600">
                    {/* Deaths */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">Deaths</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Deaths from"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.rust_deaths_min}
                          onChange={(e) => handleFilterChange('rust_deaths_min', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.rust_deaths_max}
                          onChange={(e) => handleFilterChange('rust_deaths_max', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Kills */}
                    <div className="space-y-2">
                      <label className="text-gray-300 text-sm">Kills</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="1"
                          placeholder="Kills from"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.rust_kills_min}
                          onChange={(e) => handleFilterChange('rust_kills_min', e.target.value)}
                        />
                        <input
                          type="number"
                          min="1"
                          placeholder="up to"
                          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          value={filters.rust_kills_max}
                          onChange={(e) => handleFilterChange('rust_kills_max', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Steam Keys & Other Button */}
              <button
                type="button"
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Steam Keys & Other ➜
              </button>
            </div>
          </div>
        </div>

        {/* Sort Buttons */}
        <div className="sortButtons flex flex-wrap gap-2 mt-6">
          <input type="hidden" id="sortInput" name="order_by" value={filters.order_by} />
          <input type="hidden" name="page" value="1" id="pageInput" />
          
          <button
            type="button"
            className={`px-4 py-2 rounded-lg transition-colors button-sort ${filters.order_by === 'price_to_up' ? 'bg-purple-600 text-white selected' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            data-value="price_to_up"
            onClick={() => handleSortChange('price_to_up')}
          >
            Cheapest
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg transition-colors button-sort ${filters.order_by === 'price_to_down' ? 'bg-purple-600 text-white selected' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            data-value="price_to_down"
            onClick={() => handleSortChange('price_to_down')}
          >
            Expensive
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg transition-colors button-sort ${filters.order_by === 'pdate_to_down_upload' ? 'bg-purple-600 text-white selected' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            data-value="pdate_to_down_upload"
            onClick={() => handleSortChange('pdate_to_down_upload')}
          >
            Newest
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-lg transition-colors button-sort ${filters.order_by === 'pdate_to_up_upload' ? 'bg-purple-600 text-white selected' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            data-value="pdate_to_up_upload"
            onClick={() => handleSortChange('pdate_to_up_upload')}
          >
            Oldest
          </button>
        </div>

        {/* Apply Filters Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Apply Filters'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SteamFilters

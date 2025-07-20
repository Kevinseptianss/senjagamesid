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
    order_by: 'price_to_up',
    show: '',
    currency: 'USD',
    
    // Account verification
    nsb: false, // Not sold before
    sb: false, // Sold before
    nsb_by_me: false, // Not sold by me before
    sb_by_me: false, // Sold by me before
    
    // Email filters
    email_login_data: false,
    email_type: [],
    email_provider: [],
    not_email_provider: '',
    
    // Guarantee and security
    eg: '', // Guarantee type
    no_vac: false,
    vac_skip_game_check: false,
    rt: 'no', // Community ban
    trade_ban: 'no',
    trade_limit: 'no',
    mm_ban: 'no', // CS2 Matchmaking ban
    
    // Account stats
    daybreak: '', // Days offline
    limit: 'no', // Has 5$ limit
    mafile: 'any', // Steam Guard Authenticator
    reg: '', // Account age
    reg_period: 'days',
    lmin: '', // Min level
    lmax: '', // Max level
    
    // CS2 specific
    rmin: '', // Min CS2 rank
    rmax: '', // Max CS2 rank
    wingman_rmin: '', // Min Wingman rank
    wingman_rmax: '', // Max Wingman rank
    cs2_profile_rank_min: '',
    cs2_profile_rank_max: '',
    elo_min: '', // Premier ELO
    elo_max: '',
    
    // Financial
    balance_min: '',
    balance_max: '',
    purchase_min: '',
    purchase_max: '',
    
    // Inventory
    inv_game: '',
    inv_min: '',
    inv_max: '',
    
    // Social
    friends_min: '',
    friends_max: '',
    
    // Games
    gmin: '', // Min games
    gmax: '', // Max games
    game: [], // Specific games
    
    // Performance
    win_count_min: '',
    win_count_max: '',
    recently_hours_min: '',
    recently_hours_max: '',
    
    // Location
    country: [],
    not_country: [],
    
    // Dota 2 specific
    solommr_min: '',
    solommr_max: '',
    d2_game_count_min: '',
    d2_game_count_max: '',
    d2_win_count_min: '',
    d2_win_count_max: '',
    d2_behavior_min: '',
    d2_behavior_max: '',
    
    // FACEIT
    faceit_lvl_min: '',
    faceit_lvl_max: '',
    has_faceit: 'any',
    
    // Steam points and features
    points_min: '',
    points_max: '',
    relevant_gmin: '',
    relevant_gmax: '',
    
    // Trading cards
    cards_min: '',
    cards_max: '',
    cards_games_min: '',
    cards_games_max: ''
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const handleInputChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    // Don't auto-apply filters on every change - wait for Apply button
  }

  const handleApplyFilters = () => {
    // Remove empty values and false booleans before sending to API
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([k, v]) => {
        if (Array.isArray(v)) return v.length > 0
        if (typeof v === 'boolean') return v === true
        return v !== '' && v !== 'any' && v !== 'no'
      })
    )
    
    console.log('Applying Steam filters:', cleanFilters)
    onFilterChange(cleanFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      page: 1,
      pmin: '',
      pmax: '',
      title: '',
      order_by: 'price_to_up',
      show: '',
      currency: 'USD',
      nsb: false,
      sb: false,
      nsb_by_me: false,
      sb_by_me: false,
      email_login_data: false,
      email_type: [],
      email_provider: [],
      not_email_provider: '',
      eg: '',
      no_vac: false,
      vac_skip_game_check: false,
      rt: 'no',
      trade_ban: 'no',
      trade_limit: 'no',
      mm_ban: 'no',
      daybreak: '',
      limit: 'no',
      mafile: 'any',
      reg: '',
      reg_period: 'days',
      lmin: '',
      lmax: '',
      rmin: '',
      rmax: '',
      wingman_rmin: '',
      wingman_rmax: '',
      cs2_profile_rank_min: '',
      cs2_profile_rank_max: '',
      elo_min: '',
      elo_max: '',
      balance_min: '',
      balance_max: '',
      purchase_min: '',
      purchase_max: '',
      inv_game: '',
      inv_min: '',
      inv_max: '',
      friends_min: '',
      friends_max: '',
      gmin: '',
      gmax: '',
      game: [],
      win_count_min: '',
      win_count_max: '',
      recently_hours_min: '',
      recently_hours_max: '',
      country: [],
      not_country: [],
      solommr_min: '',
      solommr_max: '',
      d2_game_count_min: '',
      d2_game_count_max: '',
      d2_win_count_min: '',
      d2_win_count_max: '',
      d2_behavior_min: '',
      d2_behavior_max: '',
      faceit_lvl_min: '',
      faceit_lvl_max: '',
      has_faceit: 'any',
      points_min: '',
      points_max: '',
      relevant_gmin: '',
      relevant_gmax: '',
      cards_min: '',
      cards_max: '',
      cards_games_min: '',
      cards_games_max: ''
    }
    setFilters(resetFilters)
    onFilterChange({ order_by: 'price_to_up', page: 1 })
  }

  const countryOptions = [
    { value: '', label: 'Any Country' },
    { value: 'US', label: 'United States' },
    { value: 'RU', label: 'Russia' },
    { value: 'DE', label: 'Germany' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'FR', label: 'France' },
    { value: 'IT', label: 'Italy' },
    { value: 'ES', label: 'Spain' },
    { value: 'PL', label: 'Poland' },
    { value: 'UA', label: 'Ukraine' },
    { value: 'BR', label: 'Brazil' },
    { value: 'TR', label: 'Turkey' },
    { value: 'IN', label: 'India' },
    { value: 'CN', label: 'China' },
    { value: 'JP', label: 'Japan' }
  ]

  const sortOptions = [
    { value: 'price_to_up', label: 'Cheap first' },
    { value: 'price_to_down', label: 'Expensive first' },
    { value: 'pdate_to_down', label: 'Newest' },
    { value: 'pdate_to_up', label: 'Oldest' },
    { value: 'pdate_to_down_upload', label: 'Newest uploaded' },
    { value: 'pdate_to_up_upload', label: 'Oldest uploaded' },
    { value: 'edate_to_up', label: 'Newest edited' },
    { value: 'edate_to_down', label: 'Oldest edited' }
  ]

  const guaranteeOptions = [
    { value: '', label: 'Any guarantee' },
    { value: '0', label: '24 hours' },
    { value: '1', label: '3 days' },
    { value: '-1', label: '12 hours' }
  ]

  const emailTypeOptions = [
    { value: 'autoreg', label: 'Auto-registered' },
    { value: 'native', label: 'Native' },
    { value: 'no', label: 'No email' },
    { value: 'no_market', label: 'No market email' }
  ]

  const emailProviderOptions = [
    { value: 'other', label: 'Other' },
    { value: 'rambler', label: 'Rambler' },
    { value: 'outlook', label: 'Outlook' },
    { value: 'firstmail', label: 'Firstmail' },
    { value: 'notletters', label: 'Notletters' },
    { value: 'mail_ru', label: 'Mail.ru' }
  ]

  const showOptions = [
    { value: '', label: 'All accounts' },
    { value: 'active', label: 'Active' },
    { value: 'sold', label: 'Sold' },
    { value: 'deleted', label: 'Deleted' }
  ]

  const tabs = [
    { id: 'basic', label: 'Basic Filters', icon: 'material-symbols:filter-list' },
    { id: 'security', label: 'Security & VAC', icon: 'material-symbols:security' },
    { id: 'games', label: 'Games & Performance', icon: 'material-symbols:sports-esports' },
    { id: 'financial', label: 'Financial & Trading', icon: 'material-symbols:attach-money' },
    { id: 'advanced', label: 'Advanced Options', icon: 'material-symbols:settings' }
  ]

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Icon icon="material-symbols:filter-list" className="mr-2" />
          Filter Steam Accounts
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Applying...' : 'Apply Filters'}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap border-b border-gray-700 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 mr-2 mb-2 rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Icon icon={tab.icon} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Filters Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-6">
          {/* Price and Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={filters.pmin}
                onChange={(e) => handleInputChange('pmin', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="1.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={filters.pmax}
                onChange={(e) => handleInputChange('pmax', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="999.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Search Title</label>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="CS2, Prime, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
              <select
                value={filters.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="RUB">RUB</option>
              </select>
            </div>
          </div>

          {/* Sorting and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
              <select
                value={filters.order_by}
                onChange={(e) => handleInputChange('order_by', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Account Status</label>
              <select
                value={filters.show}
                onChange={(e) => handleInputChange('show', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                {showOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Guarantee</label>
              <select
                value={filters.eg}
                onChange={(e) => handleInputChange('eg', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                {guaranteeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Level and Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Level</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.lmin}
                onChange={(e) => handleInputChange('lmin', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Level</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.lmax}
                onChange={(e) => handleInputChange('lmax', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Account Age (days)</label>
              <input
                type="number"
                min="0"
                value={filters.reg}
                onChange={(e) => handleInputChange('reg', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Days Offline</label>
              <input
                type="number"
                min="0"
                value={filters.daybreak}
                onChange={(e) => handleInputChange('daybreak', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          {/* Quick Boolean Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={filters.email_login_data}
                onChange={(e) => handleInputChange('email_login_data', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
              />
              <span>Has Email Login</span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={filters.nsb}
                onChange={(e) => handleInputChange('nsb', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
              />
              <span>Not Sold Before</span>
            </label>

            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={filters.no_vac}
                onChange={(e) => handleInputChange('no_vac', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
              />
              <span>No VAC Ban</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Steam Guard</label>
              <select
                value={filters.mafile}
                onChange={(e) => handleInputChange('mafile', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="any">Any</option>
                <option value="yes">Has .mafile</option>
                <option value="no">No .mafile</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Security & VAC Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Community Ban</label>
              <select
                value={filters.rt}
                onChange={(e) => handleInputChange('rt', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="no">No community ban</option>
                <option value="yes">Has community ban</option>
                <option value="any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Trade Ban</label>
              <select
                value={filters.trade_ban}
                onChange={(e) => handleInputChange('trade_ban', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="no">No trade ban</option>
                <option value="yes">Has trade ban</option>
                <option value="any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Trade Limit</label>
              <select
                value={filters.trade_limit}
                onChange={(e) => handleInputChange('trade_limit', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="no">No trade limit</option>
                <option value="yes">Has trade limit</option>
                <option value="any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">CS2 MM Ban</label>
              <select
                value={filters.mm_ban}
                onChange={(e) => handleInputChange('mm_ban', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="no">No MM ban</option>
                <option value="yes">Has MM ban</option>
                <option value="any">Any</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">$5 Limit</label>
              <select
                value={filters.limit}
                onChange={(e) => handleInputChange('limit', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="no">No $5 limit</option>
                <option value="yes">Has $5 limit</option>
                <option value="any">Any</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={filters.vac_skip_game_check}
                onChange={(e) => handleInputChange('vac_skip_game_check', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
              />
              <span>Skip VAC Game Check</span>
            </label>
          </div>
        </div>
      )}

      {/* Games & Performance Tab */}
      {activeTab === 'games' && (
        <div className="space-y-6">
          {/* Games Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Games</label>
              <input
                type="number"
                min="0"
                value={filters.gmin}
                onChange={(e) => handleInputChange('gmin', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Games</label>
              <input
                type="number"
                min="0"
                value={filters.gmax}
                onChange={(e) => handleInputChange('gmax', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Relevant Games</label>
              <input
                type="number"
                min="0"
                value={filters.relevant_gmin}
                onChange={(e) => handleInputChange('relevant_gmin', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Relevant Games</label>
              <input
                type="number"
                min="0"
                value={filters.relevant_gmax}
                onChange={(e) => handleInputChange('relevant_gmax', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="999"
              />
            </div>
          </div>

          {/* CS2 Ranks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min CS2 Rank</label>
              <input
                type="number"
                min="1"
                max="18"
                value={filters.rmin}
                onChange={(e) => handleInputChange('rmin', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max CS2 Rank</label>
              <input
                type="number"
                min="1"
                max="18"
                value={filters.rmax}
                onChange={(e) => handleInputChange('rmax', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="18"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Wingman Rank</label>
              <input
                type="number"
                min="1"
                max="18"
                value={filters.wingman_rmin}
                onChange={(e) => handleInputChange('wingman_rmin', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Wingman Rank</label>
              <input
                type="number"
                min="1"
                max="18"
                value={filters.wingman_rmax}
                onChange={(e) => handleInputChange('wingman_rmax', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="18"
              />
            </div>
          </div>

          {/* Performance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Wins</label>
              <input
                type="number"
                min="0"
                value={filters.win_count_min}
                onChange={(e) => handleInputChange('win_count_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Wins</label>
              <input
                type="number"
                min="0"
                value={filters.win_count_max}
                onChange={(e) => handleInputChange('win_count_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Recent Hours</label>
              <input
                type="number"
                min="0"
                value={filters.recently_hours_min}
                onChange={(e) => handleInputChange('recently_hours_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Recent Hours</label>
              <input
                type="number"
                min="0"
                value={filters.recently_hours_max}
                onChange={(e) => handleInputChange('recently_hours_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="9999"
              />
            </div>
          </div>

          {/* Premier ELO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Premier ELO</label>
              <input
                type="number"
                min="0"
                max="50000"
                value={filters.elo_min}
                onChange={(e) => handleInputChange('elo_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Premier ELO</label>
              <input
                type="number"
                min="0"
                max="50000"
                value={filters.elo_max}
                onChange={(e) => handleInputChange('elo_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="50000"
              />
            </div>
          </div>
        </div>
      )}

      {/* Financial & Trading Tab */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          {/* Balance */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Balance ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.balance_min}
                onChange={(e) => handleInputChange('balance_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Balance ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.balance_max}
                onChange={(e) => handleInputChange('balance_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="9999.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Total Purchases ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.purchase_min}
                onChange={(e) => handleInputChange('purchase_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Total Purchases ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.purchase_max}
                onChange={(e) => handleInputChange('purchase_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="99999.99"
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Inventory Game ID</label>
              <input
                type="number"
                min="0"
                value={filters.inv_game}
                onChange={(e) => handleInputChange('inv_game', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="730 (CS2)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Inventory Value ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.inv_min}
                onChange={(e) => handleInputChange('inv_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Inventory Value ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.inv_max}
                onChange={(e) => handleInputChange('inv_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="99999.99"
              />
            </div>
          </div>

          {/* Steam Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Steam Points</label>
              <input
                type="number"
                min="0"
                value={filters.points_min}
                onChange={(e) => handleInputChange('points_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Steam Points</label>
              <input
                type="number"
                min="0"
                value={filters.points_max}
                onChange={(e) => handleInputChange('points_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="999999"
              />
            </div>
          </div>

          {/* Trading Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Trading Cards</label>
              <input
                type="number"
                min="0"
                value={filters.cards_min}
                onChange={(e) => handleInputChange('cards_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Trading Cards</label>
              <input
                type="number"
                min="0"
                value={filters.cards_max}
                onChange={(e) => handleInputChange('cards_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Card Games</label>
              <input
                type="number"
                min="0"
                value={filters.cards_games_min}
                onChange={(e) => handleInputChange('cards_games_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Card Games</label>
              <input
                type="number"
                min="0"
                value={filters.cards_games_max}
                onChange={(e) => handleInputChange('cards_games_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="999"
              />
            </div>
          </div>
        </div>
      )}

      {/* Advanced Options Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          {/* Social */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min Friends</label>
              <input
                type="number"
                min="0"
                value={filters.friends_min}
                onChange={(e) => handleInputChange('friends_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max Friends</label>
              <input
                type="number"
                min="0"
                value={filters.friends_max}
                onChange={(e) => handleInputChange('friends_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="9999"
              />
            </div>
          </div>

          {/* FACEIT */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Has FACEIT</label>
              <select
                value={filters.has_faceit}
                onChange={(e) => handleInputChange('has_faceit', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="any">Any</option>
                <option value="yes">Has FACEIT</option>
                <option value="no">No FACEIT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Min FACEIT Level</label>
              <input
                type="number"
                min="1"
                max="10"
                value={filters.faceit_lvl_min}
                onChange={(e) => handleInputChange('faceit_lvl_min', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Max FACEIT Level</label>
              <input
                type="number"
                min="1"
                max="10"
                value={filters.faceit_lvl_max}
                onChange={(e) => handleInputChange('faceit_lvl_max', e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="10"
              />
            </div>
          </div>

          {/* Dota 2 Stats */}
          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-semibold text-purple-400 mb-3">Dota 2 Statistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min Solo MMR</label>
                <input
                  type="number"
                  min="0"
                  value={filters.solommr_min}
                  onChange={(e) => handleInputChange('solommr_min', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Solo MMR</label>
                <input
                  type="number"
                  min="0"
                  value={filters.solommr_max}
                  onChange={(e) => handleInputChange('solommr_max', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="12000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min Dota 2 Games</label>
                <input
                  type="number"
                  min="0"
                  value={filters.d2_game_count_min}
                  onChange={(e) => handleInputChange('d2_game_count_min', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Dota 2 Games</label>
                <input
                  type="number"
                  min="0"
                  value={filters.d2_game_count_max}
                  onChange={(e) => handleInputChange('d2_game_count_max', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min Dota 2 Wins</label>
                <input
                  type="number"
                  min="0"
                  value={filters.d2_win_count_min}
                  onChange={(e) => handleInputChange('d2_win_count_min', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Dota 2 Wins</label>
                <input
                  type="number"
                  min="0"
                  value={filters.d2_win_count_max}
                  onChange={(e) => handleInputChange('d2_win_count_max', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min Behavior Score</label>
                <input
                  type="number"
                  min="0"
                  max="12000"
                  value={filters.d2_behavior_min}
                  onChange={(e) => handleInputChange('d2_behavior_min', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Behavior Score</label>
                <input
                  type="number"
                  min="0"
                  max="12000"
                  value={filters.d2_behavior_max}
                  onChange={(e) => handleInputChange('d2_behavior_max', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                  placeholder="12000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mt-4 text-center text-gray-400">
          <Icon icon="eos-icons:loading" className="inline-block text-xl mr-2" />
          Applying filters...
        </div>
      )}
    </div>
  )
}

export default SteamFilters

import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';

const FortniteFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    platform: '',
    daybreak: '',
    origin: [],
    not_origin: [],
    warranty: '',
    change_email: '',
    xbox_linkable: '',
    psn_linkable: '',
    rl_purchases: false,
    skin: [],
    pickaxe: [],
    dance: [],
    glider: [],
    smin: '',
    smax: '',
    vbmin: '',
    vbmax: '',
    lmin: '',
    lmax: '',
    skins_shop_min: '',
    skins_shop_max: '',
    pickaxes_shop_min: '',
    pickaxes_shop_max: '',
    dances_shop_min: '',
    dances_shop_max: '',
    gliders_shop_min: '',
    gliders_shop_max: '',
    skins_shop_vbmin: '',
    skins_shop_vbmax: '',
    pickaxes_shop_vbmin: '',
    pickaxes_shop_vbmax: '',
    dances_shop_vbmin: '',
    dances_shop_vbmax: '',
    gliders_shop_vbmin: '',
    gliders_shop_vbmax: '',
    bp: '',
    bp_lmin: '',
    bp_lmax: '',
    stw: '',
    reg: '',
    reg_period: 'year',
    last_trans_date: '',
    last_trans_date_period: 'year',
    no_trans: false,
    order_by: 'price_to_up',
    price_min: '',
    price_max: '',
    ...initialFilters
  });

  const platformOptions = [
    { value: 'pc', label: 'PC' },
    { value: 'xbox', label: 'Xbox' },
    { value: 'sony', label: 'PlayStation' },
    { value: 'nintendo', label: 'Nintendo Switch' },
    { value: 'mobile', label: 'Mobile' }
  ];

  const warrantyOptions = [
    { value: '24', label: '24 hours' },
    { value: '168', label: '7 days' },
    { value: '720', label: '30 days' },
    { value: '2160', label: '3 months' },
    { value: '4320', label: '6 months' },
    { value: '8760', label: '1 year' }
  ];

  const timePeriodOptions = [
    { value: 'day', label: 'days' },
    { value: 'week', label: 'weeks' },
    { value: 'month', label: 'months' },
    { value: 'year', label: 'years' }
  ];

  const orderByOptions = [
    { value: 'price_to_up', label: 'Price: Low to High' },
    { value: 'price_to_down', label: 'Price: High to Low' },
    { value: 'pdate_to_down', label: 'Newest First' },
    { value: 'pdate_to_down_upload', label: 'Recently Updated' },
    { value: 'count_view', label: 'Most Viewed' },
    { value: 'count_view_down', label: 'Least Viewed' }
  ];

  useEffect(() => {
    setFilters(prev => ({ ...prev, ...initialFilters }));
  }, [initialFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
      return newFilters;
    });
  };

  const handleRadioChange = (name, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [name]: value };
      if (onFiltersChange) {
        onFiltersChange(newFilters);
      }
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      platform: '',
      daybreak: '',
      origin: [],
      not_origin: [],
      warranty: '',
      change_email: '',
      xbox_linkable: '',
      psn_linkable: '',
      rl_purchases: false,
      skin: [],
      pickaxe: [],
      dance: [],
      glider: [],
      smin: '',
      smax: '',
      vbmin: '',
      vbmax: '',
      lmin: '',
      lmax: '',
      skins_shop_min: '',
      skins_shop_max: '',
      pickaxes_shop_min: '',
      pickaxes_shop_max: '',
      dances_shop_min: '',
      dances_shop_max: '',
      gliders_shop_min: '',
      gliders_shop_max: '',
      skins_shop_vbmin: '',
      skins_shop_vbmax: '',
      pickaxes_shop_vbmin: '',
      pickaxes_shop_vbmax: '',
      dances_shop_vbmin: '',
      dances_shop_vbmax: '',
      gliders_shop_vbmin: '',
      gliders_shop_vbmax: '',
      bp: '',
      bp_lmin: '',
      bp_lmax: '',
      stw: '',
      reg: '',
      reg_period: 'year',
      last_trans_date: '',
      last_trans_date_period: 'year',
      no_trans: false,
      order_by: 'price_to_up',
      price_min: '',
      price_max: ''
    };
    setFilters(clearedFilters);
    if (onFiltersChange) {
      onFiltersChange(clearedFilters);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  };

  return (
    <div className="searchBarContainer mx-auto max-w-7xl bg-gray-900 rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="filterContainer bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            <Icon icon="mdi:gamepad-variant" className="inline mr-2 text-purple-500" />
            Fortnite Account Filters
          </h3>

          {/* Three-column grid layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* First Column */}
            <div className="filterColumn space-y-4">
              {/* Platform */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Platform</label>
                <select
                  value={filters.platform}
                  onChange={(e) => handleFilterChange('platform', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Platforms</option>
                  {platformOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="splitFilter">
                <label className="text-gray-300 text-sm font-medium">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.price_min || ''}
                    onChange={(e) => handleFilterChange('price_min', e.target.value)}
                    placeholder="Min Price"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={filters.price_max || ''}
                    onChange={(e) => handleFilterChange('price_max', e.target.value)}
                    placeholder="Max Price"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Level Range */}
              <div className="splitFilter">
                <label className="text-gray-300 text-sm font-medium">Account Level</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.lmin}
                    onChange={(e) => handleFilterChange('lmin', e.target.value)}
                    placeholder="Min Level"
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={filters.lmax}
                    onChange={(e) => handleFilterChange('lmax', e.target.value)}
                    placeholder="Max Level"
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* V-Bucks Range */}
              <div className="splitFilter">
                <label className="text-gray-300 text-sm font-medium">V-Bucks</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.vbmin}
                    onChange={(e) => handleFilterChange('vbmin', e.target.value)}
                    placeholder="Min V-Bucks"
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={filters.vbmax}
                    onChange={(e) => handleFilterChange('vbmax', e.target.value)}
                    placeholder="Max V-Bucks"
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Skins Count */}
              <div className="splitFilter">
                <label className="text-gray-300 text-sm font-medium">Skins Count</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.smin}
                    onChange={(e) => handleFilterChange('smin', e.target.value)}
                    placeholder="Min Skins"
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={filters.smax}
                    onChange={(e) => handleFilterChange('smax', e.target.value)}
                    placeholder="Max Skins"
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Second Column */}
            <div className="filterColumn space-y-4">
              {/* Battle Pass */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Battle Pass</label>
                <div className="grid grid-cols-3 gap-1">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="bp"
                      value=""
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.bp === ''}
                      onChange={() => handleRadioChange('bp', '')}
                    />
                    <span className="text-xs text-gray-300">Any</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="bp"
                      value="yes"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.bp === 'yes'}
                      onChange={() => handleRadioChange('bp', 'yes')}
                    />
                    <span className="text-xs text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="bp"
                      value="no"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.bp === 'no'}
                      onChange={() => handleRadioChange('bp', 'no')}
                    />
                    <span className="text-xs text-gray-300">No</span>
                  </label>
                </div>
              </div>

              {/* Save the World */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Save the World</label>
                <div className="grid grid-cols-3 gap-1">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="stw"
                      value=""
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.stw === ''}
                      onChange={() => handleRadioChange('stw', '')}
                    />
                    <span className="text-xs text-gray-300">Any</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="stw"
                      value="yes"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.stw === 'yes'}
                      onChange={() => handleRadioChange('stw', 'yes')}
                    />
                    <span className="text-xs text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="stw"
                      value="no"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.stw === 'no'}
                      onChange={() => handleRadioChange('stw', 'no')}
                    />
                    <span className="text-xs text-gray-300">No</span>
                  </label>
                </div>
              </div>

              {/* Email Changeable */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Changeable Email</label>
                <div className="grid grid-cols-3 gap-1">
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="change_email"
                      value=""
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.change_email === ''}
                      onChange={() => handleRadioChange('change_email', '')}
                    />
                    <span className="text-xs text-gray-300">Any</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="change_email"
                      value="yes"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.change_email === 'yes'}
                      onChange={() => handleRadioChange('change_email', 'yes')}
                    />
                    <span className="text-xs text-gray-300">Yes</span>
                  </label>
                  <label className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name="change_email"
                      value="no"
                      className="text-purple-600 focus:ring-purple-500"
                      checked={filters.change_email === 'no'}
                      onChange={() => handleRadioChange('change_email', 'no')}
                    />
                    <span className="text-xs text-gray-300">No</span>
                  </label>
                </div>
              </div>

              {/* Warranty */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Warranty Duration</label>
                <select
                  value={filters.warranty}
                  onChange={(e) => handleFilterChange('warranty', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Any Duration</option>
                  {warrantyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Features Checkboxes */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    checked={filters.rl_purchases}
                    onChange={(e) => handleFilterChange('rl_purchases', e.target.checked)}
                  />
                  <span className="text-sm">Rocket League items</span>
                </label>
                
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    checked={filters.no_trans}
                    onChange={(e) => handleFilterChange('no_trans', e.target.checked)}
                  />
                  <span className="text-sm">No transactions</span>
                </label>
              </div>
            </div>

            {/* Third Column */}
            <div className="filterColumn space-y-4">
              {/* Battle Pass Level */}
              <div className="splitFilter">
                <label className="text-gray-300 text-sm font-medium">Battle Pass Level</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.bp_lmin}
                    onChange={(e) => handleFilterChange('bp_lmin', e.target.value)}
                    placeholder="Min BP Level"
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={filters.bp_lmax}
                    onChange={(e) => handleFilterChange('bp_lmax', e.target.value)}
                    placeholder="Max BP Level"
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Account Age */}
              <div className="splitFilter">
                <label className="text-gray-300 text-sm font-medium">Account Age</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.reg}
                    onChange={(e) => handleFilterChange('reg', e.target.value)}
                    placeholder="Age..."
                    min="1"
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <select
                    value={filters.reg_period}
                    onChange={(e) => handleFilterChange('reg_period', e.target.value)}
                    className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {timePeriodOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Days Inactive */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Days Inactive</label>
                <input
                  type="number"
                  value={filters.daybreak}
                  onChange={(e) => handleFilterChange('daybreak', e.target.value)}
                  placeholder="Days Inactive"
                  min="0"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Sort By</label>
                <select
                  value={filters.order_by}
                  onChange={(e) => handleFilterChange('order_by', e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {orderByOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="actionButtons mt-6 pt-4 border-t border-gray-700 flex flex-wrap gap-3">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Icon icon="mdi:magnify" className="mr-2" />
              Apply Filters
            </button>
            
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Icon icon="mdi:filter-off" className="mr-2" />
              Clear All
            </button>
            
            <button
              type="button"
              className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Icon icon="mdi:content-save" className="mr-2" />
              Save Search
            </button>
            
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <Icon icon="mdi:help-circle" className="mr-2" />
              Guide
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FortniteFilters;

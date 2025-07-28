import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import ZelenkaAPI from '../services/zelenkaAPI'

const SteamDebugPage = ({ onBack }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [apiResponse, setApiResponse] = useState(null)
  const [selectedSearch, setSelectedSearch] = useState('')

  const api = new ZelenkaAPI()

  // Popular searches data (copied from SteamFilters)
  const popularSearches = [
    'CS2 Prime', 'Dead by Daylight', 'InZOI', 'Gorilla Tag', 'Rust', 
    'Elden Ring', 'Schedule I', 'R.E.P.O.', 'BG3'
  ]

  const handlePopularSearchClick = async (searchTerm) => {
    setSelectedSearch(searchTerm)
    setLoading(true)
    setError(null)
    setApiResponse(null)

    try {
      console.log(`🔍 Fetching Steam accounts for: "${searchTerm}"`)
      
      // Create the same API call parameters as the popular search would use
      const params = {
        title: searchTerm,
        limit: 20,
        page: 1,
        order_by: 'pdate_to_up_upload' // Same as default in SteamFilters
      }

      console.log('📡 API Parameters:', params)

      // Call the Steam API
      const response = await api.getSteamAccounts(params)
      
      console.log('✅ Raw API Response:', response)
      setApiResponse(response)

    } catch (err) {
      console.error('❌ API Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!')
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            <span>Back to Main</span>
          </button>
          <div className="h-6 w-px bg-gray-600"></div>
          <h1 className="text-2xl font-bold text-purple-400">Steam API Debug</h1>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-purple-400 mb-2">Debug Information</h2>
        <p className="text-gray-300 text-sm">
          Click on any popular search term below to see the exact API response data. 
          This helps debug what data is being received from the Steam API endpoint.
        </p>
      </div>

      {/* Popular Searches */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Popular Searches (Debug Mode)</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {popularSearches.map((term, index) => (
            <button
              key={index}
              onClick={() => handlePopularSearchClick(term)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm transition-colors border ${
                selectedSearch === term
                  ? 'bg-purple-600 text-white border-purple-500'
                  : 'bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white border-gray-600 hover:border-purple-500'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading && selectedSearch === term ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                term
              )}
            </button>
          ))}
        </div>

        {selectedSearch && (
          <div className="text-sm text-gray-400">
            Current search: <span className="text-purple-400 font-medium">"{selectedSearch}"</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-purple-400">Fetching API data...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Icon icon="material-symbols:error" className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">API Error</h3>
          </div>
          <p className="text-red-100 font-mono text-sm bg-red-800 p-3 rounded border border-red-600">
            {error}
          </p>
          <button
            onClick={() => selectedSearch && handlePopularSearchClick(selectedSearch)}
            className="mt-3 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* API Response Display */}
      {apiResponse && (
        <div className="space-y-6">
          {/* Response Summary */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">API Response Summary</h3>
              <button
                onClick={() => copyToClipboard(formatJSON(apiResponse))}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-1 rounded transition-colors"
              >
                <Icon icon="material-symbols:content-copy" className="w-4 h-4" />
                <span>Copy Full Response</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-800 p-3 rounded border border-gray-600">
                <div className="text-gray-400">Total Items</div>
                <div className="text-white font-bold text-lg">
                  {apiResponse.items ? apiResponse.items.length : 'N/A'}
                </div>
              </div>
              <div className="bg-gray-800 p-3 rounded border border-gray-600">
                <div className="text-gray-400">Total Count</div>
                <div className="text-white font-bold text-lg">
                  {apiResponse.totalItems || apiResponse.total || 'N/A'}
                </div>
              </div>
              <div className="bg-gray-800 p-3 rounded border border-gray-600">
                <div className="text-gray-400">Search Term</div>
                <div className="text-purple-400 font-medium">
                  "{selectedSearch}"
                </div>
              </div>
            </div>
          </div>

          {/* Raw JSON Response */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-400">Raw API Response</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(formatJSON(apiResponse))}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded transition-colors"
                >
                  <Icon icon="material-symbols:content-copy" className="w-4 h-4" />
                  <span>Copy JSON</span>
                </button>
              </div>
            </div>
            
            <div className="bg-black rounded border border-gray-600 p-4 overflow-auto max-h-96">
              <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                {formatJSON(apiResponse)}
              </pre>
            </div>
          </div>

          {/* Individual Items Preview */}
          {apiResponse.items && apiResponse.items.length > 0 && (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-4">
                First 3 Items Preview
              </h3>
              
              <div className="space-y-4">
                {apiResponse.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">Item #{index + 1}</h4>
                      <button
                        onClick={() => copyToClipboard(formatJSON(item))}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Icon icon="material-symbols:content-copy" className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="bg-black rounded border border-gray-700 p-3 overflow-auto max-h-48">
                      <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                        {formatJSON(item)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!loading && !error && !apiResponse && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-400 mb-3">Instructions</h3>
          <div className="text-gray-300 space-y-2">
            <p>• Click on any popular search term above to see the API response</p>
            <p>• The response will show both a summary and the raw JSON data</p>
            <p>• You can copy the full response or individual items to your clipboard</p>
            <p>• This helps debug what data structure the Steam API is returning</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SteamDebugPage

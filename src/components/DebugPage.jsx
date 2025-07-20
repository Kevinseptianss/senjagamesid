import { useState, useEffect } from 'react';
import ZelenkaAPI from '../services/zelenkaAPI';

const DebugPage = ({ onBack }) => {
  const [marketCategories, setMarketCategories] = useState([]);
  const [forumCategories, setForumCategories] = useState([]);
  const [latestAccounts, setLatestAccounts] = useState([]);
  const [connectionTest, setConnectionTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const api = new ZelenkaAPI();

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing API connection...');
      
      // Test basic connection
      const connectionResult = await api.testConnection();
      setConnectionTest(connectionResult);
      
      if (connectionResult.success) {
        // Get Market categories
        try {
          const marketCategoriesData = await api.getCategories();
          console.log('Market Categories:', marketCategoriesData);
          
          // Handle different response structures
          if (Array.isArray(marketCategoriesData)) {
            setMarketCategories(marketCategoriesData);
          } else if (marketCategoriesData.categories) {
            setMarketCategories(marketCategoriesData.categories);
          } else if (marketCategoriesData.data) {
            setMarketCategories(marketCategoriesData.data);
          } else {
            setMarketCategories([]);
          }
        } catch (catError) {
          console.error('Failed to fetch market categories:', catError);
        }
        
        // Get Forum categories
        try {
          const forumCategoriesData = await api.getForumCategories();
          console.log('Forum Categories:', forumCategoriesData);
          
          // Handle different response structures
          if (Array.isArray(forumCategoriesData)) {
            setForumCategories(forumCategoriesData);
          } else if (forumCategoriesData.categories) {
            setForumCategories(forumCategoriesData.categories);
          } else if (forumCategoriesData.data) {
            setForumCategories(forumCategoriesData.data);
          } else {
            setForumCategories([]);
          }
        } catch (catError) {
          console.error('Failed to fetch forum categories:', catError);
        }
        
        // Get latest accounts
        try {
          const accountsData = await api.getLatestAccounts();
          console.log('Latest accounts:', accountsData);
          
          // Handle different response structures
          if (Array.isArray(accountsData)) {
            setLatestAccounts(accountsData);
          } else if (accountsData.items) {
            setLatestAccounts(accountsData.items);
          } else if (accountsData.data) {
            setLatestAccounts(accountsData.data);
          } else {
            setLatestAccounts([]);
          }
        } catch (accError) {
          console.error('Failed to fetch latest accounts:', accError);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testSpecificCategory = async (categoryId, categoryName) => {
    try {
      console.log(`Testing category ${categoryName} (ID: ${categoryId})`);
      const result = await api.makeRequest('/', { 
        params: { 
          category_id: categoryId, 
          limit: 5 
        } 
      });
      console.log(`${categoryName} accounts:`, result);
    } catch (error) {
      console.error(`Failed to fetch ${categoryName} accounts:`, error);
    }
  };

  const testClientCredentials = async () => {
    try {
      console.log('Testing Client Credentials token generation...');
      const result = await api.getClientCredentialsToken();
      console.log('Client Credentials result:', result);
      alert('New token generated! Check console for details.');
    } catch (error) {
      console.error('Client Credentials failed:', error);
      alert('Failed to generate new token. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-purple-400">Zelenka API Debug Page</h1>
          {onBack && (
            <button 
              onClick={onBack}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Main
            </button>
          )}
        </div>
        
        {/* Connection Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Connection Status</h2>
          <div className="flex items-center space-x-4 mb-4">
            <button 
              onClick={testConnection}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
            <button 
              onClick={testClientCredentials}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Generate New Token
            </button>
          </div>
          
          {connectionTest && (
            <div className={`p-4 rounded-lg ${connectionTest.success ? 'bg-green-900' : 'bg-red-900'}`}>
              <p className="font-medium">
                {connectionTest.success ? '✅ Connection Successful' : '❌ Connection Failed'}
              </p>
              {!connectionTest.success && (
                <p className="text-sm mt-2">Error: {connectionTest.error}</p>
              )}
            </div>
          )}
          
          {error && (
            <div className="bg-red-900 p-4 rounded-lg mt-4">
              <p className="font-medium">❌ Error</p>
              <p className="text-sm mt-2">{error}</p>
            </div>
          )}
        </div>

        {/* API Configuration */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">API Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Base URL:</strong> {api.baseURL}</p>
              <p><strong>Auth URL:</strong> {api.authURL}</p>
              <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
            </div>
            <div>
              <p><strong>Has Token:</strong> {api.token ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Has Client ID:</strong> {api.clientId ? '✅ Yes' : '❌ No'}</p>
              <p><strong>Has Client Secret:</strong> {api.clientSecret ? '✅ Yes' : '❌ No'}</p>
            </div>
          </div>
          {api.token && (
            <div className="mt-4">
              <p><strong>Token Preview:</strong> {api.token.substring(0, 50)}...</p>
            </div>
          )}
        </div>

        {/* Market Categories */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Market Categories</h2>
          {marketCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketCategories.map((category) => (
                <div key={category.id || category.category_id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-purple-200">
                      {category.name || category.title || `Category ${category.id}`}
                    </h3>
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">
                      ID: {category.id || category.category_id}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-gray-400 text-sm mb-2">{category.description}</p>
                  )}
                  <button
                    onClick={() => testSpecificCategory(
                      category.id || category.category_id, 
                      category.name || category.title
                    )}
                    className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Test Category
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No market categories loaded. Test connection first.</p>
          )}
        </div>

        {/* Forum Categories */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-green-300 mb-4">Forum Categories</h2>
          {forumCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forumCategories.map((category) => (
                <div key={category.category_id} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-green-200">
                      {category.category_title}
                    </h3>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                      ID: {category.category_id}
                    </span>
                  </div>
                  {category.category_description && (
                    <p className="text-gray-400 text-sm mb-2">{category.category_description}</p>
                  )}
                  <div className="text-xs text-gray-500">
                    Forum Category (Not for market accounts)
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No forum categories loaded.</p>
          )}
        </div>

        {/* Latest Accounts */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Latest Accounts Sample</h2>
          {latestAccounts.length > 0 ? (
            <div className="space-y-4">
              {latestAccounts.slice(0, 5).map((account, index) => (
                <div key={account.id || account.item_id || index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p><strong>ID:</strong> {account.id || account.item_id}</p>
                      <p><strong>Price:</strong> ${account.price}</p>
                      <p><strong>Title:</strong> {account.title || account.description}</p>
                    </div>
                    <div>
                      <p><strong>Category ID:</strong> {account.category_id}</p>
                      <p><strong>Country:</strong> {account.country}</p>
                      <p><strong>Last Seen:</strong> {account.last_seen || account.updated_at}</p>
                    </div>
                    <div>
                      <p><strong>Warranty:</strong> {account.warranty_days || 0} days</p>
                      <p><strong>Status:</strong> {account.status || 'Active'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No accounts loaded. Test connection first.</p>
          )}
        </div>

        {/* Raw Data */}
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">Raw Data (Check Console)</h2>
          <p className="text-gray-400">
            Open your browser's developer console (F12) to see detailed API responses and logs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;

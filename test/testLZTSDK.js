// Test script for LZT Market SDK
import LZTMarketSDK from '../src/services/lztMarketSDK.js';

const testLZTMarketSDK = async () => {
  console.log('🧪 Testing LZT Market SDK...');
  
  const sdk = new LZTMarketSDK();
  
  try {
    // Test connection
    console.log('🔗 Testing API connection...');
    const isConnected = await sdk.testConnection();
    console.log(`Connection test: ${isConnected ? '✅ Success' : '❌ Failed'}`);
    
    if (isConnected) {
      // Test getting Steam games
      console.log('🎮 Fetching Steam games...');
      const steamGames = await sdk.getSteamGames();
      console.log(`Steam games count: ${steamGames.length}`);
      
      // Show first 10 games as sample
      console.log('📝 Sample games:');
      steamGames.slice(0, 10).forEach((game, index) => {
        console.log(`${index + 1}. ${game.label} (ID: ${game.value})`);
      });
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run the test
testLZTMarketSDK();

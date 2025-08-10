// Test the LZT Market SDK
import LZTMarketSDK from './src/services/lztMarketSDK.js';

console.log('Testing LZT Market SDK...');

const testSDK = async () => {
  try {
    const sdk = new LZTMarketSDK();
    
    console.log('SDK initialized, testing connection...');
    const isConnected = await sdk.testConnection();
    console.log('Connection test result:', isConnected);
    
    if (isConnected) {
      console.log('Fetching Steam games...');
      const games = await sdk.getSteamGames();
      console.log(`Received ${games.length} Steam games:`, games.slice(0, 5));
    }
  } catch (error) {
    console.error('SDK test failed:', error);
  }
};

testSDK();

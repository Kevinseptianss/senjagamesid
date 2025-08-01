import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true, // Enable client-side routing
    proxy: {
      '/api': {
        target: 'https://prod-api.lzt.market',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'User-Agent': 'SenjaGames.id/1.0'
        }
      }
    }
  }
})

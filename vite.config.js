import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          router: ['react-router-dom'],
          icons: ['@iconify/react', 'react-icons']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    historyApiFallback: true,
    proxy: {
      '/api/lzt': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/steam': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/epic': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/fortnite': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/gifts': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/minecraft': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/chatgpt': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/battlenet': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/roblox': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/vpn': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/escapefromtarkov': {
        target: 'http://localhost:3002',
        changeOrigin: true
      },
      '/api/socialclub': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/socialclub/, '/api/lzt/socialclub')
      },
      '/api/uplay': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/uplay/, '/api/lzt/uplay')
      },
      '/api/discord': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/discord/, '/api/lzt/discord')
      },
      '/api/tiktok': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/tiktok/, '/api/lzt/tiktok')
      },
      '/api/instagram': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/instagram/, '/api/lzt/instagram')
      },
      '/winpay-api': {
        target: 'https://api.winpay.id',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/winpay-api/, ''),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})

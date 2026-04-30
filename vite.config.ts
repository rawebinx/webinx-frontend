import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Must match tsconfig.json paths — points to src/ (not client/src/)
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Raise warning threshold to 600KB — 502KB is fine after gzip (132KB)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor libraries into separate chunks so the main app
        // bundle stays small and browsers can cache libs independently.
        manualChunks: (id: string) => {
          // React core — loads first, always cached
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'react-vendor';
          }

          // Router
          if (id.includes('node_modules/wouter')) {
            return 'router';
          }

          // Icons (lucide-react is large — split it out)
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }

          // React Helmet
          if (id.includes('node_modules/react-helmet-async')) {
            return 'helmet';
          }

          // All other node_modules go into a single vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor';
          }

          // No return = stays in the main app chunk
        },
      },
    },
  },

  server: {
    port: 5173,
    // Proxy API calls to backend during local development
    proxy: {
      '/api': {
        target: 'https://webinx-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },

  // Faster dev HMR
  optimizeDeps: {
    include: ['react', 'react-dom', 'wouter', 'lucide-react'],
  },
});

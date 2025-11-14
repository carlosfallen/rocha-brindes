import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('firebase')) {
            return 'firebase'
          }
          if (id.includes('src/pages/Admin') || id.includes('src/features/admin')) {
            return 'admin'
          }
          if (id.includes('lucide-react') || id.includes('components/ui')) {
            return 'ui'
          }
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
    target: 'es2020'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
    server: {
    host: '0.0.0.0',
    port: 5180,
  }
})
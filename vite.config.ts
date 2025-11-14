// vite.config.ts
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
    target: 'es2020',
    minify: true, // o novo padrão do Vite usa OXC (super rápido)
    cssCodeSplit: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase'
            if (id.includes('react') || id.includes('react-dom')) return 'vendor'
            if (id.includes('react-router')) return 'router'
            if (id.includes('lucide') || id.includes('tanstack')) return 'ui'
          }
        },
      }
    }
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },

  server: {
    host: '0.0.0.0',
    port: 5180,
  },
})

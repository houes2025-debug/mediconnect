import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@context': path.resolve(__dirname, './src/context'),
      '@pages': path.resolve(__dirname, './src/pages'),
    }
  },
  server: {
    port: 3001,
    open: true,
    allowedHosts: [
'congratulations-surrounding-ranked-brands.trycloudflare.com ','wma-digit-seeing-scanners.trycloudflare.com'  ,    'localhost',
    ]
  }
})
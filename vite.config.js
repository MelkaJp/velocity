import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 8080
  },
  plugins: [react()],
  css: {
    postcss: {
      plugins: []
    }
  },
  build: {
    cssMinify: false
  }
})
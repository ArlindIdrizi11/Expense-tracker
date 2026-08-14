import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev, requests to /api are proxied to the Express server on :4000,
// so the frontend can just call fetch('/api/...') with no CORS fuss.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})

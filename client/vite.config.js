import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
server: {
    proxy: {
      // ⚡ This tells Vite: "If you see a request to /proxy, forward it to port 5000"
      '/proxy': 'http://localhost:5000'
    }
  }

  
})

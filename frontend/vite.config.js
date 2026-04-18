import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      //alle Anfragen, die mit /api starten...
      '/api': {
        target: 'http://localhost:3000', //...werden an das Backend weitergereicht
        changeOrigin: true,
      }
    },
    watch: { //direkt in server, nicht nochmal ein server-key
      usePolling: true,
  },
  }
})

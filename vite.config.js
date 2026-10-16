import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: parseInt(process.env.PORT) || 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      // The marketing site, plus the standalone Pipeline Studio page (its app.js, style.css and data.js live in public/).
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        studio: resolve(import.meta.dirname, 'products/pipeline-studio/index.html'),
      },
    },
  },
})

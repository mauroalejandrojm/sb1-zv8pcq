import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Sitemap from 'vite-plugin-sitemap'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  Sitemap({ hostname: "https://madnesslab.dev" }),
  ],
  build: {
    minify: 'esbuild', // Faster minification
    chunkSizeWarningLimit: 500, // Adjust to avoid warnings
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  }
})

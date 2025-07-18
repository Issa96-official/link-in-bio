import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/link-in-bio/', // Sätter basvägen till /link-in-bio/ för GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true, // Rensa dist-mappen innan byggning
    minify: 'terser', // Använd terser för minifiering
    target: 'es2015', // Kompatibilitet med äldre webbläsare
  },
  server: {
    cors: true,
    port: 3000,
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/link-in-bio/', // Sätter basvägen till /link-in-bio/ för GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Säkerställ att vi inte får några relativa sökvägar som börjar med ../
    assetsInlineLimit: 0,
    sourcemap: true,
  }
})

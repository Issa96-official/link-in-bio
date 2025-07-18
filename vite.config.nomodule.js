// vite.config.nomodule.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Konfiguration för byggprocess utan ES moduler för bättre kompatibilitet
export default defineConfig({
  plugins: [react()],
  base: '/link-in-bio/', // Sätter basvägen till /link-in-bio/ för GitHub Pages
  build: {
    outDir: 'dist-nomodule',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true,
    minify: 'esbuild',
    target: 'es2015', // Äldre target för bättre kompatibilitet
    rollupOptions: {
      output: {
        // Format som är mer kompatibelt med olika miljöer
        format: 'iife',
        // Slå ihop allt till en fil för enklare laddning
        manualChunks: undefined,
        entryFileNames: 'index.js',
        chunkFileNames: 'index.js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    cors: true,
    port: 3000,
  }
})

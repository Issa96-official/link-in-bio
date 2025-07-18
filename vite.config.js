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
    minify: 'esbuild', // Använd esbuild istället för terser för minifiering
    target: 'es2015', // Kompatibilitet med äldre webbläsare
    rollupOptions: {
      output: {
        // Ensure correct MIME types
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          icons: ['react-icons']
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      },
      // Resolve local paths correctly
      external: []
    }
  },
  server: {
    cors: true,
    port: 3000,
  }
})

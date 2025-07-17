import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react({
    babel: {
      presets: [
        ['@babel/preset-flow', { all: true }]
      ]
    }
  })],
  
  // Keep esbuild enabled but configure it properly
  esbuild: {
    target: 'chrome88'
  },
  
  optimizeDeps: {
    include: [
      "@mui/material/styles",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
      "react",
      "react-dom"
    ]
  },
  
  // Multiple entry points for Chrome extension
  build: {
    target: 'chrome88',
    rollupOptions: {
      input: {
        // Main popup/options page
        index: resolve(__dirname, 'index.html'),
        // Offscreen page (has corresponding HTML)
        offscreen: resolve(__dirname, 'offscreen.html'),
        // Background script (pure JS)
        background: resolve(__dirname, 'src/core/backgroundMain.js'),
      },
      output: {
        // Use IIFE format for Chrome extensions
        format: 'iife',
        // Clean output filenames (no hash)
        entryFileNames: 'static/js/[name].js',
        chunkFileNames: 'static/js/[name].js',
        assetFileNames: 'static/[ext]/[name].[ext]',
        // Disable chunk splitting for Chrome extensions
        manualChunks: undefined,
        // Explicitly disable inlineDynamicImports for multiple entries
        inlineDynamicImports: false,
      },
    },
    // Don't minimize for Chrome Web Store review process
    minify: false,
    // Write files to disk in development (required for Chrome extensions)
    write: true,
    // Output to build directory
    outDir: 'build',
    emptyOutDir: true,
    // Disable dynamic import inlining at build level too
    dynamicImportVarsOptions: {
      exclude: []
    }
  },
  
  // Define globals for background scripts
  define: {
    'global': 'globalThis',
    'process.env.NODE_ENV': '"production"',
    chrome: 'chrome',
  },
  
  // Configure for Chrome extension development
  server: {
    // Write files to disk in development for Chrome extension
    fs: {
      // Allow serving files from one level up
      allow: ['..'],
    },
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
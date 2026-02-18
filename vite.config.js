import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'path'
import flow from 'esbuild-plugin-flow'
import manifest from './public/manifest.json'

export default defineConfig({
  plugins: [
    react({
      babel: {
        presets: [
          ['@babel/preset-flow', { all: true }]
        ]
      }
    }),
    crx({ manifest })
  ],

  esbuild: {
    target: 'chrome88',
    loader: 'jsx',
    include: /\.(js|jsx|ts|tsx)$/,
    exclude: []
  },

  optimizeDeps: {
    include: [
      "@mui/material/styles",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
      "react",
      "react-dom"
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx'
      },
      plugins: [flow(/\.(js|jsx)$/, true)]
    }
  },

  build: {
    target: 'chrome88',
    // @crxjs/vite-plugin handles the build configuration
    outDir: 'build',
    emptyOutDir: true,
    minify: false, // Keep unminified for Chrome Web Store review
    rollupOptions: {
      input: {
        offscreen: resolve(__dirname, 'src/core/offscreen.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Place offscreen script in assets directory
          if (chunkInfo.name === 'offscreen') {
            return 'assets/offscreen.js';
          }
          return 'assets/[name]-[hash].js';
        },
      },
    },
  },

  // Define globals for background scripts
  define: {
    'global': 'globalThis',
    'process.env.NODE_ENV': '"production"',
    'chrome': 'chrome'
  },

  // Configure for Chrome extension development
  server: {
    port: 3000,
    strictPort: true,
    fs: {
      allow: ['..'],
    },
    // Add middleware to handle routing for different extension pages
    // middlewares: [
    //   (req, res, next) => {
    //     // Handle extension routes in development
    //     if (req.url.includes('#popup') || req.url.includes('#options')) {
    //       req.url = '/';
    //     }
    //     next();
    //   }
    // ]
  },
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // Test configuration
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setupTests.js'],
    globals: true,
    // Mock Chrome APIs for testing
    deps: {
      inline: ['@testing-library/jest-dom']
    }
  }
})
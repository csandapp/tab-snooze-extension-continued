import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './public/manifest.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    tsconfigPaths()
  ],

  esbuild: {
    target: 'chrome109',
    jsx: 'automatic',
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
      },
    }
  },

  build: {
    target: 'chrome109',
    // @crxjs/vite-plugin handles the build configuration
    outDir: 'build',
    emptyOutDir: true,
    minify: false, // Keep unminified for Chrome Web Store review
    rollupOptions: {
      input: {
        offscreen: resolve(__dirname, 'src/core/offscreen.ts'),
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
  },

  // Configure for Chrome extension development
  server: {
    port: 3000,
    strictPort: true,
    fs: {
      allow: ['..'],
    },
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
    setupFiles: ['./src/__tests__/setupTests.ts'],
    globals: true,
    // Mock Chrome APIs for testing
    deps: {
      optimizer: {
        web: {
          include: ['@testing-library/jest-dom']
        }
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/**',
        'src/__tests__/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        'vite.config.ts',
        'public/**',
        'build/**',
        'src/setupChromeMock.ts'
      ]
    }
  }
})
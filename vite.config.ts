import { defineConfig } from 'vite'
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import tsconfigPaths from 'vite-tsconfig-paths'
import manifest from './public/manifest.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const gitHash = execSync('git rev-parse --short HEAD').toString().trim()
const gitCommitMsg = execSync('git log -1 --pretty=%s').toString().trim()
const gitDirty = execSync('git status --porcelain').toString().trim() !== ''

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    tsconfigPaths(),
    {
      name: 'build-info',
      closeBundle() {
        const info = [
          `Commit: ${gitHash}`,
          `Message: ${gitCommitMsg}`,
          `Dirty: ${gitDirty ? 'yes' : 'no'}`,
          `Built: ${new Date().toISOString()}`,
        ].join('\n')
        writeFileSync('build/build-info.txt', info + '\n')
        console.log('\n📦 Build Info:\n' + info + '\n')
      }
    }
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
        offscreen: resolve(__dirname, 'offscreen.html'),
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
      inline: ['@testing-library/jest-dom']
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
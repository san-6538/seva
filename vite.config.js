import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindPlugin from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: './', // ✅ This line is crucial for Netlify deployment
    plugins: [
      react(),
      tailwindPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        }
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      fs: {
        strict: false,
      },
      watch: {
        usePolling: true,
      },
      historyApiFallback: true,
    },
  }
})

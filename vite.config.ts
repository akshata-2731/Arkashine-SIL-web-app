import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'assets/**/*'],
      manifest: {
        name: 'Arkashine School Innovation Lab (SIL)',
        short_name: 'Arkashine SIL',
        description: '72-Hour Soil Science Summer Innovation Lab & Faculty Daily Form',
        theme_color: '#143D30',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: '/assets/images/soillenz-device.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/images/soillenz-device.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      }
    })
  ]
});

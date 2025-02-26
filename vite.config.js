// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRoutesPlugin } from './scripts/vite-plugin-routes';
import { VitePWA } from 'vite-plugin-pwa';
import { createfilesTreePlugin } from './scripts/vite-plugin-filesTree';
import { createSupabaseConfig } from './scripts/vite-plugin-supabase-html';

//filename: 'sworker/geo.js', // Corrected the service worker path
const manifestForPlugIn = {
  registerType: 'autoUpdate',
  strategies: 'injectManifest',
  srcDir: 'src',
  
  manifest: {
    name: 'kadabrix',
    short_name: 'kadabrix',
    description: 'Kadabrix PWA with Background Sync',
    theme_color: '#171717',
    background_color: '#f0e7db',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'any',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    permissions: [
      'periodic-background-sync',
      'background-sync',
      'geolocation',
    ],
  },
  workbox: {
    globDirectory: 'public',
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB cache limit
    globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    runtimeCaching: [
      {
        urlPattern: ({ request }) =>
          request.destination === 'script' || request.destination === 'style',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'js-css-cache',
        },
      },
      {
        urlPattern: ({ request }) => request.destination === 'document',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html-cache',
        },
      },
      {
        urlPattern: ({ request }) => request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // Cache images for 30 days
          },
        },
      },
      {
        urlPattern: ({ request }) => request.destination === 'fetch',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
};

// Add devOptions outside the manifest
const pwaConfig = {
  ...manifestForPlugIn,
  devOptions: {
    enabled: true, // Enable service worker in development mode
    type: 'module', // Use ES module format for service worker
    navigateFallback: 'index.html',
  },
};

export default defineConfig({
  build: {
    sourcemap: true, // Enable source maps for debugging
    minify: false, // Prevent minification for easier debugging
  },
  plugins: [
    react(),
    createSupabaseConfig(),
    VitePWA(pwaConfig),
    createfilesTreePlugin(),
    createRoutesPlugin({
      pagesDir: 'src/pages',
      output: 'src/routes.jsx',
    }),
  ],
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRoutesPlugin } from './scripts/vite-plugin-routes';
import { VitePWA } from 'vite-plugin-pwa';
import { createfilesTreePlugin } from './scripts/vite-plugin-filesTree';

const manifestForPlugIn = {
  registerType: 'autoUpdate',
  includeAssets: [],
  manifest: {
    name: 'kadabrix',
    short_name: 'kadabrix',
    description: 'kadabrix',
    icons: [],
    theme_color: '#171717',
    background_color: '#f0e7db',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'any',
  },
  workbox: {
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // Set limit to 5 MB
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
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
    ],
  },
};

export default defineConfig({
  build: {
    minify: false, // Disable minification for debugging in production
    sourcemap: true, // Optional: Enable source maps for better debugging
  },
  plugins: [
    react(),
    VitePWA(manifestForPlugIn),
    createfilesTreePlugin(),
    createRoutesPlugin({
      pagesDir: 'src/pages',
      output: 'src/routes.jsx',
    }),
  ],
});

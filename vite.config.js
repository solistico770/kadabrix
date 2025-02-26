import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRoutesPlugin } from './scripts/vite-plugin-routes';
import { createfilesTreePlugin } from './scripts/vite-plugin-filesTree';
import { createSupabaseConfig } from './scripts/vite-plugin-supabase-html';

export default defineConfig({
  build: {
    sourcemap: true, // Enable source maps for debugging
    minify: false, // Prevent minification for easier debugging
  },
  plugins: [
    react(),
    createSupabaseConfig(),
    createfilesTreePlugin(),
    createRoutesPlugin({
      pagesDir: 'src/pages',
      output: 'src/routes.jsx',
    }),
  ],
});

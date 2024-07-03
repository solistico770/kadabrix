import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createRoutesPlugin } from './scripts/vite-plugin-routes';

export default defineConfig({
  plugins: [
    react(),
    createRoutesPlugin({
      pagesDir: 'src/pages',
      output: 'src/routes.jsx'
    })
  ]
});

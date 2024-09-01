import { defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import { createRoutesPlugin } from './scripts/vite-plugin-routes';
import { VitePWA } from "vite-plugin-pwa";
import { createfilesTreePlugin } from './scripts/vite-plugin-filesTree';
const manifestForPlugIn = {
  registerType:'prompt',
  includeAssests:['favicon.ico', "apple-touc-icon.png", "masked-icon.svg"],
  manifest:{
    name:"kadabrix",
    short_name:"kadabrix",
    description:"kadabrix",
    icons:[
  ],
  theme_color:'#171717',
  background_color:'#f0e7db',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation:'portrait'
  }
}

export default defineConfig({
  plugins: [
    react(),
    VitePWA(manifestForPlugIn),
    createfilesTreePlugin(),
    createRoutesPlugin({
      pagesDir: 'src/pages',
      output: 'src/routes.jsx'
    })
  ]
});

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import runListeners from './events/index'
import { registerSW } from 'virtual:pwa-register';

import  './kadabrix/loginEvent';
import  './kadabrix/cartState';
import  './kadabrix/userState';
import  './kadabrix/pushEvent';


  const updateSW = registerSW({
    onNeedRefresh() {
        console.log('New content available. Please refresh.');
    },
    onOfflineReady() {
        console.log('App is ready to work offline.');
    },
  });


  
if ('serviceWorker' in navigator && 'PeriodicSyncManager' in window) {
  navigator.serviceWorker.ready.then((registration) => {
      registration.periodicSync.getTags().then((tags) => {
          if (!tags.includes('location-sync')) {
              registration.periodicSync.register('location-sync', {
                  minInterval: 60 * 1000, // 1 minute interval
              }).then(() => {
                  console.log('Periodic location sync registered');
              }).catch((error) => {
                  console.error('Failed to register periodic sync:', error);
              });
          }
      });
  });
} else {
  console.warn('Periodic Background Sync is not supported');
}






runListeners();
// Create an RTL theme
const theme = createTheme({
  direction: 'rtl',
});

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>,
);

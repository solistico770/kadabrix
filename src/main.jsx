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

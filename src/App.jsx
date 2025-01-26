import { BrowserRouter as Router, useLocation } from 'react-router-dom'; // Import useLocation
import Routes from './routes';
import Layout from './layout/layout';
import './App.css';
import React, { useEffect, useState } from 'react';
import eventBus from './kadabrix/event';
import Navigate from './kadabrix/Navigate';
import Toast from './kadabrix/toaster';
let Injected = [];
let runOnce = false;

function App() {
  const location = useLocation(); // Use the useLocation hook
  const [rerender, setRerender] = useState({});

  useEffect(() => {
    if (!runOnce) {
      eventBus.on('injectComponent', (Component) => {
        Injected.push(Component);
        setRerender({});
      });
      runOnce = true;
    }
  }, []);

  // Determine if the layout should be shown based on the current path
  const hasLayout = !['/login', '/signUp'].includes(location.pathname);

  return (
    <div className="root">
      {Injected.map((Component, index) => (
        <Component key={index} rerender={rerender} />
      ))}
      {hasLayout && <Layout />}
      <Navigate />
      <Toast />
      <Routes />
    </div>
  );
}

// Wrap the App component with Router
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
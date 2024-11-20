import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import Layout from './kadabrix/layout';
import './App.css'

function App() {
  return (
    
   <div className="root">
   <Router>
        {/* Layout Component: Fixed height */}
        <div className="layout">
          <Layout />
        </div>

        {/* Routes Component: Takes up the rest of the height */}
        <div className="router">
          <Routes/>
          
        </div>
      </Router>
  </div>
   
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import Layout from './kadabrix/layout';


function App() {
  return (
    
   <div className="root">
    <Router>
      <Layout />
      <Routes />
    </Router>
  </div>
   
  );
}

export default App;

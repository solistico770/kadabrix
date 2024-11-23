
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import Layout from './kadabrix/layout';
import './App.css'
import React, { useEffect } from "react";


import { requestForToken, onMessageListener } from "./kadabrix/firebase";



function App() {

  useEffect(() => {
    // Request permission for notifications when the app loads
    requestForToken();
  }, []);

  useEffect(() => {
    // Listen for messages when the app is in the foreground
    onMessageListener()
      .then((payload) => {
        console.log("Notification received: ", payload);
        // Add custom handling for notification here if needed
      })
      .catch((err) => console.log("Failed to receive message: ", err));
  }, []);


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

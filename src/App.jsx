import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import Layout from './kadabrix/layout';
import './App.css'
import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from '@mui/material'; // Import Snackbar for popup notification
import {  onMessageListener } from "./kadabrix/firebase";

function App() {
  const [notification, setNotification] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Listen for messages when the app is in the foreground
    onMessageListener()
      .then((payload) => {
        console.log("Notification received: ", payload);
        setNotification(payload); // Set notification data
        setOpen(true); // Open snackbar
      })
      .catch((err) => console.log("Failed to receive message: ", err));
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

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

      {/* Snackbar to show notifications */}
      <Snackbar 
        open={open} 
        autoHideDuration={6000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {notification ? notification.notification.title : "New Notification"}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;

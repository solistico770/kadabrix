import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import Layout from './kadabrix/layout';
import './App.css'
import React, { useEffect, useState } from "react";
import { Snackbar, Alert } from '@mui/material'; // Import Snackbar for popup notification
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import {  onMessageListener } from "./kadabrix/firebase";
import eventBus from "./kadabrix/event";

let Injected;


function App() {
  const [notification, setNotification] = useState(null);
  const [open, setOpen] = useState(false);
  const [rerender, setRerender] = useState({});
  
  eventBus.on("injectComponent", (injectedComponent) => {
    Injected = injectedComponent;
    setRerender({});
  });



  useEffect(() => {
    // Listen for messages continuously
    onMessageListener((payload) => {
      console.log("Notification received: ", payload);
      setNotification(payload);
      setOpen(true);
    });
  }, []);



  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="root">
      {Injected&&<Injected/>}
      <Router>
        <div className="layout">
          <Layout />
        </div>
        <div className="router">
          <Routes/>
        </div>
      </Router>

      {/* Dialog for detailed notifications */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {notification ? notification.notification.title : "New Notification"}
        </DialogTitle>
        <DialogContent>
          {notification ? notification.notification.body : "You have a new message!"}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default App;

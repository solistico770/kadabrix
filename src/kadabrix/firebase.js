// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration details (fill in with your provided keys)
const firebaseConfig = {
  apiKey: "AIzaSyAgUXTqhApqI7ieys5IDXNFXBVfR-dJBEg",
  authDomain: "kadabrix-fcm.firebaseapp.com",
  projectId: "kadabrix-fcm",
  storageBucket: "kadabrix-fcm.appspot.com",
  messagingSenderId: "419710973591",
  appId: "1:419710973591:web:acd4b64dd8dd98518c9bd2",
  measurementId: "G-RWW7RWW9HL"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
export const messaging = getMessaging(firebaseApp);

// Request notification permission and get the device token
export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BNlElSOFztpHyNbK3fR0fUP-ZV_9DYqQGOGaIjBQIB_5geLwdMX-xkXvnwkyD6SZDZt0M9wuQb-InUqvQ06qSeI", // Replace with your actual public VAPID key
    });
    if (currentToken) {
      console.log("Current Token:", currentToken);
      // Save the token to your server or use it as needed
      return currentToken;
    } else {
      console.log("No registration token available. Request permission to generate one.");
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
  }
};

// Listen for incoming messages

export const onMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);
    if (callback) {
      callback(payload); // Trigger the callback function to handle the incoming message
    }
  });
};


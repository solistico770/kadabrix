// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyAgUXTqhApqI7ieys5IDXNFXBVfR-dJBEg",
  authDomain: "kadabrix-fcm.firebaseapp.com",
  projectId: "kadabrix-fcm",
  storageBucket: "kadabrix-fcm.appspot.com",
  messagingSenderId: "419710973591",
  appId: "1:419710973591:web:acd4b64dd8dd98518c9bd2",
  measurementId: "G-RWW7RWW9HL"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png", // Replace with your app's icon here
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

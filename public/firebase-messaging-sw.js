importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");

importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDszCyTtKj33PBCZpWGp6nCQ8IXTrj40o4",
  authDomain: "speech-app-369303.firebaseapp.com",
  projectId: "speech-app-369303",
  storageBucket: "speech-app-369303.appspot.com",
  messagingSenderId: "1078826179614",
  appId: "1:1078826179614:web:8a641d0389cd55a624e20f",
});

const messaging = firebase.messaging();

// // Both of them ain't working

// //background notifications will be received here
messaging.setBackgroundMessageHandler(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("../firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}

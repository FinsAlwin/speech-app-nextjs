import firebase from "firebase/app";
import "firebase/messaging";

let messaging;

if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyDszCyTtKj33PBCZpWGp6nCQ8IXTrj40o4",
    authDomain: "speech-app-369303.firebaseapp.com",
    projectId: "speech-app-369303",
    storageBucket: "speech-app-369303.appspot.com",
    messagingSenderId: "1078826179614",
    appId: "1:1078826179614:web:8a641d0389cd55a624e20f",
  };

  firebase.initializeApp(firebaseConfig);

  messaging = firebase.messaging();
}

export const getToken = async (setTokenFound) => {
  let currentToken = "";

  const status = await Notification.requestPermission();

  if (status && status === "granted") {
    if (messaging) {
      try {
        currentToken = await messaging.getToken({
          vapidKey:
            "BCi94PnutbmuIn1jdFmrNT5L1PQH5EcbbVbBYBI69sJYJN_xP2SsoeCmMgZfUkfjicomyGAe6iUsKQD-XxA3kI0",
        });
        if (currentToken) {
          setTokenFound(true);
        } else {
          setTokenFound(false);
        }
      } catch (error) {
        console.log("An error occurred while retrieving token. ", error);
      }
    } else {
      setTokenFound(false);
    }
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      messaging.onMessage((payload) => {
        resolve(payload);
      });
    } else {
      resolve(null);
    }
  });

function notifyMe() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification("Hi there!");
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification("Hi there!");
        // …
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}

// import firebase from "firebase/app";
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import localforage from "localforage";

const firebaseCloudMessaging = {
  init: async () => {
    if (!getApps().length) {
      // Initialize the Firebase app with the credentials

      const firebaseApp = initializeApp({
        apiKey: "AIzaSyDszCyTtKj33PBCZpWGp6nCQ8IXTrj40o4",
        authDomain: "speech-app-369303.firebaseapp.com",
        projectId: "speech-app-369303",
        storageBucket: "speech-app-369303.appspot.com",
        messagingSenderId: "1078826179614",
        appId: "1:1078826179614:web:8a641d0389cd55a624e20f",
      });

      const messaging = getMessaging(firebaseApp);
      const tokenInLocalForage = await localforage.getItem("fcm_token");

      if (tokenInLocalForage !== null) {
        return tokenInLocalForage;
      }

      const status = await Notification.requestPermission();

      if (status && status === "granted") {
        getToken(messaging, {
          vapidKey:
            "BCi94PnutbmuIn1jdFmrNT5L1PQH5EcbbVbBYBI69sJYJN_xP2SsoeCmMgZfUkfjicomyGAe6iUsKQD-XxA3kI0",
        })
          .then((currentToken) => {
            if (currentToken) {
              localforage.setItem("fcm_token", currentToken);
              console.log("fcm token", currentToken);
              return currentToken;
            }
          })
          .catch((err) => {
            console.log("An error occurred while retrieving token. ", err);
            // ...
          });
      }
    }
  },
};
export { firebaseCloudMessaging };

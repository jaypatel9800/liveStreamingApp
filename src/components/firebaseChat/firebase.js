import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/messaging"

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "relationship-advice-82a76.firebaseapp.com",
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
    projectId: "relationship-advice-82a76",
    storageBucket: "relationship-advice-82a76.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MASSAGE_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: "G-B2GXS5JM9C"
}

const firebaseApp = firebase.initializeApp(config);
const firestore = firebaseApp.firestore();
const auth = firebaseApp.auth();
const messaging = firebaseApp.messaging();

export { firestore, auth, messaging }
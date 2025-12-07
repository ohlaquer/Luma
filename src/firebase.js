// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "Your_API_KEY",
    authDomain: "Your_AUTH_DOMAIN",
    projectId: "Your_ProjectId",
    storageBucket: "Your_StorageBucket",
    messagingSenderId: "Your_MessagingSenderId",
    appId: "Your_AppId",
};

// Ініціалізація
const app = initializeApp(firebaseConfig);

// Експорти
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

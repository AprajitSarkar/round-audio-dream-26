
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBDZfS3Iz9LXQZWuwHN8nPYTwVx2TXgEUU",
  authDomain: "watchtube-updates.firebaseapp.com",
  databaseURL: "https://watchtube-updates-default-rtdb.firebaseio.com",
  projectId: "watchtube-updates",
  storageBucket: "watchtube-updates.firebasestorage.app",
  messagingSenderId: "676811862497",
  appId: "1:676811862497:android:514c5f8d50bcadea5022a0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

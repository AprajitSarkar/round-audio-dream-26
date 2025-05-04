
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSq9TbdLhJ-m9Ov3ZCRotwhrBWOFFAVUE",
  authDomain: "stube-clone.firebaseapp.com",
  databaseURL: "https://stube-clone-default-rtdb.firebaseio.com",
  projectId: "stube-clone",
  storageBucket: "stube-clone.firebasestorage.app",
  messagingSenderId: "872937502355",
  appId: "1:872937502355:android:15185df77e36ab7a91ff66"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence with better error handling
try {
  enableIndexedDbPersistence(db)
    .then(() => {
      console.log("Firestore persistence has been enabled successfully");
    })
    .catch((err) => {
      console.error("Firebase persistence error:", err.code, err.message);
      if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support all of the features required to enable persistence');
      }
    });
} catch (e) {
  console.error("Failed to enable Firestore persistence:", e);
}

// Debug Firebase connection status
const connectionMonitoring = () => {
  console.log("Setting up Firebase connection monitoring...");
  
  // Log connection status for debugging
  window.addEventListener('online', () => {
    console.log('Browser is online, reconnecting to Firebase...');
  });
  
  window.addEventListener('offline', () => {
    console.log('Browser is offline, Firebase operations will use cached data if available');
  });
};

// Run connection monitoring 
connectionMonitoring();

console.log("Firebase initialized with project:", firebaseConfig.projectId);

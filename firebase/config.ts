import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWCr2QUK_wgm38gpvKB3WBI3p_ICfsEz8",
  authDomain: "taskmanager-db836.firebaseapp.com",
  projectId: "taskmanager-db836",
  storageBucket: "taskmanager-db836.appspot.com",
  messagingSenderId: "185465623442",
  appId: "1:185465623442:web:57219ff4f2043d9729e74b"
};

// Initialize Firebase
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const storage = getStorage();
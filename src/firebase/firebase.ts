// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB89zt1Dr8l__FcCKSxQDA3bmSG9YQcXcU",
  authDomain: "konnect-b134b.firebaseapp.com",
  projectId: "konnect-b134b",
  storageBucket: "konnect-b134b.appspot.com",
  messagingSenderId: "683053103441",
  appId: "1:683053103441:web:8f4025a56c8b5574da3b70",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();

// Create a root reference
export const storage = getStorage();

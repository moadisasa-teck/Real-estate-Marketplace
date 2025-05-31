// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-f1b52.firebaseapp.com",
  projectId: "mern-estate-f1b52",
  storageBucket: "mern-estate-f1b52.appspot.com",
  messagingSenderId: "516233651142",
  appId: "1:516233651142:web:b379e4b830ed3e205008c7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

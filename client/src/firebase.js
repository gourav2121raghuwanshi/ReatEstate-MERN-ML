// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestate-mern-94d31.firebaseapp.com",
  projectId: "realestate-mern-94d31",
  storageBucket: "realestate-mern-94d31.appspot.com",
  messagingSenderId: "969211930412",
  appId: "1:969211930412:web:0699b794d68dbca0a3ee89"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
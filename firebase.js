// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCplINNq7bLp3ozPL88OPLwOa6jPWlY4kQ",
  authDomain: "dmodel-170dc.firebaseapp.com",
  projectId: "dmodel-170dc",
  storageBucket: "dmodel-170dc.firebasestorage.app",
  messagingSenderId: "402003808890",
  appId: "1:402003808890:web:34b1c0eed79c40343aa1c3",
  measurementId: "G-6N2VLBN7G1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;

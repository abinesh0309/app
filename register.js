// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKz6YE5evgckN9SiKEyGPF-87kHpRTfoQ",
  authDomain: "abifirebase.firebaseapp.com",
  projectId: "abifirebase",
  storageBucket: "abifirebase.firebasestorage.app",
  messagingSenderId: "381669743242",
  appId: "1:381669743242:web:c2ff8c0bd88163bc5c2b73",
  measurementId: "G-ECCN70M4L9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//input fields
const email = document.getElementById('email');
const password = document.getElementById('password');

//register button
const sumbit = document.getElementById('signUp');
sumbit.addEventListener('click', function(event){
  event.preventDefault();
   alert('clicked');
})
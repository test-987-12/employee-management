// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCrim6xMm1CIxQVZbJJMpbAmPgojwpmR9E",
    authDomain: "emp-mgt-system.firebaseapp.com",
    projectId: "emp-mgt-system",
    storageBucket: "emp-mgt-system.firebasestorage.app",
    messagingSenderId: "878688156762",
    appId: "1:878688156762:web:ed3973a023378918076c63",
    databaseURL: "https://emp-mgt-system-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

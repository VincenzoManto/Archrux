// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";


const firebaseConfig = {
    apiKey: "AIzaSyCIdal36YDza1vEAU37H3VTqyuz3SZqAkY",
    authDomain: "insighter-38f7e.firebaseapp.com",
    databaseURL: "https://insighter-38f7e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "insighter-38f7e",
    storageBucket: "insighter-38f7e.appspot.com",
    messagingSenderId: "602264307671",
    appId: "1:602264307671:web:d5823fc208b1b235c56d92",
    measurementId: "G-41KN7DMLJ0"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
auth.onAuthStateChanged(e => {
  console.log(e);
})
export const database = getDatabase(app);
export default app;
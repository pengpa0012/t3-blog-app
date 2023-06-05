// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDoOhf7YNkILnYzGVwFaWX3fok3MKwhIow",
  authDomain: "t3-blog-app-96869.firebaseapp.com",
  projectId: "t3-blog-app-96869",
  storageBucket: "t3-blog-app-96869.appspot.com",
  messagingSenderId: "717093015740",
  appId: "1:717093015740:web:120de113efbb768e20c0b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
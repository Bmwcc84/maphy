import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAG0zhrEV-qHM-WqxP9ASZcJFYbKY_gf3E",
  authDomain: "maphy-370a1.firebaseapp.com",
  projectId: "maphy-370a1",
  storageBucket: "maphy-370a1.firebasestorage.app",
  messagingSenderId: "822147510532",
  appId: "1:822147510532:web:2797d9a71c6ec11c2de051",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
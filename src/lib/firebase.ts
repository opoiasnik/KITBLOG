// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyATrpFr8waZWeZnVbZGosVxgdLAOxF9YbY",
    authDomain: "kitglobal-88e0e.firebaseapp.com",
    projectId: "kitglobal-88e0e",
    storageBucket: "kitglobal-88e0e.firebasestorage.app",
    messagingSenderId: "857636859459",
    appId: "1:857636859459:web:396f7e98845d3530ef2ef6",
    measurementId: "G-QVWW57BHMH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Auth methods
export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGitHub = () => signInWithPopup(auth, githubProvider);
export const logOut = () => signOut(auth);

// Types
export type AuthUser = User; 
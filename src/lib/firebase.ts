
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


const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);


export const auth = getAuth(app);


export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();


export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGitHub = () => signInWithPopup(auth, githubProvider);
export const logOut = () => signOut(auth);


export type AuthUser = User;

// src/lib/firebase.js (or firebase.ts for TypeScript)

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdVF02EgF08sNqnunBsjB3YAXddUGhndM",
  authDomain: "jangama2024.firebaseapp.com",
  projectId: "jangama2024",
  storageBucket: "jangama2024.firebasestorage.app",
  messagingSenderId: "284525604294",
  appId: "1:284525604294:web:3e446915e786f5c8f056c7",
  measurementId: "G-K9G4HC3EXK"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get Firebase Auth instance
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);

export default app;

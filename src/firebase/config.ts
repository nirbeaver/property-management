import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDio0un_xi7-JbzF8MX0WBS5OP3nlucqvQ",
  authDomain: "property-management-bfe6d.firebaseapp.com",
  databaseURL: "https://property-management-bfe6d-default-rtdb.firebaseio.com",
  projectId: "property-management-bfe6d",
  storageBucket: "property-management-bfe6d.firebasestorage.app",
  messagingSenderId: "634509827920",
  appId: "1:634509827920:web:93a8bd5c20a994f69a5655",
  measurementId: "G-NVLGVYHG82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

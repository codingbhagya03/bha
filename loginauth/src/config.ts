import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD6j1bnqWeN-6qY5Rj-TozjlXfD1bfn3Q8",
  authDomain: "workflowmain-33e14.firebaseapp.com",
  projectId: "workflowmain-33e14",
  storageBucket: "workflowmain-33e14.firebasestorage.app",
  messagingSenderId: "765076857337",
  appId: "1:765076857337:web:7340e02d5b794dada91d28",
    databaseURL:"https://workflowmain-33e14-default-rtdb.firebaseio.com"
  };

export const app = initializeApp(firebaseConfig);
export const database= getAuth(app);

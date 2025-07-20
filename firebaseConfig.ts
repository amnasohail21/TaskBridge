import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 
  authDomain: 
  storageBucket: 
  messagingSenderId: 
  appId:
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
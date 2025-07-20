import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCIE0QmZf2UN0edNOWjAO-9d9na-J3m_dA",
    authDomain: "taskbridge7866.firebaseapp.com",
    projectId: "taskbridge7866",
    storageBucket: "taskbridge7866.appspot.com",
    messagingSenderId: "1009730223785",
    appId: "1:1009730223785:web:fc615e2fb708ef7b00f3b8"
};

  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
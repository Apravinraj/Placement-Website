import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAcjjaW5A-28FsU0LnR2BYOCVz7aeRZVcc",
  authDomain: "placement-webapp.firebaseapp.com",
  projectId: "placement-webapp",
  storageBucket: "placement-webapp.firebasestorage.app",
  messagingSenderId: "253499183696",
  appId: "1:253499183696:web:df148968723b753202f755"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

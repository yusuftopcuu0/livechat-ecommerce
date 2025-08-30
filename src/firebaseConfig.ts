import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3EM0PtyHXHI2gqCXVBJvE5e5clFXdDuQ",
  authDomain: "livechat-learn-5ddfc.firebaseapp.com",
  projectId: "livechat-learn-5ddfc",
  storageBucket: "livechat-learn-5ddfc.firebasestorage.app",
  messagingSenderId: "1033466844618",
  appId: "1:1033466844618:web:78f2337c87a661fa65eb33",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

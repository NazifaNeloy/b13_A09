import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
export const isMockAuth = !apiKey || apiKey === "mock-api-key";

let app, auth, googleProvider;

if (!isMockAuth) {
  try {
    const firebaseConfig = {
      apiKey: apiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ideavault-d86b7.firebaseapp.com",
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ideavault-d86b7",
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ideavault-d86b7.appspot.com",
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
      appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef"
    };
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (error) {
    console.warn("Firebase initialization failed, falling back to mock auth mode:", error);
  }
}

export { auth, googleProvider };


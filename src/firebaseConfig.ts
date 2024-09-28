// firebaseConfig.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, FirebaseStorage } from "firebase/storage";

// Configuración de Firebase usando las variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar la app solo si no ha sido inicializada antes
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Obtén la instancia de Firebase Storage
export const storage: FirebaseStorage = getStorage(app);

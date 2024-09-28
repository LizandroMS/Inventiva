// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";

// Configuración de Firebase usando las variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializa Firebase solo en el cliente
let app;
if (typeof window !== "undefined") {
  if (!firebase.apps.length) {
    app = initializeApp(firebaseConfig);
    console.log("Firebase inicializado:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  } else {
    app = firebase.app(); // Usa la app ya inicializada
    console.log("Firebase ya estaba inicializado:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  }
} else {
  console.log("Firebase no se ejecuta en el servidor");
}

// Exportar storage para ser utilizado en otras partes de la aplicación
export const storage = getStorage(app);

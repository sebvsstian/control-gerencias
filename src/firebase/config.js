import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Lectura de variables de entorno VITE_FIREBASE_*
const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const envAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const envStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const envMessagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;
const envMeasurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

// Verificacion silenciosa de variables de entorno
const faltanVariables = !envApiKey || !envProjectId || !envAppId;

if (faltanVariables) {
  console.warn("[Firebase] Variables VITE_FIREBASE_* no detectadas en el entorno; usando configuración por defecto de kalopsia-usm.");
}

// Configuración de Firebase con fallback a los datos del proyecto kalopsia-usm
const firebaseConfig = {
  apiKey: envApiKey || "AIzaSyDBkCSPjznIFfGioSBOlp0ntoarV9ig7IM",
  authDomain: envAuthDomain || "kalopsia-usm.firebaseapp.com",
  projectId: envProjectId || "kalopsia-usm",
  storageBucket: envStorageBucket || "kalopsia-usm.firebasestorage.app",
  messagingSenderId: envMessagingSenderId || "862844136716",
  appId: envAppId || "1:862844136716:web:d3994cd5440c8d3d546d29",
  measurementId: envMeasurementId || "G-STB0XEPTNL",
};

const app = initializeApp(firebaseConfig);

// Exportacion de db con caché en memoria estándar
export const db = getFirestore(app);
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Log de diagnostico para verificar que las credenciales estan cargadas
console.log("[Firebase] Inicializando con proyecto:", firebaseConfig.projectId);

if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
  console.error("[Firebase] ERROR CRITICO: Las variables de entorno VITE_FIREBASE_* no estan cargadas. Verifica el archivo .env en la raiz del proyecto.");
}

const app = initializeApp(firebaseConfig);

// Firestore con cache en memoria (sin IndexedDB — evita AbortError)
export const db = getFirestore(app);

console.log("[Firebase] db exportado correctamente:", !!db);
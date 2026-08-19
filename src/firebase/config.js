import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 1. Lectura e impresion de cada variable de entorno VITE_FIREBASE_*
const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const envAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const envStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
const envMessagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;
const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;
const envMeasurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

console.log("[Firebase] Variables de entorno detectadas:", {
  VITE_FIREBASE_API_KEY: envApiKey,
  VITE_FIREBASE_AUTH_DOMAIN: envAuthDomain,
  VITE_FIREBASE_PROJECT_ID: envProjectId,
  VITE_FIREBASE_STORAGE_BUCKET: envStorageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: envMessagingSenderId,
  VITE_FIREBASE_APP_ID: envAppId,
  VITE_FIREBASE_MEASUREMENT_ID: envMeasurementId,
});

// 2. Verificacion de variables faltantes
const faltanVariables = !envApiKey || !envProjectId || !envAppId;

if (faltanVariables) {
  const alertMsg = "Faltan variables VITE_FIREBASE_* en la compilación";
  console.error(`[Firebase] ERROR CRÍTICO: ${alertMsg}. Se utilizarán las credenciales por defecto para evitar caídas.`);
  if (typeof window !== "undefined") {
    // Alerta visible en pantalla requerida por el usuario
    setTimeout(() => {
      alert(`⚠️ ${alertMsg}`);
    }, 200);
  }
}

// Configuracion de Firebase con fallback a los datos del proyecto kalopsia-usm
const firebaseConfig = {
  apiKey: envApiKey || "AIzaSyDBkCSPjznIFfGioSBOlp0ntoarV9ig7IM",
  authDomain: envAuthDomain || "kalopsia-usm.firebaseapp.com",
  projectId: envProjectId || "kalopsia-usm",
  storageBucket: envStorageBucket || "kalopsia-usm.firebasestorage.app",
  messagingSenderId: envMessagingSenderId || "862844136716",
  appId: envAppId || "1:862844136716:web:d3994cd5440c8d3d546d29",
  measurementId: envMeasurementId || "G-STB0XEPTNL",
};

// 1. Log obligatorio de la configuracion cargada
console.log("Config cargada:", firebaseConfig);

const app = initializeApp(firebaseConfig);

// 3. Exportacion de db via getFirestore
export const db = getFirestore(app);
console.log("[Firebase] db exportado correctamente:", !!db);
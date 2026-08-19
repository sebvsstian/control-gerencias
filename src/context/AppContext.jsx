import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { GERENCIAS } from '../constants';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [gerenciaActiva, setGerenciaActiva] = useState(null); // null = dashboard general
  const [gerencias, setGerencias] = useState(GERENCIAS);

  // 1. Escuchar cambios de las gerencias en Firestore en tiempo real
  useEffect(() => {
    console.log('[Firestore] Conectando listener onSnapshot a coleccion "gerencias"...');
    const colRef = collection(db, 'gerencias');

    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const firestoreData = {};
        snap.docs.forEach((d) => {
          firestoreData[d.id] = d.data();
        });

        console.log('[Firestore] Datos de gerencias sincronizados:', Object.keys(firestoreData).length);

        // Mezclar la lista base oficial con los datos persistidos en Firestore
        setGerencias((prev) =>
          prev.map((g) => {
            const dataDoc = firestoreData[g.id];
            if (dataDoc && typeof dataDoc.responsable !== 'undefined') {
              return { ...g, responsable: dataDoc.responsable };
            }
            return g;
          })
        );
      },
      (err) => {
        console.error('[Firestore] Error al escuchar colección gerencias:', err);
      }
    );

    return () => unsub();
  }, []);

  // 2. Guardar responsable en Firestore con actualizacion optimista
  const actualizarResponsable = async (gerenciaId, nombre) => {
    const nombreLimpio = nombre ? nombre.trim() : '';

    // Actualizacion optimista inmediata en memoria
    setGerencias((prev) =>
      prev.map((g) => (g.id === gerenciaId ? { ...g, responsable: nombreLimpio } : g))
    );

    console.log(`[Firestore] Guardando responsable para "${gerenciaId}":`, nombreLimpio);

    try {
      // Persistir permanentemente en Firestore (coleccion "gerencias")
      await setDoc(
        doc(db, 'gerencias', gerenciaId),
        {
          responsable: nombreLimpio,
          actualizadoEn: serverTimestamp(),
        },
        { merge: true }
      );
      console.log(`[Firestore] Responsable de "${gerenciaId}" guardado exitosamente en Firestore.`);
    } catch (err) {
      console.error('[Firestore] Error al guardar responsable en Firestore:', err);
      alert('Error al guardar responsable en la nube: ' + err.message);
      throw err;
    }
  };

  // Inicializacion del tema desde localStorage
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('app_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return 'dark'; // Tema por defecto
    } catch {
      return 'dark';
    }
  });

  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('app_theme', theme);
    } catch (e) {
      console.warn('No se pudo guardar tema en localStorage:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider
      value={{
        gerenciaActiva,
        setGerenciaActiva,
        gerencias,
        actualizarResponsable,
        theme,
        isDarkMode,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GERENCIAS } from '../constants';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [gerenciaActiva, setGerenciaActiva] = useState(null); // null = dashboard general
  const [gerencias, setGerencias] = useState(GERENCIAS);

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

  const actualizarResponsable = (gerenciaId, nombre) => {
    setGerencias((prev) =>
      prev.map((g) => (g.id === gerenciaId ? { ...g, responsable: nombre } : g))
    );
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
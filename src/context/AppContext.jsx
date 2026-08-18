import React, { createContext, useContext, useState } from 'react';
import { GERENCIAS } from '../constants';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [gerenciaActiva, setGerenciaActiva] = useState(null); // null = dashboard
  const [gerencias, setGerencias] = useState(GERENCIAS);

  const actualizarResponsable = (gerenciaId, nombre) => {
    setGerencias((prev) =>
      prev.map((g) => (g.id === gerenciaId ? { ...g, responsable: nombre } : g))
    );
  };

  return (
    <AppContext.Provider value={{ gerenciaActiva, setGerenciaActiva, gerencias, actualizarResponsable }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

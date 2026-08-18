import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useTareas } from './hooks/useTareas';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VistaGerencia from './components/VistaGerencia';
import { Loader2, WifiOff } from 'lucide-react';

function AppContent() {
  const { gerenciaActiva, gerencias } = useApp();
  const { tareas, loading, agregarTarea, toggleTarea, editarTarea, eliminarTarea } = useTareas();

  const gerenciaActual = gerencias.find((g) => g.id === gerenciaActiva);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-indigo-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Conectando con Firestore...</p>
          <p className="text-gray-600 text-xs mt-1">Sincronizando datos en tiempo real</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar tareas={tareas} />
      <main className="flex-1 flex overflow-hidden">
        {gerenciaActiva === null ? (
          <Dashboard tareas={tareas} />
        ) : gerenciaActual ? (
          <VistaGerencia
            gerencia={gerenciaActual}
            tareas={tareas}
            onAgregar={agregarTarea}
            onToggle={toggleTarea}
            onEditar={editarTarea}
            onEliminar={eliminarTarea}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <WifiOff size={40} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">Gerencia no encontrada</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

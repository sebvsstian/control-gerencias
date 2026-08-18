import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useTareas } from './hooks/useTareas';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VistaGerencia from './components/VistaGerencia';
import { Loader2, Menu, Building2, WifiOff, AlertCircle } from 'lucide-react';
import { calcularPorcentajeGlobal, colorProgreso } from './utils';

function AppContent() {
  const { gerenciaActiva, gerencias } = useApp();
  const { tareas, loading, error, agregarTarea, toggleTarea, editarTarea, eliminarTarea } = useTareas();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const gerenciaActual = gerencias.find((g) => g.id === gerenciaActiva);
  const pctGlobal = calcularPorcentajeGlobal(tareas);
  const colorBar = colorProgreso(pctGlobal);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
        <div className="text-center bg-gray-900/80 border border-gray-800 p-8 rounded-2xl shadow-xl max-w-sm w-full">
          <Loader2 size={40} className="text-indigo-500 animate-spin mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-1">Sincronizando en Vivo</h2>
          <p className="text-gray-400 text-xs">Conectando con Firebase Firestore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950 text-gray-100 antialiased">
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden sticky top-0 z-30 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menú de navegación"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm truncate max-w-[150px] xs:max-w-[200px]">
              {gerenciaActiva === null ? 'Dashboard General' : gerenciaActual?.nombre || 'Gerencia'}
            </span>
          </div>
        </div>

        {/* Global Progress Pill on Mobile */}
        <div className="flex items-center gap-2 bg-gray-800/90 border border-gray-700/60 rounded-full px-2.5 py-1">
          <span className="text-[11px] text-gray-400 font-medium">Avance:</span>
          <span className={`text-xs font-bold ${pctGlobal >= 75 ? 'text-emerald-400' : pctGlobal >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {pctGlobal}%
          </span>
        </div>
      </header>

      {/* Error alert if any */}
      {error && (
        <div className="bg-red-950/80 border-b border-red-800/80 text-red-200 px-4 py-2 text-xs flex items-center justify-center gap-2">
          <AlertCircle size={14} />
          <span>Error de conexión Firestore: {error}</span>
        </div>
      )}

      {/* Sidebar with mobile drawer support */}
      <Sidebar
        tareas={tareas}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
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
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <WifiOff size={40} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Gerencia no encontrada</p>
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
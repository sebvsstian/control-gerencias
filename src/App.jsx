import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useTareas } from './hooks/useTareas';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VistaGerencia from './components/VistaGerencia';
import { Loader2, Menu, Building2, WifiOff, AlertCircle, Sun, Moon } from 'lucide-react';
import { calcularPorcentajeGlobal } from './utils';

function AppContent() {
  const { gerenciaActiva, gerencias, theme, toggleTheme } = useApp();
  const { tareas, loading, error, isSyncing, agregarTarea, toggleTarea, editarTarea, eliminarTarea } = useTareas();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const gerenciaActual = gerencias.find((g) => g.id === gerenciaActiva);
  const pctGlobal = calcularPorcentajeGlobal(tareas);

  if (loading && tareas.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors">
        <div className="text-center bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 p-8 rounded-2xl shadow-xl max-w-sm w-full">
          <Loader2 size={40} className="text-indigo-600 dark:text-indigo-400 animate-spin mx-auto mb-4" />
          <h2 className="text-slate-900 dark:text-white font-bold text-lg mb-1">Cargando Datos</h2>
          <p className="text-slate-500 dark:text-gray-400 text-xs">Accediendo a la base de datos en tiempo real...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-900 dark:text-gray-100 transition-colors duration-150">
      {/* Mobile Top Navigation Bar */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-slate-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-xl text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 focus:outline-none transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Abrir menú de navegación"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <Building2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[130px] xs:max-w-[180px]">
              {gerenciaActiva === null ? 'Dashboard' : gerenciaActual?.nombre || 'Gerencia'}
            </span>
          </div>
        </div>

        {/* Right Header Controls (Theme Toggle & Global Progress) */}
        <div className="flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label={theme === 'dark' ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
            title={theme === 'dark' ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-indigo-600" />
            )}
          </button>

          {/* Global Progress Pill */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-gray-800/90 border border-slate-200 dark:border-gray-700/60 rounded-full px-2.5 py-1">
            <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">Avance:</span>
            <span className={`text-xs font-bold ${pctGlobal >= 75 ? 'text-emerald-600 dark:text-emerald-400' : pctGlobal >= 40 ? 'text-amber-600 dark:text-yellow-400' : 'text-rose-600 dark:text-red-400'}`}>
              {pctGlobal}%
            </span>
          </div>
        </div>
      </header>

      {/* Desktop Top Header Bar for Theme Toggle and Status */}
      <div className="hidden md:flex fixed top-4 right-6 z-20 items-center gap-2.5">
        {isSyncing && (
          <span className="text-[11px] bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            Guardando en Firestore...
          </span>
        )}

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-200 shadow-sm hover:shadow hover:bg-slate-50 dark:hover:bg-gray-800 transition-all text-xs font-medium"
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} className="text-amber-400" />
              <span>Modo Claro</span>
            </>
          ) : (
            <>
              <Moon size={15} className="text-indigo-600" />
              <span>Modo Oscuro</span>
            </>
          )}
        </button>
      </div>

      {/* Error alert if any */}
      {error && (
        <div className="bg-rose-50 dark:bg-red-950/80 border-b border-rose-200 dark:border-red-800 text-rose-700 dark:text-red-200 px-4 py-2 text-xs flex items-center justify-center gap-2">
          <AlertCircle size={14} />
          <span>Error de conexión Firestore: {error}</span>
        </div>
      )}

      {/* Sidebar navigation */}
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
              <WifiOff size={40} className="text-slate-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-gray-400">Gerencia no encontrada</p>
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
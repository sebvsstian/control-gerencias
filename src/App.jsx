import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useTareas } from './hooks/useTareas';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VistaGerencia from './components/VistaGerencia';
import { Loader2, Menu, Building2, WifiOff, AlertCircle, Sun, Moon } from 'lucide-react';
import { calcularPorcentajeGlobal } from './utils';

function AppContent() {
  const { gerenciaActiva, gerencias, isDarkMode, toggleTheme } = useApp();
  const { tareas, loading, error, isSyncing, agregarTarea, toggleTarea, editarTarea, eliminarTarea } = useTareas();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const gerenciaActual = gerencias.find((g) => g.id === gerenciaActiva);
  const pctGlobal = calcularPorcentajeGlobal(tareas);

  if (loading && tareas.length === 0) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-150 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
        <div className={`text-center p-8 rounded-2xl shadow-xl max-w-sm w-full border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <Loader2 size={40} className="text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="font-bold text-lg mb-1">Cargando Datos</h2>
          <p className="text-xs opacity-75">Accediendo a la base de datos en tiempo real...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-150 ${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
      {/* Mobile Top Navigation Bar */}
      <header className={`md:hidden sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b backdrop-blur-md shadow-xs transition-colors duration-150 ${
        isDarkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`p-2 -ml-2 rounded-xl focus:outline-none transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Abrir menú de navegación"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs">
              <Building2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm truncate max-w-[130px] xs:max-w-[180px]">
              {gerenciaActiva === null ? 'Dashboard' : gerenciaActual?.nombre || 'Gerencia'}
            </span>
          </div>
        </div>

        {/* Right Header Controls (Theme Toggle & Global Progress) */}
        <div className="flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center border ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            aria-label={isDarkMode ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
            title={isDarkMode ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
          >
            {isDarkMode ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-indigo-600" />
            )}
          </button>

          {/* Global Progress Pill */}
          <div className={`flex items-center gap-1.5 border rounded-full px-2.5 py-1 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}>
            <span className="text-[11px] opacity-75 font-medium">Avance:</span>
            <span className={`text-xs font-bold ${
              pctGlobal >= 75
                ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
                : pctGlobal >= 40
                ? (isDarkMode ? 'text-yellow-400' : 'text-amber-600')
                : (isDarkMode ? 'text-red-400' : 'text-rose-600')
            }`}>
              {pctGlobal}%
            </span>
          </div>
        </div>
      </header>

      {/* Desktop Top Header Controls */}
      <div className="hidden md:flex fixed top-4 right-6 z-20 items-center gap-2.5">
        {isSyncing && (
          <span className={`text-[11px] border px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs ${
            isDarkMode ? 'bg-indigo-950/80 border-indigo-800/50 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            Sincronizando con Firestore...
          </span>
        )}

        <button
          onClick={toggleTheme}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border shadow-xs transition-all text-xs font-semibold ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
          }`}
          title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {isDarkMode ? (
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
        <div className={`px-4 py-2 text-xs flex items-center justify-center gap-2 border-b ${
          isDarkMode ? 'bg-red-950/80 border-red-800 text-red-200' : 'bg-rose-50 border-rose-200 text-rose-700'
        }`}>
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
              <WifiOff size={40} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Gerencia no encontrada</p>
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
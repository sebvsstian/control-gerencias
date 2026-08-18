import React from 'react';
import {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog, LayoutDashboard, ChevronRight, X,
  Sun, Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLOR_MAP } from '../constants';
import { calcularPorcentaje, colorProgreso } from '../utils';

const ICON_MAP = {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog
};

export default function Sidebar({ tareas, mobileOpen, onCloseMobile }) {
  const { gerenciaActiva, setGerenciaActiva, gerencias, isDarkMode, toggleTheme } = useApp();

  const handleSelect = (id) => {
    setGerenciaActiva(id);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className={`flex flex-col h-full border-r w-72 md:w-64 transition-colors duration-150 ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header Logo */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <span className={`font-bold text-sm tracking-tight block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              CreaciónEmpresa
            </span>
            <span className={`text-[11px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Ingeniería Comercial
            </span>
          </div>
        </div>
        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin space-y-1">
        <button
          onClick={() => handleSelect(null)}
          className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all group min-h-[44px] ${
            gerenciaActiva === null
              ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
              : (isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800/80' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100')
          }`}
        >
          <LayoutDashboard size={18} className="shrink-0" />
          <span className="text-sm font-medium">Dashboard General</span>
          {gerenciaActiva === null && <ChevronRight size={16} className="ml-auto shrink-0" />}
        </button>

        <div className="pt-3 pb-1.5 px-3.5">
          <p className={`text-[11px] font-bold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            9 Gerencias Oficiales
          </p>
        </div>

        {gerencias.map((g) => {
          const Icon = ICON_MAP[g.icono] || Building2;
          const colors = COLOR_MAP[g.color];
          const pct = calcularPorcentaje(tareas, g.id);
          const isActive = gerenciaActiva === g.id;
          const colorBar = colorProgreso(pct);

          return (
            <button
              key={g.id}
              onClick={() => handleSelect(g.id)}
              className={`w-full flex flex-col gap-1.5 px-3.5 py-2.5 rounded-xl transition-all text-left min-h-[48px] border ${
                isActive
                  ? `${colors.bg} ${colors.text} ${colors.border} font-bold shadow-xs`
                  : (isDarkMode
                      ? 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
                      : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100')
              }`}
            >
              <div className="flex items-center gap-2.5 w-full">
                <Icon size={16} className="shrink-0" />
                <span className="text-xs font-medium leading-tight flex-1 truncate">{g.nombre}</span>
                <span className={`text-xs font-bold shrink-0 ${
                  isActive
                    ? colors.text
                    : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
                }`}>
                  {pct}%
                </span>
              </div>
              {/* Mini progress bar */}
              <div className={`h-1.5 rounded-full w-full overflow-hidden ${
                isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
              }`}>
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${colorBar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Meta Footer & Theme Toggle */}
      <div className={`p-3 border-t space-y-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-colors text-xs font-semibold min-h-[42px] ${
            isDarkMode
              ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
          }`}
          title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          <div className="flex items-center gap-2">
            {isDarkMode ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-indigo-600" />
            )}
            <span>{isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </div>
          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
            isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'
          }`}>
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* ROI Target Mini-Card */}
        <div className={`rounded-xl p-3 border ${
          isDarkMode
            ? 'bg-indigo-950/40 border-indigo-900/50 text-indigo-300'
            : 'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Meta ROI</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isDarkMode
                ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                : 'bg-indigo-100 border-indigo-300 text-indigo-700'
            }`}>
              ≥ 60%
            </span>
          </div>
          <p className={`text-xs leading-snug ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Rentabilidad mínima exigida
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex flex-col h-screen shrink-0 sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer (Overlay + Slide-over) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
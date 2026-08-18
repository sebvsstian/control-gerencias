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
  const { gerenciaActiva, setGerenciaActiva, gerencias, theme, toggleTheme } = useApp();

  const handleSelect = (id) => {
    setGerenciaActiva(id);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800 w-72 md:w-64 transition-colors duration-150">
      {/* Header Logo */}
      <div className="p-4 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight block">CreaciónEmpresa</span>
            <span className="text-[11px] text-slate-500 dark:text-gray-400 font-medium">Ingeniería Comercial</span>
          </div>
        </div>
        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
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
              : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800/80 font-medium'
          }`}
        >
          <LayoutDashboard size={18} className="shrink-0" />
          <span className="text-sm">Dashboard General</span>
          {gerenciaActiva === null && <ChevronRight size={16} className="ml-auto shrink-0" />}
        </button>

        <div className="pt-3 pb-1.5 px-3.5">
          <p className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
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
              className={`w-full flex flex-col gap-1.5 px-3.5 py-2.5 rounded-xl transition-all text-left min-h-[48px] ${
                isActive
                  ? `${colors.bg} ${colors.text} border ${colors.border} font-semibold shadow-sm`
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 w-full">
                <Icon size={16} className="shrink-0" />
                <span className="text-xs font-medium leading-tight flex-1 truncate">{g.nombre}</span>
                <span className={`text-xs font-bold shrink-0 ${isActive ? colors.text : 'text-slate-400 dark:text-gray-500'}`}>
                  {pct}%
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="h-1.5 bg-slate-200 dark:bg-gray-800 rounded-full w-full overflow-hidden">
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
      <div className="p-3 border-t border-slate-200 dark:border-gray-800 space-y-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-gray-800/80 dark:hover:bg-gray-800 text-slate-700 dark:text-gray-300 transition-colors text-xs font-medium min-h-[42px]"
          title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-indigo-600" />
            )}
            <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-gray-700">
            {theme === 'dark' ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* ROI Target Mini-Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-slate-100 dark:from-indigo-950/60 dark:to-gray-900 rounded-xl p-3 border border-indigo-100 dark:border-indigo-900/50 shadow-inner">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider">Meta ROI</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/30">≥ 60%</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-gray-400 leading-snug">Rentabilidad mínima exigida</p>
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
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
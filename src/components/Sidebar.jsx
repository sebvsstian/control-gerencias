import React from 'react';
import {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog, LayoutDashboard, ChevronRight, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLOR_MAP } from '../constants';
import { calcularPorcentaje, colorProgreso } from '../utils';

const ICON_MAP = {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog
};

export default function Sidebar({ tareas, mobileOpen, onCloseMobile }) {
  const { gerenciaActiva, setGerenciaActiva, gerencias } = useApp();

  const handleSelect = (id) => {
    setGerenciaActiva(id);
    if (onCloseMobile) onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800 w-72 md:w-64">
      {/* Header Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-900/40">
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-tight block">CreaciónEmpresa</span>
            <span className="text-[11px] text-gray-400 font-medium">Ingeniería Comercial</span>
          </div>
        </div>
        {/* Mobile close button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
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
              ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-900/30'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/80 font-medium'
          }`}
        >
          <LayoutDashboard size={18} className="shrink-0" />
          <span className="text-sm">Dashboard General</span>
          {gerenciaActiva === null && <ChevronRight size={16} className="ml-auto shrink-0" />}
        </button>

        <div className="pt-3 pb-1.5 px-3.5">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
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
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 w-full">
                <Icon size={16} className="shrink-0" />
                <span className="text-xs font-medium leading-tight flex-1 truncate">{g.nombre}</span>
                <span className={`text-xs font-bold shrink-0 ${isActive ? colors.text : 'text-gray-400'}`}>
                  {pct}%
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="h-1.5 bg-gray-800 rounded-full w-full overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${colorBar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Meta Footer Card */}
      <div className="p-3 border-t border-gray-800">
        <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 rounded-xl p-3 border border-indigo-900/50 shadow-inner">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-indigo-400 font-semibold uppercase tracking-wider">Meta ROI</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">≥ 60%</span>
          </div>
          <p className="text-xs text-gray-400 leading-snug">Rentabilidad mínima a inversionistas</p>
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900 shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
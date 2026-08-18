import React from 'react';
import {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog, LayoutDashboard, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLOR_MAP } from '../constants';
import { calcularPorcentaje, colorProgreso } from '../utils';

const ICON_MAP = {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog
};

export default function Sidebar({ tareas }) {
  const { gerenciaActiva, setGerenciaActiva, gerencias } = useApp();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm">CreacionEmpresa</span>
        </div>
        <p className="text-xs text-gray-500 pl-10">Ingenieria Comercial</p>
      </div>

      {/* Dashboard */}
      <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin">
        <button
          onClick={() => setGerenciaActiva(null)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all group ${
            gerenciaActiva === null
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">Dashboard General</span>
          {gerenciaActiva === null && <ChevronRight size={14} className="ml-auto" />}
        </button>

        <div className="mt-3 mb-2">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3">Gerencias</p>
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
              onClick={() => setGerenciaActiva(g.id)}
              className={`w-full flex flex-col gap-1 px-3 py-2.5 rounded-lg mb-1 transition-all ${
                isActive
                  ? `${colors.bg} ${colors.text} border ${colors.border}`
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={16} />
                <span className="text-xs font-medium text-left leading-tight line-clamp-2">{g.nombre}</span>
                <span className={`ml-auto text-xs font-bold ${isActive ? colors.text : 'text-gray-500'}`}>
                  {pct}%
                </span>
              </div>
              {/* Mini progress bar */}
              <div className="h-1 bg-gray-700 rounded-full w-full">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${colorBar}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Meta footer */}
      <div className="p-3 border-t border-gray-800">
        <div className="bg-indigo-950/50 rounded-lg p-3 border border-indigo-900/50">
          <p className="text-xs text-indigo-400 font-semibold">Meta ROI Inversionistas</p>
          <p className="text-lg font-bold text-white">60% <span className="text-xs text-indigo-400 font-normal">minimo</span></p>
        </div>
      </div>
    </aside>
  );
}

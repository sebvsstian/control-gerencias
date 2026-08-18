import React from 'react';
import {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog, Target, AlertTriangle,
  TrendingDown, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COLOR_MAP, META_ROI } from '../constants';
import { calcularPorcentaje, calcularPorcentajeGlobal, colorProgreso, estadoDeadline } from '../utils';

const ICON_MAP = {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog
};

function GerenciaCard({ gerencia, tareas, onVerDetalle }) {
  const Icon = ICON_MAP[gerencia.icono] || Building2;
  const colors = COLOR_MAP[gerencia.color];
  const pct = calcularPorcentaje(tareas, gerencia.id);
  const colorBar = colorProgreso(pct);
  const totalTareas = tareas.filter((t) => t.gerenciaId === gerencia.id);
  const completadas = totalTareas.filter((t) => t.completada).length;
  const tieneAtrasadas = totalTareas.some(
    (t) => !t.completada && estadoDeadline(t.fechaLimite, t.completada) === 'vencida'
  );

  return (
    <div className={`bg-gray-900/90 border rounded-2xl p-4 sm:p-5 transition-all hover:border-opacity-60 flex flex-col justify-between ${colors.border} border-opacity-30 shadow-sm`}>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${colors.bg}`}>
              <Icon size={20} className={colors.text} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white text-sm sm:text-base leading-tight truncate">{gerencia.nombre}</h3>
              {gerencia.responsable ? (
                <p className="text-xs text-gray-400 mt-0.5 truncate">{gerencia.responsable}</p>
              ) : (
                <p className="text-xs text-gray-500 italic mt-0.5">Sin asignar</p>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className={`text-2xl sm:text-3xl font-black ${pct >= 75 ? 'text-emerald-400' : pct >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {pct}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${colorBar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[11px] sm:text-xs text-gray-400">{completadas} de {totalTareas.length} tareas</span>
            {pct === 0 && totalTareas.length === 0 && (
              <span className="text-[11px] text-gray-500 italic">0 tareas creadas</span>
            )}
          </div>
        </div>

        {/* Alert */}
        {tieneAtrasadas && (
          <div className="flex items-center gap-2 bg-red-950/50 border border-red-900/60 rounded-xl px-3 py-2 mb-3">
            <AlertTriangle size={14} className="text-red-400 shrink-0" />
            <span className="text-xs text-red-300 font-medium">Tiene tareas atrasadas</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onVerDetalle(gerencia.id)}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${colors.bg} ${colors.text} hover:opacity-90 active:scale-[0.98]`}
      >
        <span>Ver Detalle / Gestionar</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default function Dashboard({ tareas }) {
  const { gerencias, setGerenciaActiva } = useApp();
  const pctGlobal = calcularPorcentajeGlobal(tareas);
  const totalTareas = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const atrasadas = tareas.filter((t) => estadoDeadline(t.fechaLimite, t.completada) === 'vencida').length;
  const colorBar = colorProgreso(pctGlobal);

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 max-w-7xl w-full mx-auto">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          Dashboard General
        </h1>
        <p className="text-gray-400 text-xs sm:text-sm mt-1">
          Mando Ejecutivo — Vista consolidada en tiempo real de todas las áreas
        </p>
      </div>

      {/* KPI Row (Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* Meta ROI Card (Spans 2 columns on larger screens) */}
        <div className="sm:col-span-2 bg-gradient-to-br from-indigo-900/70 via-indigo-950/80 to-gray-900 border border-indigo-700/50 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-950">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Meta Estratégica Corporativa</p>
              <h3 className="text-sm sm:text-base text-white font-semibold">Rentabilidad a Inversionistas</h3>
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-indigo-200 tracking-tight">≥ {META_ROI}%</span>
            <span className="text-xs sm:text-sm text-indigo-300 font-medium">ROI mínimo exigido</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-300 bg-indigo-950/60 rounded-lg px-2.5 py-1.5 border border-indigo-800/40">
            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
            <span>Objetivo financiero oficial del proyecto de Creación de Empresa</span>
          </div>
        </div>

        {/* Avance Global */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Avance Global</p>
          <div className="flex items-baseline justify-between mb-3">
            <span className={`text-3xl sm:text-4xl font-black ${pctGlobal >= 75 ? 'text-emerald-400' : pctGlobal >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {pctGlobal}%
            </span>
            <span className="text-xs text-gray-400">{completadas}/{totalTareas} tareas</span>
          </div>
          <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${colorBar}`}
              style={{ width: `${pctGlobal}%` }}
            />
          </div>
        </div>

        {/* Vencidas */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Tareas Atrasadas</p>
          <div className="flex items-center justify-between">
            <span className={`text-3xl sm:text-4xl font-black ${atrasadas > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {atrasadas}
            </span>
            {atrasadas > 0 ? (
              <div className="p-2 rounded-xl bg-red-950/60 border border-red-900/60">
                <TrendingDown size={22} className="text-red-400" />
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-900/60">
                <CheckCircle2 size={22} className="text-emerald-400" />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {atrasadas === 0 ? 'Sin tareas vencidas' : `${atrasadas} tareas requieren atención`}
          </p>
        </div>
      </div>

      {/* Matriz de Gerencias Section */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Matriz de Avance Gerencial</h2>
          <p className="text-xs sm:text-sm text-gray-400">Panel de control de las 9 gerencias corporativas</p>
        </div>
      </div>

      {/* Responsive Grid of 9 Gerencias: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {gerencias.map((g) => (
          <GerenciaCard
            key={g.id}
            gerencia={g}
            tareas={tareas}
            onVerDetalle={setGerenciaActiva}
          />
        ))}
      </div>
    </div>
  );
}
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

function GerenciaCard({ gerencia, tareas, onVerDetalle, isDarkMode }) {
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
    <div className={`border rounded-2xl p-4 sm:p-5 transition-all hover:shadow-md flex flex-col justify-between ${
      isDarkMode
        ? `bg-slate-800/90 border-slate-700/80 text-white ${colors.border}`
        : `bg-white border-slate-200 text-slate-800 shadow-xs ${colors.border}`
    }`}>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3 sm:mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${colors.iconBg}`}>
              <Icon size={20} className={colors.text} />
            </div>
            <div className="min-w-0">
              <h3 className={`font-bold text-sm sm:text-base leading-tight truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {gerencia.nombre}
              </h3>
              {gerencia.responsable ? (
                <p className={`text-xs mt-0.5 truncate font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {gerencia.responsable}
                </p>
              ) : (
                <p className={`text-xs italic mt-0.5 ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Sin asignar
                </p>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className={`text-2xl sm:text-3xl font-black ${
              pct >= 75
                ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
                : pct >= 40
                ? (isDarkMode ? 'text-yellow-400' : 'text-amber-600')
                : (isDarkMode ? 'text-red-400' : 'text-rose-600')
            }`}>
              {pct}%
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className={`h-2.5 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${colorBar}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <span className={`text-[11px] sm:text-xs font-medium ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {completadas} de {totalTareas.length} tareas
            </span>
            {pct === 0 && totalTareas.length === 0 && (
              <span className={`text-[11px] italic ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                0 tareas
              </span>
            )}
          </div>
        </div>

        {/* Alert for late tasks */}
        {tieneAtrasadas && (
          <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 mb-3 ${
            isDarkMode ? 'bg-red-950/50 border-red-900/60 text-red-300' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            <AlertTriangle size={14} className={isDarkMode ? 'text-red-400' : 'text-rose-600'} />
            <span className="text-xs font-medium">Tiene tareas atrasadas</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={() => onVerDetalle(gerencia.id)}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all min-h-[44px] ${colors.btn} active:scale-[0.98] border border-transparent shadow-xs`}
      >
        <span>Ver Detalle / Gestionar</span>
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default function Dashboard({ tareas }) {
  const { gerencias, setGerenciaActiva, isDarkMode } = useApp();
  const pctGlobal = calcularPorcentajeGlobal(tareas);
  const totalTareas = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const atrasadas = tareas.filter((t) => estadoDeadline(t.fechaLimite, t.completada) === 'vencida').length;
  const colorBar = colorProgreso(pctGlobal);

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 max-w-7xl w-full mx-auto">
      {/* Title */}
      <div className="mb-6">
        <h1 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          Dashboard General
        </h1>
        <p className={`text-xs sm:text-sm mt-1 ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Mando Ejecutivo — Vista consolidada en tiempo real de todas las áreas
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {/* Meta ROI Card */}
        <div className={`sm:col-span-2 border rounded-2xl p-4 sm:p-5 shadow-md relative overflow-hidden text-white ${
          isDarkMode
            ? 'bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border-indigo-700/50 shadow-indigo-950/40'
            : 'bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 border-indigo-500/30 shadow-indigo-600/15'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-xs">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] text-indigo-100 font-bold uppercase tracking-wider">Meta Estratégica Corporativa</p>
              <h3 className="text-sm sm:text-base text-white font-semibold">Rentabilidad a Inversionistas</h3>
            </div>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">≥ {META_ROI}%</span>
            <span className="text-xs sm:text-sm text-indigo-100 font-medium">ROI mínimo exigido</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-white/90 bg-black/20 rounded-lg px-2.5 py-1.5 border border-white/10">
            <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
            <span>Objetivo financiero oficial del proyecto de Creación de Empresa</span>
          </div>
        </div>

        {/* Avance Global */}
        <div className={`border rounded-2xl p-4 sm:p-5 shadow-xs ${
          isDarkMode ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}>
          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Avance Global
          </p>
          <div className="flex items-baseline justify-between mb-3">
            <span className={`text-3xl sm:text-4xl font-black ${
              pctGlobal >= 75
                ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
                : pctGlobal >= 40
                ? (isDarkMode ? 'text-yellow-400' : 'text-amber-600')
                : (isDarkMode ? 'text-red-400' : 'text-rose-600')
            }`}>
              {pctGlobal}%
            </span>
            <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {completadas}/{totalTareas} tareas
            </span>
          </div>
          <div className={`h-2.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
            <div
              className={`h-2.5 rounded-full transition-all duration-700 ${colorBar}`}
              style={{ width: `${pctGlobal}%` }}
            />
          </div>
        </div>

        {/* Vencidas */}
        <div className={`border rounded-2xl p-4 sm:p-5 shadow-xs ${
          isDarkMode ? 'bg-slate-800/90 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xs'
        }`}>
          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Tareas Atrasadas
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-3xl sm:text-4xl font-black ${
              atrasadas > 0
                ? (isDarkMode ? 'text-red-400' : 'text-rose-600')
                : (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
            }`}>
              {atrasadas}
            </span>
            {atrasadas > 0 ? (
              <div className={`p-2 rounded-xl border ${
                isDarkMode ? 'bg-red-950/60 border-red-900/60 text-red-400' : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}>
                <TrendingDown size={22} />
              </div>
            ) : (
              <div className={`p-2 rounded-xl border ${
                isDarkMode ? 'bg-emerald-950/60 border-emerald-900/60 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <CheckCircle2 size={22} />
              </div>
            )}
          </div>
          <p className={`text-xs mt-2 font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {atrasadas === 0 ? 'Sin tareas vencidas' : `${atrasadas} requieren atención`}
          </p>
        </div>
      </div>

      {/* Matriz de Gerencias Section */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className={`text-lg sm:text-xl font-bold tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Matriz de Avance Gerencial
          </h2>
          <p className={`text-xs sm:text-sm ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Panel de control de las 9 gerencias corporativas
          </p>
        </div>
      </div>

      {/* Responsive Grid of 9 Gerencias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {gerencias.map((g) => (
          <GerenciaCard
            key={g.id}
            gerencia={g}
            tareas={tareas}
            onVerDetalle={setGerenciaActiva}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </div>
  );
}
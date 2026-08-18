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
    <div className={`bg-gray-900 border rounded-xl p-5 transition-all hover:border-opacity-60 ${colors.border} border-opacity-30`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
            <Icon size={20} className={colors.text} />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight">{gerencia.nombre}</h3>
            {gerencia.responsable ? (
              <p className="text-xs text-gray-400 mt-0.5">{gerencia.responsable}</p>
            ) : (
              <p className="text-xs text-gray-600 italic mt-0.5">Sin asignar</p>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${pct >= 75 ? 'text-emerald-400' : pct >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
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
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{completadas}/{totalTareas.length} tareas</span>
          {pct === 0 && totalTareas.length === 0 && (
            <span className="text-xs text-gray-600 italic">Sin tareas</span>
          )}
        </div>
      </div>

      {/* Alert */}
      {tieneAtrasadas && (
        <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-900/50 rounded-lg px-2.5 py-1.5 mb-3">
          <AlertTriangle size={13} className="text-red-400 shrink-0" />
          <span className="text-xs text-red-400">Tiene tareas vencidas</span>
        </div>
      )}

      {/* Action */}
      <button
        onClick={() => onVerDetalle(gerencia.id)}
        className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${colors.bg} ${colors.text} hover:opacity-80`}
      >
        Ver Detalle / Gestionar
        <ArrowRight size={13} />
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
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard General</h1>
        <p className="text-gray-400 text-sm mt-1">Mando Ejecutivo - Vista consolidada del proyecto</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {/* Meta ROI */}
        <div className="col-span-2 bg-gradient-to-br from-indigo-900/60 to-indigo-950/80 border border-indigo-700/40 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wide">Meta Corporativa</p>
              <p className="text-sm text-white font-medium">Rentabilidad a Inversionistas</p>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-indigo-300">{META_ROI}%</span>
            <span className="text-indigo-400 text-sm mb-1">ROI minimo requerido</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs text-gray-400">Objetivo financiero del proyecto universitario</span>
          </div>
        </div>

        {/* Avance Global */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Avance Global</p>
          <div className="flex items-end gap-2 mb-3">
            <span className={`text-4xl font-black ${pctGlobal >= 75 ? 'text-emerald-400' : pctGlobal >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {pctGlobal}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${colorBar}`}
              style={{ width: `${pctGlobal}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">{completadas} / {totalTareas} completadas</p>
        </div>

        {/* Vencidas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Tareas Vencidas</p>
          <div className="flex items-center gap-3">
            <span className={`text-4xl font-black ${atrasadas > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {atrasadas}
            </span>
            {atrasadas > 0 ? (
              <TrendingDown size={24} className="text-red-400" />
            ) : (
              <CheckCircle2 size={24} className="text-emerald-400" />
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {atrasadas === 0 ? 'Todo al dia' : `${atrasadas} sin completar a tiempo`}
          </p>
        </div>
      </div>

      {/* Matriz de Gerencias */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-white mb-1">Matriz de Avance Gerencial</h2>
        <p className="text-sm text-gray-500">Estado en tiempo real de las 9 gerencias</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

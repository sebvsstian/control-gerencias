import React, { useState } from 'react';
import {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog, Plus, Filter,
  AlertTriangle, CheckCircle2, ClipboardList, Pencil, Check
} from 'lucide-react';
import TareaCard from './TareaCard';
import ModalTarea from './ModalTarea';
import { useApp } from '../context/AppContext';
import { COLOR_MAP } from '../constants';
import { calcularPorcentaje, colorProgreso, estadoDeadline } from '../utils';

const ICON_MAP = {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog
};

const FILTROS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'completadas', label: 'Completadas' },
  { id: 'atrasadas', label: 'Atrasadas' },
];

export default function VistaGerencia({ gerencia, tareas, onAgregar, onToggle, onEditar, onEliminar }) {
  const { actualizarResponsable } = useApp();
  const [filtro, setFiltro] = useState('todas');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tareaEditando, setTareaEditando] = useState(null);
  const [editandoResponsable, setEditandoResponsable] = useState(false);
  const [nombreResponsable, setNombreResponsable] = useState(gerencia.responsable || '');

  const Icon = ICON_MAP[gerencia.icono] || Building2;
  const colors = COLOR_MAP[gerencia.color];
  const pct = calcularPorcentaje(tareas, gerencia.id);
  const colorBar = colorProgreso(pct);
  const tareasGerencia = tareas.filter((t) => t.gerenciaId === gerencia.id);

  const tareasFiltradas = tareasGerencia.filter((t) => {
    if (filtro === 'pendientes') return !t.completada;
    if (filtro === 'completadas') return t.completada;
    if (filtro === 'atrasadas') return estadoDeadline(t.fechaLimite, t.completada) === 'vencida';
    return true;
  });

  const atrasadas = tareasGerencia.filter(
    (t) => !t.completada && estadoDeadline(t.fechaLimite, t.completada) === 'vencida'
  ).length;

  const handleGuardar = async (datos) => {
    if (tareaEditando) {
      await onEditar(tareaEditando.id, datos);
    } else {
      await onAgregar({ ...datos, gerenciaId: gerencia.id });
    }
    setModalAbierto(false);
    setTareaEditando(null);
  };

  const handleEditarTarea = (tarea) => {
    setTareaEditando(tarea);
    setModalAbierto(true);
  };

  const handleGuardarResponsable = () => {
    actualizarResponsable(gerencia.id, nombreResponsable);
    setEditandoResponsable(false);
  };

  const completadas = tareasGerencia.filter((t) => t.completada).length;

  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 max-w-5xl w-full mx-auto">
      {/* Header Banner */}
      <div className={`bg-white dark:bg-gray-900 border rounded-2xl p-4 sm:p-6 mb-6 ${colors.border} shadow-sm transition-colors`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${colors.iconBg}`}>
              <Icon size={26} className={colors.text} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">{gerencia.nombre}</h1>
              
              {/* Responsable */}
              <div className="mt-1">
                {editandoResponsable ? (
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={nombreResponsable}
                      onChange={(e) => setNombreResponsable(e.target.value)}
                      className="bg-slate-50 dark:bg-gray-800 border border-slate-300 dark:border-gray-700 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 min-h-[36px]"
                      placeholder="Nombre del alumno responsable..."
                      onKeyDown={(e) => e.key === 'Enter' && handleGuardarResponsable()}
                      autoFocus
                    />
                    <button
                      onClick={handleGuardarResponsable}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 min-h-[36px]"
                    >
                      <Check size={14} /> Guardar
                    </button>
                    <button
                      onClick={() => setEditandoResponsable(false)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-gray-800 text-slate-600 dark:text-gray-400 text-xs hover:text-slate-900 dark:hover:text-white min-h-[36px]"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-medium">
                      {gerencia.responsable ? (
                        <strong className="text-slate-900 dark:text-white font-semibold">{gerencia.responsable}</strong>
                      ) : (
                        <span className="text-slate-400 dark:text-gray-500 italic">Responsable no asignado</span>
                      )}
                    </span>
                    <button
                      onClick={() => setEditandoResponsable(true)}
                      className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
                      title="Editar responsable"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{gerencia.descripcion}</p>
            </div>
          </div>

          {/* Progress metric */}
          <div className="flex items-center sm:flex-col sm:items-end justify-between border-t border-slate-100 dark:border-gray-800 sm:border-0 pt-3 sm:pt-0">
            <span className="text-xs text-slate-500 dark:text-gray-400 sm:hidden">Avance de área:</span>
            <div className="text-right">
              <span className={`text-3xl sm:text-4xl font-black ${pct >= 75 ? 'text-emerald-600 dark:text-emerald-400' : pct >= 40 ? 'text-amber-600 dark:text-yellow-400' : 'text-rose-600 dark:text-red-400'}`}>
                {pct}%
              </span>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400 font-medium">{completadas} de {tareasGerencia.length} completadas</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2.5 sm:h-3 bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${colorBar}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Alert for overdue tasks */}
        {atrasadas > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-rose-50 dark:bg-red-950/50 border border-rose-200 dark:border-red-900/60 rounded-xl px-3 py-2">
            <AlertTriangle size={15} className="text-rose-600 dark:text-red-400 shrink-0" />
            <span className="text-xs sm:text-sm text-rose-700 dark:text-red-300 font-medium">
              {atrasadas} tarea{atrasadas > 1 ? 's' : ''} vencida{atrasadas > 1 ? 's' : ''} pendiente{atrasadas > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Responsive Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl p-1 overflow-x-auto scrollbar-none shadow-xs">
          <Filter size={14} className="text-slate-400 dark:text-gray-400 ml-2 mr-1 shrink-0" />
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all min-h-[38px] flex items-center justify-center ${
                filtro === f.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800'
              }`}
            >
              <span>{f.label}</span>
              {f.id === 'atrasadas' && atrasadas > 0 && (
                <span className="ml-1.5 bg-rose-600 text-white text-[10px] rounded-full px-1.5 py-0.2">
                  {atrasadas}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Create Task Button */}
        <button
          onClick={() => { setTareaEditando(null); setModalAbierto(true); }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 min-h-[44px]"
        >
          <Plus size={18} />
          <span>+ Nueva Tarea</span>
        </button>
      </div>

      {/* Task List */}
      {tareasFiltradas.length === 0 ? (
        <div className="text-center py-14 sm:py-16 bg-white dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800/80 rounded-2xl p-6 shadow-xs">
          {tareasGerencia.length === 0 ? (
            <div>
              <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-gray-500">
                <ClipboardList size={32} />
              </div>
              <h3 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg mb-1">Sin tareas en esta gerencia</h3>
              <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm mb-5 max-w-md mx-auto">
                Agrega las metas y entregables para que el avance de esta área se calcule en tiempo real.
              </p>
              <button
                onClick={() => { setTareaEditando(null); setModalAbierto(true); }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md min-h-[44px]"
              >
                <Plus size={18} />
                <span>Agregar primera tarea para {gerencia.nombre}</span>
              </button>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1">No hay tareas con el filtro "{filtro}"</h3>
              <p className="text-slate-500 dark:text-gray-400 text-xs">Selecciona otro filtro para ver las demás tareas.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {tareasFiltradas.map((t) => (
            <TareaCard
              key={t.id}
              tarea={t}
              onToggle={onToggle}
              onEditar={handleEditarTarea}
              onEliminar={onEliminar}
            />
          ))}
        </div>
      )}

      {/* Modal Crear / Editar */}
      {modalAbierto && (
        <ModalTarea
          tarea={tareaEditando}
          gerenciaIdDefault={gerencia.id}
          onGuardar={handleGuardar}
          onCerrar={() => { setModalAbierto(false); setTareaEditando(null); }}
        />
      )}
    </div>
  );
}
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
  const { actualizarResponsable, isDarkMode } = useApp();
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

  // El modal se cierra solo antes de llamar a esta funcion (UI instantanea)
  // Aqui solo ejecutamos la escritura en Firestore y propagamos el error si falla
  const handleGuardar = async (datos) => {
    if (tareaEditando) {
      await onEditar(tareaEditando.id, datos);
    } else {
      await onAgregar({ ...datos, gerenciaId: gerencia.id });
    }
    // No cerramos aqui: el modal ya se cerro optimistamente antes de llamar onGuardar
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
      <div className={`border rounded-2xl p-4 sm:p-6 mb-6 shadow-xs transition-colors ${
        isDarkMode
          ? `bg-slate-800/90 border-slate-700/80 text-white ${colors.border}`
          : `bg-white border-slate-200 text-slate-900 ${colors.border}`
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${colors.iconBg}`}>
              <Icon size={26} className={colors.text} />
            </div>
            <div className="min-w-0">
              <h1 className={`text-lg sm:text-2xl font-bold leading-snug ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {gerencia.nombre}
              </h1>
              
              {/* Responsable */}
              <div className="mt-1">
                {editandoResponsable ? (
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={nombreResponsable}
                      onChange={(e) => setNombreResponsable(e.target.value)}
                      className={`border rounded-lg px-2.5 py-1.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 min-h-[36px] ${
                        isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
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
                      className={`px-2.5 py-1.5 rounded-lg text-xs min-h-[36px] ${
                        isDarkMode ? 'bg-slate-700 text-slate-300 hover:text-white' : 'bg-slate-200 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className={`text-xs sm:text-sm font-medium ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      {gerencia.responsable ? (
                        <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{gerencia.responsable}</strong>
                      ) : (
                        <span className={`italic ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Responsable no asignado</span>
                      )}
                    </span>
                    <button
                      onClick={() => setEditandoResponsable(true)}
                      className={`p-1 rounded-lg transition-colors ${
                        isDarkMode ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                      }`}
                      title="Editar responsable"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                )}
              </div>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{gerencia.descripcion}</p>
            </div>
          </div>

          {/* Progress metric */}
          <div className={`flex items-center sm:flex-col sm:items-end justify-between border-t sm:border-0 pt-3 sm:pt-0 ${
            isDarkMode ? 'border-slate-700' : 'border-slate-100'
          }`}>
            <span className={`text-xs sm:hidden ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Avance de área:</span>
            <div className="text-right">
              <span className={`text-3xl sm:text-4xl font-black ${
                pct >= 75
                  ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600')
                  : pct >= 40
                  ? (isDarkMode ? 'text-yellow-400' : 'text-amber-600')
                  : (isDarkMode ? 'text-red-400' : 'text-rose-600')
              }`}>
                {pct}%
              </span>
              <p className={`text-[11px] sm:text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {completadas} de {tareasGerencia.length} completadas
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className={`mt-4 h-2.5 sm:h-3 rounded-full overflow-hidden ${
          isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
        }`}>
          <div
            className={`h-full rounded-full transition-all duration-700 ${colorBar}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Alert for overdue tasks */}
        {atrasadas > 0 && (
          <div className={`mt-3 flex items-center gap-2 border rounded-xl px-3 py-2 ${
            isDarkMode ? 'bg-red-950/50 border-red-900/60 text-red-300' : 'bg-rose-50 border-rose-200 text-rose-700'
          }`}>
            <AlertTriangle size={15} className={isDarkMode ? 'text-red-400' : 'text-rose-600'} />
            <span className="text-xs sm:text-sm font-medium">
              {atrasadas} tarea{atrasadas > 1 ? 's' : ''} vencida{atrasadas > 1 ? 's' : ''} pendiente{atrasadas > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Responsive Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Filter Pills */}
        <div className={`flex items-center gap-1 border rounded-xl p-1 overflow-x-auto scrollbar-none shadow-xs ${
          isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <Filter size={14} className="ml-2 mr-1 shrink-0 text-slate-400" />
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all min-h-[38px] flex items-center justify-center ${
                filtro === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : (isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
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
        <div className={`text-center py-14 sm:py-16 border rounded-2xl p-6 shadow-xs ${
          isDarkMode ? 'bg-slate-800/50 border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          {tareasGerencia.length === 0 ? (
            <div>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-400'
              }`}>
                <ClipboardList size={32} />
              </div>
              <h3 className={`font-bold text-base sm:text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Sin tareas en esta gerencia
              </h3>
              <p className={`text-xs sm:text-sm mb-5 max-w-md mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
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
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border ${
                isDarkMode ? 'bg-emerald-950/60 border-emerald-900/60 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}>
                <CheckCircle2 size={32} />
              </div>
              <h3 className={`font-bold text-base mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                No hay tareas con el filtro "{filtro}"
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Selecciona otro filtro para ver las demás tareas.
              </p>
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
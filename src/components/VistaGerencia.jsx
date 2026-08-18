import React, { useState } from 'react';
import {
  Building2, DollarSign, Users, TrendingUp, MessageSquare,
  MessageCircle, Megaphone, Settings, Cog, Plus, Filter,
  AlertTriangle, CheckCircle2, ClipboardList, Pencil
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
    (t) => estadoDeadline(t.fechaLimite, t.completada) === 'vencida'
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
    <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
      {/* Header */}
      <div className={`bg-gray-900 border rounded-2xl p-6 mb-6 ${colors.border} border-opacity-40`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors.bg}`}>
              <Icon size={28} className={colors.text} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{gerencia.nombre}</h1>
              {editandoResponsable ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={nombreResponsable}
                    onChange={(e) => setNombreResponsable(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-indigo-500"
                    placeholder="Nombre del responsable..."
                    onKeyDown={(e) => e.key === 'Enter' && handleGuardarResponsable()}
                    autoFocus
                  />
                  <button onClick={handleGuardarResponsable} className="text-xs text-indigo-400 hover:text-indigo-300">Guardar</button>
                  <button onClick={() => setEditandoResponsable(false)} className="text-xs text-gray-500 hover:text-gray-400">Cancelar</button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-sm">
                    {gerencia.responsable || <span className="text-gray-600 italic">Sin responsable</span>}
                  </span>
                  <button onClick={() => setEditandoResponsable(true)} className="text-gray-600 hover:text-indigo-400 transition-colors">
                    <Pencil size={12} />
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-0.5">{gerencia.descripcion}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="text-right shrink-0">
            <span className={`text-4xl font-black ${pct >= 75 ? 'text-emerald-400' : pct >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {pct}%
            </span>
            <p className="text-xs text-gray-500 mt-1">{completadas}/{tareasGerencia.length} tareas</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-3 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-700 ${colorBar}`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Alert */}
        {atrasadas > 0 && (
          <div className="mt-3 flex items-center gap-2 bg-red-950/40 border border-red-900/40 rounded-lg px-3 py-2">
            <AlertTriangle size={14} className="text-red-400 shrink-0" />
            <span className="text-sm text-red-400">
              {atrasadas} tarea{atrasadas > 1 ? 's' : ''} vencida{atrasadas > 1 ? 's' : ''} sin completar
            </span>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        {/* Filtros */}
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
          <Filter size={13} className="text-gray-500 ml-2 mr-1" />
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filtro === f.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {f.label}
              {f.id === 'atrasadas' && atrasadas > 0 && (
                <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-1">{atrasadas}</span>
              )}
            </button>
          ))}
        </div>

        {/* Boton nueva tarea */}
        <button
          onClick={() => { setTareaEditando(null); setModalAbierto(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-900/30"
        >
          <Plus size={16} />
          Nueva Tarea para {gerencia.nombre.split(' ')[0]}
        </button>
      </div>

      {/* Lista de tareas */}
      {tareasFiltradas.length === 0 ? (
        <div className="text-center py-16">
          {tareasGerencia.length === 0 ? (
            <div>
              <ClipboardList size={48} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-400 font-semibold mb-2">Sin tareas en esta gerencia</p>
              <p className="text-gray-600 text-sm mb-5">Agrega la primera tarea para comenzar a trackear el progreso.</p>
              <button
                onClick={() => { setTareaEditando(null); setModalAbierto(true); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Plus size={16} />
                Agregar primera tarea para {gerencia.nombre}
              </button>
            </div>
          ) : (
            <div>
              <CheckCircle2 size={48} className="text-emerald-700 mx-auto mb-4" />
              <p className="text-gray-400 font-semibold">No hay tareas en este filtro</p>
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

      {/* Modal */}
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

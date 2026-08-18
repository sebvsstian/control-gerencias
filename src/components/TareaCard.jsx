import React, { useState } from 'react';
import { Check, Calendar, User, Pencil, Trash2, AlertTriangle, Clock } from 'lucide-react';
import Comentarios from './Comentarios';
import { estadoDeadline, diasRestantes, formatearFecha } from '../utils';
import { useApp } from '../context/AppContext';

function DeadlineBadge({ fechaLimite, completada, isDarkMode }) {
  if (!fechaLimite) return null;
  const estado = estadoDeadline(fechaLimite, completada);
  const dias = diasRestantes(fechaLimite);

  if (completada) {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${
        isDarkMode ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800/40' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
      }`}>
        <Check size={11} />
        Completada
      </span>
    );
  }

  if (estado === 'vencida') {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border animate-blink ${
        isDarkMode ? 'bg-red-900/60 text-red-300 border-red-800/60' : 'bg-rose-100 text-rose-700 border-rose-300'
      }`}>
        <AlertTriangle size={11} />
        Vencida: {formatearFecha(fechaLimite)}
      </span>
    );
  }

  if (estado === 'hoy') {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
        isDarkMode ? 'bg-orange-900/50 text-orange-300 border-orange-800/50' : 'bg-amber-100 text-amber-800 border-amber-300'
      }`}>
        <Clock size={11} />
        Vence HOY
      </span>
    );
  }

  if (estado === 'proxima') {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border ${
        isDarkMode ? 'bg-yellow-900/40 text-yellow-300 border-yellow-800/40' : 'bg-yellow-50 text-yellow-800 border-yellow-200'
      }`}>
        <Calendar size={11} />
        En {dias} días
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${
      isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-slate-100 text-slate-600 border-slate-200'
    }`}>
      <Calendar size={11} />
      {formatearFecha(fechaLimite)}
    </span>
  );
}

export default function TareaCard({ tarea, onToggle, onEditar, onEliminar }) {
  const { isDarkMode } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`border rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
      tarea.completada
        ? (isDarkMode ? 'bg-slate-800/40 border-slate-800 opacity-70' : 'bg-slate-50 border-slate-200 opacity-75')
        : (isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600 text-white' : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs')
    }`}>
      <div className="flex items-start gap-3.5">
        {/* Checkbox Touch Target */}
        <button
          type="button"
          onClick={() => onToggle(tarea.id, tarea.completada)}
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            tarea.completada
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : (isDarkMode ? 'border-slate-600 hover:border-indigo-400 bg-slate-700' : 'border-slate-300 hover:border-indigo-600 bg-white')
          }`}
          aria-label={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {tarea.completada && <Check size={14} className="stroke-[3]" />}
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className={`font-bold text-sm sm:text-base leading-snug break-words ${
              tarea.completada
                ? (isDarkMode ? 'line-through text-slate-500 font-medium' : 'line-through text-slate-400 font-medium')
                : (isDarkMode ? 'text-white' : 'text-slate-900')
            }`}>
              {tarea.titulo}
            </h4>

            {/* Actions for Task */}
            <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
              <button
                onClick={() => onEditar(tarea)}
                className={`p-2 rounded-xl active:scale-95 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${
                  isDarkMode ? 'text-slate-400 hover:text-indigo-400 hover:bg-slate-700' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                }`}
                aria-label="Editar tarea"
              >
                <Pencil size={15} />
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEliminar(tarea.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-colors min-h-[36px]"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[36px] ${
                      isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className={`p-2 rounded-xl active:scale-95 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center ${
                    isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-slate-700' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                  }`}
                  aria-label="Eliminar tarea"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {tarea.descripcion && (
            <p className={`text-xs sm:text-sm mb-3 leading-relaxed break-words ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {tarea.descripcion}
            </p>
          )}

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {tarea.responsable && (
              <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${
                isDarkMode ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                <User size={12} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
                <span>{tarea.responsable}</span>
              </span>
            )}
            <DeadlineBadge fechaLimite={tarea.fechaLimite} completada={tarea.completada} isDarkMode={isDarkMode} />
          </div>

          {/* Comments Accordion */}
          <Comentarios tareaId={tarea.id} />
        </div>
      </div>
    </div>
  );
}
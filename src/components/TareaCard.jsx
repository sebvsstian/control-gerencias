import React, { useState } from 'react';
import { Check, Calendar, User, Pencil, Trash2, AlertTriangle, Clock } from 'lucide-react';
import Comentarios from './Comentarios';
import { estadoDeadline, diasRestantes, formatearFecha } from '../utils';

function DeadlineBadge({ fechaLimite, completada }) {
  if (!fechaLimite) return null;
  const estado = estadoDeadline(fechaLimite, completada);
  const dias = diasRestantes(fechaLimite);

  if (completada) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
        <Check size={11} />
        Completada
      </span>
    );
  }

  if (estado === 'vencida') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 dark:bg-red-900/60 text-rose-700 dark:text-red-300 px-2.5 py-1 rounded-full border border-rose-300 dark:border-red-800/60 animate-blink">
        <AlertTriangle size={11} />
        Vencida: {formatearFecha(fechaLimite)}
      </span>
    );
  }

  if (estado === 'hoy') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 dark:bg-orange-900/50 text-amber-800 dark:text-orange-300 px-2.5 py-1 rounded-full border border-amber-300 dark:border-orange-800/50">
        <Clock size={11} />
        Vence HOY
      </span>
    );
  }

  if (estado === 'proxima') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-yellow-50 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 px-2.5 py-1 rounded-full border border-yellow-200 dark:border-yellow-800/40">
        <Calendar size={11} />
        En {dias} días
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-gray-800/80 px-2.5 py-1 rounded-full border border-slate-200 dark:border-gray-700">
      <Calendar size={11} />
      {formatearFecha(fechaLimite)}
    </span>
  );
}

export default function TareaCard({ tarea, onToggle, onEditar, onEliminar }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-900 border rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
      tarea.completada
        ? 'border-slate-200 dark:border-gray-800/80 bg-slate-50/70 dark:bg-gray-900/50 opacity-75'
        : 'border-slate-200 dark:border-gray-800 hover:border-slate-300 dark:hover:border-gray-700 hover:shadow-sm'
    }`}>
      <div className="flex items-start gap-3.5">
        {/* Checkbox Touch Target */}
        <button
          type="button"
          onClick={() => onToggle(tarea.id, tarea.completada)}
          className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            tarea.completada
              ? 'bg-emerald-600 border-emerald-600 shadow-sm text-white'
              : 'border-slate-300 dark:border-gray-600 hover:border-indigo-600 dark:hover:border-indigo-500 bg-white dark:bg-gray-800 active:scale-90'
          }`}
          aria-label={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {tarea.completada && <Check size={14} className="stroke-[3]" />}
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className={`font-bold text-sm sm:text-base leading-snug break-words ${
              tarea.completada ? 'line-through text-slate-400 dark:text-gray-500 font-medium' : 'text-slate-900 dark:text-white'
            }`}>
              {tarea.titulo}
            </h4>

            {/* Actions for Task */}
            <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
              <button
                onClick={() => onEditar(tarea)}
                className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-indigo-950/40 active:scale-95 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
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
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-gray-700 transition-colors min-h-[36px]"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-red-950/40 active:scale-95 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                  aria-label="Eliminar tarea"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {tarea.descripcion && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-400 mb-3 leading-relaxed break-words font-normal">
              {tarea.descripcion}
            </p>
          )}

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {tarea.responsable && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 dark:text-gray-300 bg-slate-100 dark:bg-gray-800/60 px-2.5 py-1 rounded-full border border-slate-200 dark:border-gray-700/60 font-medium">
                <User size={12} className="text-indigo-600 dark:text-indigo-400" />
                <span>{tarea.responsable}</span>
              </span>
            )}
            <DeadlineBadge fechaLimite={tarea.fechaLimite} completada={tarea.completada} />
          </div>

          {/* Comments Accordion */}
          <Comentarios tareaId={tarea.id} />
        </div>
      </div>
    </div>
  );
}
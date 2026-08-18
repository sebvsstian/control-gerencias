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
      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-900/40 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-800/40">
        <Check size={11} />
        Completada
      </span>
    );
  }

  if (estado === 'vencida') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-red-900/60 text-red-300 px-2.5 py-1 rounded-full border border-red-800/60 animate-blink">
        <AlertTriangle size={11} />
        Vencida: {formatearFecha(fechaLimite)}
      </span>
    );
  }

  if (estado === 'hoy') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-orange-900/50 text-orange-300 px-2.5 py-1 rounded-full border border-orange-800/50">
        <Clock size={11} />
        Vence HOY
      </span>
    );
  }

  if (estado === 'proxima') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-yellow-900/40 text-yellow-300 px-2.5 py-1 rounded-full border border-yellow-800/40">
        <Calendar size={11} />
        En {dias} días
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded-full border border-gray-700">
      <Calendar size={11} />
      {formatearFecha(fechaLimite)}
    </span>
  );
}

export default function TareaCard({ tarea, onToggle, onEditar, onEliminar }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`bg-gray-900 border rounded-2xl p-4 sm:p-5 transition-all shadow-sm ${
      tarea.completada ? 'border-gray-800/80 bg-gray-900/50 opacity-75' : 'border-gray-800 hover:border-gray-700'
    }`}>
      <div className="flex items-start gap-3.5">
        {/* Checkbox Touch Target */}
        <button
          type="button"
          onClick={() => onToggle(tarea.id, tarea.completada)}
          className={`mt-0.5 w-6 h-6 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
            tarea.completada
              ? 'bg-emerald-600 border-emerald-600 shadow-sm'
              : 'border-gray-600 hover:border-indigo-500 active:scale-90'
          }`}
          aria-label={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          {tarea.completada && <Check size={14} className="text-white stroke-[3]" />}
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h4 className={`font-semibold text-sm sm:text-base leading-snug break-words ${
              tarea.completada ? 'line-through text-gray-500' : 'text-white'
            }`}>
              {tarea.titulo}
            </h4>

            {/* Actions for Task */}
            <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
              <button
                onClick={() => onEditar(tarea)}
                className="p-2 rounded-xl text-gray-400 hover:text-indigo-400 hover:bg-indigo-950/40 active:scale-95 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                aria-label="Editar tarea"
              >
                <Pencil size={15} />
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onEliminar(tarea.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-red-700 hover:bg-red-600 text-white font-semibold transition-colors min-h-[36px]"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1.5 rounded-lg text-xs bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors min-h-[36px]"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-950/40 active:scale-95 transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
                  aria-label="Eliminar tarea"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>

          {tarea.descripcion && (
            <p className="text-xs sm:text-sm text-gray-400 mb-3 leading-relaxed break-words">
              {tarea.descripcion}
            </p>
          )}

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {tarea.responsable && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-300 bg-gray-800/60 px-2.5 py-1 rounded-full border border-gray-700/60">
                <User size={12} className="text-indigo-400" />
                <span className="font-medium">{tarea.responsable}</span>
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
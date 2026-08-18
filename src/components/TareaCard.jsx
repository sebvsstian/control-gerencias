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
      <span className="inline-flex items-center gap-1 text-xs bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-800/40">
        <Check size={10} />
        Completada
      </span>
    );
  }

  if (estado === 'vencida') {
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded-full border border-red-800/50 animate-blink">
        <AlertTriangle size={10} />
        Vencida: {formatearFecha(fechaLimite)}
      </span>
    );
  }

  if (estado === 'hoy') {
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-orange-900/50 text-orange-400 px-2 py-0.5 rounded-full border border-orange-800/50">
        <Clock size={10} />
        Vence HOY
      </span>
    );
  }

  if (estado === 'proxima') {
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-yellow-900/40 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-800/40">
        <Calendar size={10} />
        En {dias} dias
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">
      <Calendar size={10} />
      {formatearFecha(fechaLimite)}
    </span>
  );
}

export default function TareaCard({ tarea, onToggle, onEditar, onEliminar }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className={`bg-gray-900 border rounded-xl p-4 transition-all ${
      tarea.completada ? 'border-gray-800 opacity-70' : 'border-gray-800 hover:border-gray-700'
    }`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(tarea.id, tarea.completada)}
          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
            tarea.completada
              ? 'bg-emerald-600 border-emerald-600'
              : 'border-gray-600 hover:border-indigo-500'
          }`}
        >
          {tarea.completada && <Check size={12} className="text-white" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className={`font-semibold text-sm leading-snug ${tarea.completada ? 'line-through text-gray-500' : 'text-white'}`}>
              {tarea.titulo}
            </h4>
            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEditar(tarea)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-950/40 transition-colors"
              >
                <Pencil size={13} />
              </button>
              {confirmDelete ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEliminar(tarea.id)}
                    className="px-2 py-1 rounded text-xs bg-red-700 text-white hover:bg-red-600 transition-colors"
                  >Confirmar</button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                  >Cancel</button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {tarea.descripcion && (
            <p className="text-xs text-gray-400 mb-2 leading-relaxed">{tarea.descripcion}</p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            {tarea.responsable && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <User size={10} />
                {tarea.responsable}
              </span>
            )}
            <DeadlineBadge fechaLimite={tarea.fechaLimite} completada={tarea.completada} />
          </div>

          {/* Comentarios */}
          <Comentarios tareaId={tarea.id} />
        </div>
      </div>
    </div>
  );
}

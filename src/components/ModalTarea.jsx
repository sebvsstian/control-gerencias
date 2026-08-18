import React, { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, AlignLeft, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ModalTarea({ tarea, gerenciaIdDefault, onGuardar, onCerrar }) {
  const { gerencias, isDarkMode } = useApp();
  const [form, setForm] = useState({
    gerenciaId: gerenciaIdDefault || '',
    titulo: '',
    descripcion: '',
    responsable: '',
    fechaLimite: '',
  });

  useEffect(() => {
    if (tarea) {
      setForm({
        gerenciaId: tarea.gerenciaId || gerenciaIdDefault || '',
        titulo: tarea.titulo || '',
        descripcion: tarea.descripcion || '',
        responsable: tarea.responsable || '',
        fechaLimite: tarea.fechaLimite || '',
      });
    }
  }, [tarea, gerenciaIdDefault]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.gerenciaId) return;
    onGuardar(form);
  };

  const inputClass = `w-full border rounded-xl px-3.5 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors min-h-[44px] ${
    isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
  }`;
  const labelClass = `block text-xs font-bold mb-1.5 uppercase tracking-wider ${
    isDarkMode ? 'text-slate-300' : 'text-slate-700'
  }`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`border rounded-2xl w-full max-w-lg shadow-2xl my-auto animate-in zoom-in-95 duration-150 transition-colors ${
        isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${
          isDarkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <h2 className="font-bold text-base sm:text-lg">
            {tarea ? 'Editar Tarea' : 'Nueva Tarea Gerencial'}
          </h2>
          <button
            onClick={onCerrar}
            className={`transition-colors p-2 rounded-xl min-h-[40px] min-w-[40px] flex items-center justify-center ${
              isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Gerencia */}
          <div>
            <label className={labelClass}>
              <Building2 size={13} className="inline mr-1.5 text-indigo-500" />Gerencia
            </label>
            <select
              className={inputClass}
              value={form.gerenciaId}
              onChange={(e) => setForm({ ...form, gerenciaId: e.target.value })}
              required
            >
              <option value="">Seleccionar gerencia...</option>
              {gerencias.map((g) => (
                <option key={g.id} value={g.id} className={isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}>
                  {g.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Titulo */}
          <div>
            <label className={labelClass}>
              <FileText size={13} className="inline mr-1.5 text-indigo-500" />Título de la Tarea
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Ej: Elaborar proyección financiera Q1 para inversionistas..."
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </div>

          {/* Descripcion */}
          <div>
            <label className={labelClass}>
              <AlignLeft size={13} className="inline mr-1.5 text-indigo-500" />Descripción / Entregable
            </label>
            <textarea
              className={`${inputClass} resize-none h-24`}
              placeholder="Detalle del alcance o entregable esperado..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          {/* Responsable */}
          <div>
            <label className={labelClass}>
              <User size={13} className="inline mr-1.5 text-indigo-500" />Persona Responsable
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Nombre del alumno responsable..."
              value={form.responsable}
              onChange={(e) => setForm({ ...form, responsable: e.target.value })}
            />
          </div>

          {/* Fecha Limite */}
          <div>
            <label className={labelClass}>
              <Calendar size={13} className="inline mr-1.5 text-indigo-500" />Fecha Límite (Deadline)
            </label>
            <input
              type="date"
              className={inputClass}
              value={form.fechaLimite}
              onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-3">
            <button
              type="button"
              onClick={onCerrar}
              className={`w-full sm:flex-1 py-3 rounded-xl border text-sm font-semibold transition-colors min-h-[44px] ${
                isDarkMode ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/30 min-h-[44px]"
            >
              {tarea ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
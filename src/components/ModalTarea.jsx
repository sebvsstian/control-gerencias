import React, { useState, useEffect } from 'react';
import { X, Calendar, User, FileText, AlignLeft, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ModalTarea({ tarea, gerenciaIdDefault, onGuardar, onCerrar }) {
  const { gerencias } = useApp();
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
  }, [tarea]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.gerenciaId) return;
    onGuardar(form);
  };

  const inputClass = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors';
  const labelClass = 'block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-bold text-white text-lg">
            {tarea ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button onClick={onCerrar} className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Gerencia */}
          <div>
            <label className={labelClass}>
              <Building2 size={12} className="inline mr-1" />Gerencia
            </label>
            <select
              className={inputClass}
              value={form.gerenciaId}
              onChange={(e) => setForm({ ...form, gerenciaId: e.target.value })}
              required
            >
              <option value="">Seleccionar gerencia...</option>
              {gerencias.map((g) => (
                <option key={g.id} value={g.id}>{g.nombre}</option>
              ))}
            </select>
          </div>

          {/* Titulo */}
          <div>
            <label className={labelClass}>
              <FileText size={12} className="inline mr-1" />Titulo de la Tarea
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Ej: Elaborar presupuesto Q1..."
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
          </div>

          {/* Descripcion */}
          <div>
            <label className={labelClass}>
              <AlignLeft size={12} className="inline mr-1" />Descripcion / Entregable Esperado
            </label>
            <textarea
              className={`${inputClass} resize-none h-20`}
              placeholder="Describe brevemente el entregable o alcance..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          {/* Responsable */}
          <div>
            <label className={labelClass}>
              <User size={12} className="inline mr-1" />Persona Responsable
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
              <Calendar size={12} className="inline mr-1" />Fecha Limite
            </label>
            <input
              type="date"
              className={inputClass}
              value={form.fechaLimite}
              onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-400 text-sm hover:text-white hover:border-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors"
            >
              {tarea ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

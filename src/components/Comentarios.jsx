import React, { useState } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp, Loader2, User } from 'lucide-react';
import { useComentarios } from '../hooks/useComentarios';
import { formatearFecha } from '../utils';

export default function Comentarios({ tareaId }) {
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState('');
  const [autor, setAutor] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { comentarios, loading, agregarComentario } = useComentarios(abierto ? tareaId : null);

  const handleEnviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    setEnviando(true);
    try {
      await agregarComentario(tareaId, texto.trim(), autor.trim() || 'Compañero');
      setTexto('');
    } catch (err) {
      console.error(err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="border-t border-gray-800/80 mt-3 pt-3">
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors py-1 min-h-[32px]"
      >
        <MessageSquare size={13} className="text-indigo-400" />
        <span>Comentarios u observaciones {comentarios.length > 0 && abierto ? `(${comentarios.length})` : ''}</span>
        {abierto ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {abierto && (
        <div className="mt-3 space-y-3 animate-in fade-in-50 duration-150">
          {/* Comments List */}
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400 py-2">
              <Loader2 size={13} className="animate-spin text-indigo-400" />
              <span className="text-xs">Sincronizando comentarios en tiempo real...</span>
            </div>
          ) : comentarios.length === 0 ? (
            <p className="text-xs text-gray-500 italic py-1">Sin comentarios aún. Escribe el primero.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1">
              {comentarios.map((c) => (
                <div key={c.id} className="bg-gray-800/80 border border-gray-700/50 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 bg-indigo-900/80 text-indigo-300 rounded-full flex items-center justify-center text-[10px]">
                        <User size={10} />
                      </div>
                      <span className="text-xs font-bold text-indigo-300">{c.autor}</span>
                    </div>
                    <span className="text-[10px] text-gray-400">{formatearFecha(c.creadoEn)}</span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed break-words pl-5">{c.texto}</p>
                </div>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEnviar} className="flex flex-col gap-2 pt-1">
            <input
              type="text"
              className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 min-h-[38px]"
              placeholder="Tu nombre o cargo (ej: Gerente General)..."
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 min-h-[40px]"
                placeholder="Escribe una observación sobre esta tarea..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <button
                type="submit"
                disabled={enviando || !texto.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center min-h-[40px] shrink-0"
                aria-label="Enviar comentario"
              >
                {enviando ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
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
    await agregarComentario(tareaId, texto.trim(), autor.trim() || 'Anonimo');
    setTexto('');
    setEnviando(false);
  };

  return (
    <div className="border-t border-gray-800 mt-3 pt-3">
      <button
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
      >
        <MessageSquare size={13} />
        <span>Comentarios {comentarios.length > 0 && !loading && abierto ? `(${comentarios.length})` : ''}</span>
        {abierto ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {abierto && (
        <div className="mt-3 space-y-3">
          {/* Lista de comentarios */}
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={13} className="animate-spin" />
              <span className="text-xs">Cargando...</span>
            </div>
          ) : comentarios.length === 0 ? (
            <p className="text-xs text-gray-600 italic">Sin comentarios aun.</p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
              {comentarios.map((c) => (
                <div key={c.id} className="bg-gray-800/60 rounded-lg p-2.5">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-indigo-400">{c.autor}</span>
                    <span className="text-xs text-gray-600">{formatearFecha(c.creadoEn)}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{c.texto}</p>
                </div>
              ))}
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleEnviar} className="flex flex-col gap-2">
            <input
              type="text"
              className="bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
              placeholder="Tu nombre (opcional)..."
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                placeholder="Escribe un comentario u observacion..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <button
                type="submit"
                disabled={enviando || !texto.trim()}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition-colors flex items-center gap-1"
              >
                {enviando ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

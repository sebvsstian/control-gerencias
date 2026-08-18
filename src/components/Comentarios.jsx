import React, { useState } from 'react';
import { MessageSquare, Send, ChevronDown, ChevronUp, Loader2, User } from 'lucide-react';
import { useComentarios } from '../hooks/useComentarios';
import { formatearFecha } from '../utils';
import { useApp } from '../context/AppContext';

export default function Comentarios({ tareaId }) {
  const { isDarkMode } = useApp();
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
    <div className={`border-t mt-3 pt-3 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
      <button
        onClick={() => setAbierto(!abierto)}
        className={`flex items-center gap-2 text-xs font-semibold transition-colors py-1 min-h-[32px] ${
          isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'
        }`}
      >
        <MessageSquare size={13} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
        <span>Comentarios u observaciones {comentarios.length > 0 && abierto ? `(${comentarios.length})` : ''}</span>
        {abierto ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {abierto && (
        <div className="mt-3 space-y-3 animate-in fade-in-50 duration-150">
          {/* Comments List */}
          {loading ? (
            <div className={`flex items-center gap-2 py-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <Loader2 size={13} className="animate-spin text-indigo-500" />
              <span className="text-xs">Sincronizando comentarios en tiempo real...</span>
            </div>
          ) : comentarios.length === 0 ? (
            <p className={`text-xs italic py-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Sin comentarios aún. Escribe el primero.
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1">
              {comentarios.map((c) => (
                <div key={c.id} className={`border rounded-xl p-3 ${
                  isDarkMode ? 'bg-slate-700/70 border-slate-600/60 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isDarkMode ? 'bg-indigo-900/80 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        <User size={10} />
                      </div>
                      <span className={`text-xs font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                        {c.autor}
                      </span>
                    </div>
                    <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>
                      {formatearFecha(c.creadoEn)}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed break-words pl-5">{c.texto}</p>
                </div>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEnviar} className="flex flex-col gap-2 pt-1">
            <input
              type="text"
              className={`border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 min-h-[38px] ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
              }`}
              placeholder="Tu nombre o cargo (ej: Gerente General)..."
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
            <div className="flex gap-2">
              <input
                type="text"
                className={`flex-1 border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 min-h-[40px] ${
                  isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
                }`}
                placeholder="Escribe una observación sobre esta tarea..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <button
                type="submit"
                disabled={enviando || !texto.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all flex items-center justify-center min-h-[40px] shrink-0"
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
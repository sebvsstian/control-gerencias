import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function useComentarios(tareaId) {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tareaId) {
      setComentarios([]);
      setLoading(false);
      return;
    }

    // Escuchador en tiempo real por tareaId
    const q = query(
      collection(db, 'comentarios'),
      where('tareaId', '==', tareaId)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        
        // Ordenar comentarios de forma segura en memoria
        data.sort((a, b) => {
          const timeA = a.creadoEn?.toMillis ? a.creadoEn.toMillis() : (a.creadoEn ? new Date(a.creadoEn).getTime() : 0);
          const timeB = b.creadoEn?.toMillis ? b.creadoEn.toMillis() : (b.creadoEn ? new Date(b.creadoEn).getTime() : 0);
          return timeA - timeB;
        });

        setComentarios(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error al cargar comentarios:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [tareaId]);

  const agregarComentario = async (tareaId, texto, autor) => {
    if (!texto.trim()) return;
    try {
      await addDoc(collection(db, 'comentarios'), {
        tareaId,
        texto: texto.trim(),
        autor: autor?.trim() || 'Compañero',
        creadoEn: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error al agregar comentario:', err);
      throw err;
    }
  };

  return { comentarios, loading, error, agregarComentario };
}
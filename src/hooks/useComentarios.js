import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
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

    // Escuchador en tiempo real mediante onSnapshot filtrado por tareaId
    const q = query(
      collection(db, 'comentarios'),
      where('tareaId', '==', tareaId),
      orderBy('creadoEn', 'asc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setComentarios(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error al escuchar comentarios en tiempo real:', err);
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
        autor: autor?.trim() || 'Anónimo',
        creadoEn: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error al agregar comentario:', err);
      throw err;
    }
  };

  return { comentarios, loading, error, agregarComentario };
}
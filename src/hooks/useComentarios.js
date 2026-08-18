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

  useEffect(() => {
    if (!tareaId) {
      setComentarios([]);
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'comentarios'),
      where('tareaId', '==', tareaId),
      orderBy('creadoEn', 'asc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setComentarios(data);
      setLoading(false);
    });
    return unsub;
  }, [tareaId]);

  const agregarComentario = async (tareaId, texto, autor) => {
    await addDoc(collection(db, 'comentarios'), {
      tareaId,
      texto,
      autor: autor || 'Anonimo',
      creadoEn: serverTimestamp(),
    });
  };

  return { comentarios, loading, agregarComentario };
}

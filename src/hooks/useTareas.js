import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function useTareas() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'tareas'), orderBy('creadoEn', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTareas(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const agregarTarea = async (tarea) => {
    await addDoc(collection(db, 'tareas'), {
      ...tarea,
      completada: false,
      creadoEn: serverTimestamp(),
    });
  };

  const toggleTarea = async (id, completada) => {
    await updateDoc(doc(db, 'tareas', id), {
      completada: !completada,
      actualizadoEn: serverTimestamp(),
    });
  };

  const editarTarea = async (id, datos) => {
    await updateDoc(doc(db, 'tareas', id), {
      ...datos,
      actualizadoEn: serverTimestamp(),
    });
  };

  const eliminarTarea = async (id) => {
    await deleteDoc(doc(db, 'tareas', id));
  };

  return { tareas, loading, agregarTarea, toggleTarea, editarTarea, eliminarTarea };
}

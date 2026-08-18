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
  const [error, setError] = useState(null);

  useEffect(() => {
    // Escuchador en tiempo real mediante onSnapshot
    const q = query(collection(db, 'tareas'), orderBy('creadoEn', 'asc'));
    
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTareas(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error al escuchar tareas en tiempo real:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Agregar tarea con actualizacion optimista
  const agregarTarea = async (tarea) => {
    try {
      await addDoc(collection(db, 'tareas'), {
        ...tarea,
        completada: false,
        creadoEn: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error al agregar tarea:', err);
      throw err;
    }
  };

  // Toggle con actualizacion optimista inmediata en memoria
  const toggleTarea = async (id, completadaActual) => {
    const nuevoEstado = !completadaActual;
    // Actualizacion optimista local para respuesta visual a 0ms
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: nuevoEstado } : t))
    );

    try {
      await updateDoc(doc(db, 'tareas', id), {
        completada: nuevoEstado,
        actualizadoEn: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error al actualizar estado de tarea:', err);
      // Revertir si falla
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completada: completadaActual } : t))
      );
      throw err;
    }
  };

  // Editar tarea
  const editarTarea = async (id, datos) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...datos } : t))
    );

    try {
      await updateDoc(doc(db, 'tareas', id), {
        ...datos,
        actualizadoEn: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error al editar tarea:', err);
      throw err;
    }
  };

  // Eliminar tarea
  const eliminarTarea = async (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteDoc(doc(db, 'tareas', id));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      throw err;
    }
  };

  return { tareas, loading, error, agregarTarea, toggleTarea, editarTarea, eliminarTarea };
}
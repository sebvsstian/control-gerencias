import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

let memoryTareasCache = [];
let hasLoadedOnce = false;

export function useTareas() {
  const [tareas, setTareas] = useState(memoryTareasCache);
  const [loading, setLoading] = useState(!hasLoadedOnce);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Escuchador en tiempo real sin forzar persistencia en disco
    const colRef = collection(db, 'tareas');

    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        
        // Ordenar de forma segura en memoria
        data.sort((a, b) => {
          const timeA = a.creadoEn?.toMillis ? a.creadoEn.toMillis() : (a.creadoEn ? new Date(a.creadoEn).getTime() : 0);
          const timeB = b.creadoEn?.toMillis ? b.creadoEn.toMillis() : (b.creadoEn ? new Date(b.creadoEn).getTime() : 0);
          return timeA - timeB;
        });

        memoryTareasCache = data;
        hasLoadedOnce = true;
        setTareas(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error al escuchar tareas:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Agregar tarea
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

  // Toggle tarea con actualizacion optimista
  const toggleTarea = async (id, completadaActual) => {
    const nuevoEstado = !completadaActual;
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: nuevoEstado } : t))
    );
    memoryTareasCache = memoryTareasCache.map((t) =>
      t.id === id ? { ...t, completada: nuevoEstado } : t
    );

    try {
      await updateDoc(doc(db, 'tareas', id), {
        completada: nuevoEstado,
        actualizadoEn: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
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
    memoryTareasCache = memoryTareasCache.filter((t) => t.id !== id);

    try {
      await deleteDoc(doc(db, 'tareas', id));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      throw err;
    }
  };

  return { tareas, loading, error, agregarTarea, toggleTarea, editarTarea, eliminarTarea };
}
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

// Cache en memoria a nivel de modulo para render instantaneo a 0ms entre renderizados
let memoryTareasCache = [];
let hasLoadedOnce = false;

export function useTareas() {
  const [tareas, setTareas] = useState(memoryTareasCache);
  const [loading, setLoading] = useState(!hasLoadedOnce);
  const [error, setError] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Escuchador onSnapshot con cache local persistente
    const q = query(collection(db, 'tareas'), orderBy('creadoEn', 'asc'));
    
    const unsub = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        memoryTareasCache = data;
        hasLoadedOnce = true;
        setTareas(data);
        setLoading(false);
        setIsSyncing(snap.metadata.hasPendingWrites);
        setError(null);
      },
      (err) => {
        console.error('Error al sincronizar tareas:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // Agregar tarea con respuesta optimista
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

  // Toggle con actualizacion optimista instantanea en memoria local
  const toggleTarea = async (id, completadaActual) => {
    const nuevoEstado = !completadaActual;
    // Respuesta visual instantanea a 0ms
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
      console.error('Error al actualizar estado de tarea:', err);
      // Revertir en caso de fallo
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completada: completadaActual } : t))
      );
      throw err;
    }
  };

  // Editar tarea optimista
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

  // Eliminar tarea optimista
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

  return { tareas, loading, error, isSyncing, agregarTarea, toggleTarea, editarTarea, eliminarTarea };
}
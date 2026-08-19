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

// Cache en memoria para render instantaneo entre vistas
let memoryTareasCache = [];
let hasLoadedOnce = false;

export function useTareas() {
  const [tareas, setTareas] = useState(memoryTareasCache);
  const [loading, setLoading] = useState(!hasLoadedOnce);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Timeout de seguridad: si Firestore tarda mas de 1.5s, desbloquea la UI igualmente
    const safetyTimeout = setTimeout(() => {
      if (!hasLoadedOnce) {
        console.warn('[useTareas] Timeout de seguridad: desbloqueando UI tras 1.5s');
        setLoading(false);
      }
    }, 1500);

    const colRef = collection(db, 'tareas');

    const unsub = onSnapshot(
      colRef,
      (snap) => {
        // Respuesta instantanea de Firestore — limpiar timeout
        clearTimeout(safetyTimeout);

        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Ordenar en memoria por fecha de creacion (ascendente)
        data.sort((a, b) => {
          const timeA = a.creadoEn?.toMillis ? a.creadoEn.toMillis() : 0;
          const timeB = b.creadoEn?.toMillis ? b.creadoEn.toMillis() : 0;
          return timeA - timeB;
        });

        memoryTareasCache = data;
        hasLoadedOnce = true;
        setTareas(data);
        setLoading(false);   // <-- loading = false INMEDIATAMENTE al recibir datos
        setError(null);
      },
      (err) => {
        clearTimeout(safetyTimeout);
        console.error('[useTareas] Error al escuchar tareas:', err);
        setError(err.message);
        setLoading(false);   // <-- loading = false incluso en error para no bloquear UI
      }
    );

    return () => {
      clearTimeout(safetyTimeout);
      unsub();
    };
  }, []);

  // Agregar tarea con log de error visible y alerta si Firestore rechaza
  const agregarTarea = async (tarea) => {
    try {
      const docRef = await addDoc(collection(db, 'tareas'), {
        ...tarea,
        completada: false,
        creadoEn: serverTimestamp(),
      });
      console.log('[Firestore] Tarea guardada con ID:', docRef.id);
      return docRef;
    } catch (err) {
      console.error('[Firestore] ERROR al guardar tarea — posible problema de permisos:', err);
      throw err; // El modal mostrara el alert al usuario
    }
  };

  // Toggle con actualizacion optimista en memoria
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
      console.error('[Firestore] Error al actualizar estado de tarea:', err);
      // Revertir estado optimista si Firestore falla
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completada: completadaActual } : t))
      );
      throw err;
    }
  };

  // Editar tarea con estado optimista
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
      console.error('[Firestore] Error al editar tarea:', err);
      throw err;
    }
  };

  // Eliminar tarea con estado optimista
  const eliminarTarea = async (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));
    memoryTareasCache = memoryTareasCache.filter((t) => t.id !== id);

    try {
      await deleteDoc(doc(db, 'tareas', id));
    } catch (err) {
      console.error('[Firestore] Error al eliminar tarea:', err);
      throw err;
    }
  };

  return { tareas, loading, error, agregarTarea, toggleTarea, editarTarea, eliminarTarea };
}
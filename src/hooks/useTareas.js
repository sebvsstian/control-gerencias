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

export function useTareas() {
  // Estado inicial vacio — la unica fuente de verdad es Firestore
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[Firestore] Conectando listener onSnapshot a coleccion "tareas"...');

    // 3. Aumentado el timeout de conexion a 10 segundos para dar tiempo en redes lentas
    const connectionTimeout = setTimeout(() => {
      console.warn('[Firestore] Sin respuesta inicial tras 10s — desbloqueando UI para operar mientras se completa la reconexion.');
      setLoading(false);
      setError('Firestore no respondió en 10 segundos. Si estás usando una red lenta o las Reglas de Seguridad están pendientes, se intentará la reconexión de forma transparente.');
    }, 10000);

    const colRef = collection(db, 'tareas');

    const unsub = onSnapshot(
      colRef,
      (snap) => {
        // Al recibir respuesta de Firestore (incluso tras el timeout de 10s), reconexion transparente
        clearTimeout(connectionTimeout);

        console.log('[Firestore] Sincronización exitosa. Total tareas recibidas:', snap.docs.length);

        const data = snap.docs.map((d) => {
          const docData = d.data();
          return { id: d.id, ...docData };
        });

        // Ordenar en memoria por fecha de creacion ascendente
        data.sort((a, b) => {
          const timeA = a.creadoEn?.toMillis ? a.creadoEn.toMillis() : 0;
          const timeB = b.creadoEn?.toMillis ? b.creadoEn.toMillis() : 0;
          return timeA - timeB;
        });

        // Actualizar tareas y limpiar cualquier error previo
        setTareas(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        clearTimeout(connectionTimeout);
        console.error('[Firestore] Error en listener onSnapshot:', err.code, err.message);
        setError(`Error de conexión Firestore: ${err.message}`);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(connectionTimeout);
      unsub();
    };
  }, []);

  // 2. AGREGAR tarea con logs y validacion de persistencia
  const agregarTarea = async (tarea) => {
    const nuevaTarea = {
      ...tarea,
      completada: false,
      creadoEn: serverTimestamp(),
    };

    console.log('Intentando guardar en Firestore:', nuevaTarea);

    try {
      const docRef = await addDoc(collection(db, 'tareas'), nuevaTarea);
      console.log('Guardado exitoso con ID:', docRef.id);
      return docRef;
    } catch (err) {
      console.error('[Firestore] Error al guardar tarea:', err);
      alert('Error al guardar en Firestore: ' + err.message);
      throw err;
    }
  };

  // TOGGLE tarea en Firestore con actualizacion optimista
  const toggleTarea = async (id, completadaActual) => {
    const nuevoEstado = !completadaActual;
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: nuevoEstado } : t))
    );

    try {
      await updateDoc(doc(db, 'tareas', id), {
        completada: nuevoEstado,
        actualizadoEn: serverTimestamp(),
      });
      console.log(`[Firestore] Tarea ${id} actualizada a: ${nuevoEstado ? 'Completada' : 'Pendiente'}`);
    } catch (err) {
      console.error('[Firestore] Error al actualizar estado:', err);
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completada: completadaActual } : t))
      );
      alert('Error al actualizar en Firestore: ' + err.message);
      throw err;
    }
  };

  // EDITAR tarea en Firestore
  const editarTarea = async (id, datos) => {
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...datos } : t))
    );

    try {
      await updateDoc(doc(db, 'tareas', id), {
        ...datos,
        actualizadoEn: serverTimestamp(),
      });
      console.log(`[Firestore] Tarea ${id} editada correctamente`);
    } catch (err) {
      console.error('[Firestore] Error al editar tarea:', err);
      alert('Error al editar en Firestore: ' + err.message);
      throw err;
    }
  };

  // ELIMINAR tarea en Firestore
  const eliminarTarea = async (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteDoc(doc(db, 'tareas', id));
      console.log(`[Firestore] Tarea ${id} eliminada`);
    } catch (err) {
      console.error('[Firestore] Error al eliminar tarea:', err);
      alert('Error al eliminar en Firestore: ' + err.message);
      throw err;
    }
  };

  return { tareas, loading, error, agregarTarea, toggleTarea, editarTarea, eliminarTarea };
}
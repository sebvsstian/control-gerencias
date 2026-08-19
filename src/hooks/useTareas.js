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
  // Estado inicial VACIO — la unica fuente de verdad es Firestore
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('[Firestore] Iniciando listener onSnapshot en coleccion "tareas"...');

    // Timeout de seguridad: desbloquea la UI si Firestore no responde en 5s
    const safetyTimeout = setTimeout(() => {
      console.warn('[Firestore] Sin respuesta tras 5s — desbloqueando UI. Verifica las Reglas de Firestore y la conexion a Internet.');
      setLoading(false);
      setError('Firestore no respondio en 5 segundos. Verifica las Reglas de Seguridad en la consola de Firebase.');
    }, 5000);

    const colRef = collection(db, 'tareas');

    const unsub = onSnapshot(
      colRef,
      (snap) => {
        clearTimeout(safetyTimeout);

        console.log('[Firestore] onSnapshot recibido. Documentos en "tareas":', snap.docs.length);

        const data = snap.docs.map((d) => {
          const docData = d.data();
          return { id: d.id, ...docData };
        });

        // Ordenar en memoria por creadoEn ascendente
        data.sort((a, b) => {
          const timeA = a.creadoEn?.toMillis ? a.creadoEn.toMillis() : 0;
          const timeB = b.creadoEn?.toMillis ? b.creadoEn.toMillis() : 0;
          return timeA - timeB;
        });

        // UNICA fuente de verdad: lo que devuelve Firestore
        setTareas(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        clearTimeout(safetyTimeout);
        console.error('[Firestore] ERROR en onSnapshot:', err.code, err.message);
        console.error('[Firestore] Posibles causas: Reglas de Firestore bloqueadas, proyecto incorrecto, sin conexion a internet.');
        setError(`Error Firestore (${err.code}): ${err.message}`);
        setLoading(false);
        // Mostrar alerta visible para diagnosticar
        alert(
          `[Firestore] No se pudo conectar a la base de datos.\n\nError: ${err.message}\nCodigo: ${err.code}\n\nPasos para solucionar:\n1. Ve a console.firebase.google.com\n2. Selecciona el proyecto "kalopsia-usm"\n3. Firestore Database > Reglas\n4. Cambia las reglas a: allow read, write: if true;\n5. Publica los cambios.`
        );
      }
    );

    return () => {
      clearTimeout(safetyTimeout);
      unsub();
    };
  }, []);

  // AGREGAR tarea — escribe directamente en Firestore, sin estado optimista para garantizar persistencia
  const agregarTarea = async (tarea) => {
    const nuevaTarea = {
      ...tarea,
      completada: false,
      creadoEn: serverTimestamp(),
    };

    console.log('[Firestore] Intentando guardar en Firestore:', nuevaTarea);

    try {
      const docRef = await addDoc(collection(db, 'tareas'), nuevaTarea);
      console.log('[Firestore] Guardado exitoso con ID:', docRef.id);
      return docRef;
    } catch (err) {
      console.error('[Firestore] ERROR al guardar tarea:', err.code, err.message);
      alert(`Error al guardar en Firestore: ${err.message}\n\nCodigo de error: ${err.code}\n\nVerifica las Reglas de Seguridad en console.firebase.google.com > kalopsia-usm > Firestore > Reglas.`);
      throw err;
    }
  };

  // TOGGLE — actualiza en Firestore, revertir si falla
  const toggleTarea = async (id, completadaActual) => {
    const nuevoEstado = !completadaActual;
    // Actualizacion optimista en UI
    setTareas((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completada: nuevoEstado } : t))
    );

    try {
      await updateDoc(doc(db, 'tareas', id), {
        completada: nuevoEstado,
        actualizadoEn: serverTimestamp(),
      });
    } catch (err) {
      console.error('[Firestore] Error al actualizar tarea:', err);
      // Revertir UI si Firestore falla
      setTareas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completada: completadaActual } : t))
      );
      alert(`Error al actualizar tarea: ${err.message}`);
      throw err;
    }
  };

  // EDITAR — actualiza en Firestore
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
      alert(`Error al editar tarea: ${err.message}`);
      throw err;
    }
  };

  // ELIMINAR — borra de Firestore
  const eliminarTarea = async (id) => {
    setTareas((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteDoc(doc(db, 'tareas', id));
    } catch (err) {
      console.error('[Firestore] Error al eliminar tarea:', err);
      alert(`Error al eliminar tarea: ${err.message}`);
      throw err;
    }
  };

  return { tareas, loading, error, agregarTarea, toggleTarea, editarTarea, eliminarTarea };
}
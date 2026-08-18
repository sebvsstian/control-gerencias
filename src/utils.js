// Calcula dias restantes hasta la fecha limite
export function diasRestantes(fechaLimite) {
  if (!fechaLimite) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const limite = new Date(fechaLimite + 'T00:00:00');
  limite.setHours(0, 0, 0, 0);
  const diff = Math.ceil((limite - hoy) / (1000 * 60 * 60 * 24));
  return diff;
}

// Retorna el estado del deadline
export function estadoDeadline(fechaLimite, completada) {
  if (!fechaLimite) return 'sin-fecha';
  if (completada) return 'completada';
  const dias = diasRestantes(fechaLimite);
  if (dias < 0) return 'vencida';
  if (dias === 0) return 'hoy';
  if (dias <= 3) return 'proxima';
  return 'ok';
}

// Calcula el porcentaje de avance de una gerencia
export function calcularPorcentaje(tareas, gerenciaId) {
  const del = tareas.filter((t) => t.gerenciaId === gerenciaId);
  if (del.length === 0) return 0;
  const completadas = del.filter((t) => t.completada).length;
  return Math.round((completadas / del.length) * 100);
}

// Calcula el porcentaje global
export function calcularPorcentajeGlobal(tareas) {
  if (tareas.length === 0) return 0;
  const completadas = tareas.filter((t) => t.completada).length;
  return Math.round((completadas / tareas.length) * 100);
}

// Color de la barra de progreso segun porcentaje
export function colorProgreso(pct) {
  if (pct >= 75) return 'bg-emerald-500';
  if (pct >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

// Formatea fecha de Firestore Timestamp o string
export function formatearFecha(fecha) {
  if (!fecha) return '';
  if (fecha?.toDate) return fecha.toDate().toLocaleDateString('es-CL');
  if (typeof fecha === 'string') {
    const [y, m, d] = fecha.split('-');
    return `${d}/${m}/${y}`;
  }
  return '';
}

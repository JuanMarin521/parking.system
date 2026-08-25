/**
 * Funciones auxiliares relacionadas con el manejo de fechas y tiempos.
 */

/**
 * Calcula la cantidad de horas a facturar entre la hora de entrada y la de salida.
 * Regla aplicada: toda hora iniciada se cobra completa
 * @param {Date} entryTime - Hora de entrada del vehículo.
 * @param {Date} exitTime - Hora de salida del vehículo.
 * @returns {number} Total de horas facturables (mínimo 1).
 */
function calculateBillableHours(entryTime, exitTime) {
  const diffMs = exitTime.getTime() - entryTime.getTime();
  const diffMinutes = diffMs / (1000 * 60);
  const hours = Math.ceil(diffMinutes / 60);
  return hours < 1 ? 1 : hours;
}

/**
 * Da formato a un objeto Date para mostrarlo de forma legible (YYYY-MM-DD HH:mm:ss).
 * @param {Date} date - Fecha a formatear.
 * @returns {string} Fecha formateada como texto.
 */
function formatDate(date) {
  const pad = (num) => String(num).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export { calculateBillableHours, formatDate };

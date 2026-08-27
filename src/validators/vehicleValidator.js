import { ValidationError } from '../errors/AppErrors.js';

// Una placa debe tener entre 3 y 8 caracteres alfanuméricos (letras y/o números).
const LICENSE_PLATE_PATTERN = /^[A-Z0-9]{3,8}$/;

/**
 * Valida que la placa esté presente y cumpla con el formato esperado.
 * Cubre: campo obligatorio, tipo de dato correcto y patrón permitido.
 * @param {*} licensePlate - Valor ingresado por el usuario.
 * @returns {string} Placa normalizada (en mayúsculas y sin espacios).
 */
function validateLicensePlate(licensePlate) {
  // Campo obligatorio: no puede estar vacío, nulo o indefinido.
  if (licensePlate === undefined || licensePlate === null || licensePlate === '') {
    throw new ValidationError('La placa es requerida.');
  }

  // Valor no numérico esperado como texto: se valida el tipo de dato.
  if (typeof licensePlate !== 'string') {
    throw new ValidationError('La placa debe de ser un texto valido.');
  }

  const normalizedPlate = licensePlate.trim().toUpperCase();

  if (normalizedPlate === '') {
    throw new ValidationError('La placa no puede ser vacia o con solo espacios blancos.');
  }

  // Rango/formato permitido: solo letras y números, entre 3 y 8 caracteres.
  if (!LICENSE_PLATE_PATTERN.test(normalizedPlate)) {
    throw new ValidationError(
      'La placa solo debed e contener letras y/o numeros (3 a 8 caracteres).'
    );
  }

  return normalizedPlate;
}

/**
 * Valida que el valor recibido sea un número entero positivo válido para la capacidad.
 * Cubre: campo obligatorio, valor numérico válido, valor no numérico y rango permitido.
 * @param {*} capacity - Valor ingresado para la capacidad del parqueadero.
 * @returns {number} Capacidad validada como número entero.
 */
function validateCapacity(capacity) {
  // Campo obligatorio.
  if (capacity === undefined || capacity === null || capacity === '') {
    throw new ValidationError('La capacidad el parqueadero es requerida.');
  }

  const numericCapacity = Number(capacity);

  // Valor no numérico: si no se puede convertir a número, se rechaza.
  if (Number.isNaN(numericCapacity)) {
    throw new ValidationError('La capacidad del parqueadero debe de ser un numero.');
  }

  // Rango permitido: debe ser un entero positivo.
  if (!Number.isInteger(numericCapacity) || numericCapacity <= 0) {
    throw new ValidationError('La capacidad del parqueadero debe de ser un numero entero (mayor a cero).');
  }

  if (numericCapacity > 1000) {
    throw new ValidationError('capacidad del parqueadero supera la permitida (1000)');
  }

  return numericCapacity;
}

/**
 * Valida que la hora de salida no sea anterior a la hora de entrada.
 * @param {Date} entryTime - Hora de entrada registrada.
 * @param {Date} exitTime - Hora de salida a validar.
 */
function validateExitTime(entryTime, exitTime) {
  if (!(exitTime instanceof Date) || Number.isNaN(exitTime.getTime())) {
    throw new ValidationError('La salida debe de ser un tiempo valido');
  }

  // Regla de negocio de tiempos: la salida nunca puede ser anterior a la entrada.
  if (exitTime.getTime() < entryTime.getTime()) {
    throw new ValidationError('La hora de salida no puede ser anterior a la de entrada');
  }
}

export { validateLicensePlate, validateCapacity, validateExitTime };

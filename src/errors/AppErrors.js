/**
 * Clases de error personalizadas para diferenciar entre errores de validación
 * de datos de entrada y violaciones de reglas de negocio. Esto permite que la
 * capa de presentación (UI web) muestre mensajes claros y específicos en
 * lugar de fallos inesperados o mensajes genéricos.
 */

// Error para datos de entrada inválidos (campos vacíos, formato incorrecto, rangos no permitidos, etc.).
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Error de validacion';
  }
}

// Error para violaciones de reglas del negocio (placa duplicada, parqueadero lleno, etc.).
class BusinessRuleError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BusinessRuleError';
  }
}

// Error para búsquedas que no encuentran el recurso solicitado (por ejemplo, una placa no parqueada).
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export { ValidationError, BusinessRuleError, NotFoundError };

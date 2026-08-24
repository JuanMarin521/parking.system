import Vehicle from '../models/Vehicle.js';
import { BusinessRuleError, NotFoundError } from '../errors/AppErrors.js';
import { validateLicensePlate, validateCapacity, validateExitTime } from '../validators/vehicleValidator.js';
import { calculateBillableHours, formatDate } from '../utils/timeUtils.js';

const DEFAULT_RATE_PER_HOUR = 2000; // unidades monetarias por cada hora facturable

/**
 * ParkingService contiene todas las reglas de negocio del parqueadero:
 * - No permitir dos vehículos con la misma placa parqueados al mismo tiempo.
 * - No permitir el ingreso cuando el parqueadero está lleno.
 * - La hora de salida no puede ser anterior a la hora de entrada.
 * - Cálculo del valor a pagar según las horas facturables.
 */
class ParkingService {
  constructor(repository, capacity, ratePerHour = DEFAULT_RATE_PER_HOUR) {
    this.repository = repository;
    this.capacity = validateCapacity(capacity);
    this.ratePerHour = ratePerHour;
  }

  /**
   * Registra el ingreso de un vehículo a partir de su placa.
   * @param {string} rawLicensePlate - Placa ingresada por el usuario.
   * @param {Date} [entryTime] - Hora de entrada (por defecto, el momento actual).
   * @returns {Vehicle} Vehículo registrado.
   */
  registerEntry(rawLicensePlate, entryTime = new Date()) {
    const licensePlate = validateLicensePlate(rawLicensePlate);

    // Regla de negocio: no se permiten dos vehículos con la misma placa parqueados a la vez.
    if (this.repository.isPlateParked(licensePlate)) {
      throw new BusinessRuleError(`Vehicle with plate "${licensePlate}" is already parked.`);
    }

    // Regla de negocio: no se permite el ingreso si el parqueadero está lleno.
    if (this.repository.countParked() >= this.capacity) {
      throw new BusinessRuleError('Parking lot is full. Entry is not allowed.');
    }

    const vehicle = new Vehicle(licensePlate, entryTime);
    this.repository.addVehicle(vehicle);
    return vehicle;
  }

  /**
   * Registra la salida de un vehículo, calcula el tiempo de permanencia y el valor a pagar.
   * @param {string} rawLicensePlate - Placa ingresada por el usuario.
   * @param {Date} [exitTime] - Hora de salida (por defecto, el momento actual).
   * @returns {{licensePlate: string, entryTime: string, exitTime: string, totalHours: number, amountToPay: number}}
   */
  registerExit(rawLicensePlate, exitTime = new Date()) {
    const licensePlate = validateLicensePlate(rawLicensePlate);
    const vehicle = this.repository.findParkedByPlate(licensePlate);

    if (!vehicle) {
      throw new NotFoundError(`No parked vehicle found with plate "${licensePlate}".`);
    }

    // Regla de negocio: la hora de salida no puede ser anterior a la hora de entrada.
    validateExitTime(vehicle.entryTime, exitTime);

    const totalHours = calculateBillableHours(vehicle.entryTime, exitTime);
    const amountToPay = totalHours * this.ratePerHour;

    vehicle.registerExit(exitTime, totalHours, amountToPay);

    this.repository.removeParkedByPlate(licensePlate);
    this.repository.addToHistory(vehicle);

    return {
      licensePlate: vehicle.licensePlate,
      entryTime: formatDate(vehicle.entryTime),
      exitTime: formatDate(vehicle.exitTime),
      totalHours: vehicle.totalHours,
      amountToPay: vehicle.amountToPay,
    };
  }

  // Devuelve la lista de vehículos actualmente parqueados, lista para mostrarse en la UI.
  getParkedVehicles() {
    return this.repository.getAllParked().map((vehicle) => ({
      licensePlate: vehicle.licensePlate,
      entryTime: formatDate(vehicle.entryTime),
    }));
  }

  /**
   * Consulta la disponibilidad del parqueadero.
   * @returns {{capacity: number, occupied: number, availableSpots: number, isFull: boolean}}
   */
  checkAvailability() {
    const occupied = this.repository.countParked();
    const availableSpots = this.capacity - occupied;
    return {
      capacity: this.capacity,
      occupied,
      availableSpots,
      isFull: availableSpots <= 0,
    };
  }
}

export default ParkingService;

/**
 * Capa de acceso a datos en memoria para los vehículos parqueados y su historial.
 * Mantener esta capa separada de la lógica de negocio (ParkingService) permite
 * cambiar el mecanismo de almacenamiento más adelante (por ejemplo, una base
 * de datos) sin tener que modificar las reglas de negocio.
 */
class VehicleRepository {
  constructor() {
    this.parkedVehicles = new Map(); // clave: placa, valor: instancia de Vehicle
    this.history = []; // vehículos que ya registraron su salida
  }

  // Indica si una placa ya se encuentra actualmente parqueada.
  isPlateParked(licensePlate) {
    return this.parkedVehicles.has(licensePlate);
  }

  // Cuenta cuántos vehículos hay parqueados en este momento.
  countParked() {
    return this.parkedVehicles.size;
  }

  // Agrega un vehículo a la lista de parqueados.
  addVehicle(vehicle) {
    this.parkedVehicles.set(vehicle.licensePlate, vehicle);
  }

  // Busca un vehículo parqueado por su placa.
  findParkedByPlate(licensePlate) {
    return this.parkedVehicles.get(licensePlate) || null;
  }

  // Elimina un vehículo de la lista de parqueados (cuando registra su salida).
  removeParkedByPlate(licensePlate) {
    const vehicle = this.parkedVehicles.get(licensePlate);
    this.parkedVehicles.delete(licensePlate);
    return vehicle;
  }

  // Guarda un vehículo en el historial de salidas.
  addToHistory(vehicle) {
    this.history.push(vehicle);
  }

  // Devuelve la lista completa de vehículos actualmente parqueados.
  getAllParked() {
    return Array.from(this.parkedVehicles.values());
  }

  // Devuelve una copia del historial de vehículos que ya salieron.
  getHistory() {
    return [...this.history];
  }
}

export default VehicleRepository;

/**
 * Modelo de dominio Vehicle.
 * Representa un vehículo que está actualmente parqueado o que ya registró su salida.
 */
class Vehicle {
  constructor(licensePlate, entryTime) {
    this.licensePlate = licensePlate;
    this.entryTime = entryTime;
    this.exitTime = null;
    this.totalHours = null;
    this.amountToPay = null;
  }

  // Registra la información de salida una vez se calcula el tiempo y el valor a pagar.
  registerExit(exitTime, totalHours, amountToPay) {
    this.exitTime = exitTime;
    this.totalHours = totalHours;
    this.amountToPay = amountToPay;
  }
}

export default Vehicle;

import VehicleRepository from './repositories/vehicleRepository.js';
import ParkingService from './services/parkingService.js';
import ParkingUI from './ui/parkingUI.js';

// Configuración inicial del sistema: capacidad total y tarifa por hora.
const PARKING_CAPACITY = 5;
const RATE_PER_HOUR = 2000;

const repository = new VehicleRepository();
const parkingService = new ParkingService(repository, PARKING_CAPACITY, RATE_PER_HOUR);
const ui = new ParkingUI(parkingService);

// Se espera a que el DOM esté completamente cargado antes de iniciar la interfaz.
document.addEventListener('DOMContentLoaded', () => ui.init());

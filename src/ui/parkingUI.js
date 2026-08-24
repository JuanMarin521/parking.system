import { ValidationError, BusinessRuleError, NotFoundError } from '../errors/AppErrors.js';

/**
 * ParkingUI es la capa de presentación para la página web.
 * Su única responsabilidad es leer datos del DOM, mostrar resultados y
 * mensajes al usuario. Toda la lógica de negocio y validación se delega
 * por completo a ParkingService (separación de responsabilidades).
 */
class ParkingUI {
  constructor(parkingService) {
    this.parkingService = parkingService;

    // Referencias a los elementos del DOM utilizados por la interfaz.
    this.entryForm = document.getElementById('entry-form');
    this.exitForm = document.getElementById('exit-form');
    this.entryPlateInput = document.getElementById('entry-plate');
    this.exitPlateInput = document.getElementById('exit-plate');
    this.messageBox = document.getElementById('message-box');
    this.parkedTableBody = document.getElementById('parked-tbody');
    this.emptyState = document.getElementById('empty-state');
    this.boardValue = document.getElementById('board-value');
    this.boardStatus = document.getElementById('board-status');
    this.gateArm = document.getElementById('gate-arm');
    this.gateLight = document.getElementById('gate-light');
    this.ticketPlate = document.getElementById('ticket-plate');
    this.ticketDetail = document.getElementById('ticket-detail');
    this.tabs = document.querySelectorAll('.tab');
    this.tabPanels = document.querySelectorAll('.tab-panel');
    this.refreshButton = document.getElementById('refresh-btn');
  }

  // Conecta los eventos de la página y realiza la primera carga de datos.
  init() {
    this.entryForm.addEventListener('submit', (event) => this.handleEntrySubmit(event));
    this.exitForm.addEventListener('submit', (event) => this.handleExitSubmit(event));
    this.refreshButton.addEventListener('click', () => this.refreshAll());
    this.tabs.forEach((tab) => tab.addEventListener('click', () => this.switchTab(tab.dataset.tab)));

    this.refreshAll();
  }

  // Cambia entre la pestaña de "Registrar ingreso" y "Registrar salida".
  switchTab(tabName) {
    this.tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.tab === tabName));
    this.tabPanels.forEach((panel) => panel.classList.toggle('active', panel.id === `${tabName}-form`));
  }

  // Maneja el envío del formulario de ingreso de vehículos.
  handleEntrySubmit(event) {
    event.preventDefault();
    const plate = this.entryPlateInput.value;

    try {
      const vehicle = this.parkingService.registerEntry(plate);
      this.showMessage(`Entry registered successfully for plate "${vehicle.licensePlate}".`, 'success');
      this.updateTicket(vehicle.licensePlate, 'Entry registered');
      this.animateGate('open');
      this.entryForm.reset();
      this.refreshAll();
    } catch (error) {
      this.handleError(error);
      this.animateGate('closed');
    }
  }

  // Maneja el envío del formulario de salida de vehículos.
  handleExitSubmit(event) {
    event.preventDefault();
    const plate = this.exitPlateInput.value;

    try {
      const receipt = this.parkingService.registerExit(plate);
      const detail = `${receipt.totalHours}h · $${receipt.amountToPay}`;
      this.showMessage(
        `Exit registered for plate "${receipt.licensePlate}". Total: $${receipt.amountToPay} (${receipt.totalHours}h billed).`,
        'success'
      );
      this.updateTicket(receipt.licensePlate, detail);
      this.animateGate('open');
      this.exitForm.reset();
      this.refreshAll();
    } catch (error) {
      this.handleError(error);
      this.animateGate('closed');
    }
  }

  // Vuelve a consultar disponibilidad y lista de vehículos parqueados.
  refreshAll() {
    this.renderAvailability();
    this.renderParkedVehicles();
  }

  // Actualiza el tablero de disponibilidad (estilo letrero de parqueadero).
  renderAvailability() {
    const status = this.parkingService.checkAvailability();
    this.boardValue.textContent = `${status.availableSpots} / ${status.capacity}`;
    this.boardStatus.textContent = status.isFull ? 'FULL' : 'AVAILABLE';
    this.boardStatus.classList.toggle('board-status--full', status.isFull);
    this.boardStatus.classList.toggle('board-status--ok', !status.isFull);
  }

  // Renderiza la tabla de vehículos actualmente parqueados.
  renderParkedVehicles() {
    const vehicles = this.parkingService.getParkedVehicles();
    this.parkedTableBody.innerHTML = '';

    if (vehicles.length === 0) {
      this.emptyState.style.display = 'block';
    } else {
      this.emptyState.style.display = 'none';
      vehicles.forEach((vehicle) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${vehicle.licensePlate}</td><td>${vehicle.entryTime}</td>`;
        this.parkedTableBody.appendChild(row);
      });
    }
  }

  // Actualiza el "tiquete" con la última placa procesada.
  updateTicket(plate, detail) {
    this.ticketPlate.textContent = plate;
    this.ticketDetail.textContent = detail;
  }

  // Anima la barrera: 'open' la sube (verde), 'closed' la mantiene abajo (rojo).
  animateGate(state) {
    const isOpen = state === 'open';
    this.gateArm.classList.toggle('gate-arm--open', isOpen);
    this.gateLight.classList.toggle('gate-light--go', isOpen);
    this.gateLight.classList.toggle('gate-light--stop', !isOpen);

    if (isOpen) {
      // La barrera vuelve a bajar automáticamente después de unos segundos.
      clearTimeout(this._gateTimeout);
      this._gateTimeout = setTimeout(() => {
        this.gateArm.classList.remove('gate-arm--open');
        this.gateLight.classList.remove('gate-light--go');
        this.gateLight.classList.add('gate-light--stop');
      }, 2200);
    }
  }

  // Muestra un mensaje de confirmación o error en la zona de mensajes.
  showMessage(text, type) {
    this.messageBox.textContent = text;
    this.messageBox.className = `message message--${type}`;
  }

  /**
   * Traduce cada tipo de error a un mensaje claro para el usuario,
   * evitando que la aplicación falle de forma inesperada.
   */
  handleError(error) {
    if (error instanceof ValidationError) {
      this.showMessage(`Validation error: ${error.message}`, 'error');
    } else if (error instanceof BusinessRuleError) {
      this.showMessage(`Business rule violation: ${error.message}`, 'error');
    } else if (error instanceof NotFoundError) {
      this.showMessage(`Not found: ${error.message}`, 'error');
    } else {
      this.showMessage(`Unexpected error: ${error.message}`, 'error');
    }
  }
}

export default ParkingUI;

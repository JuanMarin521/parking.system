import assert from 'assert';
import VehicleRepository from '../src/repositories/vehicleRepository.js';
import ParkingService from '../src/services/parkingService.js';
import { ValidationError, BusinessRuleError, NotFoundError } from '../src/errors/AppErrors.js';

// Pruebas unitarias sobre las reglas de negocio y validaciones del sistema.

function runTest(description, testFn) {
  try {
    testFn();
    console.log(`✔ PASS: ${description}`);
  } catch (error) {
    console.error(`✘ FAIL: ${description}`);
    console.error(`  ${error.message}`);
    process.exitCode = 1;
  }
}

function createService(capacity = 2) {
  const repository = new VehicleRepository();
  return new ParkingService(repository, capacity, 1000);
}

runTest('registers a vehicle entry successfully with a valid plate', () => {
  const service = createService();
  const vehicle = service.registerEntry('ABC123');
  assert.strictEqual(vehicle.licensePlate, 'ABC123');
});

runTest('rejects entry when license plate is empty', () => {
  const service = createService();
  assert.throws(() => service.registerEntry(''), ValidationError);
});

runTest('rejects entry when license plate has invalid characters', () => {
  const service = createService();
  assert.throws(() => service.registerEntry('AB@!'), ValidationError);
});

runTest('rejects duplicate license plate while already parked', () => {
  const service = createService();
  service.registerEntry('XYZ999');
  assert.throws(() => service.registerEntry('xyz999'), BusinessRuleError);
});

runTest('rejects entry when parking lot is full', () => {
  const service = createService(1);
  service.registerEntry('AAA111');
  assert.throws(() => service.registerEntry('BBB222'), BusinessRuleError);
});

runTest('throws NotFoundError when exiting a plate that is not parked', () => {
  const service = createService();
  assert.throws(() => service.registerExit('NOTPARK'), NotFoundError);
});

runTest('rejects exit time earlier than entry time', () => {
  const service = createService();
  const entryTime = new Date('2026-01-01T10:00:00');
  service.registerEntry('CCC333', entryTime);
  const earlierExit = new Date('2026-01-01T09:00:00');
  assert.throws(() => service.registerExit('CCC333', earlierExit), ValidationError);
});

runTest('calculates fee correctly based on billable hours', () => {
  const service = createService();
  const entryTime = new Date('2026-01-01T10:00:00');
  service.registerEntry('DDD444', entryTime);
  const exitTime = new Date('2026-01-01T12:30:00'); // 2h30m -> se redondea a 3 horas facturables
  const receipt = service.registerExit('DDD444', exitTime);
  assert.strictEqual(receipt.totalHours, 3);
  assert.strictEqual(receipt.amountToPay, 3000); // 3 horas * tarifa de 1000
});

runTest('frees a spot after a vehicle exits', () => {
  const service = createService(1);
  service.registerEntry('EEE555');
  service.registerExit('EEE555');
  const availability = service.checkAvailability();
  assert.strictEqual(availability.availableSpots, 1);
});

runTest('rejects a non-numeric parking capacity', () => {
  assert.throws(() => createServiceWithCapacity('abc'), ValidationError);
});

function createServiceWithCapacity(capacity) {
  const repository = new VehicleRepository();
  return new ParkingService(repository, capacity, 1000);
}

console.log('\nAll tests finished.');

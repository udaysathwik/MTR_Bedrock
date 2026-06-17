class VehicleSystem {

  constructor(worldId) {
    this.worldId = worldId;

    // 🚆 active vehicles in world
    this.vehicles = new Map();
  }

  // =========================
  // CREATE VEHICLE
  // =========================
  spawnVehicle(vehicleId, routeId, startStation) {
    this.vehicles.set(vehicleId, {
      id: vehicleId,
      routeId: routeId,

      // movement
      progress: 0,
      speed: 0,

      // state
      doorState: "CLOSED",
      isStopped: false,

      // animation helpers
      doorValue: 0,
      oscillation: 0,

      currentStation: startStation,
      nextStation: null
    });
  }

  // =========================
  // UPDATE LOOP (TICK)
  // =========================
  tick(deltaTime) {
    this.vehicles.forEach((v) => {

      // 🚆 movement update
      if (!v.isStopped) {
        v.speed = this.calculateSpeed(v);
        v.progress += v.speed * deltaTime;
      }

      // 🚪 door animation logic
      if (v.isStopped) {
        v.doorValue = this.lerp(v.doorValue, 1, 0.1);
        v.doorState = "OPEN";
      } else {
        v.doorValue = this.lerp(v.doorValue, 0, 0.1);
        v.doorState = "CLOSED";
      }

      // 🎢 simple oscillation (movement feel)
      v.oscillation += deltaTime * v.speed * 0.5;

      // 📢 station trigger check
      this.checkStationArrival(v);
    });
  }

  // =========================
  // SPEED SYSTEM (simple)
  // =========================
  calculateSpeed(vehicle) {
    if (vehicle.isStopped) return 0;

    // base speed per system type
    if (vehicle.routeId.includes("L")) return 0.4; // Light Rail
    if (vehicle.routeId.includes("M")) return 0.8; // Metro (SP1900)
    if (vehicle.routeId.includes("H")) return 1.5; // High Speed

    return 0.6;
  }

  // =========================
  // ARRIVAL CHECK
  // =========================
  checkStationArrival(vehicle) {

    // simple example trigger
    const arrivalPoint = 100; // placeholder

    if (vehicle.progress >= arrivalPoint && !vehicle.isStopped) {

      vehicle.isStopped = true;

      // stop for station
      setTimeout(() => {
        vehicle.isStopped = false;
        vehicle.progress = 0; // next segment reset (simplified)
      }, 5000);
    }
  }

  // =========================
  // UTILITY
  // =========================
  lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // =========================
  // REMOVE VEHICLE
  // =========================
  removeVehicle(vehicleId) {
    this.vehicles.delete(vehicleId);
  }
}

export default VehicleSystem;

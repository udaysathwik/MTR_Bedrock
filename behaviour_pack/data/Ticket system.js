import { world } from "@minecraft/server";

const BALANCE = "mtr_balance";

const ENTRY = {
  Z1: "mtr_entry_zone_1",
  Z2: "mtr_entry_zone_2",
  Z3: "mtr_entry_zone_3"
};

const BASE_FARE = 2;
const ZONE_FARE = 1;
const EVASION_FINE = 500;

class TicketSystem {

  // =========================
  // GET SCORE (balance / zone)
  // =========================
  getScore(player, objective) {
    const scoreboard = world.scoreboard;
    const obj = scoreboard.getObjective(objective);

    if (!obj) return 0;

    try {
      return obj.getScore(player.scoreboardIdentity) || 0;
    } catch {
      return 0;
    }
  }

  // =========================
  // SET SCORE
  // =========================
  setScore(player, objective, value) {
    const scoreboard = world.scoreboard;

    let obj = scoreboard.getObjective(objective);
    if (!obj) obj = scoreboard.addObjective(objective, objective);

    obj.setScore(player.scoreboardIdentity, value);
  }

  // =========================
  // ADD SCORE
  // =========================
  addScore(player, objective, value) {
    const current = this.getScore(player, objective);
    this.setScore(player, objective, current + value);
  }

  // =========================
  // BALANCE API
  // =========================
  getBalance(player) {
    return this.getScore(player, BALANCE);
  }

  addBalance(player, amount) {
    this.addScore(player, BALANCE, amount);
  }

  // =========================
  // ENTRY CHECK
  // (simplified Bedrock version)
  // =========================
  hasEntered(player) {
    return (
      this.getScore(player, ENTRY.Z1) !== 0 &&
      this.getScore(player, ENTRY.Z2) !== 0 &&
      this.getScore(player, ENTRY.Z3) !== 0
    );
  }

  // =========================
  // ENTER STATION
  // =========================
  onEnter(player, station) {
    if (this.hasEntered(player)) {
      player.sendMessage("Already entered system.");
      return false;
    }

    const balance = this.getBalance(player);

    if (balance < 0) {
      player.sendMessage(`Insufficient balance: ${balance}`);
      return false;
    }

    this.setScore(player, ENTRY.Z1, station.zone1);
    this.setScore(player, ENTRY.Z2, station.zone2);
    this.setScore(player, ENTRY.Z3, station.zone3);

    player.sendMessage(`Entered ${station.name} | Balance: ${balance}`);
    return true;
  }

  // =========================
  // EXIT STATION
  // =========================
  onExit(player, station) {

    const entered = this.hasEntered(player);

    let zone1 = this.getScore(player, ENTRY.Z1);
    let zone2 = this.getScore(player, ENTRY.Z2);
    let zone3 = this.getScore(player, ENTRY.Z3);

    let fare;

    if (!entered) {
      fare = EVASION_FINE;
    } else {
      fare =
        BASE_FARE +
        ZONE_FARE * (
          Math.abs(station.zone1 - zone1) +
          Math.abs(station.zone2 - zone2) +
          Math.abs(station.zone3 - zone3)
        );
    }

    this.setScore(player, ENTRY.Z1, 0);
    this.setScore(player, ENTRY.Z2, 0);
    this.setScore(player, ENTRY.Z3, 0);

    this.addBalance(player, -fare);

    player.sendMessage(`Exit ${station.name} | Fare: ${fare}`);

    return true;
  }

  // =========================
  // MAIN PASS THROUGH
  // =========================
  passThrough(player, station, isEntrance, isExit) {

    if (isEntrance && !isExit) {
      return this.onEnter(player, station);
    }

    if (isExit) {
      return this.onExit(player, station);
    }

    return false;
  }
}

export default TicketSystem;

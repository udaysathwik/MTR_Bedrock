// EditDepotScreen.js

import { DashboardListItem } from "./DashboardListItem.js";

export class EditDepotScreen {

  constructor(depot, transportMode, previousScreen = null) {
    this.depot = depot;
    this.transportMode = transportMode;
    this.previousScreen = previousScreen;

    // state
    this.showScheduleControls = !transportMode.continuousMovement;
    this.showCruisingAltitude = transportMode.type === "AIRPLANE";

    this.sliders = new Array(24).fill(0); // HOURS_PER_DAY
    this.departures = new Set(depot.realTimeDepartures || []);

    this.selectedRepeatIndefinitely = depot.repeatInfinitely ?? false;

    this.cruisingAltitude = depot.cruisingAltitude ?? 256;

    this.departuresList = [];
    this.searchText = "";

    this.init();
  }

  // -----------------------------
  // INIT
  // -----------------------------
  init() {
    this.buildSliders();
    this.updateList();
  }

  buildSliders() {
    for (let i = 0; i < 24; i++) {
      this.sliders[i] = 0;
    }
  }

  // -----------------------------
  // SCHEDULE LOGIC
  // -----------------------------
  setSlider(hour, value) {
    this.sliders[hour] = value;

    // optional sync behavior (like Java version)
    for (let i = 0; i < 24; i++) {
      if (i !== hour) {
        this.sliders[i] = value;
      }
    }
  }

  resetSchedule() {
    this.sliders.fill(0);
    this.departures.clear();
    this.updateList();
    this.save();
  }

  // -----------------------------
  // DEPARTURE PARSING (JS VERSION)
  // -----------------------------
  parseDeparture(text, add = false, remove = false) {
    try {
      const clean = text.replace(/\s/g, "");
      const [timePart, intervalPart] = clean.split("+");

      const [h, m, s] = timePart.split(":").map(Number);

      const base = ((h % 24) * 3600 + (m % 60) * 60 + (s % 60)) * 1000;

      let multiple = 1;
      let interval = 0;

      if (intervalPart) {
        const [multiStr, timeStr] = intervalPart.split("*");
        multiple = Math.min(Number(multiStr) + 1, 24);

        const [ih, im, is] = timeStr.split(":").map(Number);
        interval = ((ih * 3600) + (im * 60) + is) * 1000;
      }

      const DAY = 24 * 60 * 60 * 1000;

      const newSet = new Set();

      for (let i = 0; i < multiple; i++) {
        const t = (base + i * interval) % DAY;
        newSet.add(t);
      }

      if (add) {
        newSet.forEach(v => this.departures.add(v));
      } else if (remove) {
        newSet.forEach(v => this.departures.delete(v));
      }

      this.updateList();
      return true;

    } catch (e) {
      return false;
    }
  }

  // -----------------------------
  // LIST UI
  // -----------------------------
  updateList() {
    const DAY = 24 * 60 * 60 * 1000;

    const sorted = Array.from(this.departures)
      .sort((a, b) => a - b)
      .map(time => {
        const d = new Date(time + Math.floor(Date.now() / DAY) * DAY);

        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        const ss = String(d.getSeconds()).padStart(2, "0");

        return new DashboardListItem(0, `${hh}:${mm}:${ss}`, 0);
      });

    this.departuresList = sorted;
  }

  // -----------------------------
  // BUTTON ACTIONS
  // -----------------------------
  onAddDeparture(text) {
    if (this.parseDeparture(text, true, false)) {
      this.save();
    }
  }

  onDeleteDeparture(item) {
    this.parseDeparture(item.name, false, true);
    this.save();
  }

  toggleRepeat() {
    this.selectedRepeatIndefinitely = !this.selectedRepeatIndefinitely;
    this.save();
  }

  // -----------------------------
  // SAVE (replace packet system)
  // -----------------------------
  save() {
    this.depot.repeatInfinitely = this.selectedRepeatIndefinitely;
    this.depot.cruisingAltitude = this.cruisingAltitude;
    this.depot.realTimeDepartures = Array.from(this.departures);

    // In Bedrock JS:
    if (globalThis.sendToServer) {
      globalThis.sendToServer("updateDepot", this.depot);
    }
  }

  // -----------------------------
  // UI RENDER (pseudo UI system)
  // -----------------------------
  render() {
    return {
      sliders: this.sliders,
      departures: this.departuresList,
      repeat: this.selectedRepeatIndefinitely,
      altitude: this.cruisingAltitude,
      showScheduleControls: this.showScheduleControls,
      showCruisingAltitude: this.showCruisingAltitude
    };
  }

  // -----------------------------
  // TICK (update loop)
  // -----------------------------
  tick() {
    // update sliders into depot
    for (let i = 0; i < 24; i++) {
      this.depot.setFrequency?.(i, this.sliders[i]);
    }
  }
}

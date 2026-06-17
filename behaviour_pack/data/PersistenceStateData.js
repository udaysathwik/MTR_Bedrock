// PersistentStateData.js
// Stores world-specific settings that persist across sessions

class PersistentStateData {

  constructor(worldId) {
    this.worldId = worldId;

    // 🧠 routeIds where announcements are disabled
    this.routeIdsWithDisabledAnnouncements = new Set();

    // internal dirty flag (needs saving)
    this.dirty = false;
  }

  // =========================
  // LOAD DATA (from storage)
  // =========================
  load(data) {
    if (!data) return;

    this.routeIdsWithDisabledAnnouncements = new Set(
      data.routeIdsWithDisabledAnnouncements || []
    );
  }

  // =========================
  // SAVE DATA (to storage)
  // =========================
  save() {
    return {
      routeIdsWithDisabledAnnouncements: Array.from(
        this.routeIdsWithDisabledAnnouncements
      )
    };
  }

  // =========================
  // QUERY
  // =========================

  getRouteIdHasDisabledAnnouncements(routeId) {
    return this.routeIdsWithDisabledAnnouncements.has(routeId);
  }

  // =========================
  // UPDATE
  // =========================

  setRouteIdHasDisabledAnnouncements(routeId, isDisabled) {
    if (isDisabled) {
      this.routeIdsWithDisabledAnnouncements.add(routeId);
    } else {
      this.routeIdsWithDisabledAnnouncements.delete(routeId);
    }

    this.markDirty();
  }

  // =========================
  // DIRTY STATE HANDLING
  // =========================

  markDirty() {
    this.dirty = true;
  }

  isDirty() {
    return this.dirty;
  }

  clearDirty() {
    this.dirty = false;
  }
}

export default PersistentStateData;

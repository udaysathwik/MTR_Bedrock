export class EditRouteScreen {
  constructor(route, previousScreen) {
    this.route = route
    this.previousScreen = previousScreen

    // fields
    this.routeNumber = route.routeNumber || ""
    this.routeType = route.routeType || "NORMAL"

    this.isHidden = route.hidden || false
    this.disableAnnouncements = route.disableAnnouncements || false

    // circular route logic
    this.isCircular = false
    this.isClockwise = false
    this.isAntiClockwise = false

    if (route.routePlatforms && route.routePlatforms.length > 0) {
      const first = route.routePlatforms[0]
      const last = route.routePlatforms[route.routePlatforms.length - 1]

      const firstStation = first?.platform?.area
      const lastStation = last?.platform?.area

      this.isCircular =
        firstStation &&
        lastStation &&
        firstStation.id === lastStation.id
    }

    // UI state
    this.ui = {
      routeTypeButtonText: this.getRouteTypeText(),
      checkboxHidden: this.isHidden,
      checkboxDisableAnnouncements: this.disableAnnouncements,
      checkboxClockwise: this.isClockwise,
      checkboxAntiClockwise: this.isAntiClockwise,
      lightRailNumber: this.routeNumber
    }
  }

  // ---------------- UI ACTIONS ----------------

  setRouteType(nextType) {
    this.route.routeType = nextType
    this.ui.routeTypeButtonText = this.getRouteTypeText()
  }

  toggleHidden(value) {
    this.isHidden = value
  }

  toggleDisableAnnouncements(value) {
    this.disableAnnouncements = value
  }

  setClockwise(value) {
    this.isClockwise = value
    if (value) this.isAntiClockwise = false
  }

  setAntiClockwise(value) {
    this.isAntiClockwise = value
    if (value) this.isClockwise = false
  }

  setRouteNumber(value) {
    this.routeNumber = value
  }

  // ---------------- SAVE ----------------

  save() {
    this.route.routeNumber = this.routeNumber
    this.route.hidden = this.isHidden
    this.route.disableAnnouncements = this.disableAnnouncements

    if (this.isCircular) {
      if (this.isClockwise) {
        this.route.circularState = "CLOCKWISE"
      } else if (this.isAntiClockwise) {
        this.route.circularState = "ANTICLOCKWISE"
      } else {
        this.route.circularState = "NONE"
      }
    } else {
      this.route.circularState = "NONE"
    }

    console.log("Route saved:", this.route)
  }

  close() {
    this.save()
    console.log("Screen closed")
  }

  // ---------------- HELPERS ----------------

  getRouteTypeText() {
    const type = this.route.routeType

    const mode = this.route.transportMode

    if (mode === "TRAIN") {
      if (type === "LIGHT_RAIL") return "Train Light Rail"
      if (type === "HIGH_SPEED") return "Train High Speed"
      return "Train Normal"
    }

    if (mode === "BOAT") {
      if (type === "LIGHT_RAIL") return "Boat Light Rail"
      if (type === "HIGH_SPEED") return "Boat High Speed"
      return "Boat Normal"
    }

    return ""
  }
}

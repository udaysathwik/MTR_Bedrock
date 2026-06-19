export class EditStationScreen {
  constructor(station, previousScreen) {
    this.station = station
    this.previousScreen = previousScreen

    this.editingExit = null
    this.editingDestinationIndex = -1
    this.clickDelay = 0

    this.zone = station.zone1 ?? 0

    this.exitLetter = ""
    this.exitNumber = ""
  }

  // ---------------- INIT ----------------

  init() {
    this.refreshLists()
  }

  // ---------------- UPDATE ----------------

  tick() {
    if (this.clickDelay > 0) this.clickDelay--
    this.refreshLists()
  }

  canClick() {
    return this.clickDelay === 0
  }

  lockClick() {
    this.clickDelay = 10
  }

  // ---------------- ZONE ----------------

  setZone(value) {
    const parsed = parseInt(value)
    this.zone = isNaN(parsed) ? 0 : parsed
  }

  // ---------------- EXIT ----------------

  startEditExit(exit, index = -1) {
    if (!exit) return

    this.editingExit = exit
    this.editingDestinationIndex = index

    this.exitLetter = (exit.name || "").replace(/[^A-Z]/g, "").toUpperCase()
    this.exitNumber = (exit.name || "").replace(/\D/g, "")
  }

  doneExitParent() {
    if (!this.canClick()) return
    this.lockClick()

    if (!this.editingExit) return

    const name = `${this.exitLetter}${this.exitNumber}`

    this.editingExit.name = name

    const existing = this.station.exits.find(e => e.name === name)

    if (!existing) {
      this.station.exits.push({
        name,
        destinations: [...(this.editingExit.destinations || [])]
      })
    } else {
      existing.destinations.push(...(this.editingExit.destinations || []))
    }

    this.editingExit = null
    this.refreshLists()
  }

  doneExitDestination(text) {
    if (!this.canClick()) return
    this.lockClick()

    if (!this.editingExit || !text) return

    if (!this.editingExit.destinations) {
      this.editingExit.destinations = []
    }

    if (this.editingDestinationIndex >= 0) {
      this.editingExit.destinations[this.editingDestinationIndex] = text
    } else {
      this.editingExit.destinations.push(text)
    }

    this.editingDestinationIndex = -1
    this.refreshLists()
  }

  // ---------------- LISTS ----------------

  refreshLists() {
    const exits = this.station.exits ?? []

    this.parentList = exits.map(exit => ({
      id: exit.name,
      name: exit.name,
      destinations: exit.destinations ?? []
    }))

    this.destinationList = this.editingExit
      ? (this.editingExit.destinations ?? []).map(d => ({ name: d }))
      : []
  }

  // ---------------- HANDLERS ----------------

  onEditParent(item) {
    const exit = this.findExit(item?.name)
    if (exit) this.startEditExit(exit)
  }

  onDeleteParent(index) {
    if (!this.canClick()) return
    this.lockClick()

    this.station.exits.splice(index, 1)
    this.editingExit = null
  }

  onEditDestination(index) {
    this.editingDestinationIndex = index
  }

  onDeleteDestination(index) {
    if (!this.editingExit) return

    this.editingExit.destinations.splice(index, 1)
  }

  findExit(name) {
    return (this.station.exits ?? []).find(e => e.name === name)
  }

  // ---------------- SAVE ----------------

  save() {
    this.station.zone1 = this.zone
    return this.station
  }

  close() {
    this.save()
  }
}

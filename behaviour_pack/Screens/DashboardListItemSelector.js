import { DashboardList } from "./DashboardList.js";
import { DashboardListItem } from "./DashboardListItem.js";

export class DashboardListSelectorScreen {
  constructor(allData, selectedIds, isSingleSelect = false, canRepeat = false, onClose = null) {
    this.allData = allData; // array of DashboardListItem
    this.selectedIds = selectedIds; // Set or array of IDs
    this.isSingleSelect = isSingleSelect;
    this.canRepeat = canRepeat;
    this.onClose = onClose;

    this.availableList = new DashboardList(
      null, null, null, null,
      this.onAdd.bind(this),
      null,
      null,
      () => this.searchAvailable || "",
      (text) => (this.searchAvailable = text)
    );

    this.selectedList = new DashboardList(
      null, null, null,
      this.updateList.bind(this),
      null,
      this.onDelete.bind(this),
      () => this.getSelectedList(),
      () => this.searchSelected || "",
      (text) => (this.searchSelected = text)
    );

    this.searchAvailable = "";
    this.searchSelected = "";
  }

  init() {
    this.updateList();
  }

  tick() {
    this.availableList.tick();
    this.selectedList.tick();
  }

  render(ctx) {
    this.availableList.render(ctx);
    this.selectedList.render(ctx, false);
  }

  // ---------- CORE LOGIC ----------

  updateList() {
    // AVAILABLE
    const available = [];

    for (const item of this.allData) {
      if (this.canRepeat || !this.selectedIds.includes(item.id)) {
        available.push(item);
      }
    }

    // SELECTED
    const selected = [];

    for (const id of this.selectedIds) {
      const found = this.allData.find(d => d.id === id);
      if (found) selected.push(found);
    }

    this.availableList.setData(available, false, false, false, false, true, false);
    this.selectedList.setData(selected, false, false, false, this.canRepeat, false, true);
  }

  onAdd(item) {
    if (this.isSingleSelect) {
      this.selectedIds.length = 0;
    }

    this.selectedIds.push(item.id);
    this.updateList();
  }

  onDelete(item) {
    if (this.canRepeat) {
      const index = this.selectedIds.indexOf(item.id);
      if (index !== -1) this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds = this.selectedIds.filter(id => id !== item.id);
    }

    this.updateList();
  }

  getSelectedList() {
    return this.selectedIds;
  }

  close() {
    if (this.onClose) this.onClose();
  }
}

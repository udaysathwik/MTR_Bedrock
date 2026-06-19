import { DashboardList } from "./DashboardList.js";

export class DashboardScreen {
  constructor(transportMode, clientData, network) {
    this.transportMode = transportMode;
    this.clientData = clientData;
    this.network = network;

    this.selectedTab = "STATIONS";

    this.editingArea = null;
    this.editingRoute = null;
    this.editingRoutePlatformIndex = -1;

    this.isNew = false;

    this.dashboardList = new DashboardList(
      this.onFind.bind(this),
      this.onDrawArea.bind(this),
      this.onEdit.bind(this),
      this.onSort.bind(this),
      null,
      this.onDelete.bind(this),
      this.getList.bind(this),
      () => this.clientData.DASHBOARD_SEARCH || "",
      (text) => (this.clientData.DASHBOARD_SEARCH = text)
    );

    this.widgetMap = {
      scale: 1,
      mode: "TOP_VIEW",
      setShowStations: () => {},
      find: () => {},
      startEditingArea: () => {},
      startEditingRoute: () => {},
    };

    this.name = "";
    this.customDestination = "";
    this.color = 0;
  }

  // ---------------- INIT ----------------

  init() {
    this.onSelectTab("STATIONS");
    this.dashboardList.init();
  }

  tick() {
    this.dashboardList.tick();

    switch (this.selectedTab) {
      case "STATIONS":
        this.loadStations();
        break;

      case "ROUTES":
        this.loadRoutes();
        break;

      case "DEPOTS":
        this.loadDepots();
        break;
    }
  }

  render(ctx) {
    this.widgetMap.render?.(ctx);
    this.dashboardList.render(ctx);
  }

  // ---------------- DATA LOADING ----------------

  loadStations() {
    if (!this.editingArea) {
      this.dashboardList.setData(
        this.clientData.stations || [],
        true, true, true, false, false, true
      );
    } else {
      this.dashboardList.setData(
        this.editingArea.savedRails || [],
        true, false, true, false, false, false
      );
    }
  }

  loadRoutes() {
    if (!this.editingRoute) {
      this.dashboardList.setData(
        this.clientData.routes || [],
        false, true, true, false, false, true
      );
    } else {
      const routeData = (this.editingRoute.routePlatforms || [])
        .map(p => {
          if (!p.platform) return null;

          const station = p.platform.area;
          const prefix = p.customDestination
            ? (p.customDestinationIsReset ? '"' : "*")
            : "";

          return {
            id: 0,
            name: station
              ? `${prefix}${station.name} (${p.platform.name})`
              : `${prefix}(${p.platform.name})`,
            color: station ? station.color : 0,
          };
        })
        .filter(Boolean);

      this.dashboardList.setData(
        routeData,
        false, false, true, true, false, true
      );
    }
  }

  loadDepots() {
    if (!this.editingArea) {
      this.dashboardList.setData(
        this.clientData.depots || [],
        true, true, true, false, false, true
      );
    } else {
      this.dashboardList.setData(
        this.editingArea.savedRails || [],
        true, false, true, false, false, false
      );
    }
  }

  // ---------------- TAB SYSTEM ----------------

  onSelectTab(tab) {
    this.selectedTab = tab;

    this.widgetMap.setShowStations?.(tab !== "DEPOTS");

    this.stopEditing?.();
  }

  // ---------------- ACTIONS ----------------

  onFind(item) {
    if (this.selectedTab === "STATIONS" || this.selectedTab === "DEPOTS") {
      if (item?.data?.center) {
        this.widgetMap.find(item.data.center);
      }
    }
  }

  onDrawArea(item) {
    if (item?.data) {
      this.startEditingArea?.(item.data, false);
    }
    this.dashboardList.clearSearch?.();
  }

  onEdit(item, index) {
    console.log("Edit:", item, index);
  }

  onSort() {
    if (this.editingRoute) {
      this.network.send("UPDATE_ROUTE", this.editingRoute);
    }
  }

  onDelete(item, index) {
    console.log("Delete:", item, index);
  }

  getList() {
    return this.editingRoute?.routePlatforms || [];
  }

  // ---------------- EDITING ----------------

  startEditingArea(area, isNew) {
    this.editingArea = area;
    this.editingRoute = null;
    this.isNew = isNew;

    this.name = area.name;
    this.color = area.color;

    this.widgetMap.startEditingArea(area);
  }

  startEditingRoute(route, isNew) {
    this.editingArea = null;
    this.editingRoute = route;
    this.isNew = isNew;

    this.name = route.name;
    this.color = route.color;

    this.widgetMap.startEditingRoute(route);
  }

  startEditingRouteDestination(index) {
    this.editingRoutePlatformIndex = index;
    const platform = this.editingRoute?.routePlatforms?.[index];
    if (platform) {
      this.customDestination = platform.customDestination;
    }
  }

  // ---------------- MAP ----------------

  onDrawCorners(c1, c2) {
    if (!this.editingArea) return;

    this.editingArea.corners = { c1, c2 };
  }

  onDrawCornersMouseRelease() {
    if (this.editingArea) {
      this.network.send("UPDATE_AREA", this.editingArea);
    }
  }
}

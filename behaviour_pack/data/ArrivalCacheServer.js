class ArrivalsCacheServer {
  constructor() {
    // platformId -> arrivals list
    this.platformCache = new Map();

    // worldId -> instance
    this.worldInstances = new Map();

    // time sync offset (server authority time correction)
    this.millisOffset = 0;

    // cache refresh time (ms)
    this.cacheTime = 1000;
  }

  // 🧠 Get or create world instance
  static getInstance(worldId) {
    if (!this.globalInstance) {
      this.globalInstance = new ArrivalsCacheServer();
    }

    if (!this.globalInstance.worldInstances.has(worldId)) {
      this.globalInstance.worldInstances.set(worldId, {
        platformCache: new Map(),
        lastTick: 0
      });
    }

    return this.globalInstance.worldInstances.get(worldId);
  }

  // ⏱️ Sync server time (Bedrock replacement for millisOffset)
  syncTime(serverTime) {
    const localTime = Date.now();
    this.millisOffset = serverTime - localTime;
  }

  // 📡 Handle arrival request (from client/dashboard)
  handleArrivalRequest(worldId, platformIds, callback) {
    const world = this.worldInstances.get(worldId);
    if (!world) return;

    const result = [];

    platformIds.forEach((platformId) => {
      const data = world.platformCache.get(platformId);

      if (data) {
        result.push({
          platform: platformId,
          train: data.train || null,
          route: data.route || null,
          arrivalMin: data.arrivalMin || 0
        });
      }
    });

    callback(result);
  }

  // 📦 Update platform arrival data (core server logic input)
  updatePlatform(worldId, platformId, arrivalData) {
    const world = this.worldInstances.get(worldId);
    if (!world) return;

    world.platformCache.set(platformId, {
      train: arrivalData.train,
      route: arrivalData.route,
      arrivalMin: arrivalData.arrivalMin,
      updatedAt: Date.now()
    });
  }

  // 🔁 Tick system (called every game tick or interval)
  tick(worldId) {
    const world = this.worldInstances.get(worldId);
    if (!world) return;

    const now = Date.now() + this.millisOffset;

    // simple cleanup / decay logic
    world.platformCache.forEach((value, key) => {
      if (now - value.updatedAt > this.cacheTime * 5) {
        world.platformCache.delete(key);
      }
    });

    world.lastTick = now;
  }

  // 🚉 Get full cache (for debug/dashboard)
  getAll(worldId) {
    const world = this.worldInstances.get(worldId);
    if (!world) return [];

    const result = [];

    world.platformCache.forEach((value, key) => {
      result.push({
        platform: key,
        ...value
      });
    });

    return result;
  }
}

export default ArrivalsCacheServer;

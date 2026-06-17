// ArrivalsCacheClient.js

class ArrivalsCacheClient {
  constructor(arrivalCache) {
    this.arrivalCache = arrivalCache;

    // Time sync offset (like Java millisOffset)
    this.millisOffset = 0;

    // Cached arrivals from server
    this.cachedArrivals = new Map();

    // refresh interval (ms)
    this.cacheTime = 3000;
  }

  // 🧠 Sync time with server (manual in Bedrock)
  syncTime(serverTime) {
    const localTime = Date.now();
    this.millisOffset = serverTime - localTime;
  }

  // ⏱️ Get corrected time
  getCorrectedTime() {
    return Date.now() + this.millisOffset;
  }

  // 📡 Simulate request to server (dashboard / system will call this)
  requestArrivals(platformIds, serverCallback) {
    if (!Array.isArray(platformIds)) return;

    // simulate sending request
    serverCallback(platformIds, (responseArrivals, serverTime) => {
      if (serverTime) {
        this.syncTime(serverTime);
      }

      this.updateCache(responseArrivals);
    });
  }

  // 📦 Update local cache
  updateCache(arrivalList) {
    this.cachedArrivals.clear();

    for (const arrival of arrivalList) {
      this.cachedArrivals.set(arrival.platform, {
        train: arrival.train,
        route: arrival.route,
        arrivalMin: arrival.arrivalMin,
      });
    }
  }

  // 🚉 Get arrival for a platform (UI / slideshow use)
  getArrival(platformId) {
    return this.cachedArrivals.get(platformId) || null;
  }

  // 📺 Get all arrivals (for boards / dashboard)
  getAllArrivals() {
    const result = [];

    for (const [platform, data] of this.cachedArrivals.entries()) {
      result.push({
        platform,
        train: data.train,
        route: data.route,
        arrivalMin: data.arrivalMin,
      });
    }

    return result;
  }

  // 🔁 auto refresh hook (called every tick/interval)
  tickRefresh(platformIds, serverCallback) {
    const now = this.getCorrectedTime();

    // simple refresh rule
    if (!this.lastRefresh || now - this.lastRefresh > this.cacheTime) {
      this.lastRefresh = now;
      this.requestArrivals(platformIds, serverCallback);
    }
  }
}

export default ArrivalsCacheClient;

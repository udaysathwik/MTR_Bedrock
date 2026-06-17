export class ArrivalCache {

static PERSISTENT_AGE = 5;

constructor(cachedMillis) {
    this.nextRequest = 0;
    this.cachedMillis = cachedMillis;

    // platformId -> age
    this.queuedPlatforms = new Map();

    // Cached arrival responses
    this.arrivalCache = [];
}

requestArrivals(platformIds) {

    if (this.queuedPlatforms.size === 0 && this.canSendRequest()) {
        this.nextRequest = Date.now() + 100;
    }

    for (const platformId of platformIds) {
        this.queuedPlatforms.set(platformId, 0);
    }

    const arrivals = [];

    for (const arrival of this.arrivalCache) {
        if (platformIds.includes(arrival.platformId)) {
            arrivals.push(arrival);
        }
    }

    return arrivals;
}

tick() {

    if (this.queuedPlatforms.size === 0) {
        return;
    }

    if (!this.canSendRequest()) {
        return;
    }

    const platformIds = [...this.queuedPlatforms.keys()];

    this.requestArrivalsFromServer(platformIds, (arrivalList) => {

        this.arrivalCache.length = 0;

        for (const arrival of arrivalList) {
            this.arrivalCache.push(arrival);
        }

    });

    for (const platformId of platformIds) {

        const age = this.queuedPlatforms.get(platformId);

        if (age > ArrivalCache.PERSISTENT_AGE) {
            this.queuedPlatforms.delete(platformId);
        } else {
            this.queuedPlatforms.set(platformId, age + 1);
        }
    }

    this.nextRequest = Date.now() + this.cachedMillis;
}

canSendRequest() {
    return Date.now() >= this.nextRequest;
}

getMillisOffset() {
    return 0;
}

requestArrivalsFromServer(platformIds, callback) {
    callback([]);
}

}

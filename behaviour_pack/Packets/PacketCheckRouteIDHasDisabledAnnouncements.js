import { world } from "@minecraft/server";

/**
 * Callback storage (client-side)
 */
const CALLBACKS = new Map();

/**
 * CLIENT → SERVER request
 */
export function checkRouteAnnouncements(player, routeId, callback) {
    const callbackId = Date.now() + Math.floor(Math.random() * 10000);

    CALLBACKS.set(callbackId, callback);

    // send request (simulated packet)
    world.getDimension("overworld").runCommandAsync(
        `scriptevent mtr:check_route ${routeId} ${callbackId}`
    );
}

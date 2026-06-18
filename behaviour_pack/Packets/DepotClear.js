import { world } from "@minecraft/server";

/**
 * DEPOT CLEAR PACKET (Bedrock style)
 * Clears all data linked to depot IDs
 */
export function clearDepotByIds(player, depotIds = []) {

    const payload = {
        type: "CLEAR_DEPOT_BY_IDS",
        depotIds: depotIds
    };

    // send request to server
    world.getDimension("overworld").runCommandAsync(
        `scriptevent mtr:clear_depot ${JSON.stringify(payload)}`
    );
}

/**
 * SERVER HANDLER
 */
world.afterEvents.scriptEventReceive.subscribe((event) => {

    if (event.id !== "mtr:clear_depot") return;

    const data = JSON.parse(event.message);

    const depotIds = data.depotIds;

    for (const id of depotIds) {
        DepotModule.clearDepot(id);
    }

    world.sendMessage("§cDepot data cleared");
});

/**
 * DEPOT STORAGE MODULE
 */
export const DepotModule = {
    depots: new Map(),

    clearDepot(id) {
        this.depots.delete(id);
    }
};

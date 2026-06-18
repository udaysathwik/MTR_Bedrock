import { world } from "@minecraft/server";

/**
 * DEPOT GENERATE PACKET (Bedrock style)
 * Generates depot-related data using depot IDs
 */
export function generateDepotByIds(player, depotIds = []) {

    const payload = {
        type: "GENERATE_DEPOT_BY_IDS",
        depotIds: depotIds
    };

    // send request to server
    world.getDimension("overworld").runCommandAsync(
        `scriptevent mtr:generate_depot ${JSON.stringify(payload)}`
    );
}

/**
 * SERVER HANDLER
 */
world.afterEvents.scriptEventReceive.subscribe((event) => {

    if (event.id !== "mtr:generate_depot") return;

    const data = JSON.parse(event.message);

    const depotIds = data.depotIds;

    for (const id of depotIds) {
        DepotModule.generateDepot(id);
    }

    world.sendMessage("§aDepot generated");
});

/**
 * DEPOT STORAGE MODULE
 */
export const DepotModule = {
    depots: new Map(),

    generateDepot(id) {
        this.depots.set(id, {
            id: id,
            status: "generated"
        });
    }
};

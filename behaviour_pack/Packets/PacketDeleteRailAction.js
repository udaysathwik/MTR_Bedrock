import { world } from "@minecraft/server";

/**
 * DELETE RAIL ACTION PACKET (Bedrock version)
 * Client → Server
 */
export function deleteRailAction(player, id) {

    // Send request to server using script event
    world.getDimension("overworld").runCommandAsync(
        `scriptevent mtr:delete_rail_action ${id}`
    );
}

/**
 * SERVER HANDLER
 */
world.afterEvents.scriptEventReceive.subscribe((event) => {

    if (event.id !== "mtr:delete_rail_action") return;

    const id = Number(event.message);

    // remove rail action from system
    RailActionModule.removeRailAction(id);

    world.sendMessage(`§cRail Action deleted: ${id}`);
});

/**
 * STORAGE MODULE
 */
export const RailActionModule = {
    railActions: new Map(),

    removeRailAction(id) {
        this.railActions.delete(id);
    }
};

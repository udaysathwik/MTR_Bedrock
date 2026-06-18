import { world } from "@minecraft/server";

/**
 * DEPOT INSTANT DEPLOY PACKET (Bedrock style)
 * Instantly deploys depot operations using depot IDs
 */
export function instantDeployDepotByIds(player, depotIds = []) {

    const payload = {
        type: "INSTANT_DEPLOY_DEPOT_BY_IDS",
        depotIds: depotIds
    };

    // send request to server
    world.getDimension("overworld").runCommandAsync(
        `scriptevent mtr:instant_deploy_depot ${JSON.stringify(payload)}`
    );
}

/**
 * SERVER HANDLER
 */
world.afterEvents.scriptEventReceive.subscribe((event) => {

    if (event.id !== "mtr:instant_deploy_depot") return;

    const data = JSON.parse(event.message);

    const depotIds = data.depotIds;

    for (const id of depotIds) {
        DepotModule.instantDeploy(id);
    }

    world.sendMessage("§bDepot instantly deployed");
});

/**
 * DEPOT STORAGE MODULE
 */
export const DepotModule = {
    depots: new Map(),

    instantDeploy(id) {
        const depot = this.depots.get(id) || {};

        depot.id = id;
        depot.state = "instantly_deployed";

        this.depots.set(id, depot);
    }
};

import { world } from "@minecraft/server";

/**
 * Delete request types
 */
export class DeleteDataRequest {
    constructor() {
        this.railIds = [];
        this.railNodes = [];
        this.liftFloors = [];
    }

    addRailId(id) {
        this.railIds.push(id);
        return this;
    }

    addRailNode(pos) {
        this.railNodes.push(pos);
        return this;
    }

    addLiftFloor(pos) {
        this.liftFloors.push(pos);
        return this;
    }
}

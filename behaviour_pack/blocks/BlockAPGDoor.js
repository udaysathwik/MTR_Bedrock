// behavior_packs/mod/block/BlockAPGDoor.js

import BlockPSDAPGDoorBase from "./BlockPSDAPGDoorBase.js";

export default class BlockAPGDoor extends BlockPSDAPGDoorBase {

    constructor(location = null) {
        super();

        this.location = location;

        this.identifier = "mtr:apg_door";
        this.item = "mtr:apg_door";

        this.isOpen = false;
    }

    createBlockEntity(location) {
        return {
            type: "APG_DOOR",
            location: location,
            isOpen: false
        };
    }

    getItem() {
        return this.item;
    }

    openDoor() {
        this.isOpen = true;
    }

    closeDoor() {
        this.isOpen = false;
    }

    toggleDoor() {
        this.isOpen = !this.isOpen;
    }

    tick() {
        // TODO:
        // Door animation
        // Platform synchronization
        // Train door linkage
    }
}

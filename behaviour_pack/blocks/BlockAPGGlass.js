// behavior_packs/mod/block/BlockAPGGlass.js

import BlockPSDAPGGlassBase from "./BlockPSDAPGGlassBase.js";

export default class BlockAPGGlass extends BlockPSDAPGGlassBase {

    static ARROW_DIRECTION = {
        MIN: 0,
        MAX: 3
    };

    constructor(location = null) {
        super();

        this.location = location;

        this.identifier = "mtr:apg_glass";
        this.item = "mtr:apg_glass";

        this.facing = 0;
        this.half = "upper";
        this.sideExtended = false;
        this.arrowDirection = 0;
    }

    getItem() {
        return this.item;
    }

    onUse(player, hitY) {

        if (
            this.half === "upper" &&
            hitY > 0.21875
        ) {

            this.arrowDirection++;

            if (this.arrowDirection > 3) {
                this.arrowDirection = 0;
            }

            this.propagateArrow();

            return true;
        }

        return super.onUse?.(player, hitY) ?? false;
    }

    propagateArrow() {

        // TODO:
        // Propagate arrow direction
        // to connected APG glass blocks

    }

    createBlockEntity(location) {
        return {
            type: "APG_GLASS",
            location: location,
            arrowDirection: this.arrowDirection
        };
    }

    getProperties() {
        return {
            facing: this.facing,
            half: this.half,
            sideExtended: this.sideExtended,
            arrowDirection: this.arrowDirection
        };
    }
}

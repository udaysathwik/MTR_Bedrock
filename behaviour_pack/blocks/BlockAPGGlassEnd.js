// behavior_packs/mod/block/BlockAPGGlassEnd.js

import BlockPSDAPGGlassEndBase from "./BlockPSDAPGGlassEndBase.js";

export default class BlockAPGGlassEnd extends BlockPSDAPGGlassEndBase {

    constructor() {
        super();

        this.identifier = "mtr:apg_glass_end";
        this.item = "mtr:apg_glass_end";
    }

    getItem() {
        return this.item;
    }
}

/**
 * Base class for handling screen navigation and historical flow in Bedrock scripting.
 */
export class MTRScreenBase {
    /**
     * @param {MTRScreenBase|Function|null} [previousScreen=null] Pass either another screen instance or a callback function to reopen the prior UI.
     */
    constructor(previousScreen = null) {
        this.previousScreen = previousScreen;
    }

    /**
     * Subclasses must override this method to render their specific form (ActionFormData, ModalFormData, etc.).
     * @param {import("@minecraft/server").Player} player
     */
    show(player) {
        // Overridden by child classes
    }

    /**
     * Equivalent to onClose2(). Reopens the previous screen if it exists.
     * @param {import("@minecraft/server").Player} player
     */
    onClose(player) {
        if (!this.previousScreen) return;

        if (this.previousScreen instanceof MTRScreenBase) {
            this.previousScreen.show(player);
        } else if (typeof this.previousScreen === "function") {
            this.previousScreen(player);
        }
    }
}

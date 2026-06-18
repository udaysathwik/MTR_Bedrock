// behavior_packs/mod/config/Client.js

const DYNAMIC_RESOLUTION_COUNT = 8;
const TRAIN_OSCILLATION_COUNT = 15;

export default class ClientConfig {

    constructor(data = {}) {

        this.chatAnnouncements = data.chatAnnouncements ?? true;
        this.textToSpeechAnnouncements = data.textToSpeechAnnouncements ?? false;
        this.hideTranslucentParts = data.hideTranslucentParts ?? false;
        this.languageDisplay = data.languageDisplay ?? "BOTH";

        this.dynamicTextureResolution =
            data.dynamicTextureResolution ?? 4;

        this.vehicleOscillationMultiplier =
            data.vehicleOscillationMultiplier ?? 1.0;

        this.defaultRail3D = data.defaultRail3D ?? true;
        this.useMTRFont = data.useMTRFont ?? true;
        this.disableShadowsForShaders =
            data.disableShadowsForShaders ?? false;

        this.preloadResourcePattern =
            data.preloadResourcePattern ?? ".*";

        this.betaWarningVersion =
            data.betaWarningVersion ?? "";
    }

    getChatAnnouncements() {
        return this.chatAnnouncements;
    }

    getTextToSpeechAnnouncements() {
        return this.textToSpeechAnnouncements;
    }

    getHideTranslucentParts() {
        return this.hideTranslucentParts;
    }

    getLanguageDisplay() {
        return this.languageDisplay;
    }

    getDynamicTextureResolution() {
        return this.dynamicTextureResolution;
    }

    getVehicleOscillationMultiplier() {
        return this.vehicleOscillationMultiplier;
    }

    getDefaultRail3D() {
        return this.defaultRail3D;
    }

    getUseMTRFont() {
        return this.useMTRFont;
    }

    getDisableShadowsForShaders() {
        return this.disableShadowsForShaders;
    }

    matchesPreloadResourcePattern(id) {
        const regex = new RegExp(this.preloadResourcePattern);
        return regex.test(id);
    }

    showBetaWarningScreen() {
        return false;
    }

    toggleChatAnnouncements() {
        this.chatAnnouncements = !this.chatAnnouncements;
    }

    toggleTextToSpeechAnnouncements() {
        this.textToSpeechAnnouncements =
            !this.textToSpeechAnnouncements;
    }

    toggleHideTranslucentParts() {
        this.hideTranslucentParts =
            !this.hideTranslucentParts;
    }

    cycleLanguageDisplay() {

        const values = [
            "BOTH",
            "CJK",
            "NON_CJK"
        ];

        const index =
            values.indexOf(this.languageDisplay);

        this.languageDisplay =
            values[(index + 1) % values.length];
    }

    setDynamicTextureResolution(value) {

        this.dynamicTextureResolution =
            Math.max(
                0,
                Math.min(
                    DYNAMIC_RESOLUTION_COUNT,
                    value
                )
            );
    }

    setVehicleOscillationMultiplier(value) {

        this.vehicleOscillationMultiplier =
            Math.max(
                0,
                Math.min(
                    TRAIN_OSCILLATION_COUNT / 10,
                    value
                )
            );
    }

    toggleDefaultRail3D() {
        this.defaultRail3D = !this.defaultRail3D;
    }

    toggleUseMTRFont() {
        this.useMTRFont = !this.useMTRFont;
    }

    toggleDisableShadowsForShaders() {
        this.disableShadowsForShaders =
            !this.disableShadowsForShaders;
    }

    hideBetaWarningScreen(modVersion) {
        this.betaWarningVersion = modVersion;
    }

    toJSON() {
        return {
            chatAnnouncements: this.chatAnnouncements,
            textToSpeechAnnouncements: this.textToSpeechAnnouncements,
            hideTranslucentParts: this.hideTranslucentParts,
            languageDisplay: this.languageDisplay,
            dynamicTextureResolution: this.dynamicTextureResolution,
            vehicleOscillationMultiplier: this.vehicleOscillationMultiplier,
            defaultRail3D: this.defaultRail3D,
            useMTRFont: this.useMTRFont,
            disableShadowsForShaders: this.disableShadowsForShaders,
            preloadResourcePattern: this.preloadResourcePattern,
            betaWarningVersion: this.betaWarningVersion
        };
    }
}

export {
    DYNAMIC_RESOLUTION_COUNT,
    TRAIN_OSCILLATION_COUNT
};

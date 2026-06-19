// PacketUpdateLastRailStyles.js (Bedrock Edition)

class PacketUpdateLastRailStyles {

    static SERVER_CACHE = new Map() // player → transportMode → styles

    static CLIENT_CACHE = new Map()

    constructor(transportMode, styles) {
        this.transportMode = transportMode
        this.styles = styles
    }

    // CLIENT → SERVER
    static update(player, transportMode, styles) {

        const packet = {
            type: "update_last_rail_styles",
            uuid: player.id,
            transportMode,
            styles
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "update_last_rail_styles") return

        const uuid = packet.uuid
        const mode = packet.transportMode
        const styles = packet.styles || []

        // 🧠 SERVER CACHE UPDATE
        if (!this.SERVER_CACHE.has(uuid)) {
            this.SERVER_CACHE.set(uuid, new Map())
        }

        const playerCache = this.SERVER_CACHE.get(uuid)
        playerCache.set(mode, [...new Set(styles)].sort())

        // 💾 Persist in world memory
        world.setDynamicProperty(
            `rail_style_${uuid}_${mode}`,
            JSON.stringify(styles)
        )
    }

    // CLIENT SIDE APPLY SYSTEM
    static canApplyStyles(player, rail, modifyRail = false) {

        const uuid = player.id
        const mode = rail.transportMode
        const currentStyles = rail.styles || []

        const cached =
            this.SERVER_CACHE.get(uuid)?.get(mode) ||
            this.getDefaultStyles(mode)

        // compare arrays
        const same =
            JSON.stringify([...cached].sort()) ===
            JSON.stringify([...currentStyles].sort())

        if (same) return false

        if (modifyRail) {
            const updatedRail = this.getRailWithLastStyles(rail, cached)

            MinecraftClientData.updateRail(updatedRail)
        }

        return true
    }

    // APPLY STORED STYLE TO RAIL
    static getRailWithLastStyles(rail, styles) {

        return {
            ...rail,
            styles: [...styles]
        }
    }

    // DEFAULT STYLE SYSTEM
    static getDefaultStyles(mode) {
        return mode === "BOAT" ? [] : ["default_rail"]
    }
}

module.exports = PacketUpdateLastRailStyles

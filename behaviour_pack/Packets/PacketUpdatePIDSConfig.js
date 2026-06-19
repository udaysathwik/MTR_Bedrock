// PacketUpdatePIDSConfig.js (Bedrock Edition)

class PacketUpdatePIDSConfig {

    constructor(x, y, z, messages, hideArrivals, platformIds, displayPage) {
        this.pos = { x, y, z }
        this.messages = messages
        this.hideArrivals = hideArrivals
        this.platformIds = platformIds
        this.displayPage = displayPage
    }

    // CLIENT → SERVER
    static update(player, x, y, z, messages, hideArrivals, platformIds, displayPage) {

        const packet = {
            type: "update_pids_config",
            pos: { x, y, z },
            messages,
            hideArrivals,
            platformIds,
            displayPage
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "update_pids_config") return

        const { x, y, z } = packet.pos

        const config = {
            messages: packet.messages || [],
            hideArrivals: packet.hideArrivals || [],
            platformIds: packet.platformIds || [],
            displayPage: packet.displayPage || 0
        }

        // 💾 Store PIDS config in world memory
        const key = `pids_${x}_${y}_${z}`

        world.setDynamicProperty(
            key,
            JSON.stringify(config)
        )

        // 🔁 Broadcast update to all players (UI sync)
        world.getPlayers().forEach(player => {
            player.runCommandAsync(
                `scriptevent mtr:packet ${JSON.stringify({
                    type: "pids_update_client",
                    pos: packet.pos,
                    config
                })}`
            )
        })
    }

    // CLIENT HANDLER (UI UPDATE SYSTEM)
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "pids_update_client") return

        const { x, y, z } = packet.pos
        const cfg = packet.config

        // 📺 Update display UI
        ClientPacketHelper.updatePIDSConfig(
            x,
            y,
            z,
            cfg.messages,
            cfg.hideArrivals,
            cfg.platformIds,
            cfg.displayPage
        )
    }
}

module.exports = PacketUpdatePIDSConfig

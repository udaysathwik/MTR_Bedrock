// PacketUpdateEyeCandyConfig.js (Bedrock Edition)

class PacketUpdateEyeCandyConfig {

    constructor(x, y, z, config) {
        this.pos = { x, y, z }
        this.config = config
    }

    // CLIENT → SERVER
    static update(player, x, y, z, config) {

        const packet = {
            type: "update_eye_candy",
            pos: { x, y, z },
            config
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "update_eye_candy") return

        const { x, y, z } = packet.pos
        const cfg = packet.config

        // 🧠 Simulated chunk check (Bedrock replacement)
        const key = `eye_${x}_${y}_${z}`

        // 💾 Store config in world memory
        world.setDynamicProperty(key, JSON.stringify(cfg))

        // Optional: notify client for live update
        world.getPlayers().forEach(player => {
            player.runCommandAsync(
                `scriptevent mtr:packet ${JSON.stringify({
                    type: "eye_candy_update_client",
                    pos: packet.pos,
                    config: cfg
                })}`
            )
        })
    }

    // CLIENT HANDLER (visual rendering)
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "eye_candy_update_client") return

        const { x, y, z } = packet.pos
        const cfg = packet.config

        // 🎨 Apply visual model update (client-side rendering system)
        ClientPacketHelper.updateEyeCandyModel(x, y, z, {
            modelId: cfg.modelId,
            translate: {
                x: cfg.translateX,
                y: cfg.translateY,
                z: cfg.translateZ
            },
            rotate: {
                x: cfg.rotateX,
                y: cfg.rotateY,
                z: cfg.rotateZ
            },
            fullLight: cfg.fullLight
        })
    }
}

module.exports = PacketUpdateEyeCandyConfig

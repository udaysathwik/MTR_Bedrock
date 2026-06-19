// PacketUpdateLiftTrackFloorConfig.js (Bedrock Edition)

class PacketUpdateLiftTrackFloorConfig {

    constructor(x, y, z, floorNumber, floorDescription, shouldDing) {
        this.pos = { x, y, z }
        this.floorNumber = floorNumber
        this.floorDescription = floorDescription
        this.shouldDing = shouldDing
    }

    // CLIENT → SERVER
    static update(player, x, y, z, floorNumber, floorDescription, shouldDing) {

        const packet = {
            type: "update_lift_floor",
            pos: { x, y, z },
            floorNumber,
            floorDescription,
            shouldDing
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "update_lift_floor") return

        const { x, y, z } = packet.pos

        // 🧠 Build lift floor config object
        const config = {
            floorNumber: packet.floorNumber,
            floorDescription: packet.floorDescription,
            shouldDing: packet.shouldDing
        }

        // 💾 Store in world memory (Bedrock equivalent of BlockEntity.data)
        const key = `lift_floor_${x}_${y}_${z}`

        world.setDynamicProperty(
            key,
            JSON.stringify(config)
        )

        // 🔁 Optional: notify all players (lift system sync)
        world.getPlayers().forEach(player => {
            player.runCommandAsync(
                `scriptevent mtr:packet ${JSON.stringify({
                    type: "lift_floor_update_client",
                    pos: packet.pos,
                    config
                })}`
            )
        })
    }

    // CLIENT HANDLER
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "lift_floor_update_client") return

        const { x, y, z } = packet.pos
        const cfg = packet.config

        // 🧠 Apply UI / lift system update
        ClientPacketHelper.updateLiftFloorConfig(
            x,
            y,
            z,
            cfg.floorNumber,
            cfg.floorDescription,
            cfg.shouldDing
        )
    }
}

module.exports = PacketUpdateLiftTrackFloorConfig

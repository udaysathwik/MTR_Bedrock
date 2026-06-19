// PacketTurnOnBlockEntity.js (Bedrock Edition)

class PacketTurnOnBlockEntity {

    constructor(x, y, z, level = 0) {
        this.pos = { x, y, z }
        this.level = level
    }

    // CLIENT → SERVER
    static activate(player, x, y, z, level = 0) {

        const packet = {
            type: "turn_on_block_entity",
            pos: { x, y, z },
            level
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER LOGIC (core simulation)
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "turn_on_block_entity") return

        const { x, y, z } = packet.pos

        // Get block type (Bedrock-safe simulation)
        const blockType = world.getBlock({ x, y, z })?.typeId

        // 🚦 SIGNAL BLOCK LOGIC
        if (blockType === "mtr:signal") {

            world.setBlock({ x, y, z }, "mtr:signal_active")
        }

        // 🧠 SENSOR BLOCK LOGIC
        if (blockType === "mtr:train_sensor") {

            world.setBlock({ x, y, z }, "mtr:train_sensor_active")
        }

        // Optional: level-based logic
        if (packet.level > 0) {

            world.setDynamicProperty(
                `block_level_${x}_${y}_${z}`,
                packet.level
            )
        }
    }

    // CLIENT HANDLER (optional visual feedback)
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "turn_on_block_entity") return

        console.log(
            `Block activated at ${packet.pos.x},${packet.pos.y},${packet.pos.z}`
        )
    }
}

module.exports = PacketTurnOnBlockEntity

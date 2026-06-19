// PacketOpenBlockEntityScreen.js (Bedrock Edition)

class PacketOpenBlockEntityScreen {

    constructor(x, y, z) {
        this.pos = { x, y, z }
    }

    // CLIENT → SERVER request
    static requestOpen(player, x, y, z) {

        const packet = {
            type: "open_block_screen",
            pos: { x, y, z }
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "open_block_screen") return

        // In Bedrock, we cannot open GUI from server directly,
        // so we send back instruction to client

        const response = {
            type: "open_screen_client",
            pos: packet.pos
        }

        world.getPlayers().forEach(player => {
            player.runCommandAsync(
                `scriptevent mtr:packet ${JSON.stringify(response)}`
            )
        })
    }

    // CLIENT HANDLER
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "open_screen_client") return

        const { x, y, z } = packet.pos

        // Open UI (custom screen system)
        ClientPacketHelper.openBlockEntityScreen(x, y, z)
    }
}

module.exports = PacketOpenBlockEntityScreen

// PacketOpenLiftCustomizationScreen.js (Bedrock Edition)

class PacketOpenLiftCustomizationScreen {

    constructor(x, y, z) {
        this.pos = { x, y, z }
    }

    // CLIENT → SERVER request
    static requestOpen(player, x, y, z) {

        const packet = {
            type: "open_lift_customization",
            pos: { x, y, z }
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "open_lift_customization") return

        // Server just forwards to client
        const response = {
            type: "open_lift_customization_client",
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

        if (packet.type !== "open_lift_customization_client") return

        const { x, y, z } = packet.pos

        // Open lift customization UI
        ClientPacketHelper.openLiftCustomizationScreen(x, y, z)
    }
}

module.exports = PacketOpenLiftCustomizationScreen

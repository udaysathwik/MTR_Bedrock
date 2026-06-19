// PacketOpenPIDSConfigScreen.js (Bedrock Edition)

class PacketOpenPIDSConfigScreen {

    constructor(x, y, z, maxArrivals = 5) {
        this.pos = { x, y, z }
        this.maxArrivals = maxArrivals
    }

    // CLIENT → SERVER request
    static requestOpen(player, x, y, z, maxArrivals = 5) {

        const packet = {
            type: "open_pids_config",
            pos: { x, y, z },
            maxArrivals
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "open_pids_config") return

        const response = {
            type: "open_pids_config_client",
            pos: packet.pos,
            maxArrivals: packet.maxArrivals
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

        if (packet.type !== "open_pids_config_client") return

        const { x, y, z } = packet.pos

        // Open PIDS config UI
        ClientPacketHelper.openPIDSConfigScreen(
            x,
            y,
            z,
            packet.maxArrivals
        )
    }
}

module.exports = PacketOpenPIDSConfigScreen

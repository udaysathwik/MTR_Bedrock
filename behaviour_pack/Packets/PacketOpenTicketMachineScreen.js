// PacketOpenTicketMachineScreen.js (Bedrock Edition)

class PacketOpenTicketMachineScreen {

    constructor(balance = 0) {
        this.balance = balance
    }

    // CLIENT → SERVER request
    static requestOpen(player, balance = 0) {

        const packet = {
            type: "open_ticket_machine",
            balance
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "open_ticket_machine") return

        const response = {
            type: "open_ticket_machine_client",
            balance: packet.balance
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

        if (packet.type !== "open_ticket_machine_client") return

        // Open UI
        ClientPacketHelper.openTicketMachineScreen(packet.balance)
    }
}

module.exports = PacketOpenTicketMachineScreen

// PacketRequestData.js (Bedrock Edition)

class PacketRequestData {

    constructor(dataRequest = {}) {
        this.dataRequest = dataRequest
    }

    // CLIENT → SERVER request
    static request(player, dataRequest) {

        const packet = {
            type: "get_data",
            request: dataRequest,
            callbackId: Math.random().toString(36).substring(2)
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static async handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "get_data") return

        // Simulated data processing (replaces DataRequest + OperationProcessor)
        const responseData = {
            type: "data_response",
            callbackId: packet.callbackId,
            data: {
                stations: [],
                routes: [],
                lifts: [],
                platforms: []
            }
        }

        // Send response ONLY to requesting player (PLAYER response type)
        world.getPlayers().forEach(player => {
            player.runCommandAsync(
                `scriptevent mtr:packet ${JSON.stringify(responseData)}`
            )
        })
    }

    // CLIENT HANDLER
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "data_response") return

        // Store in client data system
        MinecraftClientData.setInstance(packet.data)
    }
}

module.exports = PacketRequestData

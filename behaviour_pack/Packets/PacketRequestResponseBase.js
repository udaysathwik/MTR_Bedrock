// PacketRequestResponseBase.js (Bedrock Architecture Core)

class PacketRequestResponseBase {

    constructor(content = {}) {
        this.content = content
    }

    // CLIENT → SERVER
    static send(player, type, data, responseType = "PLAYER") {

        const callbackId = Math.random().toString(36).substring(2)

        const packet = {
            type,
            data,
            callbackId,
            responseType
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )

        return callbackId
    }

    // SERVER CORE PROCESSOR
    static async handleServer(event, world, handlers) {

        const packet = JSON.parse(event.message)

        if (!handlers[packet.type]) return

        const handler = handlers[packet.type]

        const result = await handler(packet.data, world)

        if (!result) return

        const response = {
            type: packet.type + "_response",
            callbackId: packet.callbackId,
            data: result.data
        }

        if (packet.responseType === "PLAYER") {

            world.getPlayers().forEach(player => {
                player.runCommandAsync(
                    `scriptevent mtr:packet ${JSON.stringify(response)}`
                )
            })

        } else if (packet.responseType === "ALL") {

            world.getPlayers().forEach(player => {
                player.runCommandAsync(
                    `scriptevent mtr:packet ${JSON.stringify(response)}`
                )
            })
        }
    }

    // CLIENT HANDLER
    static handleClient(event, callbacks) {

        const packet = JSON.parse(event.message)

        const callback = callbacks.get(packet.callbackId)

        if (callback) {
            callback(packet.data)
            callbacks.delete(packet.callbackId)
        }
    }
}

module.exports = PacketRequestResponseBase

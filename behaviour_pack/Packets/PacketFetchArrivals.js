// PacketFetchArrivals.js (Bedrock Edition version)

const CALLBACKS = new Map()

class PacketFetchArrivals {

    constructor(platformIds = [], callbackId = null) {
        this.platformIds = platformIds
        this.callbackId = callbackId ?? Math.random().toString(36).substring(2)
    }

    // CLIENT -> SERVER request
    static sendToServer(player, platformIds) {
        const packet = {
            type: "fetch_arrivals",
            platformIds: platformIds,
            callbackId: Math.random().toString(36).substring(2)
        }

        CALLBACKS.set(packet.callbackId, null)

        player.runCommandAsync(`scriptevent mtr:packet ${JSON.stringify(packet)}`)
        return packet.callbackId
    }

    // SERVER HANDLER
    static handleServer(event, world) {
        const packet = JSON.parse(event.message)

        if (packet.type !== "fetch_arrivals") return

        const instance = world.getDynamicProperty("arrivals_cache") // simplified concept

        const response = {
            type: "fetch_arrivals_response",
            callbackId: packet.callbackId,
            responseTime: Date.now(),
            arrivals: instance ? instance.getArrivals(packet.platformIds) : []
        }

        // send back to client
        world.getPlayers().forEach(player => {
            player.runCommandAsync(`scriptevent mtr:packet ${JSON.stringify(response)}`)
        })
    }

    // CLIENT HANDLER
    static handleClient(event) {
        const packet = JSON.parse(event.message)

        if (packet.type !== "fetch_arrivals_response") return

        const callback = CALLBACKS.get(packet.callbackId)
        if (!callback) return

        CALLBACKS.delete(packet.callbackId)

        callback(packet.responseTime, packet.arrivals)
    }
}

module.exports = PacketFetchArrivals

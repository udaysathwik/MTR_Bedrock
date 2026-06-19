// PacketForwardClientRequest.js (Bedrock Edition version)

const CALLBACKS = new Map()

class PacketForwardClientRequest {

    constructor(endpoint, content = "", path = "", callbackId = null) {
        this.endpoint = endpoint
        this.content = content || ""
        this.path = path || ""
        this.callbackId = callbackId || Math.random().toString(36).substring(2)
    }

    // CLIENT → SERVER request
    static sendRequest(player, endpoint, content, callback) {

        const callbackId = Math.random().toString(36).substring(2)

        CALLBACKS.set(callbackId, callback)

        const packet = {
            type: "forward_request",
            endpoint,
            content: content || "",
            path: "",
            callbackId
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )

        return callbackId
    }

    // SERVER SIDE HANDLER
    static async handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "forward_request") return

        const url = `http://localhost:${world.getDynamicProperty("server_port") || 19132}${packet.endpoint}`

        try {

            const response = await fetch(url, {
                method: "POST",
                body: packet.content || null
            })

            const text = await response.text()

            const responsePacket = {
                type: "forward_response",
                callbackId: packet.callbackId,
                content: text,
                path: packet.endpoint
            }

            world.getPlayers().forEach(player => {
                player.runCommandAsync(
                    `scriptevent mtr:packet ${JSON.stringify(responsePacket)}`
                )
            })

        } catch (e) {

            const errorPacket = {
                type: "forward_response",
                callbackId: packet.callbackId,
                content: "ERROR: " + e.message,
                path: packet.endpoint
            }

            world.getPlayers().forEach(player => {
                player.runCommandAsync(
                    `scriptevent mtr:packet ${JSON.stringify(errorPacket)}`
                )
            })
        }
    }

    // CLIENT SIDE HANDLER
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "forward_response") return

        const callback = CALLBACKS.get(packet.callbackId)

        if (!callback) return

        CALLBACKS.delete(packet.callbackId)

        callback(packet.content, packet.path)
    }
}

module.exports = PacketForwardClientRequest

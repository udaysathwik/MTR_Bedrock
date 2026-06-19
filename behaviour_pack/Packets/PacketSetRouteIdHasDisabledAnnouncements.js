// PacketSetRouteIdHasDisabledAnnouncements.js (Bedrock Edition)

const ROUTE_STATE = new Map()

class PacketSetRouteIdHasDisabledAnnouncements {

    constructor(routeId, isDisabled) {
        this.routeId = routeId
        this.isDisabled = isDisabled
    }

    // CLIENT → SERVER
    static set(player, routeId, isDisabled) {

        const packet = {
            type: "set_route_announcements",
            routeId,
            isDisabled
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER (WORLD STATE LOGIC)
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "set_route_announcements") return

        // 🧠 Persist route state (Bedrock equivalent of PersistentStateData)
        ROUTE_STATE.set(packet.routeId, packet.isDisabled)

        // Optional: store in world memory too
        world.setDynamicProperty(
            `route_${packet.routeId}_announcements`,
            packet.isDisabled
        )
    }

    // CLIENT HANDLER (optional sync)
    static handleClient(event) {
        const packet = JSON.parse(event.message)

        if (packet.type !== "set_route_announcements") return

        // Client can update UI or cache if needed
        console.log(
            `Route ${packet.routeId} announcements: ${packet.isDisabled}`
        )
    }
}

module.exports = PacketSetRouteIdHasDisabledAnnouncements

// PacketOpenDashboardScreen.js (Bedrock Edition)

const CALLBACKS = new Map()

class PacketOpenDashboardScreen {

    constructor(transportMode, screenType = "DEFAULT", dataId = 0) {
        this.transportMode = transportMode
        this.screenType = screenType
        this.dataId = dataId
    }

    // CLIENT → SERVER request
    static openDashboard(player, transportMode, screenType = "DEFAULT", dataId = 0) {

        const callbackId = Math.random().toString(36).substring(2)

        const packet = {
            type: "open_dashboard",
            transportMode,
            screenType,
            dataId,
            callbackId
        }

        CALLBACKS.set(callbackId, null)

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )

        return callbackId
    }

    // SERVER HANDLER
    static async handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "open_dashboard") return

        // Simulated dashboard data response
        const responseData = {
            type: "dashboard_response",
            transportMode: packet.transportMode,
            screenType: packet.screenType,
            dataId: packet.dataId,
            data: {
                stations: [],
                platforms: [],
                depots: []
            }
        }

        world.getPlayers().forEach(player => {
            player.runCommandAsync(
                `scriptevent mtr:packet ${JSON.stringify(responseData)}`
            )
        })
    }

    // CLIENT HANDLER
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "dashboard_response") return

        const callback = CALLBACKS.get(packet.callbackId)
        if (callback) {
            CALLBACKS.delete(packet.callbackId)
            callback(packet)
        }

        // OPEN UI SCREEN
        ClientPacketHelper.openDashboardScreen(
            packet.transportMode,
            packet.screenType,
            packet.dataId
        )
    }
}

module.exports = PacketOpenDashboardScreen

// ScreenType enum (Bedrock equivalent)
const ScreenType = {
    DEFAULT: "DEFAULT",
    STATION: "STATION",
    PLATFORM: "PLATFORM",
    DEPOT: "DEPOT",
    SIDING: "SIDING"
}

// PacketUpdateData.js (Bedrock Edition - Core Sync Engine)

class PacketUpdateData {

    constructor(data = {}) {
        this.data = data
    }

    // CLIENT → SERVER (send updates)
    static send(player, updateData) {

        const packet = {
            type: "update_data",
            data: updateData,
            timestamp: Date.now()
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER (GLOBAL BROADCAST SYSTEM)
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "update_data") return

        // 🧠 GLOBAL WORLD STATE UPDATE (Bedrock equivalent of UpdateDataResponse)
        const updatedState = {
            rails: packet.data.rails || [],
            signals: packet.data.signals || [],
            paths: packet.data.paths || [],
            vehicles: packet.data.vehicles || []
        }

        // Broadcast to ALL players (ResponseType.ALL equivalent)
        world.getPlayers().forEach(player => {
            player.runCommandAsync(
                `scriptevent mtr:packet ${JSON.stringify({
                    type: "update_data_client",
                    data: updatedState
                })}`
            )
        })
    }

    // CLIENT HANDLER (APPLY SIMULATION UPDATE)
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "update_data_client") return

        const data = packet.data

        // 🧠 Update client simulation state
        MinecraftClientData.setInstance(data)

        // 🚉 Refresh systems (equivalent to your Java update())
        this.refreshClientSimulation(data)
    }

    // CLIENT SIMULATION REFRESH (replacement for update())
    static refreshClientSimulation(data) {

        // 🚆 Path system update
        if (data.paths) {
            console.log("Updating path cache...")
        }

        // 🚦 Signals update
        if (data.signals) {
            console.log("Updating signal states...")
        }

        // 🚉 Rails update
        if (data.rails) {
            console.log("Updating rail network...")
        }

        // 🚆 Vehicles update
        if (data.vehicles) {
            console.log("Updating vehicle positions...")
        }

        // 🎨 Texture refresh simulation
        console.log("Refreshing dynamic visuals...")
    }
}

module.exports = PacketUpdateData

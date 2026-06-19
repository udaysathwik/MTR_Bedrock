// PacketUpdateVehiclesLifts.js (Bedrock Edition - Diff Sync Engine)

class PacketUpdateVehiclesLifts {

    static VEHICLES = new Map()
    static LIFTS = new Map()
    static HIDDEN_PLAYERS = new Set()

    constructor(data) {
        this.data = data
    }

    // CLIENT → SERVER
    static sync(player, vehicleLiftResponse) {

        const packet = {
            type: "update_vehicles_lifts",
            data: vehicleLiftResponse
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER (DIFF ENGINE CORE)
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "update_vehicles_lifts") return

        const data = packet.data

        // 🚆 VEHICLE SYNC
        const vehiclesToKeep = new Set(data.keepVehicles || [])
        const vehiclesToUpdate = data.updateVehicles || []

        for (const [id, vehicle] of this.VEHICLES) {
            if (!vehiclesToKeep.has(id)) {
                this.VEHICLES.delete(id)
            }
        }

        for (const v of vehiclesToUpdate) {
            this.VEHICLES.set(v.id, v)
        }

        // 🛗 LIFT SYNC
        const liftsToKeep = new Set(data.keepLifts || [])
        const liftsToUpdate = data.updateLifts || []

        for (const [id, lift] of this.LIFTS) {
            if (!liftsToKeep.has(id)) {
                this.LIFTS.delete(id)
            }
        }

        for (const l of liftsToUpdate) {
            this.LIFTS.set(l.id, l)
        }

        // 🚦 SIGNAL UPDATE SYSTEM
        if (data.signalUpdates) {
            for (const s of data.signalUpdates) {

                world.setDynamicProperty(
                    `signal_${s.railId}_pre`,
                    JSON.stringify(s.preBlocked)
                )

                world.setDynamicProperty(
                    `signal_${s.railId}_curr`,
                    JSON.stringify(s.current)
                )
            }
        }

        // 🔁 BROADCAST TO CLIENTS
        world.getPlayers().forEach(player => {
            player.runCommandAsync(
                `scriptevent mtr:packet ${JSON.stringify({
                    type: "vehicles_lifts_sync_client",
                    vehicles: [...this.VEHICLES.values()],
                    lifts: [...this.LIFTS.values()]
                })}`
            )
        })
    }

    // CLIENT HANDLER (RENDER + INTERPOLATION SYSTEM)
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "vehicles_lifts_sync_client") return

        const { vehicles, lifts } = packet

        // 🚆 Update vehicles
        for (const v of vehicles) {
            MinecraftClientData.updateVehicle(v)
        }

        // 🛗 Update lifts
        for (const l of lifts) {
            MinecraftClientData.updateLift(l)
        }

        // 🎮 INTERPOLATION CLEANUP (Bedrock version)
        this.cleanupHiddenPlayers(vehicles)
    }

    static cleanupHiddenPlayers(vehicles) {

        const visible = new Set()

        for (const v of vehicles) {
            for (const rider of v.riders || []) {
                visible.add(rider.uuid)
            }
        }

        // remove old hidden players
        for (const id of this.HIDDEN_PLAYERS) {
            if (!visible.has(id)) {
                this.HIDDEN_PLAYERS.delete(id)
            }
        }
    }
}

module.exports = PacketUpdateVehiclesLifts

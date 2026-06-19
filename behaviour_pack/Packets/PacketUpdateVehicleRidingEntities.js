// PacketUpdateVehicleRidingEntities.js (Bedrock Edition)

class PacketUpdateVehicleRidingEntities {

    constructor(data, dismount = false) {
        this.data = data
        this.dismount = dismount
    }

    // CLIENT → SERVER (send riding state)
    static update(player, rideData) {

        const packet = {
            type: "update_vehicle_riding",
            playerId: player.id,
            data: rideData,
            dismount: rideData.ridingCar < 0
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER (core simulation engine)
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "update_vehicle_riding") return

        const playerId = packet.playerId
        const data = packet.data
        const dismount = packet.dismount

        // 🧠 VEHICLE RIDE STATE STORAGE
        const rideState = {
            sidingId: data.sidingId,
            vehicleId: data.vehicleId,
            ridingCar: data.ridingCar,
            position: data.position,
            isOnGangway: data.isOnGangway,
            isDriver: data.isDriver,
            controls: {
                accelerate: data.manualAccelerate,
                brake: data.manualBrake,
                doors: data.manualToggleDoors,
                ato: data.manualToggleAto
            },
            override: data.doorOverride
        }

        // 💾 Store ride state in world memory
        world.setDynamicProperty(
            `ride_${playerId}`,
            JSON.stringify(rideState)
        )

        // 🚶 Handle dismount logic
        if (dismount) {
            world.getPlayers().forEach(player => {
                if (player.id === playerId) {
                    player.runCommandAsync("tp @s ~ ~ ~") // force safe reset
                }
            })
        }

        // 🔁 Sync to all players (simulation update)
        world.getPlayers().forEach(player => {
            player.runCommandAsync(
                `scriptevent mtr:packet ${JSON.stringify({
                    type: "vehicle_riding_sync",
                    playerId,
                    rideState
                })}`
            )
        })
    }

    // CLIENT HANDLER (apply vehicle simulation)
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "vehicle_riding_sync") return

        const { playerId, rideState } = packet

        // 🎮 Apply local vehicle simulation
        ClientPacketHelper.updateVehicleRiding(
            playerId,
            rideState
        )
    }
}

module.exports = PacketUpdateVehicleRidingEntities

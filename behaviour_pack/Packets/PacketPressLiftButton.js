// PacketPressLiftButton.js (Bedrock Edition)

class PacketPressLiftButton {

    constructor(liftData) {
        this.liftData = liftData
    }

    // CLIENT → SERVER request
    static press(player, liftData) {

        const packet = {
            type: "press_lift_button",
            data: liftData
        }

        player.runCommandAsync(
            `scriptevent mtr:packet ${JSON.stringify(packet)}`
        )
    }

    // SERVER HANDLER
    static handleServer(event, world) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "press_lift_button") return

        // Convert to lift operation (Bedrock simulation of PressLift)
        const liftAction = {
            type: "lift_press",
            data: packet.data
        }

        // Apply logic (replace with your lift system)
        world.getDynamicProperty("lift_system_state")

        // No response needed (same as ResponseType.NONE)
    }

    // CLIENT HANDLER (optional UI update)
    static handleClient(event) {

        const packet = JSON.parse(event.message)

        if (packet.type !== "lift_press") return

        // You can trigger animation or UI feedback
        ClientPacketHelper.onLiftButtonPressed(packet.data)
    }
}

module.exports = PacketPressLiftButton

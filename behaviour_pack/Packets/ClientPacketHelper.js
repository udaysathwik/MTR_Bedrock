// ClientPacketHelper.js
// Bedrock Edition adaptation (MTR-style UI handler)

import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

/**
 * Opens a block-related screen (UI replacement for Java screens)
 */
export function openBlockEntityScreen(player, blockType, blockPos) {
    system.run(() => {
        switch (blockType) {

            case "train_announcer":
                openTrainAnnouncerScreen(player, blockPos);
                break;

            case "train_sensor":
                openTrainSensorScreen(player, blockPos);
                break;

            case "railway_sign":
                openRailwaySignScreen(player, blockPos);
                break;

            case "signal":
                openSignalScreen(player, blockPos);
                break;

            default:
                player.sendMessage("§cNo screen available for this block.");
                break;
        }
    });
}

/**
 * Dashboard screen (stations / depot / platform / siding)
 */
export function openDashboardScreen(player) {
    const form = new ActionFormData()
        .title("MTR Dashboard")
        .body("Select an option:");

    form.button("Stations");
    form.button("Depots");
    form.button("Platforms");
    form.button("Sidings");

    form.show(player).then(res => {
        if (res.canceled) return;

        switch (res.selection) {
            case 0:
                player.sendMessage("Opening Stations...");
                break;
            case 1:
                player.sendMessage("Opening Depots...");
                break;
            case 2:
                player.sendMessage("Opening Platforms...");
                break;
            case 3:
                player.sendMessage("Opening Sidings...");
                break;
        }
    });
}

/**
 * Ticket machine screen
 */
export function openTicketMachineScreen(player, balance) {
    const form = new ActionFormData()
        .title("Ticket Machine")
        .body(`Balance: ${balance}`);

    form.button("Buy Ticket");
    form.button("Exit");

    form.show(player).then(res => {
        if (res.canceled) return;

        if (res.selection === 0) {
            player.sendMessage("Ticket purchased!");
        }
    });
}

/**
 * Rail modifier screen
 */
export function openRailShapeModifierScreen(player, railId) {
    const form = new ActionFormData()
        .title("Rail Modifier")
        .body(`Editing Rail: ${railId}`);

    form.button("Straight");
    form.button("Curve");
    form.button("Cancel");

    form.show(player);
}

/**
 * Simple example UI functions
 */
function openTrainAnnouncerScreen(player, pos) {
    player.sendMessage(`Opening Train Announcer UI at ${pos.x}, ${pos.y}, ${pos.z}`);
}

function openTrainSensorScreen(player, pos) {
    player.sendMessage(`Opening Sensor UI at ${pos.x}, ${pos.y}, ${pos.z}`);
}

function openRailwaySignScreen(player, pos) {
    player.sendMessage("Opening Railway Sign UI...");
}

function openSignalScreen(player, pos) {
    player.sendMessage("Opening Signal UI...");
                  }

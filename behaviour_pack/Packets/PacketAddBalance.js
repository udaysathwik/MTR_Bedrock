import { world } from "@minecraft/server";

const EMERALD_TO_DOLLAR = 10;

// Simple in-memory ticket system 
const playerBalance = new Map();

/**
 * Add balance packet logic (Bedrock version)
 */
export function PacketAddBalance(player, index) {

    // calculate cost
    const amount = getAddAmount(index);

    // check inventory
    const inventory = player.getComponent("minecraft:inventory").container;

    let emeraldCount = 0;

    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item && item.typeId === "minecraft:emerald") {
            emeraldCount += item.amount;
        }
    }

    const required = Math.pow(2, index);

    if (emeraldCount < required) {
        player.sendMessage("§cNot enough emeralds!");
        return;
    }

    // remove emeralds
    let toRemove = required;

    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);

        if (item && item.typeId === "minecraft:emerald") {

            if (item.amount >= toRemove) {
                item.amount -= toRemove;
                inventory.setItem(i, item);
                break;
            } else {
                toRemove -= item.amount;
                inventory.setItem(i, undefined);
            }
        }
    }

    // add balance
    const current = playerBalance.get(player.name) || 0;
    playerBalance.set(player.name, current + amount);

    // feedback
    player.playSound("random.orb");
    player.sendMessage(`§a+${amount} balance added!`);
}

/**
 * Formula 
 */
export function getAddAmount(index) {
    return Math.ceil(Math.pow(2, index) * (EMERALD_TO_DOLLAR + index));
}

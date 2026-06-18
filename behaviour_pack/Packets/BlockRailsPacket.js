import { world } from "@minecraft/server";

/**
 * Represents a rail network structure
 * (Bedrock equivalent of BlockRails data object)
 */
export class BlockRails {
    constructor(data = {}) {
        this.rails = data.rails || [];
        this.nodes = data.nodes || [];
        this.id = data.id || generateId();
    }
}

/**
 * Convert BlockRails → JSON string (like Java version)
 */
export function serializeBlockRails(blockRails) {
    return JSON.stringify(blockRails);
}

/**
 * Convert JSON → BlockRails object
 */
export function deserializeBlockRails(jsonString) {
    const data = JSON.parse(jsonString);
    return new BlockRails(data);
}

/**
 * Operation Processor (like OperationProcessor.BLOCK_RAILS)
 */
export const OperationProcessor = {
    BLOCK_RAILS: "block_rails"
};

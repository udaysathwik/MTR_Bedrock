import { world, system } from "@minecraft/server";

class RailActionModule {

  constructor(serverWorld) {
    this.serverWorld = serverWorld;

    /** @type {RailAction[]} */
    this.railActions = [];
  }

  // =========================
  // TICK SYSTEM
  // =========================
  tick() {
    if (this.railActions.length === 0) return;

    const action = this.railActions[0];

    // run build step
    const done = action.build();

    if (done) {
      this.railActions.shift();
      this.broadcastUpdate();
    }
  }

  // =========================
  // BRIDGE ACTION
  // =========================
  markRailForBridge(rail, player, radius, blockState) {
    this.railActions.push(
      new RailAction(this.serverWorld, player, "BRIDGE", rail, radius, 0, blockState)
    );
    this.broadcastUpdate();
  }

  // =========================
  // TUNNEL ACTION
  // =========================
  markRailForTunnel(rail, player, radius, height) {
    this.railActions.push(
      new RailAction(this.serverWorld, player, "TUNNEL", rail, radius, height, null)
    );
    this.broadcastUpdate();
  }

  // =========================
  // TUNNEL WALL ACTION
  // =========================
  markRailForTunnelWall(rail, player, radius, height, blockState) {
    this.railActions.push(
      new RailAction(this.serverWorld, player, "TUNNEL_WALL", rail, radius + 1, height + 1, blockState)
    );
    this.broadcastUpdate();
  }

  // =========================
  // REMOVE ACTION
  // =========================
  removeRailAction(id) {
    this.railActions = this.railActions.filter(a => a.id !== id);
    this.broadcastUpdate();
  }

  // =========================
  // BROADCAST UPDATE
  // =========================
  broadcastUpdate() {
    for (const player of world.getAllPlayers()) {
      player.sendMessage(`Rail Actions Updated: ${this.railActions.length}`);
    }
  }
}

export default RailActionModule;

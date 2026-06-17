 RailBuildSystem {

  constructor() {
    // active build tasks
    this.tasks = new Map();
  }

  // =========================
  // START BUILD ACTION
  // =========================
  startBuild(taskId, railPoints, type, options = {}) {
    this.tasks.set(taskId, {
      id: taskId,
      rail: railPoints,     // array of positions along rail
      type: type,           // "TUNNEL" | "BRIDGE" | "WALL"

      progressIndex: 0,

      radius: options.radius || 2,
      height: options.height || 3,

      block: options.block || "stone",

      finished: false
    });
  }

  // =========================
  // MAIN TICK LOOP
  // =========================
  tick(world) {

    this.tasks.forEach((task, taskId) => {

      if (task.finished) return;

      // limit per tick (performance safe like Java 2ms loop)
      let stepsPerTick = 2;

      while (stepsPerTick-- > 0 && task.progressIndex < task.rail.length - 1) {

        const current = task.rail[task.progressIndex];
        const next = task.rail[task.progressIndex + 1];

        if (!current || !next) continue;

        this.buildSegment(world, task, current, next);

        task.progressIndex++;
      }

      // completion check
      if (task.progressIndex >= task.rail.length - 1) {
        task.finished = true;
        this.sendProgress(world, task, 100);
      } else {
        const percent = Math.floor(
          (task.progressIndex / task.rail.length) * 100
        );
        this.sendProgress(world, task, percent);
      }
    });
  }

  // =========================
  // BUILD LOGIC (CORE)
  // =========================
  buildSegment(world, task, pos1, pos2) {

    const dx = pos2.x - pos1.x;
    const dz = pos2.z - pos1.z;

    const length = Math.sqrt(dx * dx + dz * dz);
    if (length === 0) return;

    const dirX = dx / length;
    const dirZ = dz / length;

    // perpendicular vector (for width)
    const sideX = -dirZ;
    const sideZ = dirX;

    for (let x = -task.radius; x <= task.radius; x++) {

      for (let y = 0; y <= task.height; y++) {

        const px = Math.floor(pos1.x + sideX * x);
        const pz = Math.floor(pos1.z + sideZ * x);
        const py = Math.floor(pos1.y + y);

        const targetPos = { x: px, y: py, z: pz };

        this.applyBlock(world, task, targetPos);
      }
    }
  }

  // =========================
  // BLOCK PLACEMENT RULES
  // =========================
  applyBlock(world, task, pos) {

    switch (task.type) {

      // 🧱 TUNNEL = clear space
      case "TUNNEL":
        world.setBlock(pos, "air");
        break;

      // 🌉 BRIDGE = solid floor
      case "BRIDGE":
        if (pos.y === 0) {
          world.setBlock(pos, task.block);
        }
        break;

      // 🧱 WALL = side structure
      case "WALL":
        if (pos.y > 0) {
          world.setBlock(pos, task.block);
        }
        break;
    }
  }

  // =========================
  // PROGRESS FEEDBACK
  // =========================
  sendProgress(world, task, percent) {
    world.broadcastMessage(
      `§eRail Build ${task.type}: ${percent}%`
    );
  }

  // =========================
  // STOP / CANCEL
  // =========================
  cancel(taskId) {
    this.tasks.delete(taskId);
  }
}

export default RailBuildSystem;

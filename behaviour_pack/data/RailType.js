const RailShape = {
  QUADRATIC: "QUADRATIC",
  CABLE: "CABLE"
};

const RailType = Object.freeze({
  WOODEN: {
    speedLimit: 20,
    color: "#8B5A2B",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  STONE: {
    speedLimit: 40,
    color: "#808080",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  EMERALD: {
    speedLimit: 60,
    color: "#00A86B",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  IRON: {
    speedLimit: 80,
    color: "#A0A0A0",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  BRICKS: {
    speedLimit: 100,
    color: "#B22222",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  OBSIDIAN: {
    speedLimit: 120,
    color: "#4B0082",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  PRISMARINE: {
    speedLimit: 140,
    color: "#00CED1",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  BLAZE: {
    speedLimit: 160,
    color: "#FF8C00",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  QUARTZ: {
    speedLimit: 200,
    color: "#F5F5DC",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  DIAMOND: {
    speedLimit: 300,
    color: "#00FFFF",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  PLATFORM: {
    speedLimit: 80,
    color: "#FF0000",
    isSavedRail: true,
    canAccelerate: false,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  SIDING: {
    speedLimit: 40,
    color: "#FFFF00",
    isSavedRail: true,
    canAccelerate: false,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  TURN_BACK: {
    speedLimit: 80,
    color: "#0000FF",
    isSavedRail: false,
    canAccelerate: false,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  CABLE_CAR: {
    speedLimit: 30,
    color: "#FFFFFF",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.CABLE
  },

  CABLE_CAR_STATION: {
    speedLimit: 2,
    color: "#FFFFFF",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: true,
    railShape: RailShape.QUADRATIC
  },

  RUNWAY: {
    speedLimit: 300,
    color: "#DDA0DD",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: false,
    railShape: RailShape.QUADRATIC
  },

  AIRPLANE_DUMMY: {
    speedLimit: 900,
    color: "#000000",
    isSavedRail: false,
    canAccelerate: true,
    hasSignal: false,
    railShape: RailShape.QUADRATIC
  }
});

export default RailType;
export { RailShape };

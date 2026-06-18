const RailActionType = Object.freeze({
  BRIDGE: {
    id: "BRIDGE",
    progressText: "Building Bridge...",
    name: "Bridge",
    color: 0xFFCCCCCC
  },

  TUNNEL: {
    id: "TUNNEL",
    progressText: "Digging Tunnel...",
    name: "Tunnel",
    color: 0xFF663300
  },

  TUNNEL_WALL: {
    id: "TUNNEL_WALL",
    progressText: "Building Tunnel Wall...",
    name: "Tunnel Wall",
    color: 0xFF666666
  }
});

export default RailActionType;

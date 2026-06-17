// IGui.js (Bedrock Script API version)

class IGui {

  // =========================
  // UI CONSTANTS
  // =========================

  static SQUARE_SIZE = 20;
  static PANEL_WIDTH = 144;
  static TEXT_HEIGHT = 8;
  static TEXT_PADDING = 6;
  static TEXT_FIELD_PADDING = 4;
  static LINE_HEIGHT = 10;

  static SMALL_OFFSET = 0.05;

  static RGB_WHITE = 0xFFFFFF;
  static ARGB_WHITE = 0xFFFFFFFF;
  static ARGB_BLACK = 0xFF000000;
  static ARGB_GRAY = 0xFF666666;
  static ARGB_LIGHT_GRAY = 0xFFAAAAAA;
  static ARGB_BACKGROUND = 0xFF121212;

  // =========================
  // TEXT UTILITIES
  // =========================

  static formatStationName(name) {
    return name.replace("|", " ");
  }

  static textOrUntitled(text) {
    return text && text.length > 0 ? text : "Untitled";
  }

  // =========================
  // CJK HANDLING (SIMPLIFIED)
  // =========================

  static isCjk(text) {
    if (!text) return false;

    return /[\u3000-\u9FFF\uAC00-\uD7AF\u3040-\u30FF]/.test(text);
  }

  static formatVerticalText(text) {
    if (!text) return "";

    return text.split("").map(char => {
      if (this.isCjk(char)) {
        return "|" + char + "|";
      }
      return char;
    }).join("");
  }

  // =========================
  // STATION NAME MERGING
  // =========================

  static mergeStations(stations, separator = " → ") {
    if (!Array.isArray(stations)) return "";

    return stations.join(separator);
  }

  static mergeStationsWithCommas(stations) {
    return this.mergeStations(stations, ", ");
  }

  // =========================
  // ALIGNMENT SYSTEM (UI HELPERS)
  // =========================

  static HorizontalAlignment = {
    LEFT: "LEFT",
    CENTER: "CENTER",
    RIGHT: "RIGHT",

    getOffset(type, x, width) {
      switch (type) {
        case "CENTER":
          return x - width / 2;
        case "RIGHT":
          return x - width;
        default:
          return x;
      }
    }
  };

  static VerticalAlignment = {
    TOP: "TOP",
    CENTER: "CENTER",
    BOTTOM: "BOTTOM",

    getOffset(type, y, height) {
      switch (type) {
        case "CENTER":
          return y - height / 2;
        case "BOTTOM":
          return y - height;
        default:
          return y;
      }
    }
  };
}

export default IGui;

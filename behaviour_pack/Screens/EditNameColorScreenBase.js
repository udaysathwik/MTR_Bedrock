// EditNameColorScreenBase.js

export class EditNameColorScreenBase {

  constructor(data, nameText, colorText, previousScreen = null) {
    this.data = data;
    this.previousScreen = previousScreen;

    this.nameText = nameText;
    this.colorText = colorText;

    this.nameStart = 0;
    this.colorStart = 0;
    this.colorEnd = 0;

    // UI state
    this.textFieldName = {
      text: data?.name || "",
      tick: () => {}
    };

    this.colorSelector = {
      color: data?.color || 0,
      setColor: (c) => this.colorSelector.color = c
    };
  }

  // -----------------------------
  // INIT LAYOUT
  // -----------------------------
  setPositionsAndInit(nameStart, colorStart, colorEnd) {
    this.nameStart = nameStart;
    this.colorStart = colorStart;
    this.colorEnd = colorEnd;

    const yStart = 20; // SQUARE_SIZE + TEXT_FIELD_PADDING simplified

    // position metadata (for JS UI system)
    this.textFieldName.x = nameStart;
    this.textFieldName.y = yStart;
    this.textFieldName.width = colorStart - nameStart;

    this.colorSelector.x = colorStart;
    this.colorSelector.y = yStart;
    this.colorSelector.width = colorEnd - colorStart;

    // sync data
    this.textFieldName.text = this.data?.name || "";
    this.colorSelector.color = this.data?.color || 0;
  }

  // -----------------------------
  // TICK
  // -----------------------------
  tick() {
    if (this.textFieldName.tick) {
      this.textFieldName.tick();
    }
  }

  // -----------------------------
  // RENDER TEXT HEADER
  // -----------------------------
  renderTextFields(ctx) {
    if (!ctx) return;

    const center = (a, b) => (a + b) / 2;

    ctx.drawText(this.nameText, center(this.nameStart, this.colorStart), 10);
    ctx.drawText(this.colorText, center(this.colorStart, this.colorEnd), 10);
  }

  // -----------------------------
  // SAVE DATA
  // -----------------------------
  saveData() {
    this.data.name = this.textFieldName.text;
    this.data.color = this.colorSelector.color;
  }

  // -----------------------------
  // CLOSE SCREEN
  // -----------------------------
  onClose() {
    this.saveData();

    if (this.previousScreen?.onReturn) {
      this.previousScreen.onReturn(this.data);
    }
  }

  // -----------------------------
  // GET UI STATE (for renderer)
  // -----------------------------
  getState() {
    return {
      name: this.textFieldName.text,
      color: this.colorSelector.color
    };
  }
}

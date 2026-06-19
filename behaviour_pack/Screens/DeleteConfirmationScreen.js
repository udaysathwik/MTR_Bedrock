export class DeleteConfirmationScreen {
  constructor(previousScreen, name, onDelete) {
    this.previousScreen = previousScreen;
    this.name = name;
    this.onDelete = onDelete;

    this.buttonYes = {
      label: "YES",
      onClick: () => this.handleYes(),
    };

    this.buttonNo = {
      label: "NO",
      onClick: () => this.handleNo(),
    };

    this.BUTTON_WIDTH = 100;
    this.BUTTON_PADDING = 10;
  }

  // ---------------- INIT ----------------

  init(ui) {
    this.ui = ui;

    this.buttonYesWidget = ui.createButton(this.buttonYes.label, this.buttonYes.onClick);
    this.buttonNoWidget = ui.createButton(this.buttonNo.label, this.buttonNo.onClick);

    ui.add(this.buttonYesWidget);
    ui.add(this.buttonNoWidget);

    this.layout();
  }

  layout() {
    const centerX = this.ui.width / 2;
    const centerY = this.ui.height / 2;

    this.ui.setPositionAndWidth(
      this.buttonYesWidget,
      centerX - this.BUTTON_WIDTH - this.BUTTON_PADDING,
      centerY,
      this.BUTTON_WIDTH
    );

    this.ui.setPositionAndWidth(
      this.buttonNoWidget,
      centerX + this.BUTTON_PADDING,
      centerY,
      this.BUTTON_WIDTH
    );
  }

  // ---------------- RENDER ----------------

  render(ctx) {
    this.ui.renderBackground(ctx);

    const text = `Are you sure you want to delete "${this.name}"?`;

    ctx.drawCenteredText(
      text,
      this.ui.width / 2,
      this.ui.height / 2 - 40,
      "#FFFFFF"
    );

    this.ui.renderChildren(ctx);
  }

  // ---------------- ACTIONS ----------------

  handleYes() {
    if (this.onDelete) {
      this.onDelete();
    }
    this.close();
  }

  handleNo() {
    this.close();
  }

  close() {
    if (this.previousScreen) {
      this.ui.openScreen(this.previousScreen);
    } else {
      this.ui.close();
    }
  }

  // ---------------- INPUT ----------------

  onKey(key) {
    if (key === "ESC") {
      this.handleNo();
    }
  }
           }

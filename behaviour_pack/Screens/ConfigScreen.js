export class ConfigScreen {
    constructor(client, config, translationProvider) {
        this.client = client;
        this.config = config;
        this.t = translationProvider;

        this.buttons = {};
        this.sliders = {};

        this.width = 0;
        this.height = 0;
    }

    init(width, height) {
        this.width = width;
        this.height = height;

        // Toggle buttons
        this.buttons.chatAnnouncements = this.createToggleButton(
            () => this.client.toggleChatAnnouncements(),
            () => this.client.getChatAnnouncements(),
            "Chat Announcements"
        );

        this.buttons.tts = this.createToggleButton(
            () => this.client.toggleTextToSpeechAnnouncements(),
            () => this.client.getTextToSpeechAnnouncements(),
            "TTS Announcements"
        );

        this.buttons.hideTranslucent = this.createToggleButton(
            () => this.client.toggleHideTranslucentParts(),
            () => this.client.getHideTranslucentParts(),
            "Hide Translucent Parts"
        );

        this.buttons.language = {
            text: this.client.getLanguageDisplay().translationKey,
            onClick: () => this.client.cycleLanguageDisplay()
        };

        this.buttons.defaultRail3D = this.createToggleButton(
            () => this.client.toggleDefaultRail3D(),
            () => this.client.getDefaultRail3D(),
            "Default Rail 3D"
        );

        this.buttons.useFont = this.createToggleButton(
            () => this.client.toggleUseMTRFont(),
            () => this.client.getUseMTRFont(),
            "Use MTR Font"
        );

        this.buttons.disableShadows = this.createToggleButton(
            () => this.client.toggleDisableShadowsForShaders(),
            () => this.client.getDisableShadowsForShaders(),
            "Disable Shadows"
        );

        this.buttons.patreon = {
            text: "Support Patreon",
            onClick: () =>
                window.open("https://www.patreon.com/minecraft_transit_railway")
        };

        // Sliders
        this.sliders.dynamicTexture = {
            min: 0,
            max: this.config.DYNAMIC_RESOLUTION_COUNT - 1,
            value: this.client.getDynamicTextureResolution(),
            onChange: (v) => this.client.setDynamicTextureResolution(v)
        };

        this.sliders.trainOscillation = {
            min: 0,
            max: this.config.TRAIN_OSCILLATION_COUNT,
            value: this.client.getVehicleOscillationMultiplier() * 10,
            onChange: (v) =>
                this.client.setVehicleOscillationMultiplier(v / 10)
        };
    }

    createToggleButton(toggleFn, getFn, label) {
        return {
            label,
            onClick: () => {
                toggleFn();
                this.updateButtonState();
            },
            get state() {
                return getFn();
            }
        };
    }

    updateButtonState() {
        // refresh UI states (pseudo)
    }

    render(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);

        let y = 40;

        this.renderButton(ctx, this.buttons.chatAnnouncements, 20, y); y += 40;
        this.renderButton(ctx, this.buttons.tts, 20, y); y += 40;
        this.renderButton(ctx, this.buttons.hideTranslucent, 20, y); y += 40;
        this.renderButton(ctx, this.buttons.language, 20, y); y += 40;

        this.renderSlider(ctx, this.sliders.dynamicTexture, 20, y); y += 40;
        this.renderSlider(ctx, this.sliders.trainOscillation, 20, y); y += 40;

        this.renderButton(ctx, this.buttons.defaultRail3D, 20, y); y += 40;
        this.renderButton(ctx, this.buttons.useFont, 20, y); y += 40;
        this.renderButton(ctx, this.buttons.disableShadows, 20, y); y += 40;

        this.renderButton(ctx, this.buttons.patreon, 20, y);
    }

    renderButton(ctx, button, x, y) {
        if (!button) return;

        ctx.fillStyle = "#333";
        ctx.fillRect(x, y, 200, 30);

        ctx.fillStyle = "#fff";
        ctx.fillText(
            typeof button.state === "function" ? button.state() : button.label,
            x + 10,
            y + 20
        );
    }

    renderSlider(ctx, slider, x, y) {
        const width = 200;

        ctx.fillStyle = "#555";
        ctx.fillRect(x, y, width, 10);

        const ratio =
            (slider.value - slider.min) / (slider.max - slider.min);

        ctx.fillStyle = "#00ffcc";
        ctx.fillRect(x, y, width * ratio, 10);
    }

    mouseClick(x, y) {
        // simplified hit detection
        for (const key in this.buttons) {
            const btn = this.buttons[key];
            if (btn?.onClick) btn.onClick();
        }
    }
            }

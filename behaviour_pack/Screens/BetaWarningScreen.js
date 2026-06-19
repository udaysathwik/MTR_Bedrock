// BetaWarningScreen.js (Bedrock Edition)

class BetaWarningScreen {

    static FORCE_TIME = 20000
    static openTime = 0
    static lastTick = Date.now()

    static open(player) {

        const now = Date.now()

        if (this.openTime < this.FORCE_TIME) {
            this.openTime += now - this.lastTick
        }

        this.lastTick = now

        const remaining = Math.max(0, this.FORCE_TIME - this.openTime)

        const form = {
            type: "form",
            title: "🚉 MTR Beta Warning",
            content:
`⚠ Please read carefully!

- Backup your worlds before continuing
- Report all bugs
- Manual driving not fully implemented yet

⏳ Wait time: ${Math.ceil(remaining / 1000)}s`,
            buttons: [
                { text: "❤️ Patreon" },
                { text: "📺 YouTube" },
                { text: remaining <= 0 ? "✔ Continue" : "⛔ Locked" }
            ]
        }

        player.sendForm(form, (player, index) => {

            if (index === 0) {
                player.runCommandAsync(
                    "scriptevent mtr:open_url https://www.patreon.com/minecraft_transit_railway"
                )
            }

            if (index === 1) {
                player.runCommandAsync(
                    "scriptevent mtr:open_url https://www.youtube.com/@JonathanHo33"
                )
            }

            if (index === 2 && remaining <= 0) {
                player.setDynamicProperty("hide_beta_warning", true)
            }
        })
    }

    static shouldShow(player) {
        return !player.getDynamicProperty("hide_beta_warning")
    }
}

module.exports = BetaWarningScreen

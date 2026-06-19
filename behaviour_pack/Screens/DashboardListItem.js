export class DashboardListItem {
    constructor(id, name, color, data = null) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.data = data; // optional reference like NameColorDataBase
    }

    // 📌 Get display name
    getName(formatted = false) {
        return this.name;
    }

    // 🎨 Get color
    getColor(formatted = false) {
        return this.color;
    }

    // 🧠 Used for sorting (same logic as Java)
    combineKey() {
        return (
            (this.name || "") +
            (this.color || "") +
            (this.id || 0)
        ).toLowerCase();
    }

    // 🔁 Compare function (for sorting lists)
    static compare(a, b) {
        return a.combineKey().localeCompare(b.combineKey());
    }
	}

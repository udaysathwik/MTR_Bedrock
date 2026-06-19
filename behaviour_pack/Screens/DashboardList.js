export class DashboardList {
    constructor({
        getList = () => [],
        getSearch = () => "",
        setSearch = () => {},
        onFind = null,
        onDrawArea = null,
        onEdit = null,
        onSort = null,
        onAdd = null,
        onDelete = null,
        itemsPerPage = 8
    }) {
        this.x = 0;
        this.y = 0;
        this.width = 300;
        this.height = 400;

        this.itemsPerPage = itemsPerPage;

        this.getList = getList;
        this.getSearch = getSearch;
        this.setSearch = setSearch;

        this.callbacks = {
            onFind,
            onDrawArea,
            onEdit,
            onSort,
            onAdd,
            onDelete
        };

        this.dataSorted = [];
        this.filtered = [];

        this.page = 0;
        this.hoverIndex = -1;

        this.hasFind = false;
        this.hasDrawArea = false;
        this.hasEdit = false;
        this.hasSort = false;
        this.hasAdd = false;
        this.hasDelete = false;
    }

    // 🔄 Update + filtering
    tick() {
        const search = this.getSearch().toLowerCase();

        this.filtered = this.dataSorted.filter(item =>
            (item.name || "").toLowerCase().includes(search)
        );

        const size = this.filtered.length;
        this.totalPages = Math.max(1, Math.ceil(size / this.itemsPerPage));

        if (this.page >= this.totalPages) this.page = this.totalPages - 1;
        if (this.page < 0) this.page = 0;
    }

    // 📦 Set data
    setData(list, options = {}) {
        this.dataSorted = [...list];

        this.hasFind = !!options.hasFind;
        this.hasDrawArea = !!options.hasDrawArea;
        this.hasEdit = !!options.hasEdit;
        this.hasSort = !!options.hasSort;
        this.hasAdd = !!options.hasAdd;
        this.hasDelete = !!options.hasDelete;

        // sort like Java version
        this.dataSorted.sort((a, b) =>
            (a.name + a.color + a.id).localeCompare(b.name + b.color + b.id)
        );
    }

    // 🎨 Render (canvas/UI style)
    render(ctx) {
        const start = this.page * this.itemsPerPage;
        const end = start + this.itemsPerPage;

        const visible = this.filtered.slice(start, end);

        visible.forEach((item, i) => {
            const y = this.y + 40 + i * 32;

            // color bar
            ctx.fillStyle = item.color || "#888";
            ctx.fillRect(this.x + 10, y, 16, 16);

            // text
            ctx.fillStyle = "#fff";
            ctx.fillText(item.name, this.x + 40, y + 12);
        });

        // page indicator
        ctx.fillStyle = "#fff";
        ctx.fillText(
            `${this.page + 1} / ${this.totalPages}`,
            this.x + this.width / 2,
            this.y + 20
        );
    }

    // 🖱 Hover detection
    mouseMoved(mx, my) {
        const relY = my - (this.y + 40);

        if (relY < 0) {
            this.hoverIndex = -1;
            return;
        }

        this.hoverIndex = Math.floor(relY / 32);
    }

    // 📜 Scroll
    mouseScrolled(amount) {
        this.page += amount > 0 ? -1 : 1;
        if (this.page < 0) this.page = 0;
    }

    // 🎯 Get hovered item
    getHoveredItem() {
        const index = this.page * this.itemsPerPage + this.hoverIndex;
        if (index < 0 || index >= this.filtered.length) return null;
        return this.filtered[index];
    }

    // ➕ Add
    add(item) {
        if (this.callbacks.onAdd) {
            this.callbacks.onAdd(item);
        }
    }

    // ❌ Delete
    delete(item) {
        if (this.callbacks.onDelete) {
            this.callbacks.onDelete(item);
        }
    }

    // ✏️ Edit / Find / Draw / Sort
    click(type, item) {
        const cb = this.callbacks[type];
        if (cb) cb(item);
    }

    // 🧠 Clear search
    clearSearch() {
        this.setSearch("");
    }
			}

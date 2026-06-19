package org.mtr.mod.screen;

import org.mtr.core.data.NameColorDataBase;

import java.util.Locale;

public class DashboardListItem implements Comparable<DashboardListItem> {

	public final long id;
	public final NameColorDataBase data;

	private final String name;
	private final int color;

	// 🚀 CACHE (NEW - prevents recomputation in sorting)
	private final String sortKey;

	// ========================= CONSTRUCTORS =========================

	public DashboardListItem(long id, String name, int color) {
		this.id = id;
		this.name = name != null ? name : "";
		this.color = color;
		this.data = null;
		this.sortKey = buildSortKey();
	}

	public DashboardListItem(NameColorDataBase data) {
		this.data = data;
		this.id = data != null ? data.getId() : -1;
		this.name = data != null ? data.getName() : "";
		this.color = data != null ? data.getColor() : 0;
		this.sortKey = buildSortKey();
	}

	// ========================= GETTERS =========================

	public String getName(boolean formatted) {
		return name;
	}

	public int getColor(boolean formatted) {
		return color;
	}

	// ========================= SORTING =========================

	private String buildSortKey() {
		// 🚀 Precomputed once (important performance improvement)
		return (name + "#" + color + "#" + id)
				.toLowerCase(Locale.ENGLISH);
	}

	@Override
	public int compareTo(DashboardListItem other) {
		if (other == null) return -1;
		return this.sortKey.compareTo(other.sortKey);
	}

	// ========================= DEBUG =========================

	@Override
	public String toString() {
		return "DashboardListItem{" +
				"id=" + id +
				", name='" + name + '\'' +
				", color=" + color +
				'}';
	}
}

package org.mtr.mod.screen;

import org.mtr.libraries.it.unimi.dsi.fastutil.ints.Int2ObjectAVLTreeMap;
import org.mtr.libraries.it.unimi.dsi.fastutil.ints.IntArrayList;
import org.mtr.libraries.it.unimi.dsi.fastutil.objects.ObjectArrayList;
import org.mtr.libraries.it.unimi.dsi.fastutil.objects.ObjectSet;
import org.mtr.mapping.holder.ClickableWidget;
import org.mtr.mapping.holder.Identifier;
import org.mtr.mapping.holder.MathHelper;
import org.mtr.mapping.holder.Screen;
import org.mtr.mapping.mapper.GraphicsHolder;
import org.mtr.mapping.mapper.GuiDrawing;
import org.mtr.mapping.mapper.TextFieldWidgetExtension;
import org.mtr.mapping.mapper.TexturedButtonWidgetExtension;
import org.mtr.mapping.tool.TextCase;
import org.mtr.mod.client.IDrawing;
import org.mtr.mod.client.MinecraftClientData;
import org.mtr.mod.data.IGui;
import org.mtr.mod.generated.lang.TranslationProvider;

import javax.annotation.Nullable;
import java.util.*;
import java.util.function.Consumer;
import java.util.function.Supplier;

public class DashboardList implements IGui {

	public int x, y, width, height;

	private final TextFieldWidgetExtension textFieldSearch;

	private final TexturedButtonWidgetExtension buttonPrevPage;
	private final TexturedButtonWidgetExtension buttonNextPage;

	private final TexturedButtonWidgetExtension buttonFind;
	private final TexturedButtonWidgetExtension buttonDrawArea;
	private final TexturedButtonWidgetExtension buttonEdit;
	private final TexturedButtonWidgetExtension buttonUp;
	private final TexturedButtonWidgetExtension buttonDown;
	private final TexturedButtonWidgetExtension buttonAdd;
	private final TexturedButtonWidgetExtension buttonDelete;

	private final Supplier<String> getSearch;
	private final Consumer<String> setSearch;

	private ObjectArrayList<DashboardListItem> dataSorted = new ObjectArrayList<>();
	private final Int2ObjectAVLTreeMap<DashboardListItem> dataFiltered = new Int2ObjectAVLTreeMap<>();

	// 🚀 CACHE (NEW)
	private final IntArrayList cachedSortedKeys = new IntArrayList();

	private int hoverIndex;
	private int page;
	private int totalPages;

	private boolean hasFind, hasDrawArea, hasEdit, hasSort, hasAdd, hasDelete;

	private static final int TOP_OFFSET = SQUARE_SIZE + TEXT_FIELD_PADDING;

	public <T> DashboardList(
			@Nullable Callback onFind,
			@Nullable Callback onDrawArea,
			@Nullable Callback onEdit,
			@Nullable Runnable onSort,
			@Nullable Callback onAdd,
			@Nullable Callback onDelete,
			@Nullable Supplier<List<T>> getList,
			Supplier<String> getSearch,
			Consumer<String> setSearch
	) {
		this.getSearch = getSearch;
		this.setSearch = setSearch;

		textFieldSearch = new TextFieldWidgetExtension(
				0, 0, 0, SQUARE_SIZE, 256,
				TextCase.DEFAULT, null,
				TranslationProvider.GUI_MTR_SEARCH.getString()
		);

		buttonPrevPage = TexturedButtonWidgetHelper.create(0, 0, 0, SQUARE_SIZE,
				new Identifier("textures/gui/sprites/mtr/icon_left.png"),
				new Identifier("textures/gui/sprites/mtr/icon_left_highlighted.png"),
				b -> setPage(page - 1));

		buttonNextPage = TexturedButtonWidgetHelper.create(0, 0, 0, SQUARE_SIZE,
				new Identifier("textures/gui/sprites/mtr/icon_right.png"),
				new Identifier("textures/gui/sprites/mtr/icon_right_highlighted.png"),
				b -> setPage(page + 1));

		buttonFind = new WidgetSilentImageButton(0, 0, 0, SQUARE_SIZE,
				new Identifier("textures/gui/sprites/mtr/icon_find.png"),
				new Identifier("textures/gui/sprites/mtr/icon_find_highlighted.png"),
				b -> onClick(onFind), true);

		buttonDrawArea = TexturedButtonWidgetHelper.create(0, 0, 0, SQUARE_SIZE,
				new Identifier("textures/gui/sprites/mtr/icon_draw_area.png"),
				new Identifier("textures/gui/sprites/mtr/icon_draw_area_highlighted.png"),
				b -> onClick(onDrawArea));

		buttonEdit = TexturedButtonWidgetHelper.create(0, 0, 0, SQUARE_SIZE,
				new Identifier("textures/gui/sprites/mtr/icon_edit.png"),
				new Identifier("textures/gui/sprites/mtr/icon_edit_highlighted.png"),
				b -> onClick(onEdit));

		buttonUp = TexturedButtonWidgetHelper.create(0, 0, 0, SQUARE_SIZE,
				new Identifier("textures/gui/sprites/mtr/icon_up.png"),
				new Identifier("textures/gui/sprites/mtr/icon_up_highlighted.png"),
				b -> moveUp(getList, onSort));

		buttonDown = TexturedButtonWidgetHelper.create(0, 0, 0, SQUARE_SIZE,
				new Identifier("textures/gui/sprites/mtr/icon_down.png"),
				new Identifier("textures/gui/sprites/mtr/icon_down_highlighted.png"),
				b -> moveDown(getList, onSort));

		buttonAdd = TexturedButtonWidgetHelper.create(0, 0, 0, SQUARE_SIZE,
				new Identifier("textures/gui/sprites/mtr/icon_add.png"),
				new Identifier("textures/gui/sprites/mtr/icon_add_highlighted.png"),
				b -> onClick(onAdd));

		buttonDelete = TexturedButtonWidgetHelper.create(0, 0, 0, SQUARE_SIZE,
				new Identifier("textures/gui/sprites/mtr/icon_delete.png"),
				new Identifier("textures/gui/sprites/mtr/icon_delete_highlighted.png"),
				b -> onClick(onDelete));
	}

	// ========================= INIT =========================

	public void init(Consumer<ClickableWidget> addDrawableChild) {
		IDrawing.setPositionAndWidth(buttonPrevPage, x, y + TEXT_FIELD_PADDING / 2, SQUARE_SIZE);
		IDrawing.setPositionAndWidth(buttonNextPage, x + SQUARE_SIZE * 3, y + TEXT_FIELD_PADDING / 2, SQUARE_SIZE);

		IDrawing.setPositionAndWidth(textFieldSearch,
				x + SQUARE_SIZE * 4 + TEXT_FIELD_PADDING / 2,
				y + TEXT_FIELD_PADDING / 2,
				width - SQUARE_SIZE * 4 - TEXT_FIELD_PADDING);

		textFieldSearch.setChangedListener2(setSearch);
		textFieldSearch.setText2(getSearch.get());

		addDrawableChild.accept(new ClickableWidget(buttonPrevPage));
		addDrawableChild.accept(new ClickableWidget(buttonNextPage));

		addDrawableChild.accept(new ClickableWidget(buttonFind));
		addDrawableChild.accept(new ClickableWidget(buttonDrawArea));
		addDrawableChild.accept(new ClickableWidget(buttonEdit));
		addDrawableChild.accept(new ClickableWidget(buttonUp));
		addDrawableChild.accept(new ClickableWidget(buttonDown));
		addDrawableChild.accept(new ClickableWidget(buttonAdd));
		addDrawableChild.accept(new ClickableWidget(buttonDelete));
		addDrawableChild.accept(new ClickableWidget(textFieldSearch));
	}

	// ========================= UPDATE (OPTIMIZED) =========================

	public void tick() {
		textFieldSearch.tick2();

		final String query = textFieldSearch.getText2().toLowerCase(Locale.ENGLISH);

		dataFiltered.clear();

		// 🚀 FAST FILTER (NO EXTRA SORTING)
		for (int i = 0; i < dataSorted.size(); i++) {
			DashboardListItem item = dataSorted.get(i);
			if (item.getName(true).toLowerCase(Locale.ENGLISH).contains(query)) {
				dataFiltered.put(i, item);
			}
		}

		// 🚀 CACHE KEYS ONCE
		cachedSortedKeys.clear();
		cachedSortedKeys.addAll(dataFiltered.keySet());
		Collections.sort(cachedSortedKeys);

		final int dataSize = cachedSortedKeys.size();
		totalPages = Math.max(1, (int) Math.ceil(dataSize / (float) itemsToShow()));

		setPage(page);
	}

	// ========================= DATA =========================

	public void setData(ObjectArrayList<DashboardListItem> dataList,
						boolean hasFind, boolean hasDrawArea,
						boolean hasEdit, boolean hasSort,
						boolean hasAdd, boolean hasDelete) {

		this.dataSorted = new ObjectArrayList<>(dataList);
		this.hasFind = hasFind;
		this.hasDrawArea = hasDrawArea;
		this.hasEdit = hasEdit;
		this.hasSort = hasSort;
		this.hasAdd = hasAdd;
		this.hasDelete = hasDelete;
	}

	// ========================= RENDER =========================

	public void render(GraphicsHolder graphicsHolder, boolean formatted) {

		graphicsHolder.drawCenteredText(
				(page + 1) + "/" + totalPages,
				x + SQUARE_SIZE * 2,
				y + TEXT_PADDING,
				ARGB_WHITE
		);

		final int itemsToShow = itemsToShow();

		for (int i = 0; i < itemsToShow; i++) {

			int index = i + page * itemsToShow;
			if (index >= cachedSortedKeys.size()) continue;

			int key = cachedSortedKeys.getInt(index);
			DashboardListItem data = dataFiltered.get(key);

			if (data == null) continue;

			int drawY = SQUARE_SIZE * i + TOP_OFFSET;

			GuiDrawing guiDrawing = new GuiDrawing(graphicsHolder);
			guiDrawing.beginDrawingRectangle();
			guiDrawing.drawRectangle(
					x + TEXT_PADDING,
					y + drawY,
					x + TEXT_PADDING + TEXT_HEIGHT,
					y + drawY + TEXT_HEIGHT,
					ARGB_BLACK | data.getColor(formatted)
			);
			guiDrawing.finishDrawingRectangle();

			String text = IGui.formatStationName(data.getName(formatted));

			graphicsHolder.drawText(
					text,
					x + TEXT_PADDING * 2 + TEXT_HEIGHT,
					y + drawY,
					ARGB_WHITE,
					false,
					GraphicsHolder.getDefaultLight()
			);
		}
	}

	// ========================= MOUSE =========================

	public void mouseMoved(double mouseX, double mouseY) {
		buttonFind.visible = buttonDrawArea.visible = buttonEdit.visible =
				buttonUp.visible = buttonDown.visible =
						buttonAdd.visible = buttonDelete.visible = false;

		if (mouseX < x || mouseX >= x + width) return;
		if (mouseY < y + TOP_OFFSET) return;

		int row = (int) ((mouseY - y - TOP_OFFSET) / SQUARE_SIZE);

		int index = row + page * itemsToShow();
		if (index >= cachedSortedKeys.size()) return;

		hoverIndex = row;

		buttonFind.visible = hasFind;
		buttonDrawArea.visible = hasDrawArea;
		buttonEdit.visible = hasEdit;
		buttonAdd.visible = hasAdd;
		buttonDelete.visible = hasDelete;
	}

	// ========================= HELPERS =========================

	private void setPage(int newPage) {
		page = MathHelper.clamp(newPage, 0, totalPages - 1);
		buttonPrevPage.visible = page > 0;
		buttonNextPage.visible = page < totalPages - 1;
	}

	private int itemsToShow() {
		return Math.max(1, (height - TOP_OFFSET) / SQUARE_SIZE);
	}

	private void moveUp(Supplier<List<?>> listSupplier, Runnable onSort) {
		if (textFieldSearch.getText2().isEmpty() && listSupplier != null) {
			List list = listSupplier.get();
			int index = hoverIndex + page * itemsToShow();
			if (index > 0 && index < list.size()) {
				Collections.swap(list, index, index - 1);
				if (onSort != null) onSort.run();
			}
		}
	}

	private void moveDown(Supplier<List<?>> listSupplier, Runnable onSort) {
		if (textFieldSearch.getText2().isEmpty() && listSupplier != null) {
			List list = listSupplier.get();
			int index = hoverIndex + page * itemsToShow();
			if (index >= 0 && index < list.size() - 1) {
				Collections.swap(list, index, index + 1);
				if (onSort != null) onSort.run();
			}
		}
	}

	private void onClick(@Nullable Callback callback) {
		int index = hoverIndex + page * itemsToShow();
		if (callback != null && index >= 0 && index < dataSorted.size()) {
			callback.accept(dataSorted.get(index), index);
		}
	}

	@FunctionalInterface
	public interface Callback {
		void accept(DashboardListItem item, int index);
	}
}

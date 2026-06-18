package org.mtr.mod.packet;

import org.mtr.libraries.it.unimi.dsi.fastutil.objects.ObjectArrayList;
import org.mtr.mapping.registry.PacketHandler;
import org.mtr.mapping.tool.PacketBufferReceiver;
import org.mtr.mapping.tool.PacketBufferSender;
import org.mtr.mod.client.MinecraftClientData;
import org.mtr.mod.data.RailAction;
import org.mtr.mod.screen.DashboardListItem;

public final class PacketBroadcastRailActions extends PacketHandler {

	private final ObjectArrayList<DashboardListItem> dashboardListItems;

	public PacketBroadcastRailActions(PacketBufferReceiver packetBufferReceiver) {
		dashboardListItems = new ObjectArrayList<>();

		int count = packetBufferReceiver.readInt();

		for (int i = 0; i < count; i++) {
			dashboardListItems.add(
				new DashboardListItem(
					packetBufferReceiver.readLong(),
					packetBufferReceiver.readString(),
					packetBufferReceiver.readInt()
				)
			);
		}
	}

	public PacketBroadcastRailActions(ObjectArrayList<RailAction> railActions) {
		dashboardListItems = new ObjectArrayList<>();

		for (RailAction action : railActions) {
			dashboardListItems.add(
				new DashboardListItem(
					action.id,
					action.getDescription(),
					action.getColor()
				)
			);
		}
	}

	@Override
	public void write(PacketBufferSender packetBufferSender) {
		packetBufferSender.writeInt(dashboardListItems.size());

		for (DashboardListItem item : dashboardListItems) {
			packetBufferSender.writeLong(item.id);
			packetBufferSender.writeString(item.name);
			packetBufferSender.writeInt(item.color);
		}
	}

	@Override
	public void runClient() {
		MinecraftClientData data = MinecraftClientData.getInstance();
		data.railActions.clear();
		data.railActions.addAll(dashboardListItems);
	}
}

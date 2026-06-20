import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

interface DashboardListItem {
    id: string; 
    name: string;
}

export class EyeCandyObjectSelectionScreen {
    private allData: DashboardListItem[];
    private selectedIds: Set<string>;
    private updateData: () => void;

    constructor(allData: DashboardListItem[], selectedIds: string[], updateData: () => void) {
        this.allData = allData;
        this.selectedIds = new Set(selectedIds);
        this.updateData = updateData;
    }

    public show(player: Player): void {
        const form = new ActionFormData();
        form.title("Select Eye Candy Object");
        
        this.allData.forEach(item => {
            const isSelected = this.selectedIds.has(item.id);
            form.button(`${item.name} ${isSelected ? "✅" : ""}`);
        });

        form.show(player).then((response) => {
            if (response.canceled) return;

            const selectedIndex = response.selection;
            if (selectedIndex !== undefined) {
                const clickedItem = this.allData[selectedIndex];

                if (this.selectedIds.has(clickedItem.id)) {
                    this.selectedIds.delete(clickedItem.id);
                } else {
                    this.selectedIds.add(clickedItem.id);
                }

                this.updateList();
            }
        });
    }

    protected updateList(): void {
        this.updateData();
    }
}

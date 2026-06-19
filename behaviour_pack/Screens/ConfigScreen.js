package org.mtr.bedrock;

public final class MTR_Bedrock {

    public static final String MOD_ID = "mtr_bedrock";
    public static final String MOD_NAME = "Minecraft Transit Railway: Bedrock";
    public static final String VERSION = "1.0.0-BETA";

    // 🌐 Network namespace
    public static final class Network {
        public static final String PACKET_PREFIX = "mtr:";
        
        public static final String DASHBOARD_OPEN = "mtr:dashboard_open";
        public static final String PIDS_UPDATE = "mtr:pids_update";
        public static final String TICKET_OPEN = "mtr:ticket_open";
        public static final String LIFT_UPDATE = "mtr:lift_update";
        public static final String ROUTE_UPDATE = "mtr:route_update";
    }

    // 🎨 UI Branding constants
    public static final class UI {
        public static final String TITLE = "MTR Bedrock";
        public static final String SUBTITLE = "Transit Simulation System";

        public static final int COLOR_WHITE = 0xFFFFFFFF;
        public static final int COLOR_GRAY = 0xFFAAAAAA;
        public static final int COLOR_YELLOW = 0xFFFFD700;
        public static final int COLOR_RED = 0xFFFF5555;
    }

    // ⚙ System toggles
    public static final class Features {
        public static boolean ENABLE_PIDS = true;
        public static boolean ENABLE_LIFTS = true;
        public static boolean ENABLE_SIGNALS = true;
        public static boolean ENABLE_TICKETS = true;
        public static boolean ENABLE_DASHBOARD = true;
    }

    // 🚀 Init hook
    public static void init() {
        System.out.println("[MTR_Bedrock] Initializing Transit System...");
    }
}

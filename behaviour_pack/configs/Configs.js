// behavior_packs/mod/config/Config.js

import ClientConfig from "./Client.js";
import ServerConfig from "./Server.js";

class Config {

    static client = new ClientConfig();
    static server = new ServerConfig();

    static init(data = {}) {

        this.client = new ClientConfig(
            data.client || {}
        );

        this.server = new ServerConfig(
            data.server || {}
        );
    }

    static getClient() {
        return this.client;
    }

    static getServer() {
        return this.server;
    }

    static save() {

        return {
            client: this.client.toJSON(),
            server: this.server.toJSON()
        };
    }

    static load(jsonData) {

        this.client = new ClientConfig(
            jsonData?.client || {}
        );

        this.server = new ServerConfig(
            jsonData?.server || {}
        );
    }
}

export default Config;

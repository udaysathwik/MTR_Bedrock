// behavior_packs/mod/config/Server.js

class Server {

    constructor(data = {}) {

        this.webserverPort =
            data.webserverPort ?? 8888;

        this.useThreadedSimulation =
            data.useThreadedSimulation ?? false;

        this.useThreadedFileLoading =
            data.useThreadedFileLoading ?? false;

        this.forceShutDownStrayThreads =
            data.forceShutDownStrayThreads ?? false;
    }

    getWebserverPort() {
        return this.webserverPort;
    }

    getUseThreadedSimulation() {
        return this.useThreadedSimulation;
    }

    getUseThreadedFileLoading() {
        return this.useThreadedFileLoading;
    }

    forceShutDownStrayThreadsEnabled() {
        return this.forceShutDownStrayThreads;
    }

    toJSON() {
        return {
            webserverPort: this.webserverPort,
            useThreadedSimulation: this.useThreadedSimulation,
            useThreadedFileLoading: this.useThreadedFileLoading,
            forceShutDownStrayThreads: this.forceShutDownStrayThreads
        };
    }
}

export default Server;

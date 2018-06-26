// Simple logger that meets the requirements we have for Polar.

const log = require('electron-log');

let initialized = false;

class Logger {

    /**
     * Create a new logger, delegating to the actual implementation we are
     * using.
     */
    static create() {

        if(process && process.type === "main") {
            if (!initialized) {
                throw new Error("Not initialized");
            }
        }

        return log;

    }

    static init(logsDir) {

        if(initialized) {
            throw new Error("Already initialized");
        }

        if(process && process.type !== "renderer") {
            throw new Error("Must initialize from the main electron process.");
        }

        // *** configure console
        log.transports.console.level = "info";

        // *** configure file

        // set the directory name properly
        log.transports.file.file = `${logsDir}/polar.log`;

        log.transports.file.level = "info";
        log.transports.file.appName = "polar";

        initialized = true;

    }

}

module.exports.Logger = Logger;

// Simple logger that meets the requirements we have for Polar.

const log = require('electron-log');
const {Files} = require("../util/Files.js");
const {Objects} = require("../util/Objects.js");

let initialized = false;

const USE_CONSOLE_LOG = true;

class ConsoleLogger {

    info(...args) {
        console.log(...args);
    }

    warn(...args) {
        console.warn(...args);
    }

    debug(...args) {
        console.debug(...args);
    }

    error(...args) {
        console.error(...args);
    }

    debug(msg) {
        console.log("DEBUG: " + msg);
    }

}

class Logger {

    /**
     * Create a new logger, delegating to the actual implementation we are
     * using.
     */
    static create() {

        if(USE_CONSOLE_LOG) {
            return new ConsoleLogger();
        } else {
            return log;
        }

    }

    static async init(logsDir, options) {

        if(initialized) {
            throw new Error("Already initialized");
        }

        if(! process) {
            throw new Error("No process");
        }

        if(process.type === "renderer") {
            throw new Error(`Must initialize from the main electron process (process=${process.type})`);
        }

        options = Objects.defaults(options, {createDir: true});

        if(options.createDir) {
            await Files.createDirAsync(logsDir);
        }

        // *** configure console
        log.transports.console.level = "info";
        log.transports.console.format="[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";

        // *** configure file

        // set the directory name properly
        log.transports.file.file = `${logsDir}/polar.log`;
        log.transports.file.format="[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";

        log.transports.file.level = "info";
        log.transports.file.appName = "polar";

        initialized = true;

    }

}

module.exports.create = Logger.create;
module.exports.Logger = Logger;

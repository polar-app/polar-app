// Simple logger that meets the requirements we have for Polar.

const log = require('electron-log');
const {Files} = require("../util/Files.js");
const {Objects} = require("../util/Objects.js");
const {ConsoleLogger} = require("./ConsoleLogger.js");
const {Caller} = require("./Caller.js");

let initialized = false;

class Logger {

    /**
     * Create a new logger, delegating to the actual implementation we are
     * using.
     */
    static create() {
        let caller = Caller.getCaller();
        return new DelegatedLogger();
    }

    static setLoggerDelegate(loggerDelegate) {
        global.polarLoggerDelegate = loggerDelegate;
    }

    static getLoggerDelegate() {
        return global.polarLoggerDelegate;
    }

    /**
     * Initialize the logger to write to a specific directory.
     *
     * @param logsDir {String} The directory to use to store logs.
     * @param options
     */
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

        // make the target use the new configured log (not the console).
        Logger.setLoggerDelegate(log);

        // FIXME: this won't work globally... nor is this needed any more since
        // we have DelegatedLogger. It might be nice to actually support swapping
        // this out at runtime.
        initialized = true;

    }

}

/**
 * Allows us to swap in delegates at runtime on anyone who calls create()
 * regardless of require() order.
 */
class DelegatedLogger {

    info(...args) {
        Logger.getLoggerDelegate().info(...args);
    }

    warn(...args) {
        Logger.getLoggerDelegate().warn(...args);
    }

    debug(...args) {
        Logger.getLoggerDelegate().debug(...args);
    }

    error(...args) {
        Logger.getLoggerDelegate().error(...args);
    }

    debug(...args) {
        Logger.getLoggerDelegate().info("DEBUG: " , ...args);
    }

}

/**
 * When true use a simple console log.  We have to do this for now because there
 * is a bug with getting stuck in a loop while logging and then choking the
 * renderer.
 */
Logger.setLoggerDelegate(new ConsoleLogger());

module.exports.create = Logger.create;
module.exports.Logger = Logger;

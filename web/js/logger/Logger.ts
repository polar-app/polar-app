// Simple logger that meets the requirements we have for Polar.

import {ILogger} from './ILogger';

const log = require('electron-log');
const {Files} = require("../util/Files.js");
const {Objects} = require("../util/Objects.js");
const {ConsoleLogger} = require("./ConsoleLogger.js");
const {Caller} = require("./Caller.js");

const process = require("process");

export class Logger {

    static initialized: boolean = false;

    static loggerDelegate: any;

    /**
     * Create a new logger, delegating to the actual implementation we are
     * using.
     */
    static create() {
        let caller = Caller.getCaller();
        return new DelegatedLogger(caller.filename);
    }

    static setLoggerDelegate(loggerDelegate: ILogger) {
        Logger.loggerDelegate = loggerDelegate;
    }

    static getLoggerDelegate(): ILogger {
        return Logger.loggerDelegate;
    }

    /**
     * Initialize the logger to write to a specific directory.
     *
     * @param logsDir {String} The directory to use to store logs.
     * @param options
     */
    static async init(logsDir: string, options: any) {

        if(Logger.initialized) {
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

        Logger.initialized = true;

    }

}

/**
 * Simple create
 *
 * @return {DelegatedLogger}
 */
export function create() {
    return Logger.create();
}

/**
 * Allows us to swap in delegates at runtime on anyone who calls create()
 * regardless of require() order.
 */
class DelegatedLogger {

    /**
     * The caller for this logger.
     */
    caller: string;

    /**
     *
     * @param caller {string}
     */
    constructor(caller: string) {
        this.caller = caller;
    }

    info(...args: any[]) {
        Logger.getLoggerDelegate().info(this.caller, ...args);
    }

    warn(...args: any[]) {
        Logger.getLoggerDelegate().warn(this.caller, ...args);
    }

    error(...args: any[]) {
        Logger.getLoggerDelegate().error(this.caller, ...args);
    }

    verbose(...args: any[]) {
        Logger.getLoggerDelegate().debug(this.caller, ...args);
    }

    debug(...args: any[]) {
        Logger.getLoggerDelegate().info(this.caller, ...args);
    }

}

/**
 * When true use a simple console log.  We have to do this for now because there
 * is a bug with getting stuck in a loop while logging and then choking the
 * renderer.
 */
Logger.setLoggerDelegate(new ConsoleLogger());

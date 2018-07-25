"use strict";
// Simple logger that meets the requirements we have for Polar.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const log = require('electron-log');
const { Files } = require("../util/Files.js");
const { Objects } = require("../util/Objects.js");
const { ConsoleLogger } = require("./ConsoleLogger.js");
const { Caller } = require("./Caller.js");
const process = require("process");
class Logger {
    /**
     * Create a new logger, delegating to the actual implementation we are
     * using.
     */
    static create() {
        let caller = Caller.getCaller();
        return new DelegatedLogger(caller.filename);
    }
    static setLoggerDelegate(loggerDelegate) {
        Logger.loggerDelegate = loggerDelegate;
    }
    static getLoggerDelegate() {
        return Logger.loggerDelegate;
    }
    /**
     * Initialize the logger to write to a specific directory.
     *
     * @param logsDir {String} The directory to use to store logs.
     * @param options
     */
    static init(logsDir, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Logger.initialized) {
                throw new Error("Already initialized");
            }
            if (!process) {
                throw new Error("No process");
            }
            if (process.type === "renderer") {
                throw new Error(`Must initialize from the main electron process (process=${process.type})`);
            }
            options = Objects.defaults(options, { createDir: true });
            if (options.createDir) {
                yield Files.createDirAsync(logsDir);
            }
            // *** configure console
            log.transports.console.level = "info";
            log.transports.console.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";
            // *** configure file
            // set the directory name properly
            log.transports.file.file = `${logsDir}/polar.log`;
            log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";
            log.transports.file.level = "info";
            log.transports.file.appName = "polar";
            // make the target use the new configured log (not the console).
            Logger.setLoggerDelegate(log);
            Logger.initialized = true;
        });
    }
}
Logger.initialized = false;
exports.Logger = Logger;
/**
 * Simple create
 *
 * @return {DelegatedLogger}
 */
function create() {
    return Logger.create();
}
exports.create = create;
/**
 * Allows us to swap in delegates at runtime on anyone who calls create()
 * regardless of require() order.
 */
class DelegatedLogger {
    /**
     *
     * @param caller {string}
     */
    constructor(caller) {
        this.caller = caller;
    }
    info(...args) {
        Logger.getLoggerDelegate().info(this.caller, ...args);
    }
    warn(...args) {
        Logger.getLoggerDelegate().warn(this.caller, ...args);
    }
    error(...args) {
        Logger.getLoggerDelegate().error(this.caller, ...args);
    }
    verbose(...args) {
        Logger.getLoggerDelegate().debug(this.caller, ...args);
    }
    debug(...args) {
        Logger.getLoggerDelegate().info(this.caller, ...args);
    }
}
/**
 * When true use a simple console log.  We have to do this for now because there
 * is a bug with getting stuck in a loop while logging and then choking the
 * renderer.
 */
Logger.setLoggerDelegate(new ConsoleLogger());
//# sourceMappingURL=Logger.js.map
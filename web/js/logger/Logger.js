"use strict";
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
            log.transports.console.level = "info";
            log.transports.console.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";
            log.transports.file.file = `${logsDir}/polar.log`;
            log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";
            log.transports.file.level = "info";
            log.transports.file.appName = "polar";
            Logger.setLoggerDelegate(log);
            Logger.initialized = true;
        });
    }
}
Logger.initialized = false;
exports.Logger = Logger;
function create() {
    return Logger.create();
}
exports.create = create;
class DelegatedLogger {
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
Logger.setLoggerDelegate(new ConsoleLogger());
//# sourceMappingURL=Logger.js.map
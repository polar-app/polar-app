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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var log = require('electron-log');
var Files = require("../util/Files.js").Files;
var Objects = require("../util/Objects.js").Objects;
var ConsoleLogger = require("./ConsoleLogger.js").ConsoleLogger;
var Caller = require("./Caller.js").Caller;
var process = require("process");
var Logger = /** @class */ (function () {
    function Logger() {
    }
    /**
     * Create a new logger, delegating to the actual implementation we are
     * using.
     */
    Logger.create = function () {
        var caller = Caller.getCaller();
        return new DelegatedLogger(caller.filename);
    };
    Logger.setLoggerDelegate = function (loggerDelegate) {
        Logger.loggerDelegate = loggerDelegate;
    };
    Logger.getLoggerDelegate = function () {
        return Logger.loggerDelegate;
    };
    /**
     * Initialize the logger to write to a specific directory.
     *
     * @param logsDir {String} The directory to use to store logs.
     * @param options
     */
    Logger.init = function (logsDir, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (Logger.initialized) {
                            throw new Error("Already initialized");
                        }
                        if (!process) {
                            throw new Error("No process");
                        }
                        if (process.type === "renderer") {
                            throw new Error("Must initialize from the main electron process (process=" + process.type + ")");
                        }
                        options = Objects.defaults(options, { createDir: true });
                        if (!options.createDir) return [3 /*break*/, 2];
                        return [4 /*yield*/, Files.createDirAsync(logsDir)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        // *** configure console
                        log.transports.console.level = "info";
                        log.transports.console.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";
                        // *** configure file
                        // set the directory name properly
                        log.transports.file.file = logsDir + "/polar.log";
                        log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";
                        log.transports.file.level = "info";
                        log.transports.file.appName = "polar";
                        // make the target use the new configured log (not the console).
                        Logger.setLoggerDelegate(log);
                        Logger.initialized = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    Logger.initialized = false;
    return Logger;
}());
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
var DelegatedLogger = /** @class */ (function () {
    /**
     *
     * @param caller {string}
     */
    function DelegatedLogger(caller) {
        this.caller = caller;
    }
    DelegatedLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        (_a = Logger.getLoggerDelegate()).info.apply(_a, [this.caller].concat(args));
    };
    DelegatedLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        (_a = Logger.getLoggerDelegate()).warn.apply(_a, [this.caller].concat(args));
    };
    DelegatedLogger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        (_a = Logger.getLoggerDelegate()).error.apply(_a, [this.caller].concat(args));
    };
    DelegatedLogger.prototype.verbose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        (_a = Logger.getLoggerDelegate()).debug.apply(_a, [this.caller].concat(args));
    };
    DelegatedLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        (_a = Logger.getLoggerDelegate()).info.apply(_a, [this.caller].concat(args));
    };
    return DelegatedLogger;
}());
/**
 * When true use a simple console log.  We have to do this for now because there
 * is a bug with getting stuck in a loop while logging and then choking the
 * renderer.
 */
Logger.setLoggerDelegate(new ConsoleLogger());
//# sourceMappingURL=Logger.js.map
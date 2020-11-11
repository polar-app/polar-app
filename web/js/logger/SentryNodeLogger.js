"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryNodeLogger = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const process_1 = __importDefault(require("process"));
let initialized = false;
let ready = false;
class SentryNodeLogger {
    constructor() {
        this.name = 'sentry-node-logger';
    }
    notice(msg, ...args) {
        SentryNodeLogger.initWhenNecessary();
    }
    warn(msg, ...args) {
        SentryNodeLogger.initWhenNecessary();
    }
    error(msg, ...args) {
        SentryNodeLogger.initWhenNecessary();
        if (ready) {
            args.forEach(arg => {
                if (arg instanceof Error) {
                    try {
                    }
                    catch (e) {
                        console.error("Failed to process exception for sentry: ", e);
                    }
                }
            });
        }
    }
    info(msg, ...args) {
        SentryNodeLogger.initWhenNecessary();
    }
    verbose(msg, ...args) {
        SentryNodeLogger.initWhenNecessary();
    }
    debug(msg, ...args) {
        SentryNodeLogger.initWhenNecessary();
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            SentryNodeLogger.initWhenNecessary();
        });
    }
    static isEnabled() {
        if (Preconditions_1.isPresent(process_1.default.env.POLAR_SENTRY_ENABLED)) {
            return process_1.default.env.POLAR_SENTRY_ENABLED === 'true';
        }
        return !Preconditions_1.isPresent(process_1.default.env.SNAP);
    }
    static initWhenNecessary() {
        if (initialized) {
            return;
        }
        try {
            if (SentryNodeLogger.isEnabled()) {
            }
            ready = true;
        }
        catch (e) {
            console.error("Unable to initialize sentry: ", e);
        }
        finally {
            initialized = true;
        }
    }
}
exports.SentryNodeLogger = SentryNodeLogger;
//# sourceMappingURL=SentryNodeLogger.js.map
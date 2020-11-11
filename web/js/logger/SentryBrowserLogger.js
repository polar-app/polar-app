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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryBrowserLogger = void 0;
const browser_1 = require("@sentry/browser");
let initialized = false;
function initWhenNecessary() {
    if (initialized) {
        return;
    }
    try {
        browser_1.init({
            dsn: 'https://e44af9eaf40f42f096aaa00e59e276e2@o182611.ingest.sentry.io/5306375',
        });
    }
    catch (e) {
        console.error("Unable to initialize sentry: ", e);
    }
    finally {
        initialized = true;
    }
}
class SentryBrowserLogger {
    constructor() {
        this.name = 'sentry-browser-logger';
    }
    notice(msg, ...args) {
        initWhenNecessary();
    }
    warn(msg, ...args) {
        initWhenNecessary();
    }
    error(msg, ...args) {
        initWhenNecessary();
        if (initialized) {
            args.forEach(arg => {
                if (arg instanceof Error) {
                    try {
                        browser_1.captureException(arg);
                    }
                    catch (e) {
                        console.error("Failed to process exception for sentry: ", e);
                    }
                }
            });
        }
    }
    info(msg, ...args) {
        initWhenNecessary();
    }
    verbose(msg, ...args) {
        initWhenNecessary();
    }
    debug(msg, ...args) {
        initWhenNecessary();
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            initWhenNecessary();
        });
    }
}
exports.SentryBrowserLogger = SentryBrowserLogger;
//# sourceMappingURL=SentryBrowserLogger.js.map
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
exports.NullTracer = exports.RendererAnalytics = void 0;
const universal_analytics_1 = __importDefault(require("universal-analytics"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const CIDs_1 = require("./CIDs");
const Stopwatches_1 = require("polar-shared/src/util/Stopwatches");
const Analytics_1 = require("../analytics/Analytics");
const TRACKING_ID = 'UA-122721184-5';
const DEBUG = false;
const isBrowserContext = typeof window !== 'undefined';
const cid = isBrowserContext ? CIDs_1.CIDs.get() : 'none';
const headers = {};
const visitorOptions = {
    cid,
    headers
};
const visitor = universal_analytics_1.default(TRACKING_ID, visitorOptions).debug(DEBUG);
const log = Logger_1.Logger.create();
const defaultCallback = (err, response, body) => {
    if (err) {
        log.warn("Unable to track analytics: ", err);
    }
};
class RendererAnalytics {
    static event(args) {
        if (!isBrowserContext) {
            return;
        }
        const callback = defaultCallback;
        const eventParams = {
            ec: args.category,
            ea: args.action,
        };
        visitor.event(eventParams).send(callback);
    }
    static pageviewFromLocation() {
        if (!isBrowserContext) {
            log.warn("Not called from browser context");
            return;
        }
        const url = new URL(document.location.href);
        const path = url.pathname + url.hash || "";
        const hostname = url.hostname;
        const title = document.title;
        log.info("Created pageview for: ", { path, hostname, title });
        Analytics_1.Analytics.page(path);
    }
    static identify(uid) {
        visitor.set('userId', uid);
    }
    static pageview(path, hostname, title) {
        if (!isBrowserContext) {
            log.warn("Not called from browser context");
            return;
        }
        const callback = defaultCallback;
        const pageviewParams = {
            dp: path,
            dh: hostname,
            dt: title,
        };
        visitor.pageview(pageviewParams).send(callback);
    }
    static timing(category, variable, time) {
        if (!isBrowserContext) {
            log.warn("Not called from browser context");
            return;
        }
        const callback = defaultCallback;
        visitor.timing(category, variable, time).send(callback);
    }
    static createTimer(category, variable) {
        return new DefaultTimer(category, variable);
    }
    static withTimer(category, variable, closure) {
        const stopwatch = this.createTimer(category, variable);
        try {
            const result = closure();
            return result;
        }
        finally {
            stopwatch.stop();
        }
    }
    static withTimerAsync(category, variable, closure) {
        return __awaiter(this, void 0, void 0, function* () {
            const stopwatch = this.createTimer(category, variable);
            try {
                const result = yield closure();
                return result;
            }
            finally {
                stopwatch.stop();
            }
        });
    }
    static createTracer(category) {
        return new DefaultTracer(category);
    }
    static set(fieldsObject) {
        for (const key of Object.keys(fieldsObject)) {
            const value = fieldsObject[key];
            visitor.set(key, value);
        }
    }
}
exports.RendererAnalytics = RendererAnalytics;
class LogThresholds {
}
LogThresholds.info = 500;
LogThresholds.warn = 750;
LogThresholds.error = 1500;
class DefaultTimer {
    constructor(category, variable, stopwatch = Stopwatches_1.Stopwatches.create()) {
        this.category = category;
        this.variable = variable;
        this.stopwatch = stopwatch;
        this.stopped = false;
    }
    stop() {
        if (this.stopped) {
            log.warn("Stop called twice");
            return;
        }
        const duration = this.stopwatch.stop();
        this.doAnalytics(duration);
        this.doLogging(duration);
        this.stopped = true;
    }
    doAnalytics(duration) {
        if (navigator.onLine) {
            RendererAnalytics.timing(this.category, this.variable, duration.durationMS);
        }
    }
    doLogging(duration) {
        const toLevel = (duration) => {
            if (duration > LogThresholds.error) {
                return 'error';
            }
            else if (duration > LogThresholds.warn) {
                return 'warn';
            }
            else if (duration > LogThresholds.info) {
                return 'info';
            }
            return undefined;
        };
        const level = toLevel(duration.durationMS);
        const message = `Operation took too long: ${this.category}:${this.variable}: ${duration.durationMS}ms`;
        switch (level) {
            case 'info':
                console.info(message);
                break;
            case 'warn':
                console.warn(message);
                break;
            case 'error':
                console.error(message);
                break;
        }
    }
}
class DefaultTracer {
    constructor(category) {
        this.category = category;
    }
    trace(variable, closure) {
        return RendererAnalytics.withTimer(this.category, variable, closure);
    }
    traceAsync(variable, closure) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield RendererAnalytics.withTimerAsync(this.category, variable, closure);
        });
    }
}
class NullTracer {
    trace(variable, closure) {
        return closure();
    }
    traceAsync(variable, closure) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield closure();
        });
    }
}
exports.NullTracer = NullTracer;
//# sourceMappingURL=RendererAnalytics.js.map
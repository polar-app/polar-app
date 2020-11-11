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
exports.MultiLogger = void 0;
const SafeLogger_1 = require("./SafeLogger");
class MultiLogger {
    constructor(...delegates) {
        delegates = MultiLogger.toSafeLoggers(delegates);
        this.delegates = delegates;
        this.name = 'multi-logger|'
            + this.delegates.map(delegate => delegate.name).join("+");
    }
    notice(msg, ...args) {
        this.delegates.forEach(delegate => delegate.notice(msg, ...args));
    }
    warn(msg, ...args) {
        this.delegates.forEach(delegate => delegate.warn(msg, ...args));
    }
    error(msg, ...args) {
        this.delegates.forEach(delegate => delegate.error(msg, ...args));
    }
    info(msg, ...args) {
        this.delegates.forEach(delegate => delegate.info(msg, ...args));
    }
    verbose(msg, ...args) {
        this.delegates.forEach(delegate => delegate.verbose(msg, ...args));
    }
    debug(msg, ...args) {
        this.delegates.forEach(delegate => delegate.debug(msg, ...args));
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const delegate of this.delegates) {
                yield delegate.sync();
            }
        });
    }
    static toSafeLoggers(delegates) {
        return delegates.map(current => {
            if (current instanceof SafeLogger_1.SafeLogger) {
                return current;
            }
            else {
                return new SafeLogger_1.SafeLogger(current);
            }
        });
    }
}
exports.MultiLogger = MultiLogger;
//# sourceMappingURL=MultiLogger.js.map
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
exports.SafeLogger = void 0;
class SafeLogger {
    constructor(delegate) {
        this.delegate = delegate;
        this.name = 'safe-logger+' + delegate.name;
    }
    notice(msg, ...args) {
        this.withTryCatch(() => this.delegate.notice(msg, ...args));
    }
    warn(msg, ...args) {
        this.withTryCatch(() => this.delegate.warn(msg, ...args));
    }
    error(msg, ...args) {
        this.withTryCatch(() => this.delegate.error(msg, ...args));
    }
    info(msg, ...args) {
        this.withTryCatch(() => this.delegate.info(msg, ...args));
    }
    verbose(msg, ...args) {
        this.withTryCatch(() => this.delegate.verbose(msg, ...args));
    }
    debug(msg, ...args) {
        this.withTryCatch(() => this.delegate.debug(msg, ...args));
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delegate.sync();
        });
    }
    withTryCatch(logFunction) {
        try {
            logFunction();
        }
        catch (e) {
            console.error("Unable to log: ", e);
        }
    }
}
exports.SafeLogger = SafeLogger;
//# sourceMappingURL=SafeLogger.js.map
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
exports.FilteredLogger = void 0;
const LogLevel_1 = require("./LogLevel");
class FilteredLogger {
    constructor(delegate, level = LogLevel_1.LogLevel.INFO) {
        this.delegate = delegate;
        this.level = level;
        this.name = `filtered-logger -> ${delegate.name}`;
    }
    notice(msg, ...args) {
        this.delegate.notice(msg, ...args);
    }
    debug(msg, ...args) {
        if (this.level < LogLevel_1.LogLevel.DEBUG) {
            return;
        }
        this.delegate.debug(msg, ...args);
    }
    verbose(msg, ...args) {
        if (this.level < LogLevel_1.LogLevel.VERBOSE) {
            return;
        }
        this.delegate.verbose(msg, ...args);
    }
    info(msg, ...args) {
        if (this.level < LogLevel_1.LogLevel.INFO) {
            return;
        }
        this.delegate.info(msg, ...args);
    }
    warn(msg, ...args) {
        if (this.level < LogLevel_1.LogLevel.WARN) {
            return;
        }
        this.delegate.warn(msg, ...args);
    }
    error(msg, ...args) {
        if (this.level < LogLevel_1.LogLevel.ERROR) {
            return;
        }
        this.delegate.error(msg, ...args);
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delegate.sync();
        });
    }
}
exports.FilteredLogger = FilteredLogger;
//# sourceMappingURL=FilteredLogger.js.map
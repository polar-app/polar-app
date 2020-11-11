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
exports.LevelAnnotatingLogger = void 0;
class LevelAnnotatingLogger {
    constructor(delegate) {
        this.delegate = delegate;
        this.name = `level-annotating-logger -> ${delegate.name}`;
    }
    notice(msg, ...args) {
        this.delegate.info(`[notice] ${msg}`, ...args);
    }
    info(msg, ...args) {
        this.delegate.info(`[info] ${msg}`, ...args);
    }
    warn(msg, ...args) {
        this.delegate.warn(`[warn] ${msg}`, ...args);
    }
    error(msg, ...args) {
        this.delegate.error(`[error] ${msg}`, ...args);
    }
    verbose(msg, ...args) {
        this.delegate.verbose(`[verbose] ${msg}`, ...args);
    }
    debug(msg, ...args) {
        this.delegate.debug(`[debug] ${msg}`, ...args);
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delegate.sync();
        });
    }
}
exports.LevelAnnotatingLogger = LevelAnnotatingLogger;
//# sourceMappingURL=LevelAnnotatingLogger.js.map
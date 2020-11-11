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
exports.FilteredStats = exports.StatsLogger = void 0;
class StatsLogger {
    constructor() {
        this.name = "stats";
        this.stats = new FilteredStats();
    }
    notice(msg, ...args) {
        ++this.stats.notice;
    }
    debug(msg, ...args) {
        ++this.stats.debug;
    }
    verbose(msg, ...args) {
        ++this.stats.verbose;
    }
    info(msg, ...args) {
        ++this.stats.info;
    }
    warn(msg, ...args) {
        ++this.stats.warn;
    }
    error(msg, ...args) {
        ++this.stats.error;
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.StatsLogger = StatsLogger;
class FilteredStats {
    constructor() {
        this.notice = 0;
        this.debug = 0;
        this.verbose = 0;
        this.info = 0;
        this.warn = 0;
        this.error = 0;
    }
}
exports.FilteredStats = FilteredStats;
//# sourceMappingURL=StatsLogger.js.map
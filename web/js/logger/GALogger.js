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
exports.GALogger = void 0;
const RendererAnalytics_1 = require("../ga/RendererAnalytics");
const GALoggers_1 = require("./GALoggers");
class GALogger {
    constructor() {
        this.name = 'ga-logger';
    }
    notice(msg, ...args) {
    }
    warn(msg, ...args) {
    }
    error(msg, ...args) {
        const error = GALoggers_1.GALoggers.getError(args);
        const event = GALoggers_1.GALoggers.toEvent(error);
        if (event) {
            RendererAnalytics_1.RendererAnalytics.event(event);
        }
    }
    info(msg, ...args) {
    }
    verbose(msg, ...args) {
    }
    debug(msg, ...args) {
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.GALogger = GALogger;
//# sourceMappingURL=GALogger.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAppExceptionHandlers = void 0;
const process_1 = __importDefault(require("process"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class MainAppExceptionHandlers {
    static register() {
        process_1.default.on('uncaughtException', err => {
            log.error("Uncaught exception: ", err);
        });
        process_1.default.on('unhandledRejection', err => {
            log.error("Unhandled rejection: ", err);
        });
    }
}
exports.MainAppExceptionHandlers = MainAppExceptionHandlers;
//# sourceMappingURL=MainAppExceptionHandlers.js.map
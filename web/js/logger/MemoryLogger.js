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
exports.MemoryLogger = void 0;
const FixedBuffer_1 = require("../util/FixedBuffer");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Strings_1 = require("polar-shared/src/util/Strings");
const capacity = Strings_1.Strings.toNumber(process.env.POLAR_LOG_CAPACITY, 250);
let IDX_GENERATOR = 0;
const buffer = new FixedBuffer_1.FixedBuffer(capacity);
class MemoryLogger {
    constructor() {
        this.name = 'memory-logger';
    }
    notice(msg, ...args) {
        buffer.write(createLogMessage('notice', msg, args));
    }
    info(msg, ...args) {
        buffer.write(createLogMessage('info', msg, args));
    }
    warn(msg, ...args) {
        buffer.write(createLogMessage('warn', msg, args));
    }
    error(msg, ...args) {
        buffer.write(createLogMessage('error', msg, args));
    }
    verbose(msg, ...args) {
        buffer.write(createLogMessage('verbose', msg, args));
    }
    debug(msg, ...args) {
        buffer.write(createLogMessage('debug', msg, args));
    }
    getOutput() {
        return buffer.toView().join("\n");
    }
    toJSON() {
        return JSON.stringify(buffer.toView(), null, "  ");
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static addEventListener(eventListener) {
        return buffer.addEventListener(eventListener);
    }
    static toView() {
        return buffer.toView();
    }
    static clear() {
        buffer.clear();
        buffer.write(createLogMessage('info', "Log messages cleared", []));
    }
}
exports.MemoryLogger = MemoryLogger;
function createLogMessage(level, msg, args) {
    return {
        timestamp: ISODateTimeStrings_1.ISODateTimeStrings.create(),
        idx: IDX_GENERATOR++,
        level,
        msg,
        args
    };
}
//# sourceMappingURL=MemoryLogger.js.map
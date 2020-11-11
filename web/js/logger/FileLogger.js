"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.FileLogger = void 0;
const Files_1 = require("polar-shared/src/util/Files");
const util = __importStar(require("util"));
class FileLogger {
    constructor(path, fd) {
        this.path = path;
        this.fd = fd;
        this.name = 'file-logger:' + path;
    }
    notice(msg, ...args) {
        this.append('notice', msg, ...args);
    }
    debug(msg, ...args) {
        this.append('debug', msg, ...args);
    }
    error(msg, ...args) {
        this.append('error', msg, ...args);
    }
    info(msg, ...args) {
        this.append('info', msg, ...args);
    }
    verbose(msg, ...args) {
        this.append('verbose', msg, ...args);
    }
    warn(msg, ...args) {
        this.append('warn', msg, ...args);
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            return Files_1.Files.fsyncAsync(this.fd);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Files_1.Files.closeAsync(this.fd);
        });
    }
    append(level, msg, ...args) {
        const line = FileLogger.format(level, msg, ...args);
        Files_1.Files.appendFileAsync(this.fd, line)
            .catch((err) => console.error("Could not write to file logger: ", err));
    }
    static create(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const fd = yield Files_1.Files.openAsync(path, 'a');
            return new FileLogger(path, fd);
        });
    }
    static format(level, msg, ...args) {
        const timestamp = new Date().toISOString();
        let line = `[${timestamp}] [${level}] ${msg}`;
        if (args.length > 0) {
            args.forEach(arg => {
                if (!line.endsWith(' ')) {
                    line += ' ';
                }
                if (arg instanceof Error) {
                    const err = arg;
                    line += '\n' + err.stack;
                }
                else if (typeof arg === 'string' ||
                    typeof arg === 'boolean' ||
                    typeof arg === 'number') {
                    line += arg.toString();
                }
                else {
                    line += util.inspect(arg, false, undefined, false);
                }
            });
        }
        line += '\n';
        return line;
    }
}
exports.FileLogger = FileLogger;
//# sourceMappingURL=FileLogger.js.map
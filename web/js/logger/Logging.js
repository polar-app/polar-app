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
exports.Logging = void 0;
const LoggerDelegate_1 = require("polar-shared/src/logger/LoggerDelegate");
const FilteredLogger_1 = require("./FilteredLogger");
const ConsoleLogger_1 = require("polar-shared/src/logger/ConsoleLogger");
const LevelAnnotatingLogger_1 = require("./annotating/LevelAnnotatingLogger");
const VersionAnnotatingLogger_1 = require("./annotating/VersionAnnotatingLogger");
const LogLevel_1 = require("./LogLevel");
const LogLevels_1 = require("./LogLevels");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const MultiLogger_1 = require("./MultiLogger");
const ElectronContextType_1 = require("../electron/context/ElectronContextType");
const ElectronContextTypes_1 = require("../electron/context/ElectronContextTypes");
const process_1 = __importDefault(require("process"));
const MemoryLogger_1 = require("./MemoryLogger");
const GALogger_1 = require("./GALogger");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
class Logging {
    static init() {
        return __awaiter(this, void 0, void 0, function* () {
            const level = this.configuredLevel();
            const target = yield this.createTarget(level);
            yield this.initWithTarget(target);
        });
    }
    static initForTesting() {
        const level = this.configuredLevel();
        const target = new ConsoleLogger_1.ConsoleLogger();
        const delegate = new FilteredLogger_1.FilteredLogger(new VersionAnnotatingLogger_1.VersionAnnotatingLogger(new LevelAnnotatingLogger_1.LevelAnnotatingLogger(target)), level);
        LoggerDelegate_1.LoggerDelegate.set(delegate);
    }
    static initWithTarget(target) {
        return __awaiter(this, void 0, void 0, function* () {
            const lc = yield this.loggingConfig();
            const delegate = new FilteredLogger_1.FilteredLogger(new VersionAnnotatingLogger_1.VersionAnnotatingLogger(new LevelAnnotatingLogger_1.LevelAnnotatingLogger(target)), lc.level);
            LoggerDelegate_1.LoggerDelegate.set(delegate);
            const logger = LoggerDelegate_1.LoggerDelegate.get();
            logger.info(`Using logger: ${logger.name}: target=${lc.target}, level=${LogLevel_1.LogLevel[lc.level]}`);
        });
    }
    static createTarget(level) {
        return __awaiter(this, void 0, void 0, function* () {
            const loggers = [];
            const electronContext = ElectronContextTypes_1.ElectronContextTypes.create();
            if (AppRuntime_1.AppRuntime.isBrowser()) {
            }
            if (['electron-renderer', 'browser'].includes(AppRuntime_1.AppRuntime.get())) {
                loggers.push(new GALogger_1.GALogger());
            }
            if (electronContext === ElectronContextType_1.ElectronContextType.RENDERER) {
                loggers.push(new MemoryLogger_1.MemoryLogger());
            }
            loggers.push(yield this.createPrimaryTarget());
            return new MultiLogger_1.MultiLogger(...loggers);
        });
    }
    static createPrimaryTarget() {
        return __awaiter(this, void 0, void 0, function* () {
            const loggingConfig = yield this.loggingConfig();
            if (loggingConfig.target === LoggerTarget.CONSOLE) {
                return new ConsoleLogger_1.ConsoleLogger();
            }
            else {
                throw new Error("Invalid target: " + loggingConfig.target);
            }
        });
    }
    static loggingConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                target: LoggerTarget.CONSOLE,
                level: this.configuredLevel()
            };
        });
    }
    static configuredLevel() {
        const isRendererContext = typeof window !== 'undefined';
        const fromENV = () => {
            return Optional_1.Optional.of(process_1.default.env.POLAR_LOG_LEVEL);
        };
        const fromStorage = (storage) => {
            return Optional_1.Optional.of(storage.getItem("POLAR_LOG_LEVEL"));
        };
        const fromLocalStorage = () => {
            if (isRendererContext) {
                return fromStorage(window.localStorage);
            }
            return Optional_1.Optional.empty();
        };
        const fromSessionStorage = () => {
            if (isRendererContext) {
                return fromStorage(window.sessionStorage);
            }
            return Optional_1.Optional.empty();
        };
        const level = Optional_1.Optional.first(fromENV(), fromLocalStorage(), fromSessionStorage())
            .map(level => LogLevels_1.LogLevels.fromName(level))
            .getOrElse(LogLevel_1.LogLevel.WARN);
        return level;
    }
}
exports.Logging = Logging;
var LoggerTarget;
(function (LoggerTarget) {
    LoggerTarget["CONSOLE"] = "CONSOLE";
})(LoggerTarget || (LoggerTarget = {}));
//# sourceMappingURL=Logging.js.map
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
exports.VersionAnnotatingLogger = void 0;
const PackageManifest_1 = require("../../util/PackageManifest");
class VersionAnnotatingLogger {
    constructor(delegate) {
        this.delegate = delegate;
        this.name = `version-annotating-logger -> ${delegate.name}`;
        const packageManifest = new PackageManifest_1.PackageManifest();
        this.versionAnnotation = `[${packageManifest.version()}]`;
    }
    notice(msg, ...args) {
        this.delegate.notice(this.versionAnnotation + ` ${msg}`, ...args);
    }
    info(msg, ...args) {
        this.delegate.info(this.versionAnnotation + ` ${msg}`, ...args);
    }
    warn(msg, ...args) {
        this.delegate.warn(this.versionAnnotation + ` ${msg}`, ...args);
    }
    error(msg, ...args) {
        this.delegate.error(this.versionAnnotation + ` ${msg}`, ...args);
    }
    verbose(msg, ...args) {
        this.delegate.verbose(this.versionAnnotation + ` ${msg}`, ...args);
    }
    debug(msg, ...args) {
        this.delegate.debug(this.versionAnnotation + ` ${msg}`, ...args);
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delegate.sync();
        });
    }
}
exports.VersionAnnotatingLogger = VersionAnnotatingLogger;
//# sourceMappingURL=VersionAnnotatingLogger.js.map
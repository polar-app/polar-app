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
exports.CachingPHZReader = void 0;
const PHZReader_1 = require("polar-content-capture/src/phz/PHZReader");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class CachingPHZReader {
    constructor(path, timeout = 60000) {
        this.reopened = 0;
        this.path = path;
        this.timeout = timeout;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.delegate = new PHZReader_1.PHZReader();
            yield this.delegate.init(this.path);
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                yield this.close();
            }), this.timeout);
        });
    }
    getMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openWhenNecessary();
            return yield this.delegate.getMetadata();
        });
    }
    getResources() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openWhenNecessary();
            return yield this.delegate.getResources();
        });
    }
    getResource(resourceEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openWhenNecessary();
            return yield this.delegate.getResource(resourceEntry);
        });
    }
    getResourceAsStream(resourceEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.openWhenNecessary();
            return yield this.delegate.getResourceAsStream(resourceEntry);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            const delegate = this.delegate;
            this.delegate = undefined;
            yield delegate.close();
        });
    }
    openWhenNecessary() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.delegate) {
                return;
            }
            log.info("Caching PHZReader being re-opened: " + this.path);
            ++this.reopened;
            yield this.init();
        });
    }
}
exports.CachingPHZReader = CachingPHZReader;
//# sourceMappingURL=CachingPHZReader.js.map
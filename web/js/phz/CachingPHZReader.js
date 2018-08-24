"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PHZReader_1 = require("./PHZReader");
const Logger_1 = require("../logger/Logger");
const log = Logger_1.Logger.create();
class CachingPHZReader {
    constructor(path, timeout = 60000) {
        this.reopened = 0;
        this.path = path;
        this.timeout = timeout;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.delegate = new PHZReader_1.PHZReader(this.path);
            yield this.delegate.init();
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
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            let delegate = this.delegate;
            this.delegate = undefined;
            yield delegate.close();
        });
    }
}
exports.CachingPHZReader = CachingPHZReader;
//# sourceMappingURL=CachingPHZReader.js.map
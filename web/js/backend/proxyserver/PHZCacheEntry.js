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
exports.PHZCacheEntry = void 0;
const CacheEntry_1 = require("./CacheEntry");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class PHZCacheEntry extends CacheEntry_1.CacheEntry {
    constructor(opts) {
        super(opts);
        this.phzReader = opts.phzReader;
        this.resourceEntry = opts.resourceEntry;
        Preconditions_1.Preconditions.assertNotNull(this.phzReader, "phzReader");
        Preconditions_1.Preconditions.assertNotNull(this.resourceEntry, "resourceEntry");
        Object.defineProperty(this, 'phzReader', {
            value: this.phzReader,
            enumerable: false
        });
    }
    handleData(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this.phzReader.getResource(this.resourceEntry);
            callback(buffer);
            return false;
        });
    }
    toBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.phzReader.getResource(this.resourceEntry);
        });
    }
    toStream() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.phzReader.getResourceAsStream(this.resourceEntry);
        });
    }
}
exports.PHZCacheEntry = PHZCacheEntry;
//# sourceMappingURL=PHZCacheEntry.js.map
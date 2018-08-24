"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jszip_1 = __importDefault(require("jszip"));
const Resources_1 = require("./Resources");
const Files_1 = require("../util/Files");
class PHZReader {
    constructor(path) {
        this.metadata = {};
        this.resources = new Resources_1.Resources();
        this.cache = {};
        this.path = path;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield Files_1.Files.readFileAsync(this.path);
            this.zip = new jszip_1.default();
            yield this.zip.loadAsync(data);
        });
    }
    getMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getCached("metadata.json", "metadata");
            }
            catch (e) {
                return Promise.resolve(null);
            }
        });
    }
    getResources() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getCached("resources.json", "resources");
            }
            catch (e) {
                return Promise.resolve(new Resources_1.Resources());
            }
        });
    }
    getCached(path, key) {
        return __awaiter(this, void 0, void 0, function* () {
            let cached = this.cache[key];
            if (cached !== undefined && cached !== null) {
                return cached;
            }
            let buffer = yield this._readAsBuffer(path);
            if (!buffer)
                throw new Error("No buffer for path: " + path);
            cached = JSON.parse(buffer.toString("UTF-8"));
            this.cache[key] = cached;
            return cached;
        });
    }
    _readAsBuffer(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.zip === undefined)
                throw new Error("No zip.");
            let zipFile = yield this.zip.file(path);
            if (!zipFile) {
                throw new CachingException("No zip entry for path: " + path);
            }
            let arrayBuffer = yield zipFile.async('arraybuffer');
            return Buffer.from(arrayBuffer);
        });
    }
    getResource(resourceEntry) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._readAsBuffer(resourceEntry.path);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.zip = undefined;
        });
    }
}
exports.PHZReader = PHZReader;
class CachingException extends Error {
    constructor(message) {
        super(message);
    }
}
exports.CachingException = CachingException;
//# sourceMappingURL=PHZReader.js.map
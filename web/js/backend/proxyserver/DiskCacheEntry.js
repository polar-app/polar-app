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
exports.DiskCacheEntry = void 0;
const CacheEntry_1 = require("./CacheEntry");
const fs_1 = __importDefault(require("fs"));
class DiskCacheEntry extends CacheEntry_1.CacheEntry {
    constructor(options) {
        super(options);
        this.path = options.path;
        if (this.path === undefined) {
            throw new Error("No path");
        }
    }
    handleData(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.readFile(this.path, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    callback(data);
                    resolve(false);
                });
            });
        });
    }
    toBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.readFile(this.path, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        });
    }
    toStream() {
        return __awaiter(this, void 0, void 0, function* () {
            return fs_1.default.createReadStream(this.path);
        });
    }
}
exports.DiskCacheEntry = DiskCacheEntry;
//# sourceMappingURL=DiskCacheEntry.js.map
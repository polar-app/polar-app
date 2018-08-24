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
const CacheEntry_1 = require("./CacheEntry");
const fs = require("fs");
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
                fs.readFile(this.path, (err, data) => {
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
                fs.readFile(this.path, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        });
    }
}
exports.DiskCacheEntry = DiskCacheEntry;
//# sourceMappingURL=DiskCacheEntry.js.map
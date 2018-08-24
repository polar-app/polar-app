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
const { promisify } = require('util');
const fs = require('fs');
class Files {
    static readFileAsync(path) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not replaced via promisify");
        });
    }
    static writeFileAsync(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not replaced via promisify");
        });
    }
    static createDirAsync(dir, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = {
                dir
            };
            if (yield this.existsAsync(dir)) {
                result.exists = true;
            }
            else {
                result.created = true;
                yield this.mkdirAsync(dir, mode);
            }
            return result;
        });
    }
    static existsAsync(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.statAsync(path)
                    .then(function () {
                    resolve(true);
                })
                    .catch(function (err) {
                    if (err.code === 'ENOENT') {
                        resolve(false);
                    }
                    else {
                        reject(err);
                    }
                });
            });
        });
    }
    static removeAsync(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.existsAsync(path)) {
                yield this.unlinkAsync(path);
            }
        });
    }
    static statAsync(path) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not replaced via promisify");
        });
    }
    static mkdirAsync(path, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not replaced via promisify");
        });
    }
    static accessAsync(path, mode) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not replaced via promisify");
        });
    }
    static unlinkAsync(path) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not replaced via promisify");
        });
    }
    static rmdirAsync(path) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not replaced via promisify");
        });
    }
}
exports.Files = Files;
Files.readFileAsync = promisify(fs.readFile);
Files.writeFileAsync = promisify(fs.writeFile);
Files.mkdirAsync = promisify(fs.mkdir);
Files.accessAsync = promisify(fs.access);
Files.statAsync = promisify(fs.stat);
Files.unlinkAsync = promisify(fs.unlink);
Files.rmdirAsync = promisify(fs.rmdir);
//# sourceMappingURL=Files.js.map
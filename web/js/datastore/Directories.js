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
const DiskDatastore_1 = require("./DiskDatastore");
const Paths_1 = require("../util/Paths");
const Files_1 = require("../util/Files");
class Directories {
    constructor(dataDir) {
        if (dataDir) {
            this.dataDir = dataDir;
        }
        else {
            this.dataDir = DiskDatastore_1.DiskDatastore.getDataDir();
        }
        this.stashDir = Paths_1.Paths.create(this.dataDir, "stash");
        this.logsDir = Paths_1.Paths.create(this.dataDir, "logs");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                dataDir: yield Files_1.Files.createDirAsync(this.dataDir),
                stashDir: yield Files_1.Files.createDirAsync(this.stashDir),
                logsDir: yield Files_1.Files.createDirAsync(this.logsDir)
            };
        });
    }
}
exports.Directories = Directories;
//# sourceMappingURL=Directories.js.map
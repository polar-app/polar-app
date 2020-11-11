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
exports.GlobalDataDir = exports.Directories = void 0;
const DiskDatastore_1 = require("./DiskDatastore");
const Files_1 = require("polar-shared/src/util/Files");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class Directories {
    constructor() {
        this.dataDirConfig = Directories.getDataDir();
        this.dataDir = this.dataDirConfig.path;
        this.stashDir = FilePaths_1.FilePaths.create(this.dataDir, "stash");
        this.filesDir = FilePaths_1.FilePaths.create(this.dataDir, "files");
        this.logsDir = FilePaths_1.FilePaths.create(this.dataDir, "logs");
        this.configDir = FilePaths_1.FilePaths.create(this.dataDir, "config");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initialization = {
                dataDir: yield Files_1.Files.createDirAsync(this.dataDir),
                stashDir: yield Files_1.Files.createDirAsync(this.stashDir),
                filesDir: yield Files_1.Files.createDirAsync(this.filesDir),
                logsDir: yield Files_1.Files.createDirAsync(this.logsDir),
                configDir: yield Files_1.Files.createDirAsync(this.configDir)
            };
            return this;
        });
    }
    static getDataDir() {
        let dataDirs = [
            {
                path: GlobalDataDir.get(),
                strategy: 'manual'
            },
            {
                path: process.env.POLAR_DATA_DIR,
                strategy: 'env'
            },
            {
                path: FilePaths_1.FilePaths.join(DiskDatastore_1.DiskDatastore.getUserHome(), ".polar"),
                strategy: 'home',
            }
        ];
        dataDirs = dataDirs.filter(current => Preconditions_1.isPresent(current.path));
        const dataDir = dataDirs[0];
        return {
            path: dataDir.path,
            strategy: dataDir.strategy
        };
    }
}
exports.Directories = Directories;
class GlobalDataDir {
    static set(value) {
        this.value = value;
    }
    static get() {
        return this.value;
    }
}
exports.GlobalDataDir = GlobalDataDir;
GlobalDataDir.value = undefined;
//# sourceMappingURL=Directories.js.map
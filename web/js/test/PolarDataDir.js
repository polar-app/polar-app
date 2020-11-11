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
exports.PolarDataDir = void 0;
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Files_1 = require("polar-shared/src/util/Files");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Directories_1 = require("../datastore/Directories");
const log = Logger_1.Logger.create();
class PolarDataDir {
    static useFreshDirectory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataDir = FilePaths_1.FilePaths.createTempName(name);
            console.log("Using new dataDir: " + dataDir);
            process.env.POLAR_DATA_DIR = dataDir;
            yield Files_1.Files.removeDirectoryRecursivelyAsync(dataDir);
            const directories = new Directories_1.Directories();
            yield Files_1.Files.createDirAsync(directories.dataDir),
                yield Files_1.Files.createDirAsync(directories.stashDir),
                yield Files_1.Files.createDirAsync(directories.logsDir),
                yield Files_1.Files.createDirAsync(directories.configDir),
                log.info("Using polar data dir: " + dataDir);
            return dataDir;
        });
    }
    static reuseDirectory(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataDir = FilePaths_1.FilePaths.createTempName(name);
            process.env.POLAR_DATA_DIR = dataDir;
            const directories = new Directories_1.Directories();
            yield directories.init();
            log.info("Using polar data dir: " + dataDir);
            return dataDir;
        });
    }
    static get() {
        return process.env.POLAR_DATA_DIR;
    }
}
exports.PolarDataDir = PolarDataDir;
//# sourceMappingURL=PolarDataDir.js.map
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
const Datastore_1 = require("./Datastore");
const Paths_1 = require("../util/Paths");
const Preconditions_1 = require("../Preconditions");
const fs = require("fs");
const os = require("os");
const util = require('util');
const log = require("../logger/Logger").create();
class DiskDatastore extends Datastore_1.Datastore {
    constructor(dataDir) {
        super();
        if (dataDir) {
            this.dataDir = dataDir;
        }
        else {
            this.dataDir = DiskDatastore.getDataDir();
        }
        this.stashDir = Paths_1.Paths.create(this.dataDir, "stash");
        this.logsDir = Paths_1.Paths.create(this.dataDir, "logs");
        this.readFileAsync = util.promisify(fs.readFile);
        this.writeFileAsync = util.promisify(fs.writeFile);
        this.mkdirAsync = util.promisify(fs.mkdir);
        this.accessAsync = util.promisify(fs.access);
        this.statAsync = util.promisify(fs.stat);
        this.unlinkAsync = util.promisify(fs.unlink);
        this.rmdirAsync = util.promisify(fs.rmdir);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                dataDir: yield this.createDirAsync(this.dataDir),
                stashDir: yield this.createDirAsync(this.stashDir),
                logsDir: yield this.createDirAsync(this.logsDir),
            };
        });
    }
    createDirAsync(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = {
                exists: false,
                created: false,
                dir
            };
            if (yield this.existsAsync(dir)) {
                result.exists = true;
            }
            else {
                result.created = true;
                yield this.mkdirAsync(dir);
            }
            return result;
        });
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            let docDir = this.dataDir + "/" + fingerprint;
            if (!(yield this.existsAsync(docDir))) {
                return null;
            }
            let statePath = docDir + "/state.json";
            let statePathStat = yield this.statAsync(statePath);
            if (!statePathStat.isFile()) {
                return null;
            }
            let canAccess = yield this.accessAsync(statePath, fs.constants.R_OK | fs.constants.W_OK)
                .then(() => true)
                .catch(() => false);
            if (!canAccess) {
                return null;
            }
            let buffer = yield this.readFileAsync(statePath);
            return buffer.toString('utf8');
        });
    }
    existsAsync(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.statAsync(path)
                    .then(() => {
                    resolve(true);
                })
                    .catch(err => {
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
    sync(fingerprint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertTypeOf(data, "string", "data");
            log.info("Performing sync of content into disk datastore.");
            let docDir = this.dataDir + "/" + fingerprint;
            let dirExists = yield this.statAsync(docDir)
                .then(() => true)
                .catch(() => false);
            if (!dirExists) {
                log.info(`Doc dir does not exist. Creating ${docDir}`);
                yield this.mkdirAsync(docDir);
            }
            let statePath = docDir + "/state.json";
            log.info(`Writing data to state file: ${statePath}`);
            return yield this.writeFileAsync(statePath, data);
        });
    }
    static getUserHome() {
        let result = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
        if (!result) {
            result = os.homedir();
        }
        return result;
    }
    static getDataDir() {
        return DiskDatastore.getUserHome() + "/.polar";
    }
}
exports.DiskDatastore = DiskDatastore;
//# sourceMappingURL=DiskDatastore.js.map
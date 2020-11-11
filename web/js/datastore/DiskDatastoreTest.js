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
const chai_1 = require("chai");
const Assertions_1 = require("../test/Assertions");
const DiskDatastore_1 = require("./DiskDatastore");
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const Files_1 = require("polar-shared/src/util/Files");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Directories_1 = require("./Directories");
const Platforms_1 = require("polar-shared/src/util/Platforms");
const DatastoreTester_1 = require("./DatastoreTester");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const DefaultPersistenceLayer_1 = require("./DefaultPersistenceLayer");
const DocMetas_1 = require("../metadata/DocMetas");
const MockPHZWriter_1 = require("../phz/MockPHZWriter");
const tmpdir = os_1.default.tmpdir();
describe("DiskDatastore", function () {
    return __awaiter(this, void 0, void 0, function* () {
        DatastoreTester_1.DatastoreTester.test(() => __awaiter(this, void 0, void 0, function* () { return new DiskDatastore_1.DiskDatastore(); }));
        it("getDataDir", function () {
            chai_1.assert.notEqual(Directories_1.Directories.getDataDir(), null);
        });
        it("getDataDirsForPlatform MAC_OS", function () {
            if (Platforms_1.Platforms.get() !== Platforms_1.Platform.MACOS) {
                return;
            }
            const userHome = '/Users/alice';
            const platform = Platforms_1.Platform.MACOS;
            Assertions_1.assertJSON(DiskDatastore_1.DiskDatastore.getDataDirsForPlatform({ userHome, platform }), {
                "paths": [
                    "/Users/alice/.polar",
                    "/Users/alice/Library/Application Support/Polar"
                ],
                "preferredPath": "/Users/alice/Library/Application Support/Polar"
            });
        });
        it("init dataDir directory on init()", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const dataDir = FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test');
                yield Files_1.Files.removeDirectoryRecursivelyAsync(dataDir);
                Directories_1.GlobalDataDir.set(dataDir);
                const diskDatastore = new DiskDatastore_1.DiskDatastore();
                chai_1.assert.equal(yield Files_1.Files.existsAsync(dataDir), false);
                let expected = {
                    "dataDirConfig": {
                        "path": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test"),
                        "strategy": "manual"
                    },
                    "dataDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test"),
                    "stashDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test", "stash"),
                    "filesDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test", "files"),
                    "logsDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test", "logs"),
                    "configDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test", "config"),
                    "initialization": {
                        "dataDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test'),
                            "created": true,
                        },
                        "stashDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test', 'stash'),
                            "created": true,
                        },
                        "filesDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test', 'files'),
                            "created": true,
                        },
                        "logsDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test', 'logs'),
                            "created": true,
                        },
                        "configDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test', 'config'),
                            "created": true,
                        }
                    },
                };
                Assertions_1.assertJSON(yield diskDatastore.init(), expected);
                expected = {
                    "dataDirConfig": {
                        "path": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test"),
                        "strategy": "manual"
                    },
                    "dataDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test"),
                    "stashDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test", "stash"),
                    "filesDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test", "files"),
                    "logsDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test", "logs"),
                    "configDir": FilePaths_1.FilePaths.join(tmpdir, "disk-datastore.test", "config"),
                    "initialization": {
                        "dataDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test'),
                            "exists": true,
                        },
                        "stashDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test', 'stash'),
                            "exists": true,
                        },
                        "filesDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test', 'files'),
                            "exists": true,
                        },
                        "logsDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test', 'logs'),
                            "exists": true,
                        },
                        "configDir": {
                            "dir": FilePaths_1.FilePaths.join(tmpdir, 'disk-datastore.test', 'config'),
                            "exists": true,
                        }
                    }
                };
                Assertions_1.assertJSON(yield diskDatastore.init(), expected);
            });
        });
        it("init and test paths", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const dataDir = FilePaths_1.FilePaths.join(tmpdir, 'test-paths');
                yield Files_1.Files.removeDirectoryRecursivelyAsync(dataDir);
                Directories_1.GlobalDataDir.set(dataDir);
                const diskDatastore = new DiskDatastore_1.DiskDatastore();
                yield diskDatastore.init();
                chai_1.assert.equal(diskDatastore.dataDir, FilePaths_1.FilePaths.join(tmpdir, 'test-paths'));
                chai_1.assert.equal(diskDatastore.stashDir, FilePaths_1.FilePaths.join(tmpdir, 'test-paths', 'stash'));
            });
        });
        it("test async exists function", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const dataDir = FilePaths_1.FilePaths.join(tmpdir, 'this-file-does-not-exist');
                yield Files_1.Files.removeDirectoryRecursivelyAsync(dataDir);
                chai_1.assert.equal(fs_1.default.existsSync(dataDir), false);
                chai_1.assert.equal(yield Files_1.Files.existsAsync(dataDir), false);
            });
        });
        it("Add file and remove file from the stash and see if it exists.", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const path = yield Files_1.Files.realpathAsync(FilePaths_1.FilePaths.join(__dirname, "..", "..", "..", "docs", "example.pdf"));
                chai_1.assert.ok(yield Files_1.Files.existsAsync(path), "No file found from: " + process.cwd());
                const dataDir = FilePaths_1.FilePaths.join(tmpdir, 'datastore-stash-backend');
                yield Files_1.Files.removeDirectoryRecursivelyAsync(dataDir);
                Directories_1.GlobalDataDir.set(dataDir);
                const diskDatastore = new DiskDatastore_1.DiskDatastore();
                yield diskDatastore.init();
                yield diskDatastore.writeFile(Backend_1.Backend.STASH, { name: 'example.pdf' }, yield Files_1.Files.readFileAsync(path));
                const pdfPath = FilePaths_1.FilePaths.join(dataDir, "stash", "example.pdf");
                chai_1.assert.ok(yield Files_1.Files.existsAsync(pdfPath), "Could not find file: " + pdfPath);
                chai_1.assert.ok(yield diskDatastore.containsFile(Backend_1.Backend.STASH, { name: 'example.pdf' }));
                yield diskDatastore.deleteFile(Backend_1.Backend.STASH, { name: 'example.pdf' });
                chai_1.assert.isFalse(yield Files_1.Files.existsAsync(pdfPath));
            });
        });
        it("Delete file and make sure state.json and dir are no longer present", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const dataDir = FilePaths_1.FilePaths.join(tmpdir, 'datastore-delete-test');
                Directories_1.GlobalDataDir.set(dataDir);
                const diskDatastore = new DiskDatastore_1.DiskDatastore();
                yield diskDatastore.init();
                const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(diskDatastore);
                yield persistenceLayer.init();
                const fingerprint = '0x00datadelete';
                const docMeta = DocMetas_1.MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                yield persistenceLayer.write(fingerprint, docMeta);
                const stateFile = FilePaths_1.FilePaths.join(dataDir, fingerprint, 'state.json');
                chai_1.assert.ok(yield Files_1.Files.existsAsync(stateFile));
                const docMetaFileRef = {
                    fingerprint,
                    docFile: {
                        name: `${fingerprint}.phz`
                    },
                    docInfo: docMeta.docInfo
                };
                yield MockPHZWriter_1.MockPHZWriter.write(FilePaths_1.FilePaths.create(diskDatastore.stashDir, `${fingerprint}.phz`));
                yield persistenceLayer.delete(docMetaFileRef);
                chai_1.assert.isFalse(yield persistenceLayer.contains(stateFile));
            });
        });
    });
});
//# sourceMappingURL=DiskDatastoreTest.js.map
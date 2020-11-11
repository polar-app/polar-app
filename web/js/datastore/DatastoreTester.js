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
exports.DatastoreTester = void 0;
const chai_1 = require("chai");
const Assertions_1 = require("../test/Assertions");
const DocMetas_1 = require("../metadata/DocMetas");
const DefaultPersistenceLayer_1 = require("./DefaultPersistenceLayer");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const os_1 = __importDefault(require("os"));
const Files_1 = require("polar-shared/src/util/Files");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const Directories_1 = require("./Directories");
const MockPHZWriter_1 = require("../phz/MockPHZWriter");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const DatastoreMutation_1 = require("./DatastoreMutation");
const Datastores_1 = require("./Datastores");
const DiskDatastore_1 = require("./DiskDatastore");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const Latch_1 = require("polar-shared/src/util/Latch");
const tmpdir = os_1.default.tmpdir();
class DatastoreTester {
    static test(datastoreFactory, hasLocalFiles = true) {
        describe('DatastoreTester tests', function () {
            const fingerprint = "0x001";
            const dataDir = FilePaths_1.FilePaths.join(tmpdir, 'test-data-dir');
            let datastore;
            let persistenceLayer;
            let docMeta;
            let directories;
            beforeEach(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log("===== before test ====");
                        console.log("Removing directory recursively: " + dataDir);
                        yield Files_1.Files.removeDirectoryRecursivelyAsync(dataDir);
                        Directories_1.GlobalDataDir.set(dataDir);
                        console.log("Creating new datastore");
                        datastore = yield datastoreFactory();
                        directories = new Directories_1.Directories();
                        persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(datastore);
                        console.log("Init of new persistence layer...");
                        yield persistenceLayer.init();
                        console.log("Init of new persistence layer...done");
                        console.log("Purge of new persistence layer...");
                        yield Datastores_1.Datastores.purge(datastore, purgeEvent => console.log("Purged: ", purgeEvent));
                        console.log("Purge of new persistence layer...done");
                        docMeta = DocMetas_1.MockDocMetas.createWithinInitialPagemarks(fingerprint, 14);
                        docMeta.docInfo.filename = `${fingerprint}.phz`;
                        yield persistenceLayer.delete({ fingerprint, docInfo: docMeta.docInfo });
                        const contains = yield persistenceLayer.contains(fingerprint);
                        chai_1.assert.equal(contains, false, "Document already exists in persistence layer: " + fingerprint);
                        yield Files_1.Files.createDirAsync(directories.dataDir);
                        yield Files_1.Files.createDirAsync(directories.stashDir);
                        yield MockPHZWriter_1.MockPHZWriter.write(FilePaths_1.FilePaths.create(directories.stashDir, `${fingerprint}.phz`));
                        const datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation();
                        yield persistenceLayer.write(fingerprint, docMeta, { datastoreMutation });
                        yield datastoreMutation.written.get();
                        yield datastoreMutation.committed.get();
                    }
                    catch (e) {
                        console.error("beforeEach failed: ", e);
                        throw e;
                    }
                });
            });
            afterEach(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log("===== after test ====");
                        yield Datastores_1.Datastores.purge(persistenceLayer.datastore, purgeEvent => console.log("Purged: ", purgeEvent));
                        yield persistenceLayer.stop();
                    }
                    catch (e) {
                        console.error("afterEach failed: ", e);
                        throw e;
                    }
                });
            });
            it("write and read data to disk", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const docMeta0 = yield persistenceLayer.getDocMeta(fingerprint);
                    chai_1.assert.ok(docMeta0.docInfo.lastUpdated !== undefined);
                    delete docMeta0.docInfo.lastUpdated;
                    delete docMeta0.docInfo.nrComments;
                    delete docMeta0.docInfo.nrFlashcards;
                    delete docMeta0.docInfo.nrAreaHighlights;
                    delete docMeta0.docInfo.nrTextHighlights;
                    delete docMeta0.docInfo.nrNotes;
                    delete docMeta0.docInfo.nrAnnotations;
                    delete docMeta0.docInfo.uuid;
                    docMeta.docInfo.uuid = '__canonicalized__';
                    docMeta0.docInfo.uuid = '__canonicalized__';
                    chai_1.assert.equal(Preconditions_1.isPresent(docMeta0), true, "docMeta0 is not present");
                    Assertions_1.assertJSON(Dictionaries_1.Dictionaries.sorted(docMeta), Dictionaries_1.Dictionaries.sorted(docMeta0));
                });
            });
            it("data contains no whitespace", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = yield datastore.getDocMeta(fingerprint);
                    chai_1.assert.isNotNull(data);
                    chai_1.assert.equal(data.indexOf("\n"), -1);
                });
            });
            it("read non-existant fingerprint", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const nonExistantDocMeta = yield persistenceLayer.getDocMeta('0x666');
                    chai_1.assert.ok(nonExistantDocMeta === undefined);
                });
            });
            it("Delete DocMeta and the associated stash file...", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const docMetaFileRef = {
                        fingerprint,
                        docFile: {
                            name: `${fingerprint}.phz`
                        },
                        docInfo: docMeta.docInfo
                    };
                    const docPath = FilePaths_1.FilePaths.join(directories.stashDir, `${fingerprint}.phz`);
                    const statePath = FilePaths_1.FilePaths.join(directories.dataDir, fingerprint, 'state.json');
                    if (hasLocalFiles) {
                        chai_1.assert.ok(yield Files_1.Files.existsAsync(docPath));
                        chai_1.assert.ok(yield Files_1.Files.existsAsync(statePath));
                    }
                    yield persistenceLayer.delete(docMetaFileRef);
                    if (hasLocalFiles) {
                        chai_1.assert.ok(!(yield Files_1.Files.existsAsync(docPath)));
                        chai_1.assert.ok(!(yield Files_1.Files.existsAsync(statePath)));
                    }
                    yield persistenceLayer.delete(docMetaFileRef);
                    yield persistenceLayer.delete(docMetaFileRef);
                    yield persistenceLayer.delete(docMetaFileRef);
                });
            });
            it("adding binary files", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const data = 'fake image data';
                    const fileRef = { name: 'test.jpg' };
                    yield datastore.deleteFile(Backend_1.Backend.IMAGE, fileRef);
                    yield datastore.deleteFile(Backend_1.Backend.IMAGE, fileRef);
                    chai_1.assert.ok(!(yield datastore.containsFile(Backend_1.Backend.IMAGE, fileRef)), "Datastore already contains file!");
                    const meta = {
                        "foo": "bar"
                    };
                    yield datastore.writeFile(Backend_1.Backend.IMAGE, fileRef, data, { meta });
                    yield datastore.writeFile(Backend_1.Backend.IMAGE, fileRef, data, { meta });
                    chai_1.assert.ok(yield datastore.containsFile(Backend_1.Backend.IMAGE, fileRef));
                    const datastoreFile = datastore.getFile(Backend_1.Backend.IMAGE, fileRef);
                    chai_1.assert.ok(datastoreFile, "no result");
                    yield datastore.deleteFile(Backend_1.Backend.IMAGE, fileRef);
                    yield datastore.deleteFile(Backend_1.Backend.IMAGE, fileRef);
                });
            });
            it("getDocMetaFiles", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const docMetaFiles = yield datastore.getDocMetaRefs();
                    chai_1.assert.equal(docMetaFiles.length > 0, true);
                    chai_1.assert.equal(docMetaFiles.map((current) => current.fingerprint).includes(fingerprint), true);
                });
            });
            it("overview", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const overview = yield datastore.overview();
                    chai_1.assert.isDefined(overview);
                });
            });
            it("snapshot and make sure we receive a terminated batch at committed consistency.", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const writtenSnapshotReceived = new Latch_1.Latch();
                    const committedSnapshotReceived = new Latch_1.Latch();
                    const snapshotResult = yield datastore.snapshot((docMetaSnapshotEvent) => __awaiter(this, void 0, void 0, function* () {
                        if (docMetaSnapshotEvent.batch) {
                            if (docMetaSnapshotEvent.batch.terminated) {
                                if (docMetaSnapshotEvent.consistency === 'committed') {
                                    committedSnapshotReceived.resolve(true);
                                    writtenSnapshotReceived.resolve(true);
                                }
                                if (docMetaSnapshotEvent.consistency === 'written') {
                                    writtenSnapshotReceived.resolve(true);
                                }
                            }
                        }
                    }));
                    yield writtenSnapshotReceived.get();
                    yield committedSnapshotReceived.get();
                    if (snapshotResult.unsubscribe) {
                        snapshotResult.unsubscribe();
                    }
                });
            });
            it("createBackup", function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (!(datastore instanceof DiskDatastore_1.DiskDatastore)) {
                        console.log("Skipping (not DiskDatastore)");
                        return;
                    }
                    try {
                        TestingTime_1.TestingTime.freeze();
                        const now = new Date();
                        console.log("Creating backup at: " + now.toUTCString());
                        const backupDir = FilePaths_1.FilePaths.join(dataDir, ".backup-2012-03-02");
                        yield datastore.createBackup();
                        console.log("Testing for backup dir: " + backupDir);
                        chai_1.assert.ok(yield Files_1.Files.existsAsync(backupDir));
                        chai_1.assert.ok(!(yield Files_1.Files.existsAsync(FilePaths_1.FilePaths.join(backupDir, ".backup-2012-03-02"))));
                        const statePath = FilePaths_1.FilePaths.join(backupDir, '0x001', 'state.json');
                        chai_1.assert.ok(yield Files_1.Files.existsAsync(statePath));
                    }
                    finally {
                        TestingTime_1.TestingTime.unfreeze();
                    }
                });
            });
        });
    }
}
exports.DatastoreTester = DatastoreTester;
//# sourceMappingURL=DatastoreTester.js.map
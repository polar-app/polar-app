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
exports.DiskPersistentPrefs = exports.DiskPersistentPrefsBacking = exports.DiskDatastore = void 0;
const Datastore_1 = require("./Datastore");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Files_1 = require("polar-shared/src/util/Files");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Directories_1 = require("./Directories");
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const Backend_1 = require("polar-shared/src/datastore/Backend");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Platforms_1 = require("polar-shared/src/util/Platforms");
const DatastoreFiles_1 = require("./DatastoreFiles");
const DatastoreMutation_1 = require("./DatastoreMutation");
const Datastores_1 = require("./Datastores");
const Functions_1 = require("polar-shared/src/util/Functions");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Stopwatches_1 = require("polar-shared/src/util/Stopwatches");
const Prefs_1 = require("../util/prefs/Prefs");
const DatastoreMutations_1 = require("./DatastoreMutations");
const Strings_1 = require("polar-shared/src/util/Strings");
const Mutexes_1 = require("polar-shared/src/util/Mutexes");
const DocMetas_1 = require("../metadata/DocMetas");
const log = Logger_1.Logger.create();
const writeMutex = Mutexes_1.Mutexes.create();
class DiskDatastore extends Datastore_1.AbstractDatastore {
    constructor() {
        super();
        this.id = 'disk';
        this.directories = new Directories_1.Directories();
        this.dataDir = this.directories.dataDir;
        this.dataDirConfig = this.directories.dataDirConfig;
        this.stashDir = this.directories.stashDir;
        this.filesDir = this.directories.filesDir;
        this.logsDir = this.directories.logsDir;
        this.diskPersistentPrefsBacking = new DiskPersistentPrefsBacking(this.directories);
    }
    init(errorListener = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            const diskInitResult = yield this.directories.init();
            const doInitInfo = () => __awaiter(this, void 0, void 0, function* () {
                const hasDatastoreInfo = () => __awaiter(this, void 0, void 0, function* () {
                    const datastoreInfo = yield this.info();
                    return datastoreInfo.isPresent();
                });
                if (yield hasDatastoreInfo()) {
                    return;
                }
                const stopwatch = Stopwatches_1.Stopwatches.create();
                const docMetaRefs = yield this.getDocMetaRefs();
                const addedValues = [];
                for (const docMetaRef of docMetaRefs) {
                    const data = yield this.getDocMeta(docMetaRef.fingerprint);
                    if (data) {
                        try {
                            const docMeta = JSON.parse(data);
                            if (docMeta && docMeta.docInfo && docMeta.docInfo.added) {
                                addedValues.push(docMeta.docInfo.added);
                            }
                        }
                        catch (e) {
                            log.warn("Unable to parse doc meta with fingerprint: " + docMetaRef.fingerprint);
                        }
                    }
                }
                const created = addedValues.length > 0 ? addedValues.sort()[0] : ISODateTimeStrings_1.ISODateTimeStrings.create();
                const datastoreInfo = { created };
                const msg = "Writing new datastore info: " + JSON.stringify(datastoreInfo);
                log.info(msg);
                yield this.writeInfo(datastoreInfo);
                log.info(msg + " ... " + stopwatch.stop());
            });
            yield doInitInfo();
            yield this.initPrefs();
            return diskInitResult;
        });
    }
    initPrefs() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.prefs) {
                yield this.diskPersistentPrefsBacking.init();
                this.prefs = new DiskPersistentPrefsProviderImpl(this.diskPersistentPrefsBacking);
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    contains(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            const docDir = FilePaths_1.FilePaths.join(this.dataDir, fingerprint);
            if (!(yield Files_1.Files.existsAsync(docDir))) {
                return false;
            }
            const statePath = FilePaths_1.FilePaths.join(docDir, 'state.json');
            return yield Files_1.Files.existsAsync(statePath);
        });
    }
    delete(docMetaFileRef, datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation()) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteDelegate = () => __awaiter(this, void 0, void 0, function* () {
                const docDir = FilePaths_1.FilePaths.join(this.dataDir, docMetaFileRef.fingerprint);
                const statePath = FilePaths_1.FilePaths.join(docDir, 'state.json');
                let deleteFilePromise = Promise.resolve();
                if (docMetaFileRef.docFile && docMetaFileRef.docFile.name) {
                    deleteFilePromise = this.deleteFile(Backend_1.Backend.STASH, docMetaFileRef.docFile);
                }
                log.info(`Deleting statePath ${statePath} and file: `, docMetaFileRef.docFile);
                const deleteStatePathPromise = Files_1.Files.deleteAsync(statePath);
                log.debug("Waiting for state delete...");
                const docMetaFile = yield deleteStatePathPromise;
                log.debug("Waiting for state delete...done");
                log.debug("Waiting for file delete...");
                yield deleteFilePromise;
                log.debug("Waiting for file delete...done");
                return {
                    docMetaFile
                };
            });
            return yield DatastoreMutations_1.DatastoreMutations.handle(() => __awaiter(this, void 0, void 0, function* () { return deleteDelegate(); }), datastoreMutation, () => true);
        });
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            const docDir = FilePaths_1.FilePaths.join(this.dataDir, fingerprint);
            const statePath = FilePaths_1.FilePaths.join(docDir, 'state.json');
            if (!(yield this.contains(fingerprint))) {
                return null;
            }
            const statePathStat = yield Files_1.Files.statAsync(statePath);
            if (!statePathStat.isFile()) {
                log.error("Path is not a file: ", statePath);
                return null;
            }
            const canAccess = yield Files_1.Files.accessAsync(statePath, fs_1.default.constants.R_OK | fs_1.default.constants.W_OK)
                .then(() => true)
                .catch(() => false);
            if (!canAccess) {
                log.error("No access: ", statePath);
                return null;
            }
            const buffer = yield Files_1.Files.readFileAsync(statePath);
            return buffer.toString('utf8');
        });
    }
    writeFile(backend, ref, data, opts = new Datastore_1.DefaultWriteFileOpts()) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Preconditions_1.isPresent(data)) {
                if (opts.updateMeta) {
                    return this.getFile(backend, ref);
                }
                else {
                    throw new Error("No data present");
                }
            }
            const meta = opts.meta || {};
            DatastoreFiles_1.DatastoreFiles.assertSanitizedFileName(ref);
            const fileReference = this.createFileReference(backend, ref);
            yield Files_1.Files.createDirAsync(fileReference.dir);
            const diskData = data;
            yield Files_1.Files.writeFileAsync(fileReference.path, diskData, { existing: 'link' });
            yield Files_1.Files.writeFileAsync(fileReference.metaPath, JSON.stringify(meta, null, '  '), { atomic: true });
            return this.createDatastoreFile(backend, ref, fileReference);
        });
    }
    getFile(backend, ref, opts = {}) {
        Datastores_1.Datastores.assertNetworkLayer(this, opts.networkLayer);
        DatastoreFiles_1.DatastoreFiles.assertSanitizedFileName(ref);
        const fileReference = this.createFileReference(backend, ref);
        return this.createDatastoreFile(backend, ref, fileReference);
    }
    containsFile(backend, ref) {
        DatastoreFiles_1.DatastoreFiles.assertSanitizedFileName(ref);
        const fileReference = this.createFileReference(backend, ref);
        return Files_1.Files.existsAsync(fileReference.path);
    }
    deleteFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            DatastoreFiles_1.DatastoreFiles.assertSanitizedFileName(ref);
            const fileReference = this.createFileReference(backend, ref);
            yield Files_1.Files.removeAsync(fileReference.path);
            yield Files_1.Files.removeAsync(fileReference.metaPath);
        });
    }
    write(fingerprint, data, docInfo, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const datastoreMutation = opts.datastoreMutation || new DatastoreMutation_1.DefaultDatastoreMutation();
            const writeDelegate = () => __awaiter(this, void 0, void 0, function* () {
                yield this.handleWriteFile(opts);
                Preconditions_1.Preconditions.assertPresent(data, "data");
                Preconditions_1.Preconditions.assertTypeOf(data, "string", "data", () => log.error("Failed with data: ", data));
                if (data.length === 0) {
                    throw new Error("Invalid data");
                }
                if (data[0] !== '{') {
                    throw new Error("Not JSON");
                }
                log.info("Performing sync of content into disk datastore");
                const docDir = FilePaths_1.FilePaths.join(this.dataDir, fingerprint);
                yield Files_1.Files.createDirAsync(docDir);
                log.debug("Calling stat on docDir: " + docDir);
                const stat = yield Files_1.Files.statAsync(docDir);
                if (!stat.isDirectory()) {
                    throw new Error("Path is not a directory: " + docDir);
                }
                const statePath = FilePaths_1.FilePaths.join(docDir, "state.json");
                log.info(`Writing data to state file: ${statePath}`);
                yield Files_1.Files.writeFileAsync(statePath, data, { encoding: 'utf8', atomic: true });
            });
            yield writeMutex.execute(() => __awaiter(this, void 0, void 0, function* () {
                yield DatastoreMutations_1.DatastoreMutations.handle(() => __awaiter(this, void 0, void 0, function* () { return writeDelegate(); }), datastoreMutation, () => true);
            }));
        });
    }
    getDocMetaRefs() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield Files_1.Files.existsAsync(this.dataDir))) {
                return [];
            }
            const fingerprints = yield Files_1.Files.readdirAsync(this.dataDir);
            const result = [];
            for (const fingerprint of fingerprints) {
                const docMetaDir = FilePaths_1.FilePaths.join(this.dataDir, fingerprint);
                const docMetaDirStat = yield Files_1.Files.statAsync(docMetaDir);
                if (docMetaDirStat.isDirectory()) {
                    const stateFile = FilePaths_1.FilePaths.join(this.dataDir, fingerprint, 'state.json');
                    const exists = yield Files_1.Files.existsAsync(stateFile);
                    if (exists) {
                        result.push({
                            fingerprint,
                            docMetaProvider: () => __awaiter(this, void 0, void 0, function* () {
                                const data = yield this.getDocMeta(fingerprint);
                                return DocMetas_1.DocMetas.deserialize(data, fingerprint);
                            })
                        });
                    }
                }
            }
            return result;
        });
    }
    snapshot(docMetaSnapshotEventListener, errorListener = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            return Datastores_1.Datastores.createCommittedSnapshot(this, docMetaSnapshotEventListener);
        });
    }
    createBackup() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataDir = this.directories.dataDir;
            const now = new Date();
            const ordYear = now.getUTCFullYear();
            const ordMonth = now.getUTCMonth() + 1;
            const ordDay = now.getUTCDate();
            const year = Strings_1.Strings.lpad(ordYear, '0', 4);
            const month = Strings_1.Strings.lpad(ordMonth, '0', 2);
            const day = Strings_1.Strings.lpad(ordDay, '0', 2);
            const backupDir = FilePaths_1.FilePaths.join(dataDir, `.backup-${year}-${month}-${day}`);
            const acceptPredicate = (path) => {
                return path.indexOf(".backup-") === -1;
            };
            if (yield Files_1.Files.existsAsync(backupDir)) {
                log.warn("Not creating backup.  Already exists: ", backupDir);
            }
            else {
                log.notice("Creating backup to: " + backupDir);
                yield Files_1.Files.createDirectorySnapshot(dataDir, backupDir, acceptPredicate);
            }
        });
    }
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener) {
    }
    info() {
        return __awaiter(this, void 0, void 0, function* () {
            const infoPath = FilePaths_1.FilePaths.join(this.dataDir, 'info.json');
            if (yield Files_1.Files.existsAsync(infoPath)) {
                const data = yield Files_1.Files.readFileAsync(infoPath);
                try {
                    const result = JSON.parse(data.toString('utf-8'));
                    return Optional_1.Optional.of(result);
                }
                catch (e) {
                    yield Files_1.Files.deleteAsync(infoPath);
                    log.warn("Unable to read info.json file.");
                    return Optional_1.Optional.empty();
                }
            }
            return Optional_1.Optional.empty();
        });
    }
    overview() {
        return __awaiter(this, void 0, void 0, function* () {
            const docMetaRefs = yield this.getDocMetaRefs();
            const datastoreInfo = yield this.info();
            const created = datastoreInfo.map(info => info.created).getOrUndefined();
            return { nrDocs: docMetaRefs.length, created };
        });
    }
    capabilities() {
        const networkLayers = new Set(['local']);
        return {
            networkLayers,
            permission: { mode: 'rw' }
        };
    }
    writeInfo(datastoreInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            const infoPath = FilePaths_1.FilePaths.join(this.dataDir, 'info.json');
            const json = JSON.stringify(datastoreInfo, null, "  ");
            yield Files_1.Files.writeFileAsync(infoPath, json, { atomic: true });
        });
    }
    getPrefs() {
        if (this.prefs) {
            return this.prefs;
        }
        else {
            throw new Error("No prefs. Not initialized yet.");
        }
    }
    createDatastoreFile(backend, ref, fileReference) {
        const fileURL = FilePaths_1.FilePaths.toURL(fileReference.path);
        const url = new URL(fileURL);
        return {
            backend,
            ref,
            url: url.href,
        };
    }
    createFileReference(backend, ref) {
        let dir;
        if (backend === Backend_1.Backend.STASH) {
            dir = FilePaths_1.FilePaths.join(this.dataDir, backend.toString().toLowerCase());
        }
        else {
            dir = FilePaths_1.FilePaths.join(this.filesDir, backend.toString().toLowerCase());
        }
        const path = FilePaths_1.FilePaths.join(dir, ref.name);
        const metaPath = FilePaths_1.FilePaths.join(dir, ref.name + '.meta');
        return { dir, path, metaPath };
    }
    static getDataDirs() {
        const userHome = this.getUserHome();
        const platform = Platforms_1.Platforms.get();
        return this.getDataDirsForPlatform({ userHome, platform });
    }
    static determineProperDirectory(directorySet) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const path of directorySet.paths) {
                if (yield Files_1.Files.existsAsync(path)) {
                    return path;
                }
            }
            return directorySet.preferredPath;
        });
    }
    static getDataDirsForPlatform(dirRuntime) {
        const { userHome, platform } = dirRuntime;
        switch (platform) {
            case Platforms_1.Platform.WINDOWS: {
                const preferredPath = FilePaths_1.FilePaths.join(userHome, "Polar");
                return {
                    paths: [
                        FilePaths_1.FilePaths.join(userHome, ".polar"),
                        preferredPath
                    ],
                    preferredPath
                };
            }
            case Platforms_1.Platform.LINUX: {
                const preferredPath = FilePaths_1.FilePaths.join(userHome, ".config", "Polar");
                return {
                    paths: [
                        FilePaths_1.FilePaths.join(userHome, ".polar"),
                    ],
                    preferredPath
                };
            }
            case Platforms_1.Platform.MACOS: {
                const preferredPath = FilePaths_1.FilePaths.join(userHome, "Library", "Application Support", "Polar");
                return {
                    paths: [
                        FilePaths_1.FilePaths.join(userHome, ".polar"),
                        preferredPath,
                    ],
                    preferredPath
                };
            }
            default:
                throw new Error("Platform not supported: " + platform);
        }
    }
    static getUserHome() {
        const ENV_NAME = process.platform === 'win32' ? 'USERPROFILE' : 'HOME';
        let result = process.env[ENV_NAME];
        if (!result) {
            result = os_1.default.homedir();
        }
        return result;
    }
}
exports.DiskDatastore = DiskDatastore;
class DiskPersistentPrefsBacking {
    constructor(directories) {
        this.directories = directories;
        this.prefs = new DiskPersistentPrefs(this);
        this.path = FilePaths_1.FilePaths.create(this.directories.configDir, "prefs.json");
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield Files_1.Files.existsAsync(this.path)) {
                log.info("Loaded prefs from: " + this.path);
                const data = yield Files_1.Files.readFileAsync(this.path);
                const prefs = JSON.parse(data.toString("UTF-8"));
                this.prefs = new DiskPersistentPrefs(this, prefs);
            }
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(this.prefs.toPrefDict(), null, "  ");
            yield Files_1.Files.writeFileAsync(this.path, data, { atomic: true });
        });
    }
    get() {
        return this.prefs;
    }
}
exports.DiskPersistentPrefsBacking = DiskPersistentPrefsBacking;
class DiskPersistentPrefs extends Prefs_1.DictionaryPrefs {
    constructor(diskPrefsStore, delegate = {}) {
        super(delegate);
        this.diskPrefsStore = diskPrefsStore;
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.diskPrefsStore.commit();
        });
    }
}
exports.DiskPersistentPrefs = DiskPersistentPrefs;
class DiskPersistentPrefsProviderImpl extends Datastore_1.AbstractPrefsProvider {
    constructor(backing) {
        super();
        this.backing = backing;
    }
    get() {
        return this.createInterceptedPersistentPrefs(this.backing.get());
    }
}
//# sourceMappingURL=DiskDatastore.js.map
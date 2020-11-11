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
exports.MemoryDatastore = void 0;
const Datastore_1 = require("./Datastore");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Files_1 = require("polar-shared/src/util/Files");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const DatastoreMutation_1 = require("./DatastoreMutation");
const Datastores_1 = require("./Datastores");
const Functions_1 = require("polar-shared/src/util/Functions");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Prefs_1 = require("../util/prefs/Prefs");
const log = Logger_1.Logger.create();
class MemoryDatastore extends Datastore_1.AbstractDatastore {
    constructor() {
        super();
        this.id = 'memory';
        this.docMetas = {};
        this.files = {};
        this.prefs = new Prefs_1.NonPersistentPrefs();
        this.docMetas = {};
        this.created = ISODateTimeStrings_1.ISODateTimeStrings.create();
    }
    init(errorListener = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    contains(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return fingerprint in this.docMetas;
        });
    }
    delete(docMetaFileRef) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {
                docMetaFile: {
                    path: `/${docMetaFileRef.fingerprint}.json`,
                    deleted: false
                },
                dataFile: {
                    path: '/' + Optional_1.Optional.of(docMetaFileRef.docFile)
                        .map(current => current.name)
                        .getOrUndefined(),
                    deleted: false
                }
            };
            if (yield this.contains(docMetaFileRef.fingerprint)) {
                result.docMetaFile.deleted = true;
                result.dataFile.deleted = true;
            }
            return result;
        });
    }
    writeFile(backend, ref, data, opts = new Datastore_1.DefaultWriteFileOpts()) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = MemoryDatastore.toFileRefKey(backend, ref);
            let buff;
            if (typeof data === 'string') {
                buff = Buffer.from(data);
            }
            else if (data instanceof Buffer) {
                buff = data;
            }
            else {
                buff = yield Files_1.Files.readFileAsync(data.path);
            }
            const meta = opts.meta || {};
            this.files[key] = { buffer: buff, meta };
            return { backend, ref, url: 'NOT_IMPLEMENTED:none' };
        });
    }
    getFile(backend, ref) {
        const key = MemoryDatastore.toFileRefKey(backend, ref);
        if (!key) {
            throw new Error(`No file for ${backend} at ${ref.name}`);
        }
        const fileData = this.files[key];
        return { backend, ref, url: 'NOT_IMPLEMENTED:none' };
    }
    containsFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = MemoryDatastore.toFileRefKey(backend, ref);
            return Preconditions_1.isPresent(this.files[key]);
        });
    }
    deleteFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = MemoryDatastore.toFileRefKey(backend, ref);
            delete this.files[key];
        });
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            const nrDocs = Object.keys(this.docMetas).length;
            log.info(`Fetching document from datastore with fingerprint ${fingerprint} of ${nrDocs} docs.`);
            return this.docMetas[fingerprint];
        });
    }
    write(fingerprint, data, docInfo, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const datastoreMutation = opts.datastoreMutation || new DatastoreMutation_1.DefaultDatastoreMutation();
            Preconditions_1.Preconditions.assertTypeOf(data, "string", "data");
            this.docMetas[fingerprint] = data;
            datastoreMutation.written.resolve(true);
            datastoreMutation.committed.resolve(true);
        });
    }
    getDocMetaRefs() {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.keys(this.docMetas)
                .map(fingerprint => ({ fingerprint }));
        });
    }
    snapshot(listener) {
        return __awaiter(this, void 0, void 0, function* () {
            return Datastores_1.Datastores.createCommittedSnapshot(this, listener);
        });
    }
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener) {
    }
    overview() {
        return __awaiter(this, void 0, void 0, function* () {
            const docMetaRefs = yield this.getDocMetaRefs();
            return { nrDocs: docMetaRefs.length, created: this.created };
        });
    }
    capabilities() {
        const networkLayers = new Set(['local']);
        return {
            networkLayers,
            permission: { mode: 'rw' }
        };
    }
    static toFileRefKey(backend, fileRef) {
        return `${backend}:${fileRef.name}`;
    }
    getPrefs() {
        class PrefsProviderImpl extends Datastore_1.AbstractPrefsProvider {
            constructor(prefs) {
                super();
                this.prefs = prefs;
            }
            get() {
                return this.prefs;
            }
        }
        return new PrefsProviderImpl(this.prefs);
    }
}
exports.MemoryDatastore = MemoryDatastore;
//# sourceMappingURL=MemoryDatastore.js.map
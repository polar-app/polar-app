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
exports.DefaultPrefsProvider = exports.AbstractPrefsProvider = exports.SyncDocs = exports.SyncDocMaps = exports.DocMetaSnapshotEvents = exports.isBinaryFileData = exports.BinaryFileDatas = exports.sources = exports.DefaultWriteFileOpts = exports.AbstractDatastore = void 0;
const DocMetaRef_1 = require("./DocMetaRef");
const Files_1 = require("polar-shared/src/util/Files");
const DatastoreMutation_1 = require("./DatastoreMutation");
const AsyncWorkQueues_1 = require("polar-shared/src/util/AsyncWorkQueues");
const DocMetas_1 = require("../metadata/DocMetas");
const DatastoreMutations_1 = require("./DatastoreMutations");
const Prefs_1 = require("../util/prefs/Prefs");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Either_1 = require("../util/Either");
const BackendFileRefs_1 = require("./BackendFileRefs");
const Visibility_1 = require("polar-shared/src/datastore/Visibility");
const Functions_1 = require("polar-shared/src/util/Functions");
const SimpleReactor_1 = require("../reactor/SimpleReactor");
class AbstractDatastore {
    constructor() {
        this.datastoreMutations = DatastoreMutations_1.DatastoreMutations.create('written');
    }
    getDocMetaSnapshot(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const unsubscriber = Functions_1.NULL_FUNCTION;
            try {
                const data = yield this.getDocMeta(opts.fingerprint);
                opts.onSnapshot({
                    exists: true,
                    data: data || undefined,
                    hasPendingWrites: false,
                    source: 'server',
                    unsubscriber
                });
            }
            catch (e) {
                if (opts.onError) {
                    opts.onError(e);
                }
            }
            return {
                unsubscriber
            };
        });
    }
    writeDocMeta(docMeta, datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation()) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = DocMetas_1.DocMetas.serialize(docMeta, "");
            const docInfo = docMeta.docInfo;
            const syncMutation = new DatastoreMutation_1.DefaultDatastoreMutation();
            DatastoreMutations_1.DatastoreMutations.pipe(syncMutation, datastoreMutation, () => docInfo);
            yield this.write(docMeta.docInfo.fingerprint, data, docInfo, { datastoreMutation: syncMutation });
            return docInfo;
        });
    }
    handleWriteFile(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!opts) {
                return;
            }
            if (opts.writeFile) {
                const writeFileOpts = { progressListener: opts.progressListener, onController: opts.onController };
                yield this.writeFile(opts.writeFile.backend, opts.writeFile, opts.writeFile.data, writeFileOpts);
            }
        });
    }
    synchronizeDocs(...docMetaRefs) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    createBackup() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.AbstractDatastore = AbstractDatastore;
class DefaultWriteFileOpts {
    constructor() {
        this.meta = {};
        this.visibility = Visibility_1.Visibility.PRIVATE;
    }
}
exports.DefaultWriteFileOpts = DefaultWriteFileOpts;
var sources;
(function (sources) {
    class DataSources {
        static toLiteral(source) {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof source === 'function') {
                    return source();
                }
                return source;
            });
        }
    }
    sources.DataSources = DataSources;
})(sources = exports.sources || (exports.sources = {}));
class BinaryFileDatas {
    static toType(data) {
        if (typeof data === 'string') {
            return 'string';
        }
        else if (data instanceof Buffer) {
            return 'buffer';
        }
        else if (data instanceof Blob) {
            return 'blob';
        }
        else if (Files_1.FileHandles.isFileHandle(data)) {
            return 'file-handle';
        }
        else {
            return 'readable-stream';
        }
    }
}
exports.BinaryFileDatas = BinaryFileDatas;
function isBinaryFileData(data) {
    if (!Preconditions_1.isPresent(data)) {
        return false;
    }
    if (typeof data === 'string') {
        return true;
    }
    if (data instanceof Buffer) {
        return true;
    }
    if (data instanceof Blob) {
        return true;
    }
    if (Preconditions_1.isPresent(data.path)) {
        return true;
    }
    return false;
}
exports.isBinaryFileData = isBinaryFileData;
class DocMetaSnapshotEvents {
    static format(ev) {
        let batch = "NO BATCH";
        if (ev.batch) {
            batch = `(id: ${ev.batch.id}, terminated: ${ev.batch.terminated})`;
        }
        const progress = ev.progress.progress;
        const nrMutations = ev.docMetaMutations.length;
        return `${ev.datastore} ${progress}% (consistency: ${ev.consistency}, nr mutations: ${nrMutations}, batch: ${batch})`;
    }
    static toDocInfos(docMetaSnapshotEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            return AsyncWorkQueues_1.AsyncWorkQueues
                .awaitAsyncFunctions(docMetaSnapshotEvent.docMetaMutations.map(current => current.docInfoProvider));
        });
    }
    static toSyncDocs(docMetaSnapshotEvent) {
        return __awaiter(this, void 0, void 0, function* () {
            const typedAsyncFunctions = docMetaSnapshotEvent.docMetaMutations.map(docMetaMutation => {
                return () => __awaiter(this, void 0, void 0, function* () {
                    const docInfo = yield docMetaMutation.docInfoProvider();
                    return SyncDocs.fromDocInfo(docInfo, docMetaMutation.mutationType);
                });
            });
            return yield AsyncWorkQueues_1.AsyncWorkQueues.awaitAsyncFunctions(typedAsyncFunctions);
        });
    }
}
exports.DocMetaSnapshotEvents = DocMetaSnapshotEvents;
class SyncDocMaps {
    static putAll(syncDocMap, syncDocs) {
        for (const syncDoc of syncDocs) {
            syncDocMap[syncDoc.fingerprint] = syncDoc;
        }
    }
    static fromArray(syncDocs) {
        const result = {};
        for (const syncDoc of syncDocs) {
            result[syncDoc.fingerprint] = syncDoc;
        }
        return result;
    }
}
exports.SyncDocMaps = SyncDocMaps;
class SyncDocs {
    static fromDocInfo(docInfo, mutationType) {
        const files = BackendFileRefs_1.BackendFileRefs.toBackendFileRefs(Either_1.Either.ofRight(docInfo));
        return {
            fingerprint: docInfo.fingerprint,
            title: docInfo.title || 'untitled',
            docMetaFileRef: DocMetaRef_1.DocMetaFileRefs.createFromDocInfo(docInfo),
            mutationType,
            uuid: docInfo.uuid,
            files
        };
    }
}
exports.SyncDocs = SyncDocs;
class AbstractPrefsProvider {
    constructor() {
        this.reactor = new SimpleReactor_1.SimpleReactor();
    }
    register(onNext, onError) {
        return Functions_1.NULL_FUNCTION;
    }
    subscribe(onNext, onError) {
        if (!this.get) {
            throw new Error("No get method!");
        }
        const handleOnNext = (persistentPrefs) => {
            const interceptedPersistentPrefs = this.createInterceptedPersistentPrefs(persistentPrefs);
            onNext(interceptedPersistentPrefs);
        };
        const eventListener = (persistentPrefs) => handleOnNext(persistentPrefs);
        const unsubscriber = this.register(eventListener, onError);
        this.reactor.addEventListener(eventListener);
        return () => {
            this.reactor.removeEventListener(eventListener);
            unsubscriber();
        };
    }
    createInterceptedPersistentPrefs(persistentPrefs) {
        function isIntercepted(persistentPrefs) {
            return persistentPrefs.__intercepted === true;
        }
        if (persistentPrefs) {
            if (isIntercepted(persistentPrefs)) {
                return persistentPrefs;
            }
            const commit = () => __awaiter(this, void 0, void 0, function* () {
                this.reactor.dispatchEvent(persistentPrefs);
                return persistentPrefs.commit();
            });
            return Prefs_1.InterceptedPersistentPrefsFactory.create(persistentPrefs, commit);
        }
        else {
            return undefined;
        }
    }
}
exports.AbstractPrefsProvider = AbstractPrefsProvider;
class DefaultPrefsProvider extends AbstractPrefsProvider {
    constructor(prefs) {
        super();
        this.prefs = prefs;
    }
    get() {
        return this.createInterceptedPersistentPrefs(this.prefs);
    }
}
exports.DefaultPrefsProvider = DefaultPrefsProvider;
//# sourceMappingURL=Datastore.js.map
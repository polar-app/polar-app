"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.CloudAwareDatastore = void 0;
const Datastore_1 = require("./Datastore");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const DatastoreMutation_1 = require("./DatastoreMutation");
const Logger_1 = require("polar-shared/src/logger/Logger");
const DocMetaComparisonIndex_1 = require("./DocMetaComparisonIndex");
const PersistenceLayers_1 = require("./PersistenceLayers");
const DocMetaSnapshotEventListeners_1 = require("./DocMetaSnapshotEventListeners");
const Functions_1 = require("polar-shared/src/util/Functions");
const SimpleReactor_1 = require("../reactor/SimpleReactor");
const firebase = __importStar(require("firebase/app"));
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const Datastores_1 = require("./Datastores");
const Either_1 = require("../util/Either");
const BackendFileRefs_1 = require("./BackendFileRefs");
const Latch_1 = require("polar-shared/src/util/Latch");
const Prefs_1 = require("../util/prefs/Prefs");
const log = Logger_1.Logger.create();
class CloudAwareDatastore extends Datastore_1.AbstractDatastore {
    constructor(local, cloud) {
        super();
        this.id = 'cloud-aware';
        this.fileSynchronizationEventDispatcher = new SimpleReactor_1.SimpleReactor();
        this.synchronizationEventDispatcher = new SimpleReactor_1.SimpleReactor();
        this.docMetaSnapshotEventDispatcher = new SimpleReactor_1.SimpleReactor();
        this.docMetaComparisonIndex = new DocMetaComparisonIndex_1.DocMetaComparisonIndex();
        this.shutdownHook = Functions_1.ASYNC_NULL_FUNCTION;
        this.local = local;
        this.cloud = cloud;
    }
    init(errorListener = Functions_1.NULL_FUNCTION, opts = { noInitialSnapshot: false, noSync: false }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initDelegates(errorListener);
            yield this.initPrefs();
            yield this.initSnapshots(errorListener, opts);
            return {};
        });
    }
    initDelegates(errorListener) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([
                this.cloud.init(errorListener, { noInitialSnapshot: true }),
                this.local.init(errorListener)
            ]);
        });
    }
    initPrefs() {
        return __awaiter(this, void 0, void 0, function* () {
            const localPrefs = this.local.getPrefs().get();
            const cloudPrefs = this.cloud.getPrefs().get();
            const doUpdate = (source, target) => __awaiter(this, void 0, void 0, function* () {
                if (target.update(source.toPrefDict())) {
                    yield target.commit();
                }
            });
            yield doUpdate(localPrefs, cloudPrefs);
            yield doUpdate(cloudPrefs, localPrefs);
        });
    }
    initSnapshots(errorListener, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshotListener = (event) => __awaiter(this, void 0, void 0, function* () { return this.docMetaSnapshotEventDispatcher.dispatchEvent(event); });
            if (!opts.noSync) {
                this.primarySnapshot = yield this.snapshot(snapshotListener, errorListener);
            }
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.shutdownHook();
            if (this.primarySnapshot && this.primarySnapshot.unsubscribe) {
                this.primarySnapshot.unsubscribe();
            }
            yield Promise.all([this.cloud.stop(), this.local.stop()]);
        });
    }
    contains(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.local.contains(fingerprint);
        });
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.local.getDocMeta(fingerprint);
        });
    }
    getDocMetaSnapshot(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cloud.getDocMetaSnapshot(opts);
        });
    }
    writeFile(backend, ref, data, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const datastoreMutation = opts.datastoreMutation || new DatastoreMutation_1.DefaultDatastoreMutation();
            const result = yield this.local.writeFile(backend, ref, data, opts);
            datastoreMutation.written.resolve(true);
            this.cloud.writeFile(backend, ref, data, opts)
                .then(() => {
                datastoreMutation.committed.resolve(true);
            })
                .catch(err => log.error("Unable to write file to cloud: ", err));
            return result;
        });
    }
    getFile(backend, ref, opts = {}) {
        Datastores_1.Datastores.assertNetworkLayer(this, opts.networkLayer);
        if (!opts.networkLayer || opts.networkLayer === 'local') {
            return this.local.getFile(backend, ref);
        }
        else {
            return this.cloud.getFile(backend, ref);
        }
    }
    containsFile(backend, ref) {
        return this.local.containsFile(backend, ref);
    }
    deleteFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cloud.deleteFile(backend, ref);
            return this.local.deleteFile(backend, ref);
        });
    }
    delete(docMetaFileRef, datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation()) {
        return __awaiter(this, void 0, void 0, function* () {
            datastoreMutation.written.get()
                .then(() => {
                this.docMetaComparisonIndex.remove(docMetaFileRef.fingerprint);
            })
                .catch(err => log.error("Could not handle delete: ", err));
            yield this.datastoreMutations.executeBatchedWrite(datastoreMutation, (remoteCoordinator) => __awaiter(this, void 0, void 0, function* () {
                yield this.cloud.delete(docMetaFileRef, remoteCoordinator);
            }), (localCoordinator) => __awaiter(this, void 0, void 0, function* () {
                yield this.local.delete(docMetaFileRef, localCoordinator);
            }));
            return {};
        });
    }
    write(fingerprint, data, docInfo, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const datastoreMutation = opts.datastoreMutation || new DatastoreMutation_1.DefaultDatastoreMutation();
            const writeFileDatastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation();
            if (opts.writeFile) {
                yield this.writeFile(opts.writeFile.backend, opts.writeFile, opts.writeFile.data, { datastoreMutation: writeFileDatastoreMutation });
            }
            else {
                writeFileDatastoreMutation.written.resolve(true);
                writeFileDatastoreMutation.committed.resolve(true);
            }
            datastoreMutation
                .written.get().then(() => {
                this.docMetaComparisonIndex.updateUsingDocInfo(docInfo);
            })
                .catch(err => log.error("Could not handle delete: ", err));
            yield this.datastoreMutations.executeBatchedWrite(datastoreMutation, (remoteCoordinator) => __awaiter(this, void 0, void 0, function* () {
                yield writeFileDatastoreMutation.committed.get();
                yield this.cloud.write(fingerprint, data, docInfo, { datastoreMutation: remoteCoordinator });
            }), (localCoordinator) => __awaiter(this, void 0, void 0, function* () {
                yield this.local.write(fingerprint, data, docInfo, { datastoreMutation: localCoordinator });
            }));
        });
    }
    getDocMetaRefs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.local.getDocMetaRefs();
        });
    }
    synchronizeDocs(...docMetaRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("CloudAwareDatastore: synchronizeDocs: ", docMetaRefs);
            const clearDocMeta = (...docMetaRefs) => {
                return docMetaRefs.map(current => {
                    return {
                        fingerprint: current.fingerprint
                    };
                });
            };
            const cloudSyncOrigin = yield PersistenceLayers_1.PersistenceLayers.toSyncOrigin(this.cloud, ...clearDocMeta(...docMetaRefs));
            const localSyncOrigin = yield PersistenceLayers_1.PersistenceLayers.toSyncOrigin(this.local, ...docMetaRefs);
            yield PersistenceLayers_1.PersistenceLayers.synchronizeOrigins(localSyncOrigin, cloudSyncOrigin, Functions_1.ASYNC_NULL_FUNCTION);
        });
    }
    snapshot(docMetaSnapshotEventListener, errorListener = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            const isPrimarySnapshot = this.primarySnapshot === undefined;
            const snapshotID = CloudAwareDatastore.SNAPSHOT_ID++;
            const deduplicatedListener = DocMetaSnapshotEventListeners_1.DocMetaSnapshotEventListeners.createDeduplicatedListener((docMetaSnapshotEvent) => __awaiter(this, void 0, void 0, function* () {
                yield docMetaSnapshotEventListener(docMetaSnapshotEvent);
            }));
            class InitialSnapshotLatch {
                constructor(id) {
                    this.syncDocMap = {};
                    this.latch = new Latch_1.Latch();
                    this.hasInitialTerminatedBatch = false;
                    this.pending = 0;
                    this.id = id;
                }
                handleSnapshot(docMetaSnapshotEvent) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            if (this.hasInitialTerminatedBatch) {
                                return;
                            }
                            if (!docMetaSnapshotEvent.batch || docMetaSnapshotEvent.batch.id !== 0) {
                                return;
                            }
                            ++this.pending;
                            const syncDocs = yield Datastore_1.DocMetaSnapshotEvents.toSyncDocs(docMetaSnapshotEvent);
                            Datastore_1.SyncDocMaps.putAll(this.syncDocMap, syncDocs);
                            if (docMetaSnapshotEvent.consistency === 'committed' &&
                                docMetaSnapshotEvent.batch.terminated) {
                                const nrDocs = Dictionaries_1.Dictionaries.size(this.syncDocMap);
                                this.hasInitialTerminatedBatch = true;
                            }
                        }
                        finally {
                            --this.pending;
                            if (this.hasInitialTerminatedBatch && this.pending === 0) {
                                this.latch.resolve(true);
                            }
                        }
                    });
                }
                createSnapshot(datastore) {
                    return datastore.snapshot((docMetaSnapshotEvent) => __awaiter(this, void 0, void 0, function* () {
                        if (!initialSyncCompleted) {
                            yield this.handleSnapshot(docMetaSnapshotEvent);
                        }
                        yield synchronizingListener(docMetaSnapshotEvent);
                    }), errorListener);
                }
            }
            let initialSyncCompleted = false;
            const localInitialSnapshotLatch = new InitialSnapshotLatch('local');
            const cloudInitialSnapshotLatch = new InitialSnapshotLatch('cloud');
            const synchronizingEventDeduplicator = DocMetaSnapshotEventListeners_1.DocMetaSnapshotEventListeners.createDeduplicatedListener((docMetaSnapshotEvent) => __awaiter(this, void 0, void 0, function* () {
                const handleEvent = () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (initialSyncCompleted && isPrimarySnapshot) {
                            yield this.handleSnapshotSynchronization(docMetaSnapshotEvent, deduplicatedListener.listener);
                        }
                    }
                    finally {
                        yield docMetaSnapshotEventListener(docMetaSnapshotEvent);
                    }
                });
                handleEvent()
                    .catch(err => {
                    log.error(`Unable to handle synchronizing snapshot ${snapshotID}`, err);
                    errorListener(err);
                });
            }), this.docMetaComparisonIndex);
            const synchronizingListener = synchronizingEventDeduplicator.listener;
            log.info("Local snapshot...");
            console.time("localSnapshot");
            const localSnapshotResultPromise = localInitialSnapshotLatch.createSnapshot(this.local);
            yield localInitialSnapshotLatch.latch.get();
            console.timeEnd("localSnapshot");
            log.info("Local snapshot...done");
            log.info("Cloud snapshot...");
            const cloudSnapshotResultPromise = cloudInitialSnapshotLatch.createSnapshot(this.cloud);
            yield cloudInitialSnapshotLatch.latch.get();
            log.info("Cloud snapshot...done");
            const localSyncOrigin = {
                datastore: this.local,
                syncDocMap: localInitialSnapshotLatch.syncDocMap
            };
            const cloudSyncOrigin = {
                datastore: this.cloud,
                syncDocMap: cloudInitialSnapshotLatch.syncDocMap
            };
            if (isPrimarySnapshot) {
                yield PersistenceLayers_1.PersistenceLayers.synchronizeOrigins(localSyncOrigin, cloudSyncOrigin, deduplicatedListener.listener);
            }
            initialSyncCompleted = true;
            yield localSnapshotResultPromise;
            const cloudSnapshotResult = yield cloudSnapshotResultPromise;
            log.notice("INITIAL SNAPSHOT COMPLETE");
            return {
                unsubscribe: cloudSnapshotResult.unsubscribe
            };
        });
    }
    handleSnapshotSynchronization(docMetaSnapshotEvent, listener) {
        return __awaiter(this, void 0, void 0, function* () {
            const toLocalSyncOrigin = () => __awaiter(this, void 0, void 0, function* () {
                const docMetaFiles = docMetaSnapshotEvent.docMetaMutations.map(current => {
                    return { fingerprint: current.fingerprint };
                });
                const syncDocMap = yield PersistenceLayers_1.PersistenceLayers.toSyncDocMapFromDocs(this.local, docMetaFiles);
                return {
                    datastore: this.local,
                    syncDocMap
                };
            });
            const toCloudSyncOrigin = () => __awaiter(this, void 0, void 0, function* () {
                const syncDocs = yield Datastore_1.DocMetaSnapshotEvents.toSyncDocs(docMetaSnapshotEvent);
                return {
                    datastore: this.cloud,
                    syncDocMap: Datastore_1.SyncDocMaps.fromArray(syncDocs)
                };
            });
            if (docMetaSnapshotEvent.consistency !== 'committed') {
                return;
            }
            for (const docMetaMutation of docMetaSnapshotEvent.docMetaMutations) {
                if (docMetaMutation.mutationType === 'created' || docMetaMutation.mutationType === 'updated') {
                    const cloudSyncOrigin = yield toCloudSyncOrigin();
                    const localSyncOrigin = yield toLocalSyncOrigin();
                    log.info("Transferring from cloud -> local...");
                    yield PersistenceLayers_1.PersistenceLayers.transfer(cloudSyncOrigin, localSyncOrigin, listener, 'cloud-to-local');
                    log.info("Transferring from cloud -> local...done");
                }
                if (docMetaMutation.mutationType === 'deleted') {
                    const docMetaFileRef = yield docMetaMutation.docMetaFileRefProvider();
                    const fileRefs = BackendFileRefs_1.BackendFileRefs.toBackendFileRefs(Either_1.Either.ofRight(docMetaFileRef.docInfo));
                    for (const fileRef of fileRefs) {
                        yield this.local.deleteFile(fileRef.backend, fileRef);
                    }
                    yield this.local.delete(docMetaFileRef);
                    log.info("File deleted: ", docMetaFileRef);
                }
            }
            this.synchronizationEventDispatcher.dispatchEvent(Object.assign(Object.assign({}, docMetaSnapshotEvent), { dest: 'local' }));
        });
    }
    addFileSynchronizationEventListener(eventListener) {
        this.fileSynchronizationEventDispatcher.addEventListener(eventListener);
    }
    addSynchronizationEventListener(eventListener) {
        this.synchronizationEventDispatcher.addEventListener(eventListener);
    }
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener) {
        this.docMetaSnapshotEventDispatcher.addEventListener(docMetaSnapshotEventListener);
    }
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield firebase.auth().signOut();
        });
    }
    overview() {
        return __awaiter(this, void 0, void 0, function* () {
            return Optional_1.Optional.first(yield this.local.overview(), yield this.cloud.overview()).getOrUndefined();
        });
    }
    capabilities() {
        const networkLayers = new Set(['local', 'web']);
        return {
            networkLayers,
            permission: { mode: 'rw' },
            snapshots: true
        };
    }
    getPrefs() {
        const onCommit = (persistentPrefs) => __awaiter(this, void 0, void 0, function* () {
            const localPrefs = this.local.getPrefs().get();
            localPrefs.update(persistentPrefs.toPrefDict());
            yield localPrefs.commit();
        });
        return new Prefs_1.InterceptedPrefsProvider(this.cloud.getPrefs(), onCommit);
    }
}
exports.CloudAwareDatastore = CloudAwareDatastore;
CloudAwareDatastore.SNAPSHOT_ID = 0;
//# sourceMappingURL=CloudAwareDatastore.js.map
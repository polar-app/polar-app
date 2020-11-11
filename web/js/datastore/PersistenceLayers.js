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
exports.PersistenceLayers = void 0;
const Functions_1 = require("polar-shared/src/util/Functions");
const AsyncWorkQueue_1 = require("polar-shared/src/util/AsyncWorkQueue");
const Datastore_1 = require("./Datastore");
const UUIDs_1 = require("../metadata/UUIDs");
const ProgressTracker_1 = require("polar-shared/src/util/ProgressTracker");
const DocMetas_1 = require("../metadata/DocMetas");
const DefaultPersistenceLayer_1 = require("./DefaultPersistenceLayer");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const URLs_1 = require("polar-shared/src/util/URLs");
const Logger_1 = require("polar-shared/src/logger/Logger");
const BackendFileRefs_1 = require("./BackendFileRefs");
const log = Logger_1.Logger.create();
class PersistenceLayers {
    static changeVisibility(store, docMeta, visibility) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("Changing document visibility changed to: ", visibility);
            const backendFileRefs = BackendFileRefs_1.BackendFileRefs.toBackendFileRefs(docMeta);
            const writeFileOpts = { visibility, updateMeta: true };
            const toWriteFilePromise = (backendFileRef) => __awaiter(this, void 0, void 0, function* () {
                yield store.writeFile(backendFileRef.backend, backendFileRef, undefined, writeFileOpts);
            });
            const toWriteFilePromises = () => {
                return backendFileRefs.map(current => toWriteFilePromise(current));
            };
            const toWriteDocMetaPromise = () => __awaiter(this, void 0, void 0, function* () {
                docMeta.docInfo.visibility = visibility;
                yield store.writeDocMeta(docMeta);
            });
            const writeFilePromises = toWriteFilePromises();
            const writeDocMetaPromise = toWriteDocMetaPromise();
            const promises = [...writeFilePromises, writeDocMetaPromise];
            yield Promise.all(promises);
            log.info("Document visibility changed to: ", visibility);
        });
    }
    static toPersistenceLayer(input) {
        return new DefaultPersistenceLayer_1.DefaultPersistenceLayer(input);
    }
    static toSyncOrigin(datastore, ...docMetaRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            const syncDocMap = yield PersistenceLayers.toSyncDocMapFromDocs(datastore, docMetaRefs);
            return {
                datastore,
                syncDocMap
            };
        });
    }
    static toSyncDocMap(datastore, progressStateListener = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            const docMetaFiles = yield datastore.getDocMetaRefs();
            return this.toSyncDocMapFromDocs(datastore, docMetaFiles, progressStateListener);
        });
    }
    static toSyncDocMapFromDocs(datastore, docMetaRefs, progressStateListener = Functions_1.NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            const syncDocsMap = {};
            const work = [];
            const asyncWorkQueue = new AsyncWorkQueue_1.AsyncWorkQueue(work);
            const init = {
                total: docMetaRefs.length,
                id: `datastore:${datastore.id}#toSyncDocMapFromDocs`
            };
            const progressTracker = new ProgressTracker_1.ProgressTracker(init);
            for (const docMetaRef of docMetaRefs) {
                work.push(() => __awaiter(this, void 0, void 0, function* () {
                    let docMeta = docMetaRef.docMetaProvider ? yield docMetaRef.docMetaProvider() : undefined;
                    if (!docMeta) {
                        const data = yield datastore.getDocMeta(docMetaRef.fingerprint);
                        if (Preconditions_1.isPresent(data)) {
                            docMeta = DocMetas_1.DocMetas.deserialize(data, docMetaRef.fingerprint);
                        }
                    }
                    if (Preconditions_1.isPresent(docMeta)) {
                        syncDocsMap[docMetaRef.fingerprint] = Datastore_1.SyncDocs.fromDocInfo(docMeta.docInfo, 'created');
                        progressStateListener(progressTracker.peek());
                    }
                    else {
                    }
                }));
            }
            yield asyncWorkQueue.execute();
            progressStateListener(progressTracker.terminate());
            return syncDocsMap;
        });
    }
    static merge(syncOrigin0, syncOrigin1, listener = Functions_1.ASYNC_NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transfer(syncOrigin0, syncOrigin1, listener);
            yield this.transfer(syncOrigin1, syncOrigin0, listener);
        });
    }
    static synchronizeOrigins(localSyncOrigin, cloudSyncOrigin, listener = Functions_1.ASYNC_NULL_FUNCTION) {
        return __awaiter(this, void 0, void 0, function* () {
            log.notice("Transferring from local -> cloud...");
            const localToCloud = yield PersistenceLayers.transfer(localSyncOrigin, cloudSyncOrigin, listener, 'local-to-cloud');
            log.notice("Transferring from local -> cloud...done", localToCloud);
            log.notice("Transferring from cloud -> local...");
            const cloudToLocal = yield PersistenceLayers.transfer(cloudSyncOrigin, localSyncOrigin, listener, 'cloud-to-local');
            log.notice("Transferring from cloud -> local...done", cloudToLocal);
        });
    }
    static transfer(source, target, listener = Functions_1.ASYNC_NULL_FUNCTION, id = 'none') {
        return __awaiter(this, void 0, void 0, function* () {
            const result = {
                docMeta: {
                    total: 0,
                    writes: 0
                },
                files: {
                    total: 0,
                    writes: 0
                }
            };
            function handleSyncFile(syncDoc, fileRef) {
                return __awaiter(this, void 0, void 0, function* () {
                    ++result.files.total;
                    const containsFile = (datastore, id) => __awaiter(this, void 0, void 0, function* () {
                        try {
                            return yield datastore.containsFile(fileRef.backend, fileRef);
                        }
                        catch (e) {
                            log.error(`Could not get file ${fileRef.name} for doc with fingerprint: ${syncDoc.fingerprint} from ${id}`, fileRef, e);
                            throw e;
                        }
                    });
                    const targetContainsFile = yield containsFile(target.datastore, 'target');
                    if (!targetContainsFile) {
                        const sourceContainsFile = yield containsFile(source.datastore, 'source');
                        if (sourceContainsFile) {
                            const sourceFile = source.datastore.getFile(fileRef.backend, fileRef);
                            const blob = yield URLs_1.URLs.toBlob(sourceFile.url);
                            yield target.datastore.writeFile(sourceFile.backend, fileRef, blob);
                            ++result.files.writes;
                        }
                        else {
                            log.warn(`Both the target and source files are missing in doc ${syncDoc.fingerprint} (${syncDoc.title}): `, fileRef);
                        }
                    }
                });
            }
            function handleSyncDoc(sourceSyncDoc, targetSyncDoc) {
                return __awaiter(this, void 0, void 0, function* () {
                    ++result.docMeta.total;
                    function computeWriteDocMeta() {
                        if (!targetSyncDoc) {
                            return true;
                        }
                        const cmp = UUIDs_1.UUIDs.compare(targetSyncDoc.uuid, sourceSyncDoc.uuid);
                        return cmp < 0;
                    }
                    const targetStale = computeWriteDocMeta();
                    if (targetStale) {
                        for (const sourceSyncFile of sourceSyncDoc.files) {
                            if (sourceSyncFile.name) {
                                yield handleSyncFile(sourceSyncDoc, sourceSyncFile);
                            }
                        }
                        const data = yield source.datastore.getDocMeta(sourceSyncDoc.fingerprint);
                        if (data) {
                            yield target.datastore.write(sourceSyncDoc.fingerprint, data, sourceSyncDoc.docMetaFileRef.docInfo);
                        }
                        else {
                            log.warn("No data for fingerprint: " + sourceSyncDoc.fingerprint);
                        }
                        ++result.docMeta.writes;
                    }
                    const progress = progressTracker.incr();
                    const docMetaSnapshotEvent = {
                        datastore: source.datastore.id,
                        progress,
                        consistency: 'committed',
                        docMetaMutations: []
                    };
                    yield listener(docMetaSnapshotEvent);
                });
            }
            const docFileAsyncWorkQueue = new AsyncWorkQueue_1.AsyncWorkQueue([]);
            const docMetaAsyncWorkQueue = new AsyncWorkQueue_1.AsyncWorkQueue([]);
            const sourceSyncDocs = Object.values(source.syncDocMap);
            const progressID = `transfer:source=${source.datastore.id},target=${target.datastore.id}`;
            const progressTracker = new ProgressTracker_1.ProgressTracker({ total: sourceSyncDocs.length, id: progressID });
            for (const sourceSyncDoc of sourceSyncDocs) {
                const targetSyncDoc = target.syncDocMap[sourceSyncDoc.fingerprint];
                const handler = () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield handleSyncDoc(sourceSyncDoc, targetSyncDoc);
                    }
                    catch (e) {
                        log.error("Unable to sync between source and target: ", { sourceSyncDoc, targetSyncDoc }, e);
                    }
                });
                docMetaAsyncWorkQueue.enqueue(handler);
            }
            const docFileExecutionPromise = docFileAsyncWorkQueue.execute();
            const docMetaExecutionPromise = docMetaAsyncWorkQueue.execute();
            yield Promise.all([docFileExecutionPromise, docMetaExecutionPromise]);
            yield listener({
                datastore: source.datastore.id,
                progress: progressTracker.terminate(),
                consistency: 'committed',
                docMetaMutations: []
            });
            return result;
        });
    }
}
exports.PersistenceLayers = PersistenceLayers;
//# sourceMappingURL=PersistenceLayers.js.map
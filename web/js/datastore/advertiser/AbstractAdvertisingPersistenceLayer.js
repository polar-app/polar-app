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
exports.AbstractAdvertisingPersistenceLayer = void 0;
const SimpleReactor_1 = require("../../reactor/SimpleReactor");
const PersistenceLayer_1 = require("../PersistenceLayer");
const Functions_1 = require("polar-shared/src/util/Functions");
class AbstractAdvertisingPersistenceLayer extends PersistenceLayer_1.AbstractPersistenceLayer {
    constructor(delegate) {
        super();
        this.reactor = new SimpleReactor_1.SimpleReactor();
        this.datastore = delegate.datastore;
        this.delegate = delegate;
    }
    init(errorListener, opts) {
        return this.delegate.init(errorListener, opts);
    }
    stop() {
        return this.delegate.stop();
    }
    getDocMetaSnapshot(opts) {
        const _super = Object.create(null, {
            getDocMetaSnapshot: { get: () => super.getDocMetaSnapshot }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (this.datastore.capabilities().snapshots) {
                return _super.getDocMetaSnapshot.call(this, opts);
            }
            const handleCurr = (unsubscriber) => __awaiter(this, void 0, void 0, function* () {
                const onError = opts.onError || Functions_1.NULL_FUNCTION;
                try {
                    const data = yield this.getDocMeta(opts.fingerprint);
                    opts.onSnapshot({
                        exists: true,
                        data,
                        source: 'server',
                        hasPendingWrites: false,
                        unsubscriber
                    });
                }
                catch (e) {
                    onError(e);
                }
            });
            const handleNext = () => {
                const releasable = this.addEventListenerForDoc(opts.fingerprint, event => {
                    opts.onSnapshot({
                        exists: true,
                        data: event.docMeta,
                        source: 'server',
                        hasPendingWrites: false,
                        unsubscriber: () => releasable.release()
                    });
                });
                return {
                    unsubscriber: () => releasable.release()
                };
            };
            const result = handleNext();
            yield handleCurr(result.unsubscriber);
            return result;
        });
    }
    addEventListener(listener) {
        return this.reactor.addEventListener(listener);
    }
    addEventListenerForDoc(fingerprint, listener) {
        return this.addEventListener((event) => {
            if (fingerprint === event.docInfo.fingerprint) {
                listener(event);
            }
        });
    }
    writeDocMeta(docMeta, datastoreMutation) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.handleWrite(docMeta, () => __awaiter(this, void 0, void 0, function* () { return yield this.delegate.writeDocMeta(docMeta, datastoreMutation); }));
        });
    }
    write(fingerprint, docMeta, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.handleWrite(docMeta, () => __awaiter(this, void 0, void 0, function* () { return yield this.delegate.write(fingerprint, docMeta, opts); }));
        });
    }
    handleWrite(docMeta, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            const docInfo = yield handler();
            const eventType = this.contains(docMeta.docInfo.fingerprint) ? 'updated' : 'created';
            this.broadcastEvent({
                docInfo,
                docMeta,
                docMetaRef: {
                    fingerprint: docMeta.docInfo.fingerprint
                },
                eventType
            });
            return docInfo;
        });
    }
    synchronizeDocs(...docMetaRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.synchronizeDocs(...docMetaRefs);
        });
    }
    contains(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.contains(fingerprint);
        });
    }
    getDocMetaRefs() {
        return this.delegate.getDocMetaRefs();
    }
    snapshot(listener, errorListener = Functions_1.NULL_FUNCTION) {
        return this.delegate.snapshot(listener, errorListener);
    }
    createBackup() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.createBackup();
        });
    }
    delete(docMetaFileRef) {
        const result = this.delegate.delete(docMetaFileRef);
        this.broadcastEvent({
            docMeta: undefined,
            docInfo: docMetaFileRef.docInfo,
            docMetaRef: {
                fingerprint: docMetaFileRef.fingerprint
            },
            eventType: 'deleted'
        });
        return result;
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delegate.getDocMeta(fingerprint);
        });
    }
    dispatchEvent(event) {
        this.reactor.dispatchEvent(event);
    }
    writeFile(backend, ref, data, opts) {
        return this.delegate.writeFile(backend, ref, data, opts);
    }
    containsFile(backend, ref) {
        return this.delegate.containsFile(backend, ref);
    }
    deleteFile(backend, ref) {
        return this.datastore.deleteFile(backend, ref);
    }
    getFile(backend, ref, opts) {
        return this.delegate.getFile(backend, ref, opts);
    }
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener) {
        this.delegate.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }
    overview() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delegate.overview();
        });
    }
    capabilities() {
        return this.delegate.capabilities();
    }
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delegate.deactivate();
        });
    }
    getUserTagsDB() {
        return this.delegate.getUserTagsDB();
    }
}
exports.AbstractAdvertisingPersistenceLayer = AbstractAdvertisingPersistenceLayer;
//# sourceMappingURL=AbstractAdvertisingPersistenceLayer.js.map
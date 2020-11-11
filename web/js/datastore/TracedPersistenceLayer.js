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
exports.TracedPersistenceLayer = void 0;
const RendererAnalytics_1 = require("../ga/RendererAnalytics");
const tracer = RendererAnalytics_1.RendererAnalytics.createTracer('persistence-layer');
class TracedPersistenceLayer {
    constructor(delegate, id = 'traced') {
        this.delegate = delegate;
        this.id = id;
        this.datastore = delegate.datastore;
    }
    addEventListener(listener) {
        return this.delegate.addEventListener(listener);
    }
    addEventListenerForDoc(fingerprint, listener) {
        this.delegate.addEventListenerForDoc(fingerprint, listener);
    }
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener) {
        this.delegate.addDocMetaSnapshotEventListener(docMetaSnapshotEventListener);
    }
    contains(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('contains', () => this.delegate.contains(fingerprint));
        });
    }
    containsFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('containsFile', () => this.delegate.containsFile(backend, ref));
        });
    }
    deleteFile(backend, ref) {
        return tracer.traceAsync('deleteFile', () => this.datastore.deleteFile(backend, ref));
    }
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.deactivate();
        });
    }
    delete(docMetaFileRef, datastoreMutation) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('delete', () => this.delegate.delete(docMetaFileRef, datastoreMutation));
        });
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('getDocMeta', () => this.delegate.getDocMeta(fingerprint));
        });
    }
    getDocMetaSnapshot(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('getDocMetaSnapshot', () => this.delegate.getDocMetaSnapshot(opts));
        });
    }
    getDocMetaRefs() {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('getDocMetaRefs', () => this.delegate.getDocMetaRefs());
        });
    }
    getFile(backend, ref, opts) {
        return tracer.trace('getFile', () => this.delegate.getFile(backend, ref, opts));
    }
    init(errorListener, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.init(errorListener, opts);
        });
    }
    snapshot(listener, errorListener) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.snapshot(listener, errorListener);
        });
    }
    createBackup() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.createBackup();
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.stop();
        });
    }
    write(fingerprint, docMeta, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('write', () => this.delegate.write(fingerprint, docMeta, opts));
        });
    }
    writeDocMeta(docMeta, datastoreMutation) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('writeDocMeta', () => this.delegate.writeDocMeta(docMeta, datastoreMutation));
        });
    }
    synchronizeDocs(...docMetaRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('synchronizeDocs', () => this.delegate.synchronizeDocs(...docMetaRefs));
        });
    }
    writeFile(backend, ref, data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('writeFile', () => this.delegate.writeFile(backend, ref, data, opts));
        });
    }
    overview() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delegate.overview();
        });
    }
    capabilities() {
        return this.delegate.capabilities();
    }
    getUserTagsDB() {
        return this.delegate.getUserTagsDB();
    }
}
exports.TracedPersistenceLayer = TracedPersistenceLayer;
//# sourceMappingURL=TracedPersistenceLayer.js.map
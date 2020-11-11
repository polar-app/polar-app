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
exports.TracedDatastore = void 0;
const RendererAnalytics_1 = require("../ga/RendererAnalytics");
const DelegatedDatastore_1 = require("./DelegatedDatastore");
const tracer = RendererAnalytics_1.RendererAnalytics.createTracer('datastore');
class TracedDatastore extends DelegatedDatastore_1.DelegatedDatastore {
    constructor(delegate, id = 'traced') {
        super(delegate);
        this.delegate = delegate;
        this.id = id;
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
    createBackup() {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('createBackup', () => this.delegate.createBackup());
        });
    }
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('deactivate', () => this.delegate.deactivate());
        });
    }
    delete(docMetaFileRef, datastoreMutation) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('delete', () => this.delegate.delete(docMetaFileRef, datastoreMutation));
        });
    }
    deleteFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('deleteFile', () => this.delegate.deleteFile(backend, ref));
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
            return tracer.traceAsync('init', () => this.delegate.init(errorListener, opts));
        });
    }
    overview() {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('overview', () => this.delegate.overview());
        });
    }
    synchronizeDocs(...docMetaRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('synchronizeDocs', () => this.delegate.synchronizeDocs(...docMetaRefs));
        });
    }
    write(fingerprint, data, docInfo, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('write', () => this.delegate.write(fingerprint, data, docInfo, opts));
        });
    }
    writeDocMeta(docMeta, datastoreMutation) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('writeDocMeta', () => this.delegate.writeDocMeta(docMeta, datastoreMutation));
        });
    }
    writeFile(backend, ref, data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return tracer.traceAsync('writeFile', () => this.delegate.writeFile(backend, ref, data, opts));
        });
    }
}
exports.TracedDatastore = TracedDatastore;
//# sourceMappingURL=TracedDatastore.js.map
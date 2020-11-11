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
exports.DelegatedDatastore = void 0;
const Datastore_1 = require("./Datastore");
const Directories_1 = require("./Directories");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class DelegatedDatastore extends Datastore_1.AbstractDatastore {
    constructor(delegate) {
        super();
        Preconditions_1.Preconditions.assertPresent(delegate, 'delegate');
        this.id = 'delegated:' + delegate.id;
        this.delegate = delegate;
        this.directories = new Directories_1.Directories();
        this.filesDir = this.directories.filesDir;
    }
    contains(fingerprint) {
        return this.delegate.contains(fingerprint);
    }
    delete(docMetaFileRef, datastoreMutation) {
        return this.delegate.delete(docMetaFileRef, datastoreMutation);
    }
    writeFile(backend, ref, data, opts) {
        return this.delegate.writeFile(backend, ref, data, opts);
    }
    containsFile(backend, ref) {
        return this.delegate.containsFile(backend, ref);
    }
    getFile(backend, ref, opts) {
        return this.delegate.getFile(backend, ref, opts);
    }
    deleteFile(backend, ref) {
        return this.delegate.deleteFile(backend, ref);
    }
    getDocMeta(fingerprint) {
        return this.delegate.getDocMeta(fingerprint);
    }
    getDocMetaSnapshot(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.getDocMetaSnapshot(opts);
        });
    }
    getDocMetaRefs() {
        return this.delegate.getDocMetaRefs();
    }
    snapshot(listener) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.snapshot(listener);
        });
    }
    createBackup() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.createBackup();
        });
    }
    init() {
        return this.delegate.init();
    }
    stop() {
        return this.delegate.stop();
    }
    write(fingerprint, data, docInfo, opts) {
        return this.delegate.write(fingerprint, data, docInfo, opts);
    }
    synchronizeDocs(...docMetaRefs) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delegate.synchronizeDocs(...docMetaRefs);
        });
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
    getPrefs() {
        return this.delegate.getPrefs();
    }
}
exports.DelegatedDatastore = DelegatedDatastore;
//# sourceMappingURL=DelegatedDatastore.js.map
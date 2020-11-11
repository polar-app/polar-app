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
exports.SharingDatastore = void 0;
const Datastore_1 = require("./Datastore");
const Logger_1 = require("polar-shared/src/logger/Logger");
const FirebaseDatastore_1 = require("./FirebaseDatastore");
const DocMetas_1 = require("../metadata/DocMetas");
const BackendFileRefs_1 = require("./BackendFileRefs");
const IDatastore_1 = require("polar-shared/src/datastore/IDatastore");
const log = Logger_1.Logger.create();
class SharingDatastore extends Datastore_1.AbstractDatastore {
    constructor(docMetaID, fingerprint) {
        super();
        this.docMetaID = docMetaID;
        this.fingerprint = fingerprint;
        this.delegate = new FirebaseDatastore_1.FirebaseDatastore();
        this.docMetaData = null;
        this.docMetaRefs = [];
        this.backendFileRefs = [];
        this.id = 'shared';
    }
    init(errorListener, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                opts = Object.assign(Object.assign({}, opts), { noInitialSnapshot: true });
                yield this.delegate.init(errorListener, opts);
                this.docMetaData = yield this.delegate.getDocMetaDirectly(this.docMetaID);
                if (this.docMetaData) {
                    this.docMeta = DocMetas_1.DocMetas.deserialize(this.docMetaData, this.fingerprint);
                    this.docMetaRefs = [
                        {
                            fingerprint: this.fingerprint,
                            docMetaProvider: () => Promise.resolve(this.docMeta)
                        }
                    ];
                    this.backendFileRefs = BackendFileRefs_1.BackendFileRefs.toBackendFileRefs(this.docMeta);
                }
                return {};
            }
            catch (e) {
                log.error("Unable to init datastore: ", e);
                throw e;
            }
        });
    }
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener) {
    }
    capabilities() {
        return {
            networkLayers: IDatastore_1.NetworkLayers.WEB,
            permission: { mode: 'ro' }
        };
    }
    contains(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fingerprint === fingerprint;
        });
    }
    deactivate() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.docMetaData;
        });
    }
    getDocMetaRefs() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.docMetaRefs;
        });
    }
    getPrefs() {
        throw this.delegate.getPrefs();
    }
    overview() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delegate.overview();
        });
    }
    snapshot(docMetaSnapshotEventListener, errorListener) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not supported");
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    write(fingerprint, data, docInfo, opts = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not supported");
        });
    }
    containsFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            const backendFileRef = Object.assign({ backend }, ref);
            return this.backendFileRefs.filter(current => BackendFileRefs_1.BackendFileRefs.equals(current, backendFileRef)).length > 0;
        });
    }
    delete(docMetaFileRef, datastoreMutation) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not supported");
        });
    }
    deleteFile(backend, ref) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not supported");
        });
    }
    getFile(backend, ref, opts) {
        throw new Error("Not implemented yet");
    }
    writeFile(backend, ref, data, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not supported");
        });
    }
}
exports.SharingDatastore = SharingDatastore;
//# sourceMappingURL=SharingDatastore.js.map
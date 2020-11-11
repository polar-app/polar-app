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
exports.RemoteDatastore = void 0;
const Datastores_1 = require("./Datastores");
const DelegatedDatastore_1 = require("./DelegatedDatastore");
const SimpleReactor_1 = require("../reactor/SimpleReactor");
const Logger_1 = require("polar-shared/src/logger/Logger");
const DatastoreMutation_1 = require("./DatastoreMutation");
const DatastoreMutations_1 = require("./DatastoreMutations");
const log = Logger_1.Logger.create();
class RemoteDatastore extends DelegatedDatastore_1.DelegatedDatastore {
    constructor(datastore) {
        super(datastore);
        this.docMetaSnapshotEventDispatcher = new SimpleReactor_1.SimpleReactor();
        this.id = 'remote:' + datastore.id;
    }
    snapshot(listener) {
        return __awaiter(this, void 0, void 0, function* () {
            return Datastores_1.Datastores.createCommittedSnapshot(this, listener);
        });
    }
    init(errorListener) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this);
            if (this.docMetaSnapshotEventDispatcher.size() > 0) {
                this.snapshot((event) => __awaiter(this, void 0, void 0, function* () { return this.docMetaSnapshotEventDispatcher.dispatchEvent(event); }))
                    .catch(err => log.error(err));
            }
            return {};
        });
    }
    write(fingerprint, data, docInfo, opts = {}) {
        const datastoreMutation = opts.datastoreMutation || new DatastoreMutation_1.DefaultDatastoreMutation();
        opts = Object.assign(Object.assign({}, opts), { datastoreMutation: undefined });
        const writeDelegate = () => __awaiter(this, void 0, void 0, function* () {
            return this.delegate.write(fingerprint, data, docInfo, opts);
        });
        return DatastoreMutations_1.DatastoreMutations.handle(() => writeDelegate(), datastoreMutation, () => true);
    }
    delete(docMetaFileRef, datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation()) {
        return __awaiter(this, void 0, void 0, function* () {
            const syncMutation = new DatastoreMutation_1.DefaultDatastoreMutation();
            const result = yield DatastoreMutations_1.DatastoreMutations.handle(() => this.delegate.delete(docMetaFileRef, syncMutation), datastoreMutation, () => true);
            return result;
        });
    }
    addDocMetaSnapshotEventListener(docMetaSnapshotEventListener) {
        this.docMetaSnapshotEventDispatcher.addEventListener(docMetaSnapshotEventListener);
    }
}
exports.RemoteDatastore = RemoteDatastore;
//# sourceMappingURL=RemoteDatastore.js.map
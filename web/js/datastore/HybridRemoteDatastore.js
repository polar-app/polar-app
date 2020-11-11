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
exports.HybridRemoteDatastore = void 0;
const Datastore_1 = require("./Datastore");
const DiskDatastore_1 = require("./DiskDatastore");
const RemoteDatastore_1 = require("./RemoteDatastore");
const Blobs_1 = require("polar-shared/src/util/Blobs");
class HybridRemoteDatastore extends RemoteDatastore_1.RemoteDatastore {
    constructor(delegate) {
        super(delegate);
        this.id = 'hybrid-remote:' + delegate.id;
        this.diskDatastore = new DiskDatastore_1.DiskDatastore();
    }
    init(errorListener) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this);
            yield this.diskDatastore.init(errorListener);
            return {};
        });
    }
    writeFile(backend, ref, data, opts) {
        if (!Datastore_1.isBinaryFileData(data)) {
            throw new Error("Data is not BinaryFileData");
        }
        const toDiskData = () => {
            if (data instanceof Blob) {
                return Blobs_1.Blobs.toStream(data);
            }
            else {
                return data;
            }
        };
        const diskData = toDiskData();
        return this.diskDatastore.writeFile(backend, ref, diskData, opts);
    }
    getDocMetaRefs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.diskDatastore.getDocMetaRefs();
        });
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.diskDatastore.getDocMeta(fingerprint);
        });
    }
}
exports.HybridRemoteDatastore = HybridRemoteDatastore;
//# sourceMappingURL=HybridRemoteDatastore.js.map
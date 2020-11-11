"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HybridRemoteDatastores = void 0;
const HybridRemoteDatastore_1 = require("./HybridRemoteDatastore");
const RemoteDatastores_1 = require("./RemoteDatastores");
const DataFileCacheDatastore_1 = require("./DataFileCacheDatastore");
class HybridRemoteDatastores {
    static create() {
        const datastore = RemoteDatastores_1.RemoteDatastores.create();
        return new DataFileCacheDatastore_1.DataFileCacheDatastore(new HybridRemoteDatastore_1.HybridRemoteDatastore(datastore));
    }
}
exports.HybridRemoteDatastores = HybridRemoteDatastores;
//# sourceMappingURL=HybridRemoteDatastores.js.map
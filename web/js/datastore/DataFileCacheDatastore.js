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
exports.DataFileCacheDatastore = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const DatastoreFileCache_1 = require("./DatastoreFileCache");
const DelegatedDatastore_1 = require("./DelegatedDatastore");
const log = Logger_1.Logger.create();
class DataFileCacheDatastore extends DelegatedDatastore_1.DelegatedDatastore {
    constructor(delegate) {
        super(delegate);
    }
    getFile(backend, ref, opts) {
        const hit = DatastoreFileCache_1.DatastoreFileCache.getFile(backend, ref);
        if (hit.isPresent()) {
            log.debug("Found file in datastore cache: ", { backend, ref });
            return hit.get();
        }
        return super.getFile(backend, ref, opts);
    }
    deleteFile(backend, ref) {
        const _super = Object.create(null, {
            deleteFile: { get: () => super.deleteFile }
        });
        return __awaiter(this, void 0, void 0, function* () {
            DatastoreFileCache_1.DatastoreFileCache.evictFile(backend, ref);
            return _super.deleteFile.call(this, backend, ref);
        });
    }
}
exports.DataFileCacheDatastore = DataFileCacheDatastore;
//# sourceMappingURL=DataFileCacheDatastore.js.map
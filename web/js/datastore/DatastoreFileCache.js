"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatastoreFileCache = void 0;
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class DatastoreFileCache {
    static writeFile(backend, ref, meta) {
        const key = this.toKey(backend, ref);
        this.backing[key] = Object.assign(Object.assign({}, meta), { backend, ref });
    }
    static getFile(backend, ref, opts) {
        const key = this.toKey(backend, ref);
        const entry = this.backing[key];
        const status = entry ? 'hit' : 'miss';
        log.debug("DatastoreFileCache status: " + status);
        return Optional_1.Optional.of(entry);
    }
    static evictFile(backend, ref) {
        const key = this.toKey(backend, ref);
        delete this.backing[key];
    }
    static toKey(backend, ref) {
        return `${backend}:${ref.name}`;
    }
}
exports.DatastoreFileCache = DatastoreFileCache;
DatastoreFileCache.backing = {};
//# sourceMappingURL=DatastoreFileCache.js.map
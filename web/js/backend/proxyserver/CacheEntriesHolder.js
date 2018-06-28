/**
 * Holds the cached requests plus other metadata.
 */
class CacheEntriesHolder {

    constructor(options) {

        /**
         *
         * @type {Object<String, CacheEntry>}
         */
        this.cacheEntries = {};

        this.metadata = {};

        Object.assign(this, options);
    }

}

module.exports.CacheEntriesHolder = CacheEntriesHolder;

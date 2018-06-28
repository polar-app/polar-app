/**
 * Holds the cached requests plus other metadata.
 */
class CachedRequestsHolder {

    constructor(options) {

        /**
         * The metadata for cached request.
         * @type {{}}
         */
        this.metadata = {};

        /**
         *
         * @type {Object<String, CachedRequest>}
         */
        this.cachedRequests = {};

        Object.assign(this, options);
    }

}

module.exports.CachedRequestsHolder = CachedRequestsHolder;

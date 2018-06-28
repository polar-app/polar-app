/**
 * Metadata about an object registered in the cache.
 */
class CacheMeta {

    /**
     *
     * @param url {String}
     * @param requestConfig {CachedRequest}
     */
    constructor(url, requestConfig) {
        this.url = url;
        this.requestConfig = requestConfig;
    }

}

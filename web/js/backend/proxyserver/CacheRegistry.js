const path = require('path');
const CachedRequestsHolder = require("./CachedRequestsHolder").CachedRequestsHolder;
const {Preconditions} = require("../../Preconditions");
const {Hashcodes} = require('../../Hashcodes');
const {CacheEntriesFactory} = require('./CacheEntriesFactory');
const {CacheMeta} = require('./CacheMeta');
const {CachedRequest} = require('./CachedRequest');
const {forDict} = require('../../util/Functions');

class CacheRegistry {

    constructor(proxyConfig) {

        this.proxyConfig = Preconditions.assertNotNull(proxyConfig);

        this.registry = {};

    }

    /**
     *
     * @param path
     * @return {Promise<CachedRequestsHolder>}
     */
    async registerFile(path) {

        let cacheEntriesHolder = await CacheEntriesFactory.createEntriesFromFile(path);

        let cachedRequestsHolder = new CachedRequestsHolder({
            metadata: cacheEntriesHolder.metadata
        });

        if(! cacheEntriesHolder.cacheEntries) {
            throw new Error("No cache entries!");
        }

        forDict(cacheEntriesHolder.cacheEntries, (key, cacheEntry) => {
            let cacheMeta = this.register(cacheEntry);
            cachedRequestsHolder.cachedRequests[cacheMeta.url] = cacheMeta;
        });

        return cachedRequestsHolder;

    }


    /**
     * Register a file to be served with the given checksum.  Then return
     * metadata about what we registered including how to fetch the file we
     * registered.
     *
     * @return {CachedRequest}
     */
    register(cacheEntry) {

        Preconditions.assertNotNull(cacheEntry, "cacheEntry");
        Preconditions.assertNotNull(cacheEntry.statusCode, "cacheEntry.statusCode");
        Preconditions.assertNotNull(cacheEntry.headers, "cacheEntry.headers");

        let url = cacheEntry.url;

        Preconditions.assertNotNull(url, "url");

        console.log(`Registered new cache entry at: ${url}`);

        this.registry[url] = cacheEntry;

        return new CachedRequest({
            url,
            proxyRules: `http=localhost:${this.proxyConfig.port}`,
            proxyBypassRules: "<local>"
        });

    }

    /**
     * Return true if the given hashcode is registered.
     *
     * @param key The key we should fetch.
     */
    hasEntry(url) {
        return url in this.registry;
    }

    /**
     * Get metadata about the given key.
     *
     * @return {CacheEntry}
     */
    get(url) {

        if(!this.hasEntry(url)) {
            throw new Error("URL not registered: " + url);
        }

        return this.registry[url];

    }

}

module.exports.CacheRegistry = CacheRegistry;

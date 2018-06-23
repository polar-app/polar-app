const path = require('path');
const {Preconditions} = require("../../Preconditions");
const {Hashcodes} = require('../../Hashcodes');

class CacheRegistry {

    constructor(proxyConfig) {

        this.proxyConfig = Preconditions.assertNotNull(proxyConfig);

        this.registry = {};

    }

    registerFile(path) {



    }
    /**
     * Register a file to be served with the given checksum.  Then return
     * metadata about what we registered including how to fetch the file we
     * registered.
     *
     */
    register(cacheEntry) {

        Preconditions.assertNotNull(cacheEntry, "cacheEntry");
        Preconditions.assertNotNull(cacheEntry.statusCode, "cacheEntry.statusCode");
        Preconditions.assertNotNull(cacheEntry.headers, "cacheEntry.headers");

        let url = cacheEntry.url;

        Preconditions.assertNotNull(url, "url");

        console.log(`Registered new cache entry at: ${url}`);

        this.registry[url] = cacheEntry;

        return { url };

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
     */
    get(url) {

        if(!this.hasEntry(url)) {
            throw new Error("URL not registered: " + url);
        }

        return this.registry[url];

    }

}

module.exports.CacheRegistry = CacheRegistry;

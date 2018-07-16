const {Paths} = require("../../util/Paths");
const {Fingerprints} = require("../../util/Fingerprints");
const {Preconditions} = require("../../Preconditions");

const log = require("../../logger/Logger").create();

const WEBSERVER_PORT = 8500;
const DEFAULT_HOST = "127.0.0.1";

/**
 *
 */
class PHZLoader {

    constructor(opts) {

        /**
         *
         * @type {CacheRegistry}
         */
        this.cacheRegistry = undefined;

        Object.assign(this, opts);

        Preconditions.assertNotNull(this.cacheRegistry, "cacheRegistry");

    }

    /**
     * Compute a URL to load a file in the UI a PHZ file and registers it
     * with the CacheRegistry so it can be loaded properly.
     *
     * @param path {string}
     * @return {string}
     */
    async registerForLoad(path) {

        // register the phz.  the cache interceptor should do the rest.
        let cachedRequestsHolder = await this.cacheRegistry.registerFile(path);

        log.info("cachedRequestsHolder: " + JSON.stringify(cachedRequestsHolder));

        // get the cache metadata for the primary URL as it will work for the
        // subsequent URLs too.

        let cachedRequest = cachedRequestsHolder.cachedRequests[cachedRequestsHolder.metadata.url];

        console.log("Going to load URL: " + cachedRequest.url);

        let descriptor = cachedRequestsHolder.metadata;
        let descriptorJSON = JSON.stringify(descriptor);

        // we don't need the content represented twice.

        let basename = Paths.basename(path);

        // TODO: this is workaround until we enable zip files with embedded
        // metadata / descriptors
        let fingerprint = Fingerprints.create(basename);

        return `http://${DEFAULT_HOST}:${WEBSERVER_PORT}/htmlviewer/index.html?file=${encodeURIComponent(cachedRequest.url)}&fingerprint=${fingerprint}&descriptor=${encodeURIComponent(descriptorJSON)}`;

    }

}

module.exports.PHZLoader = PHZLoader;

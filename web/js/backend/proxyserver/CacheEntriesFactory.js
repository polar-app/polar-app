
const fs = require("fs");
const {DiskCacheEntry} = require("./DiskCacheEntry");
const {PHZCacheEntry} = require("./PHZCacheEntry");
const {CachingPHZReader} = require("../../phz/CachingPHZReader");
const {Promises} = require("../../util/Promises");
const {CacheEntriesHolder} = require("./CacheEntriesHolder");
const {forDict} = require("../../util/Functions");

/**
 * Cache entry which is just buffered in memory.
 */
class CacheEntriesFactory {

    /**
     *
     * @param path
     * @return {Promise<CacheEntriesHolder>}
     */
    static async createEntriesFromFile(path) {

        if(path.endsWith(".chtml")) {
            return CacheEntriesFactory.createFromCHTML(path);
        } else if(path.endsWith(".phz")) {
            return CacheEntriesFactory.createFromPHZ(path);
        } else {
            throw new Error("Unable to handle file type for path: " + path);
        }

    }

    static createFromHTML(url, path) {

        // TODO: stat the file so that we can get the Content-Length

        return new DiskCacheEntry({
            url,
            method: "GET",
            headers: {
                "Content-Type": "text/html"
            },
            statusCode: 200,
            statusMessage: "OK",
            path
        });

    }

    /**
     * Read from a static CHTML file which has the URL within the metadata.
     *
     * @param path
     * @return Promise<CacheEntriesHolder>
     */
    static async createFromPHZ(path) {

        // load the .json data so we have the URL.

        let cachingPHZReader = new CachingPHZReader(path);

        let resources = await cachingPHZReader.getResources();

        let cacheEntriesHolder = new CacheEntriesHolder({});

        cacheEntriesHolder.metadata = await cachingPHZReader.getMetadata();

        forDict(resources.entries, (key,resourceEntry) => {

            let resource = resourceEntry.resource;

            let url = resourceEntry.resource.url;

            if(!url) {
                throw new Error("No url");
            }

            // FIXME: we need a way to keep the CacheEntry and Resource fields
            // all in sync... Maybe have them all extend from the same base object

            let cacheEntry = new PHZCacheEntry({
                url,
                method: resource.method,
                headers: resource.headers,
                statusCode: resource.statusCode,
                statusMessage: resource.statusMessage,
                contentType: resource.contentType,
                mimeType: resource.encoding,
                encoding: resource.encoding,
                phzReader: cachingPHZReader,
                resourceEntry: resourceEntry
            });

            cacheEntriesHolder.cacheEntries[url]=cacheEntry;

        });

        return cacheEntriesHolder;

    }


    /**
     * Read from a static CHTML file which has the URL within the metadata.
     *
     * @param path
     * @return Promise<CacheEntriesHolder>
     */
    static async createFromCHTML(path) {

        // load the .json data so we have the URL.

        let jsonPath = path.replace(".chtml", "") + ".json";

        let json = fs.readFileSync(jsonPath);

        let data = JSON.parse(json.toString("UTF-8"));

        let url = data.url;

        // we can't serve this via HTTPS.. only HTTP which is cached locally.
        url = url.replace(/^https:/, "http:");

        // TODO: stat the file so that we can get the Content-Length

        return new CacheEntriesHolder({
            metadata: {
                url
            },
            cacheEntries: {
                url: new DiskCacheEntry({
                    url: url,
                    method: "GET",
                    headers: {
                        "Content-Type": "text/html"
                    },
                    statusCode: 200,
                    statusMessage: "OK",
                    path
                })
            }
        });

    }

}

module.exports.CacheEntriesFactory = CacheEntriesFactory;


const fs = require("fs");
const {DiskCacheEntry} = require("./DiskCacheEntry");
const {PHZCacheEntry} = require("./PHZCacheEntry");
const {CachingPHZReader} = require("../../phz/CachingPHZReader");
const {Promises} = require("../../util/Promises");
const {CacheEntriesHolder} = require("./CacheEntriesHolder");

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

        cacheEntriesHolder.metadata = cachingPHZReader.getMetadata();

        resources.entries.forEach(resourceEntry => {

            let cacheEntry = new PHZCacheEntry({
                url: resourceEntry.url,
                method: resourceEntry.method,
                headers: resourceEntry.headers,
                statusCode: resourceEntry.statusCode,
                statusMessage: resourceEntry.statusMessage,
                phzReader: cachingPHZReader,
                resourceEntry: resourceEntry
            });

            cacheEntriesHolder.cacheEntries.push(cacheEntry);

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

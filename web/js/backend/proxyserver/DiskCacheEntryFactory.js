
const fs = require("fs");
const {DiskCacheEntry} = require("./DiskCacheEntry");
/**
 * Cache entry which is just buffered in memory.
 */
class DiskCacheEntryFactory {

    static createFromStaticHTML(url, path) {

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

}

module.exports.DiskCacheEntryFactory = DiskCacheEntryFactory;

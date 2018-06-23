
const fs = require("fs");
const {DiskCacheEntry} = require("./DiskCacheEntry");
/**
 * Cache entry which is just buffered in memory.
 */
class DiskCacheEntryFactory {

    static createFromFile(path) {

        if(path.endsWith(".chtml")) {
            return DiskCacheEntryFactory.createFromStaticCHTML(path);
        } else {
            throw new Error("Unable to handle file type for path: " + path);
        }

    }

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

    /**
     * Read from a static CHTML file which has the URL within the metadata.
     *
     * @param path
     * @return {DiskCacheEntry}
     */
    static createFromStaticCHTML(path) {

        // load the .json data so we have the URL.

        let jsonPath = path.replace(".chtml", "") + ".json";

        let json = fs.readFileSync(jsonPath);

        let data = JSON.parse(json.toString("UTF-8"));

        // TODO: stat the file so that we can get the Content-Length

        return new DiskCacheEntry({
            url: data.url,
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

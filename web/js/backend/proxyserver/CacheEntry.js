const {Objects} = require("../../util/Objects");

// https://expressjs.com/en/4x/api.html#req
// https://expressjs.com/en/4x/api.html#res

/* abstract */ class CacheEntry {

    constructor(options) {

        this.method = "GET";

        /**
         * The URL to request.
         */
        this.url = null;

        /**
         * The request headers.
         *
         * @type {{}}
         */
        this.headers = {};

        /**
         * The status code for this cache entry.
         */
        this.statusCode = 200;

        /**
         * The status message.
         */
        this.statusMessage = "OK";

        /**
         * The content length of the data, if known. Otherwise, null.
         * @type {null}
         */
        this.contentLength = null;

        Object.assign(this, options);

    }

    /**
     * Handle data for this request.  The callback is called as a function
     * with one 'data' parameter which is a buffer of data to write.
     *
     * The handleData should return false when there is no more data to handle.
     *
     */
    /* abstract */ async handleData(callback) {

    }

}

module.exports.CacheEntry = CacheEntry;

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

        Objects.defaults(options, this);

    }

}

module.exports.CacheEntry = CacheEntry;


const {CacheEntry} = require("./CacheEntry");
/**
 * Cache entry which is just buffered in memory.
 */
class BufferedCacheEntry extends CacheEntry {

    constructor(options) {

        super(options);

        /**
         * The data we should serve.
         * @type {null}
         */
        this.data = options.data;

    }

    handleData(callback) {
        callback(this.data);
        return false;
    }

}

module.exports.BufferedCacheEntry = BufferedCacheEntry;

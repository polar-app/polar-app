const {CacheEntry} = require("./CacheEntry");

/**
 * A cache entry backed by a phz file.
 */
class PHZCacheEntry extends CacheEntry {

    constructor(options) {

        super(options);

        /**
         *
         * @type {PHZReader}
         */
        this.phzReader = null;

        /**
         *
         * @type {ResourceEntry}
         */
        this.resourceEntry = null;

        Object.assign(this, options);

        Preconditions.assertNotNull(this.phzReader, "phzReader");
        Preconditions.assertNotNull(this.resourceEntry, "resourceEntry");

    }

    async handleData(callback) {

        let buffer = await this.phzReader.getResource(this.resourceEntry);

        // TODO: this is probably incorrect for now but we only need to support
        // UTF-8 HTML content.
        callback(buffer.toString("UTF-8"));

    }

}

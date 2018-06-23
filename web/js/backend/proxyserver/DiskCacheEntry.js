
const fs = require("fs");
const {CacheEntry} = require("./CacheEntry");
/**
 * Cache entry which is just buffered in memory.
 */
class DiskCacheEntry extends CacheEntry {

    constructor(options) {

        super(options);

        /**
         * The data we should serve.
         * @type {null}
         */
        this.path = options.path;

    }

    async handleData(callback) {

        return new Promise((resolve, reject) => {

            // TODO: in the future migrate to reading in chunks which would be
            // slightly faster but almost irrelevant now

            fs.readFile(this.path, (err, data) => {

                if (err) {
                    reject(err)
                }

                callback(data);
                resolve(false);

            });

        });

    }

}

module.exports.DiskCacheEntry = DiskCacheEntry;


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
        Object.assign(this, options);

        if(! this.path) {
            throw new Error("No path");
        }

    }

    async handleData(callback) {

        return new Promise((resolve, reject) => {

            // TODO: in the future migrate to a stream

            fs.readFile(this.path, (err, data) => {

                if (err) {
                    reject(err)
                }

                callback(data);
                resolve(false);

            });

        });

    }

    async toBuffer() {

        // TODO: in the future migrate to a stream

        return new Promise((resolve, reject) => {

           fs.readFile(this.path, (err, data) => {

                if (err) {
                    reject(err)
                }

                resolve(data);

            });

        });
    }


}

module.exports.DiskCacheEntry = DiskCacheEntry;

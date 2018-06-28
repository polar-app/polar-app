const JSZip = require("jszip");
const {PHZReader} = require("./PHZReader");
const {Files} = require("../util/Files");
const {Logger} = require("../logger/Logger");

const log = Logger.create();

class CachingPHZReader {

    constructor(path, timeout) {

        if(!timeout) {
            timeout = 60000;
        }

        this.path = path;

        /**
         * The delegate PHZReader that actually performs the IO.
         *
         * @type {PHZReader}
         */
        this.delegate = null;

        /**
         * The amount of time we should wait after init to close the file.
         *
         * @type {number}
         */
        this.timeout = timeout;

        /**
         * The number of times the reader has been re-opened.
         * @type {number}
         */
        this.reopened = 0;

    }

    /**
     * Init must be called to load the entries which we can work with.
     *
     * @return {Promise<void>}
     */
    async init() {

        this.delegate = new PHZReader(this.path);
        await this.delegate.init();

        setTimeout(async () => {

            await this.close();

        }, this.timeout);

    }

    async getMetadata() {
        await this.openWhenNecessary();
        return await this.delegate.getMetadata();
    }

    /**
     * Get just the resources from the metadata.
     */
    async getResources() {
        await this.openWhenNecessary();
        return await this.delegate.getResources();
    }

    /**
     * Read a resource from disk and call the callback with the new content once
     * it's ready for usage.
     *
     * @param resourceEntry {ResourceEntry}
     * @return {Promise<Buffer>}
     */
    async getResource(resourceEntry) {
        await this.openWhenNecessary();
        return await this.delegate.getResource(resourceEntry);
    }

    async openWhenNecessary() {

        if(this.delegate) {
            // we are done.  There is already a delegate we can use.
            return;
        }

        log.info("Caching PHZReader being re-opened: " + this.path);
        ++this.reopened;

        await this.init();

    }

    async close() {

        // copy the delegate so that nothing can see this.delegate as being
        // non-null while we close else we would have a race.
        let delegate = this.delegate;
        this.delegate = null;

        await delegate.close();

    }

}

module.exports.CachingPHZReader = CachingPHZReader;

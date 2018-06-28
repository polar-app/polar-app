const JSZip = require("jszip");
const {Files} = require("../util/Files");

class PHZReader {

    constructor(path) {
        this.path = path;
        this.zip = null;

        this.metadata = null;

        /**
         *
         * @type {Resources}
         */
        this.resources = null;

    }

    /**
     * Init must be called to load the entries which we can work with.
     *
     * @return {Promise<void>}
     */
    async init() {

        let data = Files.readFileAsync(this.path);

        this.zip = new JSZip();

        await this.zip.loadAsync(data);

    }

    /**
     * @return {Promise<Object>}
     */
    async getMetadata() {
        return await this.getCached("metadata.json", "metadata");
    }

    /**
     * Get just the resources from the metadata.
     * @return {Promise<Resources>}
     */
    async getResources() {
        return await this.getCached("resources.json", "resources");
    }

    async getCached(path, key) {

        if(this[key] !== null) {
            // return the cache version if it's already read properly.
            return this[key];
        }

        let buffer = await this._readAsBuffer(path);

        if(! buffer)
            return null;

        this[key] = JSON.parse(buffer.toString("UTF-8"));

        return this[key];

    }

    /**
     * Return a raw buffer with no encoding.
     *
     * @param path
     * @return {Promise<Buffer>}
     * @private
     */
    async _readAsBuffer(path) {

        let zipFile = await this.zip.file(path);

        if(!zipFile) {
            return null;
        }

        let arrayBuffer = await zipFile.async("ArrayBuffer");
        return Buffer.from(arrayBuffer);

    }

    /**
     * Read a resource from disk and call the callback with the new content once
     * it's ready for usage.
     *
     * @param resourceEntry {ResourceEntry}
     * @return {Promise<Buffer>}
     */
    async getResource(resourceEntry) {
        return await this._readAsBuffer(resourceEntry.path);
    }

    async close() {
        // we just have to let it GC
        this.zip = null;
    }

}

module.exports.PHZReader = PHZReader;

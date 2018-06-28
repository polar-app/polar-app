const JSZip = require("jszip");
const {Files} = require("../util/Files");

class PHZReader {

    constructor(path) {
        this.path = path;
        this.zip = null;

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

    async getMetadata() {

    }

    /**
     * Get just the resources from the metadata.
     */
    async getResources() {

        if(this.resources !== null) {
            // return the cache version if it's already read properly.
            return this.resources;
        }

        let arrayBuffer = await this.zip.file("resources.json").async("ArrayBuffer");
        let buffer = Buffer.from(arrayBuffer);
        this.resources = JSON.parse(buffer.toString("UTF-8"));

        return this.resources;

    }

    /**
     * Read a resource from disk and call the callback with the new content once
     * it's ready for usage.
     *
     * @param resource
     * @param callback
     */
    getResource(resource, callback) {

    }

}

module.exports.PHZReader = PHZReader;

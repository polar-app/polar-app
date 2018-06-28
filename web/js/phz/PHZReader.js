const AdmZip = require('adm-zip');

class PHZReader {

    constructor(path) {
        this.path = path;
        this.zip = new AdmZip(this.path);
    }

    getMetadata() {

    }

    /**
     * Get just the resources from the metadata.
     */
    getResources() {
        return this.meta.resources;
    }

    /**
     * Read a resource from disk and call the callback with the new content once
     * it's ready for usage.
     *
     * @param resource
     * @param callback
     */
    readResource(resource, callback) {

    }

}

module.exports.PHZReader = PHZReader;

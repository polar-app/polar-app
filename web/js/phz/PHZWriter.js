const JSZip = require("jszip");
const fs = require("fs");
const {Resources} = require("./Resources");

/**
 * Write to a new zip output stream.
 */
class PHZWriter {

    constructor(path) {
        this.path = path;
        this.zip = new JSZip();
        this.resources = {

            /**
             * The list of all resources.
             */
            entries: []

        };

    }

    /**
     * Write user provided metadata which applies to all files in the archive.
     *
     * @param metadata
     * @return {PHZWriter}
     */
    writeMetadata(metadata) {
        this.__write("/metadata.json", JSON.stringify(metadata, null, "  "), "metadata");
        return this;
    }

    /**
     *
     * @param resource {Resource}
     * @param content
     * @param comment
     * @return {PHZWriter}
     */
    writeResource(resource, content, comment) {

        if (!comment) {
            comment = "";
        }

        // add this to the resources index.
        this.resources.entries.push(resource);

        // *** write the metadata

        this.__write(`${resource.id}-meta.json`, JSON.stringify(resource, null, "  "), "");

        // *** write the actual data

        let ext = Resources.contentTypeToExtension(resource.contentType);
        let resourcePath = `${resource.id}.${ext}`;
        this.__write(resourcePath, content, comment);

        return this;

    }

    __writeResources() {
        this.__write("/resources.json", JSON.stringify(this.resources, null, "  "), "resources");
        return this;
    }

    __write(path, content, comment) {

        // FIXME: comment and how do I handle binary data??

        this.zip.file(path, content);

        return this;
    }

    /**
     * Save the new zip file to disk.
     * @return {Promise<void>}
     */
    save() {

        this.__writeResources();

        return new Promise((resolve,reject) => {

            this.zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
                .pipe(fs.createWriteStream(this.path))
                .on('error', function (err) {
                    reject(err);
                })
                .on('finish', function () {
                    resolve();
                });

        })

    }

}

module.exports.PHZWriter = PHZWriter;

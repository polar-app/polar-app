const JSZip = require("jszip");
const fs = require("fs");
const {ResourceEntry} = require("./ResourceEntry");
const {Resources} = require("./Resources");
const {ContentTypes} = require("./ContentTypes");

/**
 * Write to a new zip output stream.
 */
class PHZWriter {

    constructor(path) {
        this.path = path;
        this.zip = new JSZip();
        this.resources = new Resources();

    }

    /**
     * Write user provided metadata which applies to all files in the archive.
     *
     * @param metadata
     * @return {PHZWriter}
     */
    async writeMetadata(metadata) {
        this.__write("metadata.json", JSON.stringify(metadata, null, "  "), "metadata");
        return this;
    }

    /**
     *
     * @param resource {Resource}
     * @param content
     * @param comment
     * @return {PHZWriter}
     */
    async writeResource(resource, content, comment) {

        // TODO: when writing the content  update the contentLength with the
        // binary storage used to represent the data as UTF-8...

        // TODO: verify that we store the data as UTF-8

        if (!comment) {
            comment = "";
        }

        let ext = ContentTypes.contentTypeToExtension(resource.contentType);
        let path = `${resource.id}.${ext}`;

        const resourceEntry = new ResourceEntry({id: resource.id, path, resource});

        // add this to the resources index.
        this.resources.entries[resource.id] = resourceEntry;

        // *** write the metadata

        this.__write(`${resource.id}-meta.json`, JSON.stringify(resource, null, "  "), "");

        // *** write the actual data

        this.__write(path, content, comment);

        return this;

    }

    __writeResources() {
        this.__write("resources.json", JSON.stringify(this.resources, null, "  "), "resources");
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
    async close() {

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

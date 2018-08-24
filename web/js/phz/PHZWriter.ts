import JSZip from 'jszip';
import {Resources} from './Resources';
import {ResourceEntry} from './ResourceEntry';
import {ContentTypes} from './ContentTypes';
import {Resource} from './Resource';

const fs = require('fs');

/**
 * Write to a new zip output stream.
 */
export class PHZWriter {

    public path: string;

    public zip: JSZip;

    public resources: Resources;

    constructor(path: string) {
        this.path = path;
        this.zip = new JSZip();
        this.resources = new Resources();

    }

    /**
     * Write user provided metadata which applies to all files in the archive.
     *
     */
    async writeMetadata(metadata: any): Promise<PHZWriter> {
        this.__write("metadata.json", JSON.stringify(metadata, null, "  "), "metadata");
        return this;
    }

    /**
     *
     */
    async writeResource(resource: Resource, content: string, comment?: string): Promise<PHZWriter> {

        // TODO: when writing the content  update the contentLength with the
        // binary storage used to represent the data as UTF-8...

        // TODO: verify that we store the data as UTF-8

        if (comment === undefined) {
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

    __write(path: string, content: string, comment: string) {

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
                .on('error', function (err: Error) {
                    reject(err);
                })
                .on('finish', function () {
                    resolve();
                });

        })

    }

}

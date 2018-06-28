/**
 * Writes out a PHZ archive from the given captured JSON data.
 */
const {Resource} = require("../phz/Resource");
const {ResourceFactory} = require("../phz/ResourceFactory");
const {PHZWriter} = require("../phz/PHZWriter");
const {Objects} = require("../util/Objects");


class CapturedPHZWriter {

    constructor(path) {
        this.path = path;
    }

    /**
     * Convert it to the PHZ file at the given path.
     *
     * @param captured
     * @return {Promise<void>}
     */
    async convert(captured) {

        let phzWriter = new PHZWriter(this.path);

        // convert the captured to metadata...
        let metadata = CapturedPHZWriter.toMetadata(captured);

        // now work with each resource

        for (let idx = 0; idx < captured.capturedDocuments.length; idx++) {

            let capturedDocument = captured.capturedDocuments[idx];

            let resource = ResourceFactory.create(capturedDocument.url, "text/html");
            resource.title = capturedDocument.title;

            await phzWriter.writeResource(resource, capturedDocument.content, capturedDocument.url);

        }

        await phzWriter.writeMetadata(metadata);

        await phzWriter.close();

    }

    static toMetadata(captured) {
        let metadata = Objects.duplicate(captured);
        delete metadata.content;
        delete metadata.capturedDocuments;
        return metadata;

    }

}

module.exports.CapturedPHZWriter = CapturedPHZWriter;

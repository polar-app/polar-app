/**
 * Writes out a PHZ archive from the given captured JSON data.
 */
import {PHZWriter} from '../phz/PHZWriter';
import {forOwnKeys} from '../util/Functions';
import {ResourceFactory} from '../phz/ResourceFactory';
import {Objects} from '../util/Objects';

export class CapturedPHZWriter {

    public path: string;

    constructor(path: string) {
        this.path = path;
    }

    /**
     * Convert it to the PHZ file at the given path.
     *
     * @param captured
     * @return {Promise<void>}
     */
    async convert(captured: ICaptured) {

        let phzWriter = new PHZWriter(this.path);

        // convert the captured to metadata...
        let metadata = CapturedPHZWriter.toMetadata(captured);

        // now work with each resource

        await forOwnKeys(captured.capturedDocuments, async (url: string, capturedDocument: any) => {

            let resource = ResourceFactory.create(capturedDocument.url, "text/html");
            resource.title = capturedDocument.title;

            await phzWriter.writeResource(resource, capturedDocument.content, capturedDocument.url);

        });

        await phzWriter.writeMetadata(metadata);

        await phzWriter.close();

    }

    static toMetadata(captured: any) {
        let metadata = Objects.duplicate(captured);
        delete metadata.content;
        delete metadata.capturedDocuments;
        return metadata;
    }

}

export interface ICaptured {

    capturedDocuments: {[url: string]: any};

}

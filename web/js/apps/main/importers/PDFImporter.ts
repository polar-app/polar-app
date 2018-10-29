
import url from 'url';

import * as PDFJSDIST from 'pdfjs-dist';
import {PDFJSStatic} from 'pdfjs-dist';
import {PersistenceLayerWorkers} from '../../../datastore/dispatcher/PersistenceLayerWorkers';
import {IPersistenceLayer} from '../../../datastore/IPersistenceLayer';
import {Files} from '../../../util/Files';
import {FilePaths} from '../../../util/FilePaths';
import {Optional} from '../../../util/ts/Optional';
import {DocMetas} from '../../../metadata/DocMetas';
import {FileLoader} from '../loaders/FileLoader';

const pdfjs: PDFJSStatic = <any> PDFJSDIST;

/**
 * Handles taking a given file, parsing the metadata, and then writing a new
 * DocMeta file and importing the PDF file to the stash.
 */
export class PDFImporter {

    readonly persistenceLayer: IPersistenceLayer;

    constructor(persistenceLayer: IPersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }

    public async import(filePath: string) {

        const pdfMeta = await this.getMetadata(filePath);

        const docMeta = DocMetas.create(pdfMeta.fingerprint,
                                        pdfMeta.nrPages,
                                        pdfMeta.filename);

        docMeta.docInfo.title = pdfMeta.title;
        docMeta.docInfo.description = pdfMeta.description;

        FileLoader.importToStash(filePath);

        await this.persistenceLayer.sync(pdfMeta.fingerprint, docMeta);

    }

    public async getMetadata(filePath: string): Promise<PDFMeta> {

        if (! await Files.existsAsync(filePath)) {
            throw new Error("File does not exist at path: " + filePath);
        }

        const fileURL = url.format({
            protocol: 'file',
            slashes: true,
            pathname: filePath,
        });

        const doc = await pdfjs.getDocument(fileURL);

        const metaHolder = await doc.getMetadata()

        const filename = FilePaths.basename(filePath);
        let title = filename;
        let description: string | undefined = undefined;

        if(metaHolder.metadata) {
            const metadata = metaHolder.metadata;
            title = Optional.of(metadata.get('dc:title')).getOrElse(title);
            description = Optional.of(metadata.get('dc:description')).getOrUndefined()
        }

        return {
            filename,
            fingerprint: doc.fingerprint,
            nrPages: doc.numPages,
            title,
            description
        }

    }

}

export interface PDFMeta {
    readonly filename: string;
    readonly fingerprint: string;
    readonly nrPages: number;
    readonly title?: string;
    readonly description?: string;
}

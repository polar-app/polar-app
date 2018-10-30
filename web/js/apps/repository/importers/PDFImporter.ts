import url from 'url';

import * as PDFJSDIST from 'pdfjs-dist';
import {PDFJSStatic} from 'pdfjs-dist';
import {IPersistenceLayer} from '../../../datastore/IPersistenceLayer';
import {Files} from '../../../util/Files';
import {FilePaths} from '../../../util/FilePaths';
import {Optional} from '../../../util/ts/Optional';
import {DocMetas} from '../../../metadata/DocMetas';
import {DefaultPersistenceLayer} from '../../../datastore/DefaultPersistenceLayer';
import {Datastore} from '../../../datastore/Datastore';
import {FileLoader} from '../../main/loaders/FileLoader';

const pdfjs: PDFJSStatic = <any> PDFJSDIST;

(<any>pdfjs).GlobalWorkerOptions.workerSrc =
    '../../node_modules/pdfjs-dist/build/pdf.worker.js';
//
// pdfjs.disableWorker = true;

/**
 * Handles taking a given file, parsing the metadata, and then writing a new
 * DocMeta file and importing the PDF file to the stash.
 */
export class PDFImporter {

    readonly persistenceLayer: IPersistenceLayer;

    constructor(persistenceLayer: IPersistenceLayer) {
        this.persistenceLayer = persistenceLayer;
    }

    public async importFile(filePath: string) {

        // FIXME: I need a way to import JUST directly into the stash...

        const pdfMeta = await this.getMetadata(filePath);

        FileLoader.importToStash(filePath);

        if(! this.persistenceLayer.contains(pdfMeta.fingerprint)) {

            const docMeta = DocMetas.create(pdfMeta.fingerprint,
                                            pdfMeta.nrPages,
                                            pdfMeta.filename);

            docMeta.docInfo.title = pdfMeta.title;
            docMeta.docInfo.description = pdfMeta.description;

            await this.persistenceLayer.sync(pdfMeta.fingerprint, docMeta);

        }

    }

    public async getMetadata(filePath: string): Promise<PDFMeta> {

        // TODO: move this to its own file so that the PDF logic is isolated...

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

import {Files} from '../../../util/Files';
import url from "url";
import {FilePaths} from '../../../util/FilePaths';
import {Optional} from '../../../util/ts/Optional';
import {PDFJSStatic} from 'pdfjs-dist';
import * as PDFJSDIST from 'pdfjs-dist';

const pdfjs: PDFJSStatic = <any> PDFJSDIST;

(<any> pdfjs).GlobalWorkerOptions.workerSrc =
    '../../node_modules/pdfjs-dist/build/pdf.worker.js';

export class PDFMetadata {

    public static async getMetadata(filePath: string): Promise<PDFMeta> {

        if (! await Files.existsAsync(filePath)) {
            throw new Error("File does not exist at path: " + filePath);
        }

        const fileURL = url.format({
            protocol: 'file',
            slashes: true,
            pathname: filePath,
        });

        const doc = await pdfjs.getDocument(fileURL);

        const metaHolder = await doc.getMetadata();

        const filename = FilePaths.basename(filePath);
        let title: string | undefined;
        let description: string | undefined;

        if (metaHolder.metadata) {
            const metadata = metaHolder.metadata;
            title = Optional.of(metadata.get('dc:title')).getOrUndefined();
            description = Optional.of(metadata.get('dc:description')).getOrUndefined();
        }

        return {
            fingerprint: doc.fingerprint,
            nrPages: doc.numPages,
            title,
            description
        };

    }

}


export interface PDFMeta {
    readonly fingerprint: string;
    readonly nrPages: number;
    readonly title?: string;
    readonly description?: string;
}

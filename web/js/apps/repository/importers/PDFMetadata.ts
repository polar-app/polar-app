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
        let creator: string | undefined;
        let props: Props = {};

        if (metaHolder.metadata) {

            const metadata = metaHolder.metadata;

            const toProps = () => {
                const result: Props = {};

                const keys = Object.keys((<any> metadata)._metadata);

                for (const key of keys) {
                    result[key] = metadata.get(key);
                }

                return result;

            };

            title = Optional.of(metadata.get('dc:title')).getOrUndefined();
            description = Optional.of(metadata.get('dc:description')).getOrUndefined();
            creator = Optional.of(metadata.get('dc:creator')).getOrUndefined();

            props = toProps();

        }

        return {
            fingerprint: doc.fingerprint,
            nrPages: doc.numPages,
            title,
            description,
            props
        };

    }

}


export interface PDFMeta {

    readonly fingerprint: string;

    readonly nrPages: number;

    readonly title?: string;

    readonly creator?: string;

    readonly description?: string;

    /**
     * A link back to the page hosting the content.  This may not be the
     * original resource though and might be a page overview of the resource.
     *
     * This is often used with PDFs to have a 'meta' page for it.
     */
    readonly link?: string;

    /**
     * Full / raw list of mettadata properties.
     */
    readonly props: Readonly<Props>;

}

export interface Props {
    [key: string]: string;
}


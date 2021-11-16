import {PDFWorkers} from "./PDFWorkers";
import {URLStr} from "polar-shared/src/util/Strings";

const PDFJS = require('pdfjs-dist');

PDFJS.GlobalWorkerOptions.workerSrc = PDFWorkers.computeWorkerSrcPath();

/**
 * This code is bound/coupled to our webpack configuration whereby we always
 * copy the same path on every system we work with.
 */
export namespace PDFDocs {

    export interface Opts {
        readonly url: URLStr;
        readonly docBaseURL?: string;
    }

    export interface IDocumentInitParameters {

    }

    export interface IPageViewport {
        readonly width: number;
        readonly height: number;
    }

    export interface IPDFPageProxy {

        getViewport(args: {
            scale: number;
            rotate?: number;
            dontFlip?: boolean;
        }): IPageViewport;

    }


    interface IMetadata {
        get(name: string): string | null;
        // getAll(): StringMap;
        // has(name: string): boolean;
    }

    export interface IMetadataProxy {

        metadata: IMetadata | null;

    }

    export interface IPDFDocumentProxy {

        /**
         * @return {number} Total number of pages the PDF contains.
         */
        numPages: number;

        /**
         * @return {string} A unique ID to identify a PDF. Not guaranteed to be
         * unique.
         */
        fingerprint: string;

        /**
         * @param {number} pageNumber The page number to get. The first page is 1.
         * @return {Promise} A promise that is resolved with a {@link IPDFPageProxy}
         * object.
         */
        getPage(pageNumber: number): Promise<IPDFPageProxy>;

        getMetadata(): Promise<IMetadataProxy>;

    }

    export interface IPDFDocumentLoadingTask {
        readonly promise: Promise<IPDFDocumentProxy>;
    }

    export function getDocument(opts: Opts): IPDFDocumentLoadingTask {

        const init: IDocumentInitParameters = {
            ...opts,
            cMapPacked: true,
            cMapUrl: '/pdfjs-dist/cmaps/',
            disableAutoFetch: true,
            docBaseUrl: opts.docBaseURL
        };

        return PDFJS.getDocument(init);

    }

}

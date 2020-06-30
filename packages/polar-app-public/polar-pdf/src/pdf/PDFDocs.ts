import PDFJS, {
    DocumentInitParameters,
    PDFDocumentLoadingTask
} from "pdfjs-dist";
import {PDFWorkers} from "./PDFWorkers";

PDFJS.GlobalWorkerOptions.workerSrc = PDFWorkers.computeWorkerSrcPath();

/**
 * This code is bound/coupled to our webpack configuration whereby we always
 * copy the same path on every system we work with.
 */
export namespace PDFDocs {

    import htmlString = JQuery.htmlString;

    export interface Opts {
        readonly url: htmlString;
    }

    export function getDocument(opts: Opts): PDFDocumentLoadingTask {

        const init: DocumentInitParameters = {
            ...opts,
            cMapPacked: true,
            cMapUrl: '/web/dist/pdfjs-dist/cmaps/',
            disableAutoFetch: true,
        };

        return PDFJS.getDocument(init);

    }

}

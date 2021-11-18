import {PDFWorkers} from "./PDFWorkers";
import {URLStr} from "polar-shared/src/util/Strings";
import {IDocumentInitParameters, IPDFDocumentLoadingTask, PDFJS} from "./PDFJS";

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

import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {URLs} from "polar-shared/src/util/URLs";
import {PageViewport, TextContent, Transform, Util} from "pdfjs-dist";
import {PDFDocs} from "./PDFDocs";

export namespace PDFText {

    import TextItem = _pdfjs.TextItem;

    export interface IPDFTextItem extends TextItem {
        readonly pageNum: number;
        readonly tx: Transform;
    }

    export interface IPDFTextContent {
        readonly pageNum: number;
        readonly textContent: TextContent;
        readonly viewport: PageViewport;
    }

    export interface IOpts {
        readonly maxPages?: number;
    }

    export async function getText(docPathOrURL: PathOrURLStr,
                                  callback: (content: IPDFTextContent) => void,
                                  opts: IOpts = {}) {

        const docURL = await URLs.toURL(docPathOrURL);

        const pdfLoadingTask = PDFDocs.getDocument({url: docURL});

        const doc = await pdfLoadingTask.promise;

        const numPages = Math.min(doc.numPages, opts.maxPages || Number.MAX_VALUE)

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {

            const page = await doc.getPage(pageNum);
            const viewport = page.getViewport({scale: 1.0});

            const textContent = await page.getTextContent({
                normalizeWhitespace: true,
                disableCombineTextItems: false
            });

            callback({pageNum, textContent, viewport});

        }

    }

}

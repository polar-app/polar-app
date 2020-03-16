import {PathOrURLStr} from "polar-shared/src/util/Strings";
import {PDFs} from "./PDFs";
import {URLs} from "polar-shared/src/util/URLs";
import {TextContent} from "pdfjs-dist";

export class PDFText {

    public static async getText(docPathOrURL: PathOrURLStr,
                                callback: (page: number, textContent: TextContent) => void) {

        const PDFJS = PDFs.getPDFJS();

        const docURL = await URLs.toURL(docPathOrURL);

        const pdfLoadingTask = PDFJS.getDocument(docURL);
        const doc = await pdfLoadingTask.promise;

        for (let idx = 1; idx <= doc.numPages; idx++) {
            const page = await doc.getPage(idx);
            const textContent = await page.getTextContent();
            callback(idx, textContent);
        }

    }

}


export interface PDFMeta {

}



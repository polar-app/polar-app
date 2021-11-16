import {Whitespace} from "polar-shared/src/util/Whitespace";

const {PDFDocumentProxy} = require("pdfjs-dist");

export namespace PDFTitleExtractor {

    export async function extract(doc: PDFDocumentProxy): Promise<string | undefined> {

        if (doc.numPages === 0) {
            // no pages so we obviously can't extract a title.
            return undefined;
        }

        const page = await doc.getPage(1);
        const textContent = await page.getTextContent();

        if (textContent.items.length === 0 ) {
            // there actually isn't any text for us to work with.
            return undefined;
        }

        function computeTitleHeight() {
            const firstText = textContent.items[0];
            return firstText.height;
        }

        function computeHeadTextWithIdenticalHeight(height: number): ReadonlyArray<any> {

            function createPredicate() {

                let accept: boolean = true;

                return (textItem: any) => {

                    if (textItem.height !== height) {
                        accept = false;
                    }

                    return accept;

                }

            }

            return textContent.items.filter(createPredicate())

        }

        const titleHeight = computeTitleHeight();

        const head = computeHeadTextWithIdenticalHeight(titleHeight)

        if (head.length === 0) {
            return undefined;
        }

        return Whitespace.canonicalize(head.map(current => current.str).join("")).trim();

    }

}

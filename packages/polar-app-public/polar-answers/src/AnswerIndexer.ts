import {URLStr} from "polar-shared/src/util/Strings";
import {PDFText} from "polar-pdf/src/pdf/PDFText";

export namespace AnswerIndexer {

    export interface IndexOpts {
        readonly url: URLStr;
    }

    export async function doIndex(opts: IndexOpts) {


        await PDFText.getText(opts.url, pdfTextContent => {
            const {extract, pageNum} = pdfTextContent;

            const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

            // now build the sentence shingles over this...



        });

    }

}

import {URLStr} from "polar-shared/src/util/Strings";
import {PDFText} from "polar-pdf/src/pdf/PDFText";
import {SentenceShingler} from "./SentenceShingler";

export namespace AnswerIndexer {

    export interface IndexOpts {
        readonly url: URLStr;
    }

    export async function doIndex(opts: IndexOpts) {


        await PDFText.getText(opts.url, async pdfTextContent => {

            const {extract, pageNum} = pdfTextContent;

            const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

            // now build the sentence shingles over this...

            const shingles = await SentenceShingler.computeShinglesFromContent(content);

            // FIXME: now for each shingle, persist it out to ES

            // FIXME: tests to make sure shingles are computed properly.

        });

    }

}

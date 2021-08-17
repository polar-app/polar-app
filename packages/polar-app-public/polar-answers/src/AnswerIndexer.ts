import {IDStr, URLStr} from "polar-shared/src/util/Strings";
import {PDFText} from "polar-pdf/src/pdf/PDFText";
import {SentenceShingler} from "./SentenceShingler";
import {ESShingleWriter} from "./ESShingleWriter";

export namespace AnswerIndexer {

    export interface IndexOpts {
        readonly docID: IDStr;
        readonly url: URLStr;
    }

    export async function doIndex(opts: IndexOpts) {

        await PDFText.getText(opts.url, async pdfTextContent => {

            const {extract, pageNum} = pdfTextContent;

            const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

            // now build the sentence shingles over this...

            const shingles = await SentenceShingler.computeShinglesFromContent(content);

            for(const shingle of shingles) {
                await ESShingleWriter.write(opts.docID, pageNum, shingle);
            }

        });

    }

}

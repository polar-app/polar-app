import {UserIDStr} from "polar-shared/src/util/Strings";
import {PDFText} from "polar-pdf/src/pdf/PDFText";
import {SentenceShingler} from "./SentenceShingler";
import {ESShingleWriter} from "./ESShingleWriter";
import {IAnswerIndexerRequest} from "polar-answers-api/src/IAnswerIndexerRequest";

export namespace AnswerIndexer {

    export interface IndexOpts extends IAnswerIndexerRequest {
        readonly uid: UserIDStr;
    }

    export async function doIndex(opts: IndexOpts) {

        const {uid, docID} = opts;

        const writer = ESShingleWriter.create({uid});

        await PDFText.getText(opts.url, async pdfTextContent => {

                const {extract, pageNum} = pdfTextContent;

                console.log("Indexing text on page: " + pageNum)

                const content = extract.map(current => current.map(word => word.str).join(" ")).join("\n");

                // now build the sentence shingles over this...

                const shingles = await SentenceShingler.computeShinglesFromContent(content);

                for(const shingle of shingles) {
                    await writer.write({docID, pageNum, shingle});
                }

            },
            {
                skipPages: opts.skipPages
            });

    }

}

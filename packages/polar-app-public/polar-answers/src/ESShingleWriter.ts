import {ESRequests} from "./ESRequests";
import {SentenceShingler} from "./SentenceShingler";
import {IDStr} from "polar-shared/src/util/Strings";

export namespace ESShingleWriter {

    import ISentenceShingle = SentenceShingler.ISentenceShingle;

    export async function write(docID: IDStr, sentenceShingle: ISentenceShingle) {

        const digestID = `${docID}:${sentenceShingle.idx}`;

        await ESRequests.doPut(`/answer_digest/_doc/${digestID}`, {
            idx: sentenceShingle.idx,
            text: sentenceShingle.text
        });

    }
}

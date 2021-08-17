import {ESRequests} from "./ESRequests";
import {SentenceShingler} from "./SentenceShingler";
import {IDStr} from "polar-shared/src/util/Strings";

export namespace ESShingleWriter {

    import ISentenceShingle = SentenceShingler.ISentenceShingle;

    export interface IAnswerDigestRecord {
        readonly docID: IDStr;
        readonly pageNum: number;
        readonly idx: number;
        readonly text: string;
    }

    export async function write(docID: IDStr, pageNum: number, sentenceShingle: ISentenceShingle) {

        const digestID = `${docID}:${sentenceShingle.idx}`;

        const record: IAnswerDigestRecord = {
            docID, pageNum,
            idx: sentenceShingle.idx,
            text: sentenceShingle.text
        }

        await ESRequests.doPut(`/answer_digest/_doc/${digestID}`, record);

    }
}

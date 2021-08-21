import {ESRequests} from "./ESRequests";
import {SentenceShingler} from "./SentenceShingler";
import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";

export namespace ESShingleWriter {

    import ISentenceShingle = SentenceShingler.ISentenceShingle;

    export interface IWriteOpts {
        readonly docID: IDStr,
        readonly pageNum: number;
        readonly uid: UserIDStr;
        readonly shingle: ISentenceShingle;
    }

    export interface IAnswerDigestRecord {
        readonly docID: IDStr;
        readonly pageNum: number;
        readonly idx: number;
        readonly text: string;
    }

    export async function write(opts: IWriteOpts) {

        const {docID, shingle, pageNum, uid} = opts;

        const shingleID = `${docID}:${pageNum}:${shingle.idx}`;

        console.log("Writing shingleID: " + shingleID);

        const record: IAnswerDigestRecord = {
            docID, pageNum,
            idx: shingle.idx,
            text: shingle.text
        };

        const indexName = ESAnswersIndexNames.createForUserDocs(uid)

        // const indexName = 'test';
        await ESRequests.doPut(`/${indexName}/_doc/${shingleID}`, record);

    }
}

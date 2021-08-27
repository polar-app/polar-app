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

    /**
     * The ID for a shingle which contains docID,and idx.
     */
    export type ShingleID = string;

    export interface IAnswerDigestRecord {
        readonly id: ShingleID;
        readonly docID: IDStr;
        readonly idx: number;
        readonly pageNum: number;
        readonly text: string;
    }

    export interface IESShingleWriter {

        readonly write: (opts: IWriteOpts) => Promise<void>

    }

    export function create(): IESShingleWriter {

        let idx: number = 0;

        // TODO write this to support bulk indexing with a sync() method

        async function write(opts: IWriteOpts) {

            const {docID, shingle, pageNum, uid} = opts;

            const id: ShingleID = `${docID}:${idx}`;

            console.log("Writing shingleID: " + id);

            const record: IAnswerDigestRecord = {
                id,
                docID, pageNum,
                idx,
                text: shingle.text
            };

            const indexName = ESAnswersIndexNames.createForUserDocs(uid)

            await ESRequests.doPut(`/${indexName}/_doc/${id}`, record);

            ++idx;

        }

        return {write};

    }


}

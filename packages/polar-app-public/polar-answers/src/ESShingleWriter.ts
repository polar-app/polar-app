import {ESRequests} from "./ESRequests";
import {SentenceShingler} from "./SentenceShingler";
import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {ShingleID} from "polar-answers-api/src/ShingleID";

export namespace ESShingleWriter {

    import ISentenceShingle = SentenceShingler.ISentenceShingle;

    export interface ICreateOpts {
        readonly uid: UserIDStr;
    }

    export interface IWriteOpts {
        readonly docID: IDStr,
        readonly pageNum: number;
        readonly shingle: ISentenceShingle;
    }


    export interface IESShingleWriter {

        readonly write: (opts: IWriteOpts) => Promise<void>

    }

    export function create(opts: ICreateOpts): IESShingleWriter {

        let idx = 0;

        // TODO write this to support bulk indexing with a sync() method

        // curl -X DELETE "localhost:9200/my-index-000001?pretty"

        const indexName = ESAnswersIndexNames.createForUserDocs(opts.uid)

        async function write(opts: IWriteOpts) {

            const {docID, shingle, pageNum} = opts;

            const id: ShingleID = `${docID}:${idx}`;

            console.log("Writing shingleID: " + id);

            // TODO: this will have to be updated for EPUB and not hard code to the PDF type.
            const record: IAnswerDigestRecord = {
                type: 'pdf',
                id,
                docID, pageNum,
                idx,
                text: shingle.text
            };

            await ESRequests.doPut(`/${indexName}/_doc/${id}`, record);

            ++idx;

        }

        console.log("Created ESShingleWriter for " + indexName);

        return {write};

    }


}

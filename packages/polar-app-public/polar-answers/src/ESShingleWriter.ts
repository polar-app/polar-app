import {ESRequests} from "./ESRequests";
import {SentenceShingler} from "./SentenceShingler";
import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {ShingleID} from "polar-answers-api/src/ShingleID";
import {Batcher} from "polar-shared/src/util/Batcher";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

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

    export interface ICreateBatcherOpts {
        readonly uid: UserIDStr;
        readonly type: 'pdf';
    }

    /**
     * Create a writer that does batch writes.
     */
    export function createBatcher(opts: ICreateBatcherOpts): IESShingleWriter {

        // https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html

        let idx = 0;

        const indexName = ESAnswersIndexNames.createForUserDocs(opts.uid)

        const {type} = opts;

        async function handleBatch(records: ReadonlyArray<IAnswerDigestRecord>) {

            interface IIndexOp {
                readonly _index: string;
                readonly _id: string;
            }

            function createIndexOp(record: IAnswerDigestRecord): IIndexOp {

                return {
                    _index: indexName,
                    _id: record.id
                }

            }

            function createIndexDigestRecord(record: IAnswerDigestRecord): IAnswerDigestRecord {
                return record;
            }

            type BulkWriteTuple = [IIndexOp, IAnswerDigestRecord];

            function toBulkWriteTuple(record: IAnswerDigestRecord): BulkWriteTuple {
                return [
                    createIndexOp(record),
                    createIndexDigestRecord(record)
                ];
            }

            const writes = arrayStream(records)
                .map(current => toBulkWriteTuple(current))
                .flatMap(current => current)
                .collect();

            await ESRequests.doPut(`/_bulk`, writes);

        }

        const batcher = Batcher.create<IAnswerDigestRecord>(handleBatch)

        function createID(opts: IWriteOpts) {
            const {docID} = opts;
            const id: ShingleID = `${docID}:${idx}`;
            return id;
        }

        async function write(opts: IWriteOpts) {

            const id = createID(opts);

            const {docID, shingle, pageNum} = opts;

            const record = {
                id,
                type,
                idx,
                docID, pageNum,
                text: shingle.text
            };

            await batcher.write(record)

            ++idx;

        }

        return {...batcher, write};

    }

}

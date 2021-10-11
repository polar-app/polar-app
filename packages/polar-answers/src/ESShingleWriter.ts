import {ESRequests} from "./ESRequests";
import {SentenceShingler} from "./SentenceShingler";
import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import {IAnswerDigestRecord} from "polar-answers-api/src/IAnswerDigestRecord";
import {ShingleID} from "polar-answers-api/src/ShingleID";
import {Batcher} from "polar-shared/src/util/Batcher";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {IElasticsearchDeleteByQuery} from "polar-answers-api/src/IElasticsearchQuery";

export namespace ESShingleWriter {

    import ISentenceShingle = SentenceShingler.ISentenceShingle;

    export interface ICreateOpts {
        readonly uid: UserIDStr;
        readonly docID: IDStr,
    }

    export interface IWriteOpts {
        readonly pageNum: number;
        readonly shingle: ISentenceShingle;
    }


    export interface IESShingleWriter {

        readonly init: () => Promise<void>;

        readonly write: (opts: IWriteOpts) => Promise<void>
        // noop
        readonly sync: () => Promise<void>;

    }

    async function purgeExisting(indexName: string, docID: IDStr) {

        const url = `/${indexName}/_delete_by_query`

        const deleteByQuery: IElasticsearchDeleteByQuery = {
            query: {
                query_string: {
                    query: `docID: ${docID}`,
                    default_field: 'docID'
                },

            }
        }

        console.log("Purging existing data by query for idx...")
        await ESRequests.doPost(url, deleteByQuery);
        console.log("Purging existing data by query for idx...done")

    }

    export function create(opts: ICreateOpts): IESShingleWriter {

        let idx = 0;

        const indexName = ESAnswersIndexNames.createForUserDocs(opts.uid)

        const {docID} = opts;

        async function init() {
            await purgeExisting(indexName, docID);
        }

        async function write(opts: IWriteOpts) {

            const {shingle, pageNum} = opts;

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

        async function sync() {
            // noop
        }

        console.log("Created ESShingleWriter for " + indexName);

        return {init, write, sync};

    }

    export interface ICreateBatcherOpts {
        readonly uid: UserIDStr;
        readonly type: 'pdf';
        readonly docID: IDStr,
    }

    /**
     * Create a writer that does batch writes.
     */
    export function createBatcher(opts: ICreateBatcherOpts) {

        // https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html

        let idx = 0;

        const indexName = ESAnswersIndexNames.createForUserDocs(opts.uid)

        const {type, docID} = opts;

        async function handleBatch(records: ReadonlyArray<IAnswerDigestRecord>) {

            console.log("Writing batch of N records: " + records.length);

            interface IIndexOp {
                readonly _index: string;
                readonly _id: string;
            }

            interface IIndexAction {
                readonly index: IIndexOp;
            }

            function createIndexOp(record: IAnswerDigestRecord): IIndexAction {

                return {
                    index: {
                        _index: indexName,
                        _id: record.id
                    }
                };

            }

            function createIndexDigestRecord(record: IAnswerDigestRecord): IAnswerDigestRecord {
                return record;
            }

            type BulkWriteTuple = [IIndexAction, IAnswerDigestRecord];

            function toBulkWriteTuple(record: IAnswerDigestRecord): BulkWriteTuple {
                return [
                    createIndexOp(record),
                    createIndexDigestRecord(record)
                ];
            }

            const writes = arrayStream(records)
                .map(current => toBulkWriteTuple(current))
                .flatMap(current => current)
                .map(current => JSON.stringify(current))
                .collect();

            const body = writes.join("\n");

            console.log("FIXME: \n" + body);

            await ESRequests.doPost(`/_bulk`, body);

        }

        const batcher = Batcher.create<IAnswerDigestRecord>(handleBatch)

        function createID(opts: IWriteOpts) {
            const id: ShingleID = `${docID}:${idx}`;
            return id;
        }

        async function write(opts: IWriteOpts) {

            const id = createID(opts);

            const {shingle, pageNum} = opts;

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


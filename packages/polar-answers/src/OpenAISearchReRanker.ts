import {AIModel} from "polar-answers-api/src/AIModel";
import {Arrays} from "polar-shared/src/util/Arrays";
import {OpenAISearchClient} from "./OpenAISearchClient";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {FunctionTimers} from "polar-shared/src/util/FunctionTimers";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";

// TODO: Sending 20 docs at a time is MUCH faster than 200 at a time.  This was
// tested on my local laptop so this might just be an issue with bandwidth but
// we should definitely test within the cluster.

/**
 * There is a limit to the number of docs we can request at once.
 */
const MAX_DOCS_PER_REQUEST = 200;

/**
 * Allows us to take raw data, batch the into requests, pass them ALL to OpenAI,
 * re-rank them, then sort the results by rank.
 */
export namespace OpenAISearchReRanker {

    import IOpenAISearchResponse = OpenAISearchClient.IOpenAISearchResponse;

    export interface IRerankedResults<R> {
        readonly records: ReadonlyArray<IRecordWithScore<R>>
    }
    export interface IRecordWithScore<R> {
        readonly record: R;
        readonly score: number;
    }

    export async function exec<V>(model: AIModel,
                                  query: string,
                                  records: ReadonlyArray<V>,
                                  toText: (value: V) => string): Promise<IRerankedResults<V>> {

        function createRequests() {

            function createBatches() {
                return Arrays.createBatches(records, MAX_DOCS_PER_REQUEST);
            }

            const batches = createBatches();

            return batches.map((batch) => {

                return () => {

                    const documents = batch.map(current => toText(current));

                    async function doAsync(): Promise<[IOpenAISearchResponse, ReadonlyArray<V>]> {

                        console.log("re-ranker batch  started: " + ISODateTimeStrings.create());

                        const before = Date.now();
                        const response = await OpenAISearchClient.exec(model, {
                            documents,
                            query
                        });
                        const after = Date.now();
                        const duration = after - before;

                        console.log("re-ranker batch completed: " + ISODateTimeStrings.create());
                        console.log("re-ranker batch duration: " + duration);

                        return [response, batch]

                    }

                    return doAsync();

                }

            })

        }

        function createResponseConverter(batch: ReadonlyArray<V>) {

            return (response: IOpenAISearchResponse): IRerankedResults<V> => {

                const reranked = response.data.map((current): IRecordWithScore<V> => {
                    const record = batch[current.document];
                    const score = current.score;
                    return {record, score};
                });

                return {
                    records: reranked,
                };

            }

        }

        async function executeRequests() {

            const requests = createRequests().map(current => current())

            const [responses, duration] = await FunctionTimers.execAsync(async () => {
                return await Promise.all(requests);
            });

            const result = responses.map((current) => {
                const [response, batch] = current;
                const converter = createResponseConverter(batch);
                return converter(response)
            })

            console.log("Duration for requests: " + duration);
            return result;
        }

        const responses = await executeRequests();

        function computeResult() {

            const [result, duration] = FunctionTimers.exec(() => {

                // const cost = responses.map(current => current.cost_estimation.cost).reduce(Reducers.SUM, 0);
                // const tokens = responses.map(current => current.cost_estimation.tokens).reduce(Reducers.SUM, 0);

                const reranked =
                    arrayStream(responses)
                        .map(current => current.records)
                        .flatMap(current => current)
                        // now sort descending by score
                        .sort((a, b) => b.score - a.score)
                        .collect();

                return {
                    records: reranked
                };

            })

            console.log("Duration for result (metadata and sorted records): " + duration);

            return result;

        }

        return computeResult();

    }

}

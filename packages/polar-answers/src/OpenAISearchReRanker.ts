import {AIModel} from "polar-answers-api/src/AIModel";
import {Arrays} from "polar-shared/src/util/Arrays";
import {OpenAISearchClient} from "./OpenAISearchClient";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import { Reducers } from "polar-shared/src/util/Reducers";
import {ICostEstimation, ICostEstimationHolder} from "polar-answers-api/src/ICostEstimation";
import {FunctionTimers} from "polar-shared/src/util/FunctionTimers";

/**
 * There is a limit to the number of docs we can request at once.
 */
const MAX_DOCS_PER_REQUEST = 200;

/**
 * Allows us to take raw data, batch the into requests, pass them ALL to OpenAI,
 * re-rank them, then sort the results by rank.
 */
export namespace OpenAISearchReRanker {

    export interface IRerankedResults<R> extends ICostEstimationHolder<ICostEstimation> {
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

        const batches = Arrays.createBatches(records, MAX_DOCS_PER_REQUEST);

        const requests = batches.map((batch) => {

            return async (): Promise<IRerankedResults<V>> => {

                const documents = batch.map(current => toText(current));

                const response = await OpenAISearchClient.exec(model, {
                    documents,
                    query
                });

                const reranked = response.data.map((current): IRecordWithScore<V> => {
                    const record = batch[current.document];
                    const score = current.score;
                    return {record, score};
                });

                return {
                    records: reranked,
                    cost_estimation: {
                        cost: response.cost_estimation.cost,
                        tokens: response.cost_estimation.tokens
                    }
                };

            }

        })

        async function executeRequests() {
            const [result, duration] = await FunctionTimers.execAsync(() => Promise.all(requests.map(current => current())));
            console.log("Duration for requests: " + duration);
            return result;
        }

        const responses = await executeRequests();

        function computeResult() {

            const [result, duration] = FunctionTimers.exec(() => {

                const cost = responses.map(current => current.cost_estimation.cost).reduce(Reducers.SUM, 0);
                const tokens = responses.map(current => current.cost_estimation.tokens).reduce(Reducers.SUM, 0);

                const reranked =
                    arrayStream(responses)
                        .map(current => current.records)
                        .flatMap(current => current)
                        // now sort descending by score
                        .sort((a, b) => b.score - a.score)
                        .collect();

                console.log("Rerank cost: ", {cost, tokens, model});

                return {
                    cost_estimation: {
                        cost, tokens
                    },
                    records: reranked
                };

            })

            console.log("Duration for result (metadata and sorted records): " + duration);

            return result;

        }

        return computeResult();

    }

}

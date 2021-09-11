import {AIModel} from "polar-answers-api/src/AIModel";
import {Arrays} from "polar-shared/src/util/Arrays";
import {OpenAISearchClient} from "./OpenAISearchClient";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";

/**
 * There is a limit to the number of docs we can request at once.
 */
const MAX_DOCS_PER_REQUEST = 200;

/**
 * Allows us to take raw data, batch the into requests, pass them ALL to OpenAI,
 * re-rank them, then sort the results by rank.
 */
export namespace OpenAISearchReRanker {

    export interface IRecordWithScore<R> {
        readonly record: R;
        readonly score: number;
    }

    export async function exec<V>(model: AIModel,
                                  query: string,
                                  records: ReadonlyArray<V>,
                                  toText: (value: V) => string): Promise<ReadonlyArray<IRecordWithScore<V>>> {

        const batches = Arrays.createBatches(records, MAX_DOCS_PER_REQUEST);


        const requests = batches.map((records) => {

            return async (): Promise<ReadonlyArray<IRecordWithScore<V>>> => {

                const documents = records.map(current => toText(current));

                const response = await OpenAISearchClient.exec(model, {
                    documents,
                    query
                });

                return response.data.map((current): IRecordWithScore<V> => {
                    const record = records[current.document];
                    const score = current.score;
                    return {record, score};
                });

            }

        })

        const responses = await Promise.all(requests.map(current => current()));

        return arrayStream(responses)
            .flatMap(current => current)
            // now sort descending by score
            .sort((a, b) => b.score - a.score)
            .collect();

    }

}

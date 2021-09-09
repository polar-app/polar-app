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

    import IOpenAISearchDoc = OpenAISearchClient.IOpenAISearchDoc;

    export async function exec(model: AIModel,
                               query: string,
                               documents: ReadonlyArray<string>): Promise<ReadonlyArray<IOpenAISearchDoc>> {

        const batches = Arrays.createBatches(documents, MAX_DOCS_PER_REQUEST);

        const requests = batches.map(current => {
            return OpenAISearchClient.exec(model, {
                documents: current,
                query
            })
        })

        const responses = await Promise.all(requests);

        return arrayStream(responses)
            .map(current => current.data)
            .flatMap(current => current)
            // now sort descending by score
            .sort((a, b) => b.score - a.score)
            .collect();

    }

}

import {AIModel} from "polar-answers-api/src/AIModel";
import {OpenAIRequests} from "./OpenAIRequests";
import {OpenAICostEstimator} from "./OpenAICostEstimator";

/**
 * Create search
 * POST
 *
 * https://api.openai.com/v1/engines/{engine_id}/search
 *
 *  The search endpoint computes similarity scores between provided query and
 *  documents. Documents can be passed directly to the API if there are no more
 *  than 200 of them.
 *
 * To go beyond the 200 document limit, documents can be processed offline and
 * then used for efficient retrieval at query time. When file is set, the search
 * endpoint searches over all the documents in the given file and returns up to
 * the max_rerank number of documents. These documents will be returned along
 * with their search scores.
 *
 * The similarity score is a positive score that usually ranges from 0 to 300
 * (but can sometimes go higher), where a score above 200 usually means the
 * document is semantically similar to the query.
 *
 */
export namespace OpenAISearchClient {

    import ICostEstimation = OpenAICostEstimator.ICostEstimation;

    export interface IOpenAISearchRequest {

        /**
         * Up to 200 documents to search over, provided as a list of strings.
         *
         * The maximum document length (in tokens) is 2034 minus the number of tokens in the query.
         *
         * You should specify either documents or a file, but not both.
         */
        readonly documents: ReadonlyArray<string>;

        /**
         * Query to search against the documents.
         */
        readonly query: string;

        /**
         * The maximum number of documents to be re-ranked and returned by search.
         * Optional Defaults to 200
         */
        // eslint-disable-next-line camelcase
        readonly max_rerank?: number;

        /**
         * A special boolean flag for showing metadata. If set to true, each document entry in the returned JSON will contain a "metadata" field.
         *
         * This flag only takes effect when file is set.
         *
         * Optional Defaults to false
         */
        // eslint-disable-next-line camelcase
        readonly return_metadata?: boolean;
    }

    export interface IOpenAISearchDoc {
        readonly document: number;
        readonly object: "search_result";
        readonly score: number;
    }

    export interface IOpenAISearchResponse {

        readonly data: ReadonlyArray<IOpenAISearchDoc>;
        readonly "object": "list";

    }

    export async function exec(model: AIModel, request: IOpenAISearchRequest): Promise<IOpenAISearchResponse & ICostEstimation> {

        const url = `https://api.openai.com/v1/engines/${model}/search`;
        const response = await OpenAIRequests.exec<IOpenAISearchRequest, IOpenAISearchResponse>(url, request);

        const cost = OpenAICostEstimator.costOfSearch({model, query: request.query, documents: request.documents});

        return {...response, ...cost};

    }

}

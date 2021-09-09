import {AIModel} from "./AIModel";


export interface IAnswerExecutorRequest {

    readonly question: string;

    /**
     * When specified, use these documents rather than fetching from
     * Elasticsearch. This will simulate what OpenAI knows about the question
     * without any external document statements.
     */
    readonly documents?: ReadonlyArray<string>;

    readonly search_model?: AIModel;

    readonly model?: AIModel;

    /**
     * Re-rank the results against the OpenAI search endpoint.
     */
    readonly rerank_elasticseach?: boolean;

    /**
     * When we re-rank the ES results, how many should we fetch.  Defaults to 10,000.
     */
    readonly rerank_elasticseach_size?: number;

    /**
     * The model to re-rank with.  Defaults to 'ada'
     */
    readonly rerank_elasticseach_model?: AIModel;

}

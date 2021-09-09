import {AIModel} from "./AIModel";


export interface IAnswerExecutorRequest {

    readonly question: string;

    /**
     * When specified, use these documents rather than fetching from
     * Elasticsearch. This will simulate what OpenAI knows about the question
     * without any external document statements.
     */
    readonly documents?: ReadonlyArray<string>;

    // eslint-disable-next-line camelcase
    readonly search_model?: AIModel;

    readonly model?: AIModel;

    // eslint-disable-next-line camelcase
    readonly filter_stopwords?: boolean;

    /**
     * Re-rank the results against the OpenAI search endpoint.
     */
    // eslint-disable-next-line camelcase
    readonly rerank_elasticsearch?: boolean;

    /**
     * When we re-rank the ES results, how many should we fetch.  Defaults to 10,000.
     */
    // eslint-disable-next-line camelcase
    readonly rerank_elasticsearch_size?: number;

    /**
     * The model to re-rank with.  Defaults to 'ada'
     */
    // eslint-disable-next-line camelcase
    readonly rerank_elasticsearch_model?: AIModel;

}

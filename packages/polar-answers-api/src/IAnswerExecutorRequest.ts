import {AIModel} from "./AIModel";

export type FilterQuestionType = 'none' | 'stopwords' | 'part-of-speech' | 'part-of-speech-noun' | 'part-of-speech-noun-adj';

export interface IAnswerExecutorRequest {

    readonly question: string;

    // eslint-disable-next-line camelcase
    readonly search_model?: AIModel;

    readonly model?: AIModel;

    /**
     * Apply a document limit so that we can keep costs minimal for tests.
     */
    // eslint-disable-next-line camelcase
    readonly documents_limit?: number;

    /**
     * Filter the question and derive a query to ES via the specified algorithm.
     *
     */
    // eslint-disable-next-line camelcase
    readonly filter_question?: FilterQuestionType;

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

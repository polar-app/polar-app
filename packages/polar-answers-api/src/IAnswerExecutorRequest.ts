import {AIModel} from "./AIModel";

export type FilterQuestionType = 'none' | 'stopwords' | 'part-of-speech' | 'part-of-speech-noun' | 'part-of-speech-noun-adj';

/**
 * _score is desc, anything else defaults to asc.
 */
export type ElasticsearchSortOrder = "_score" | "idx";

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

    /**
     * When true we truncate the re-ranked results to JUST the short head.
     */
    // eslint-disable-next-line camelcase
    readonly rerank_truncate_short_head?: boolean;

    /**
     * When true, we prune the elasticsearch results of contiguous records.
     */
    // eslint-disable-next-line camelcase
    readonly prune_contiguous_records?: boolean;

    // eslint-disable-next-line camelcase
    readonly elasticsearch_sort_order?: ElasticsearchSortOrder;

    // eslint-disable-next-line camelcase
    readonly max_tokens?: number;

    /**
     * When true, enable the OpenAICompletionCleanup code so that we can make
     * sure the completions don't have errors due to currie.
     */
    // eslint-disable-next-line camelcase
    readonly openai_completion_cleanup_enabled: boolean;

}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICoreAnswerExecutorRequest extends Required<Pick<IAnswerExecutorRequest, 'search_model' | 'model' | 'rerank_elasticsearch' | 'rerank_elasticsearch_size' | 'rerank_elasticsearch_model' | 'filter_question'>> {

}

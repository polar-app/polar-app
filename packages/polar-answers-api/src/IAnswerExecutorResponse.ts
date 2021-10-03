import {ISelectedDocument} from "./ISelectedDocument";
import {IAnswerDigestRecord} from "./IAnswerDigestRecord";
import {IOpenAIAnswersResponse} from "./IOpenAIAnswersResponse";
import {IRPCError} from "polar-shared/src/util/IRPCError";
import {IAnswersCostEstimation, ICostEstimation, ICostEstimationHolder} from "./ICostEstimation";

export interface IAnswerExecutorTimings {

    /**
     * The amount of time it took to fetch the base documents from Elasticsearch.
     */
    readonly elasticsearch: number;

    /**
     * The amount of time it takes to compute the OpenAI re-rank or undefined if we're not re-ranking
     * everything.
     */
    // eslint-disable-next-line camelcase
    readonly openai_rerank: number | undefined;

    /**
     * The amount of time it took to query against OpenAI.
     */
    // eslint-disable-next-line camelcase
    readonly openai_answer: number;

}

/**
 * Total costs for the answer executor.
 */
export interface IAnswerExecutorCostEstimation extends ICostEstimation {

    /**
     * Cost estimation when re-rank is enabled.
     */
    // eslint-disable-next-line camelcase
    readonly openai_rerank_cost_estimation?: ICostEstimation;

    /**
     * Cost estimation for using the answer API to compute the response.
     */
    // eslint-disable-next-line camelcase
    readonly openai_answer_api_cost_estimation: IAnswersCostEstimation;

}

export interface ISelectedDocumentWithRecord<R>  extends ISelectedDocument {

    /**
     * The original record for this document
     */
    readonly record: R;

}

export interface IAnswerExecutorResponse extends IOpenAIAnswersResponse, ICostEstimationHolder<IAnswerExecutorCostEstimation> {
    /**
     * Unique ID for this response which can be used when flagging results for good/bad
     */
    readonly id: string;
    readonly question: string;

    // eslint-disable-next-line camelcase
    readonly selected_documents: ReadonlyArray<ISelectedDocumentWithRecord<IAnswerDigestRecord>>;

    readonly timings: IAnswerExecutorTimings;

}

export type IAnswerExecutorError = IAnswerExecutorErrorFailed | IAnswerExecutorErrorNoAnswer;

export interface IAnswerExecutorErrorFailed extends IRPCError<'failed'>, ICostEstimationHolder<IAnswerExecutorCostEstimation> {
    readonly message: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAnswerExecutorErrorNoAnswer extends IRPCError<'no-answer'>, ICostEstimationHolder<IAnswerExecutorCostEstimation> {
}

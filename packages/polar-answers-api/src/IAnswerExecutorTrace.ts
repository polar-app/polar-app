import {IAnswerExecutorRequest} from "./IAnswerExecutorRequest";
import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {IOpenAIAnswersResponse} from "./IOpenAIAnswersResponse";
import {IAnswerDigestRecord} from "./IAnswerDigestRecord";
import {IOpenAIAnswersRequest} from "./IOpenAIAnswersRequest";
import {IElasticsearchQuery} from "./IElasticsearchQuery";
import {IAnswerExecutorTimings} from "./IAnswerExecutorResponse";

export interface IAnswerExecutorTraceMinimal extends IAnswerExecutorRequest {

    readonly id: IDStr;

    readonly type: 'trace-minimal';

    readonly uid: UserIDStr;

    // eslint-disable-next-line camelcase
    readonly elasticsearch_query: IElasticsearchQuery;

    // eslint-disable-next-line camelcase
    readonly elasticsearch_url: string;

    readonly docIDs: ReadonlyArray<IDStr>;

    readonly elasticsearch_indexes: ReadonlyArray<string>;

    readonly elasticsearch_hits: number;

    // eslint-disable-next-line camelcase
    readonly openai_answers_request: IOpenAIAnswersRequest;

    // eslint-disable-next-line camelcase
    readonly openai_answers_response: IOpenAIAnswersResponse;

    readonly timings: IAnswerExecutorTimings;

    /**
     * The users vote on the answer...
     */
    readonly vote?: 'up' | 'down';

    /**
     * When a user votes, this is just a free-form string explanation of what
     * they think the issue was.
     */
    readonly expectation?: string;

}
export interface IAnswerExecutorTraceExtended extends IAnswerExecutorRequest {

    readonly id: IDStr;

    readonly type: 'trace-extended';

    readonly uid: UserIDStr;

    // eslint-disable-next-line camelcase
    readonly elasticsearch_query: IElasticsearchQuery;

    // eslint-disable-next-line camelcase
    readonly elasticsearch_url: string;

    /**
     * The records given back from ES.
     */
    // eslint-disable-next-line camelcase
    readonly elasticsearch_records: ReadonlyArray<IAnswerDigestRecord>;

    // eslint-disable-next-line camelcase
    readonly openai_answers_request: IOpenAIAnswersRequest;

    // eslint-disable-next-line camelcase
    readonly openai_answers_response: IOpenAIAnswersResponse;

    readonly timings: IAnswerExecutorTimings;

    /**
     * The users vote on the answer...
     */
    readonly vote?: 'up' | 'down';

    /**
     * When a user votes, this is just a free-form string explanation of what
     * they think the issue was.
     */
    readonly expectation?: string;

}

export type IAnswerExecutorTrace = IAnswerExecutorTraceMinimal | IAnswerExecutorTraceExtended;

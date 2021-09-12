import {IAnswerExecutorRequest} from "./IAnswerExecutorRequest";
import {IDStr, UserIDStr} from "polar-shared/src/util/Strings";
import {IOpenAIAnswersResponse} from "./IOpenAIAnswersResponse";
import {IAnswerDigestRecord} from "./IAnswerDigestRecord";
import {IOpenAIAnswersRequest} from "./IOpenAIAnswersRequest";

export interface IAnswerExecutorTrace extends IAnswerExecutorRequest {

    readonly id: IDStr;

    readonly type: 'trace';

    readonly uid: UserIDStr;

    // eslint-disable-next-line camelcase
    readonly elasticseach_query: any;

    // eslint-disable-next-line camelcase
    readonly elasticsearch_url: string;

    /**
     * The records given back from ES.
     */
    // eslint-disable-next-line camelcase
    readonly elasticseach_records: ReadonlyArray<IAnswerDigestRecord>;

    // eslint-disable-next-line camelcase
    readonly openai_request: IOpenAIAnswersRequest;

    // eslint-disable-next-line camelcase
    readonly openai_response: IOpenAIAnswersResponse;

}

/**
 * Allows us to update and specify the vote data.
 */
export interface IAnswerExecutorTraceWithFeedback extends IAnswerExecutorTrace {
    readonly vote: 'up' | 'down';
    readonly expectation: string;
}

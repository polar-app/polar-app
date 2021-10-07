import {IAnswerExecutorError, IAnswerExecutorResponse} from "polar-answers-api/src/IAnswerExecutorResponse";
import {IAnswerExecutorRequest} from "polar-answers-api/src/IAnswerExecutorRequest";
import {UserIDStr} from "polar-shared/src/util/Strings";

export namespace AnswerExecutors {

    export interface IAnswerExecutorRequestWithUID extends IAnswerExecutorRequest {
        readonly uid: UserIDStr;
    }

    export interface IAnswerExecutor {
        readonly exec: (request: IAnswerExecutorRequestWithUID) => Promise<IAnswerExecutorResponse | IAnswerExecutorError>;
    }

}

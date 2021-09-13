import {ExpressFunctions} from "../util/ExpressFunctions";
import {IDUser} from "../util/IDUsers";
import {SentryReporters} from "../reporters/SentryReporter";
import {AnswerExecutor} from "polar-answers/src/AnswerExecutor";
import {IAnswerExecutorError, IAnswerExecutorResponse} from "polar-answers-api/src/IAnswerExecutorResponse";
import {IAnswerExecutorRequest} from "polar-answers-api/src/IAnswerExecutorRequest";

export namespace AnswerExecutorImpl {

    export async function exec(idUser: IDUser,
                               request: IAnswerExecutorRequest): Promise<IAnswerExecutorResponse | IAnswerExecutorError> {

        try {

            return await AnswerExecutor.exec({...request, uid: idUser.uid})

        } catch (e) {
            SentryReporters.reportError("Failed to execute: ", e);
            return {
                error: true,
                code: 'failed',
                message: e.message
            };
        }

    }

}

export const AnswerExecutorFunction = ExpressFunctions.createRPCHook('AnswerExecutorFunction', AnswerExecutorImpl.exec);

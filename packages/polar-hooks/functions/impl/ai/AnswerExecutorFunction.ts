import {ExpressFunctions} from "../util/ExpressFunctions";
import {IDUser} from "../util/IDUsers";
import {SentryReporters} from "../reporters/SentryReporter";
import {AnswerExecutor} from "polar-answers/src/AnswerExecutor";
import IExecOpts = AnswerExecutor.IExecOpts;
import {IAnswerExecutorResponse} from "polar-answers-api/src/IAnswerExecutorResponse";
import {IAnswerExecutorError} from "polar-answers-api/src/IAnswerExecutorResponse";

interface AnswerExecutorRequest extends Exclude<IExecOpts, 'uid'> {

}

export namespace AnswerExecutorImpl {

    export async function exec(idUser: IDUser,
                               request: AnswerExecutorRequest): Promise<IAnswerExecutorResponse | IAnswerExecutorError> {

        try {

            return await AnswerExecutor.exec({...request, uid: idUser.uid})

        } catch (e) {
            SentryReporters.reportError("Failed to execute: ", e);
            return {
                error: 'failed',
                message: e.message
            };
        }

    }

}

export const AnswerExecutorFunction = ExpressFunctions.createRPCHook('AnswerExecutorFunction', AnswerExecutorImpl.exec);

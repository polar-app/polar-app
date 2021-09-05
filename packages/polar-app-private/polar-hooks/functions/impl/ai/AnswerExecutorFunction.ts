import {ExpressFunctions} from "../util/ExpressFunctions";
import {IDUser} from "../util/IDUsers";
import {SentryReporters} from "../reporters/SentryReporter";
import {AnswerExecutor} from "polar-answers/src/AnswerExecutor";
import IExecOpts = AnswerExecutor.IExecOpts;
import IAnswer = AnswerExecutor.IAnswer;

interface AnswerExecutorRequest extends Exclude<IExecOpts, 'uid'> {

}

interface AnswerExecutorResponse extends IAnswer {
}

export interface AnswerExecutorError {
    readonly error: 'failed';
    readonly message: string;
}

export namespace AnswerExecutorImpl {

    export async function exec(idUser: IDUser,
                               request: AnswerExecutorRequest): Promise<AnswerExecutorResponse | AnswerExecutorError> {

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

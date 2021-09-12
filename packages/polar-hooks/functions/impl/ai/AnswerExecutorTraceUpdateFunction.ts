import {ExpressFunctions} from "../util/ExpressFunctions";
import {IDUser} from "../util/IDUsers";
import {SentryReporters} from "../reporters/SentryReporter";
import {AnswerExecutorTraceCollection,} from "polar-firebase/src/firebase/om/AnswerExecutorTraceCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {IAnswerExecutorTraceUpdate} from "polar-answers-api/src/IAnswerExecutorTraceUpdate";
import {
    IAnswerExecutorTraceUpdateError,
    IAnswerExecutorTraceUpdateResponse
} from "polar-answers-api/src/IAnswerExecutorTraceUpdateResponse";

export namespace AnswerExecutorTraceUpdateImpl {

    export async function exec(idUser: IDUser,
                               request: IAnswerExecutorTraceUpdate): Promise<IAnswerExecutorTraceUpdateResponse | IAnswerExecutorTraceUpdateError> {

        try {

            const firestore = FirestoreAdmin.getInstance();

            await AnswerExecutorTraceCollection.update(firestore, request.id, request)

            return {};

        } catch (e) {
            SentryReporters.reportError("Failed to execute: ", e);
            return {
                error: 'failed',
                message: e.message
            };
        }

    }

}

export const AnswerExecutorTraceUpdateFunction = ExpressFunctions.createRPCHook('AnswerExecutorTraceUpdateFunction', AnswerExecutorTraceUpdateImpl.exec);

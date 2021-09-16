import {ExpressFunctions} from "../util/ExpressFunctions";
import {IDUser} from "../util/IDUsers";
import {SentryReporters} from "../reporters/SentryReporter";
import {AnswerIndexer} from "polar-answers/src/AnswerIndexer";

interface AnswerIndexerRequest {
    docID: string,
    url: string,
}

interface AnswerIndexerResponse {
}

export interface AnswerIndexerError {
    readonly error: 'failed';
    readonly message: string;
}

export namespace AnswerIndexerImpl {

    export async function exec(idUser: IDUser,
                               request: AnswerIndexerRequest): Promise<AnswerIndexerResponse | AnswerIndexerError> {

        try {

            await AnswerIndexer.doIndex({
                uid: idUser.uid,
                docID: request.docID,
                url: request.url,
            });

            return {};

        } catch (e) {
            SentryReporters.reportError("Failed to index document to ElasticSearch: ", e);

            // TODO: convert this to an IRPC message like AnswerExecutor
            return {
                error: 'failed',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message: (e as any).message || undefined
            };
        }

    }

}

export const AnswerIndexerFunction = ExpressFunctions.createRPCHook('AnswerIndexer', AnswerIndexerImpl.exec);

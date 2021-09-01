import {ExpressFunctions} from "../util/ExpressFunctions";
import {IDUser} from "../util/IDUsers";
import {SentryReporters} from "../reporters/SentryReporter";
import {AnswerIndexer} from "polar-answers/src/AnswerIndexer";

interface DocumentIndexerRequest {
    docID: string,
    url: string,
}

interface DocumentIndexerResponse {
}

export namespace DocumentIndexerImpl {

    export async function exec(idUser: IDUser,
                               request: DocumentIndexerRequest): Promise<DocumentIndexerResponse> {

        try {

            await AnswerIndexer.doIndex({
                uid: idUser.uid,
                docID: request.docID,
                url: request.url,
            });

            return {};

        } catch (e) {
            SentryReporters.reportError("Failed to index document to ElasticSearch: ", e);
            return {error: 'no-result'};
        }

    }

}

export const DocumentIndexer = ExpressFunctions.createRPCHook('DocumentIndexer', DocumentIndexerImpl.exec);

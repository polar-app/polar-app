import {JSONRPC} from "../datastore/sharing/rpc/JSONRPC";
import {AutoClozeDeletions} from "polar-backend-api/src/api/AutoClozeDeletion";

export namespace AutoClozeDeletionRequests {
    import AutoFlashcardResponse = AutoClozeDeletions.AutoClozeDeletionResponse;
    import AutoFlashcardRequest = AutoClozeDeletions.AutoClozeDeletionRequest;
    import AutoFlashcardError = AutoClozeDeletions.AutoClozeDeletionError;

    export async function exec(request: AutoFlashcardRequest): Promise<AutoFlashcardResponse | AutoFlashcardError> {
        return await JSONRPC.exec('AutoClozeDeletionFunction', request)
    }

}

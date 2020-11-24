import {JSONRPC} from "../datastore/sharing/rpc/JSONRPC";
import {AutoFlashcards} from "polar-backend-api/AutoFlashcards";

export namespace AutoFlashcardRequests {
    import AutoFlashcardResponse = AutoFlashcards.AutoFlashcardResponse;
    import AutoFlashcardRequest = AutoFlashcards.AutoFlashcardRequest;

    export async function exec(request: AutoFlashcardRequest): Promise<AutoFlashcardResponse> {
        return await JSONRPC.exec<AutoFlashcardRequest, AutoFlashcardResponse>('autoFlashcard', request)
    }
}
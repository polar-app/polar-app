import { IDUser } from "polar-rpc/src/IDUser";
import { ExpressFunctions } from "../util/ExpressFunctions";
import { AnkiExport } from "./FlashcardsExport";
import express from "express";

export interface FlashcardExportRequest {
    /**
     * an array of flashcard block IDs
     */
    readonly targets: ReadonlyArray<string>;

    /**
     * Generated file name will include this string + apkg extension
     * example: anki_export.apkg
     */
    readonly ankiDeckName: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FlashCardExportResponse {
}


export namespace FlashCardsExportFunction {
    export async function exec(idUser: IDUser, 
                                request: FlashcardExportRequest,
                                response: express.Response
                               ): Promise<FlashCardExportResponse> { 
        const path = await AnkiExport.create(request, idUser.uid);

        response.download(path);

        return {};
    }
}

export const FlashcardsExportFunction = ExpressFunctions.createRPCHookResponse("FlashcardsExportFunction", FlashCardsExportFunction.exec);
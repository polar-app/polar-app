import {BlockIDStr} from "polar-blocks/src/blocks/IBlock"

export namespace FlashCardsExport {

    export interface FlashcardExportRequest {
        /**
         * an array of flashcard block IDs
         */
        readonly blockIDs: ReadonlyArray<BlockIDStr>;

        /**
         * Generated file name will include this string + apkg extension
         *
         * example: anki_export.apkg
         */
        readonly ankiDeckName: string;

    }

    export interface FlashcardExportResponse {
        readonly temporary_url: string,
    }

}

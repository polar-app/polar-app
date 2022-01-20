import { FlashcardExportRequest } from "./FlashCardsExportFunction";
import { FlashCardExport } from "polar-anki-export/src/FlashCardExport";
import { FirebaseAdmin } from "polar-firebase-admin/src/FirebaseAdmin";
import { BlockCollection } from "polar-firebase/src/firebase/om/BlockCollection";
import { AnnotationContentType } from "polar-blocks/src/blocks/content/IAnnotationContent";
import { IBlockFlashcard } from "polar-blocks/src/annotations/IBlockFlashcard";
import { FlashcardType } from "polar-shared/src/metadata/FlashcardType";
import { tmpdir } from "os";

export namespace AnkiExport{

    export async function fetchUserBlocks(uid: string, docIDRange: ReadonlyArray<string>) {
        return FirebaseAdmin.app()
            .firestore()
            .collection(BlockCollection.COLLECTION)
            .where('id', 'in', docIDRange)
            .where('uid', '==', uid)
            .where('content.type', '==', AnnotationContentType.FLASHCARD)
            .get();
    }

    /**
     * 
     * @param request Flashcard export request
     * @param uid user id 
     * @returns generated apkg file path
     */
    export async function create(request: FlashcardExportRequest, uid: string): Promise<string> {

        const flashCardExport = FlashCardExport.init(request.ankiDeckName);

        const docs = await fetchUserBlocks(uid, request.targets);


        // Converting blocks to Anki flashcards based on type
        docs.forEach(
            (doc: FirebaseFirestore.DocumentData ) => {
                const flashcard = doc.data().content.value as IBlockFlashcard;

                if (flashcard.type == FlashcardType.CLOZE) {
                    flashCardExport.addCloze(flashcard.fields.text);
                } else if (
                    flashcard.type == FlashcardType.BASIC_FRONT_BACK_AND_REVERSE || 
                    flashcard.type == FlashcardType.BASIC_FRONT_BACK_OR_REVERSE ||
                    flashcard.type == FlashcardType.BASIC_FRONT_BACK 
                ) {
                    flashCardExport.addBasic(flashcard.fields.front, flashcard.fields.back);
                }
            }
        );

        return flashCardExport.save(tmpdir());
    }
}
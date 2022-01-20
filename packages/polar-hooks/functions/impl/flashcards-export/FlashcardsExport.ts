import { FlashcardExportRequest } from "./FlashCardsExportFunction";
import { FlashCardExport } from "polar-anki-export/src/FlashCardExport";
import { FirebaseAdmin } from "polar-firebase-admin/src/FirebaseAdmin";
import { BlockCollection } from "polar-firebase/src/firebase/om/BlockCollection";
import { AnnotationContentType } from "polar-blocks/src/blocks/content/IAnnotationContent";
import { IBlockFlashcard } from "polar-blocks/src/annotations/IBlockFlashcard";
import { FlashcardType } from "polar-shared/src/metadata/FlashcardType";
import { FilePaths } from "polar-shared/src/util/FilePaths";

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

                switch (flashcard.type) {
                    case FlashcardType.CLOZE:
                        flashCardExport.addCloze(flashcard.fields.text);
                        break;
                    // The following three types get the same treatment
                    // and we currently only support BASIC_FRONT_BACK
                    // users can't actually create a flashcard of the other two types
                    case FlashcardType.BASIC_FRONT_BACK_AND_REVERSE:
                    case FlashcardType.BASIC_FRONT_BACK_OR_REVERSE:
                    case FlashcardType.BASIC_FRONT_BACK:
                        flashCardExport.addBasic(flashcard.fields.front, flashcard.fields.back);
                        break;
                    default:
                        console.error("Undefined flashcard type")
                        break;
                }
            }
        );

        return flashCardExport.save(FilePaths.tmpdir());
    }
}
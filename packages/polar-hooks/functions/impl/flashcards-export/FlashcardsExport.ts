import {FlashcardExport} from "polar-anki-export/src/FlashcardExport";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {BlockCollection} from "polar-firebase/src/firebase/om/BlockCollection";
import {AnnotationContentType, IAnnotationContent} from "polar-blocks/src/blocks/content/IAnnotationContent";
import {IBlockFlashcard} from "polar-blocks/src/annotations/IBlockFlashcard";
import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {PathStr, UserIDStr} from "polar-shared/src/util/Strings";
import {IBlock} from "polar-blocks/src/blocks/IBlock";
import {FlashcardsExport} from "polar-backend-api/src/api/FlashcardsExport";

export namespace AnkiExport {

    import FlashcardExportRequest = FlashcardsExport.FlashcardExportRequest;

    export async function fetchUserBlocks(uid: UserIDStr) {
        return FirebaseAdmin.app()
            .firestore()
            .collection(BlockCollection.COLLECTION)
            .where('uid', '==', uid)
            .get();
    }

    /**
     *
     * @param request Flashcard export request
     * @param uid user id
     * @returns generated apkg file path
     */
    export async function create(request: FlashcardExportRequest, uid: UserIDStr): Promise<PathStr> {

        const flashCardExport = FlashcardExport.create(request.ankiDeckName);

        const docs = await fetchUserBlocks(uid);

        const requestedBlockIDs = new Set(request.blockIDs);


        // Converting blocks to Anki flashcards based on type
        docs.forEach(
            (doc: FirebaseFirestore.DocumentData ) => {
                const block = doc.data() as IBlock<IAnnotationContent>;

                // Skip blocks that are NOT requested
                if (! requestedBlockIDs.has(block.id)) {
                    return;
                }

                // Skip blocks that aren't a flashcard
                if (block.content.type !== AnnotationContentType.FLASHCARD) {
                    return;
                }

                const flashcard = block.content.value as IBlockFlashcard;

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
